import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Auth middleware
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, phone: true, address: true, dob: true, aadhaarLast4: true }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  address: z.string().optional(),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  aadhaarLast4: z.string().regex(/^\d{4}$/)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const productSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  image: z.string().url(),
  volumeMl: z.number().positive().optional(),
  abv: z.number().positive().optional(),
  origin: z.string().optional(),
  stock: z.number().int().min(0).default(100),
  rating: z.number().min(0).max(5).optional(),
  categoryId: z.string()
});

// Auth routes
app.post('/api/auth/register', async (req: any, res: any) => {
  try {
    const data = registerSchema.parse(req.body);
    
    // Age validation (21+)
    const today = new Date();
    const dob = new Date(data.dob);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    if (age < 21) {
      return res.status(400).json({ error: 'You must be at least 21 years old' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        address: data.address,
        dob: data.dob,
        aadhaarLast4: data.aadhaarLast4
      },
      select: { id: true, name: true, email: true, phone: true, address: true, dob: true, aadhaarLast4: true }
    });

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ user, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req: any, res: any) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        dob: user.dob,
        aadhaarLast4: user.aadhaarLast4
      },
      token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User routes
app.get('/api/user/profile', authenticateToken, async (req: any, res: any) => {
  res.json({ user: req.user });
});

app.put('/api/user/profile', authenticateToken, async (req: any, res: any) => {
  try {
    const { name, phone, address } = req.body;
    
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, phone, address },
      select: { id: true, name: true, email: true, phone: true, address: true, dob: true, aadhaarLast4: true }
    });

    res.json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Categories routes
app.get('/api/categories', async (req: any, res: any) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Products routes
app.get('/api/products', async (req: any, res: any) => {
  try {
    const { category, search, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const where: any = {};
    if (category && category !== 'All') {
      where.category = { name: category as string };
    }
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { brand: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    res.json({ products, total, page: parseInt(page as string), limit: parseInt(limit as string) });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products/:id', async (req: any, res: any) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cart routes
app.get('/api/cart', authenticateToken, async (req: any, res: any) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: { include: { category: true } } }
    });

    res.json({ items: cartItems });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/cart/add', authenticateToken, async (req: any, res: any) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ error: 'Invalid product ID or quantity' });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Upsert cart item
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId
        }
      },
      update: {
        quantity: { increment: quantity }
      },
      create: {
        userId: req.user.id,
        productId,
        quantity
      },
      include: { product: { include: { category: true } } }
    });

    res.json({ item: cartItem });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/cart/update', authenticateToken, async (req: any, res: any) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity < 0) {
      return res.status(400).json({ error: 'Invalid product ID or quantity' });
    }

    if (quantity === 0) {
      await prisma.cartItem.deleteMany({
        where: {
          userId: req.user.id,
          productId
        }
      });
      return res.json({ message: 'Item removed from cart' });
    }

    const cartItem = await prisma.cartItem.updateMany({
      where: {
        userId: req.user.id,
        productId
      },
      data: { quantity }
    });

    res.json({ message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/cart/clear', authenticateToken, async (req: any, res: any) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id }
    });

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Orders routes
app.get('/api/orders', authenticateToken, async (req: any, res: any) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: { include: { category: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/orders', authenticateToken, async (req: any, res: any) => {
  try {
    const { address, paymentMethod = 'COD' } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Delivery address is required' });
    }

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total
    const total = cartItems.reduce((sum: number, item: { product: { price: number }, quantity: number }) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        total,
        address,
        paymentMethod,
        status: 'PLACED',
        items: {
          create: cartItems.map((item: { productId: string, quantity: number, product: { price: number } }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      },
      include: {
        items: {
          include: { product: { include: { category: true } } }
        }
      }
    });

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id }
    });

    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Yoolivery API server running on port ${PORT}`);
});

export default app;