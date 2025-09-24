# Yoolivery - Full Stack Alcohol Delivery App

A complete full-stack alcohol delivery application built with React Native (mobile), Next.js (web), Express.js (API), and PostgreSQL (database). Features age verification, cart management, order tracking, and COD payment integration.

## 🚀 Features

### Mobile App (React Native + Expo)
- **Authentication**: User registration with age verification (21+) and Aadhaar validation
- **Product Catalog**: Browse alcohol products by category with search functionality
- **Shopping Cart**: Add/remove items, quantity management, persistent cart
- **Order Management**: Place orders, track status, view order history
- **Location Services**: District-based delivery targeting
- **Dark Theme**: Modern, user-friendly interface

### Web App (Next.js)
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Same Features**: All mobile app features available on web
- **Modern UI**: Built with Tailwind CSS
- **Real-time Updates**: Live cart and order status

### Backend API (Express.js)
- **RESTful API**: Complete CRUD operations for all entities
- **Authentication**: JWT-based auth with secure password hashing
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Input validation with Zod schemas
- **Security**: CORS, Helmet, and other security middleware

## 🏗️ Architecture

```
yoolivery-app/
├── apps/
│   ├── mobile/          # React Native mobile app
│   └── web/             # Next.js web application
├── packages/
│   ├── api/             # Express.js backend API
│   └── db/              # Prisma database package
└── docker-compose.yml   # Docker orchestration
```

## 🛠️ Tech Stack

### Frontend
- **Mobile**: React Native, Expo, TypeScript
- **Web**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **State Management**: React Context API
- **Navigation**: Expo Router (mobile), Next.js App Router (web)

### Backend
- **API**: Express.js, TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT, bcryptjs
- **Validation**: Zod

### DevOps
- **Containerization**: Docker, Docker Compose
- **Package Management**: npm/pnpm

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd yoolivery-app
```

### 2. Start with Docker (Recommended)
```bash
# Start all services
docker-compose up -d

# Seed the database
docker-compose exec api npm run prisma:seed
```

### 3. Manual Setup (Alternative)

#### Database Setup
```bash
# Start PostgreSQL
docker-compose up -d db

# Set up database
cd packages/db
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
```

#### Backend API
```bash
cd packages/api
npm install
npm run dev
```

#### Web Application
```bash
cd apps/web
npm install
npm run dev
```

#### Mobile Application
```bash
cd apps/mobile
npm install
npm start
```

## 📱 Mobile App Setup

1. Install Expo CLI: `npm install -g @expo/cli`
2. Start the development server: `npm start`
3. Scan QR code with Expo Go app on your phone
4. Or run on simulator: `npm run ios` or `npm run android`

## 🌐 Web App Access

- **URL**: http://localhost:3000
- **Features**: Same as mobile app with responsive design

## 🔧 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile

### Product Endpoints
- `GET /products` - List products (with filters)
- `GET /products/:id` - Get product details
- `GET /categories` - List categories

### Cart Endpoints
- `GET /cart` - Get cart items
- `POST /cart/add` - Add item to cart
- `PUT /cart/update` - Update cart item quantity
- `DELETE /cart/clear` - Clear cart

### Order Endpoints
- `GET /orders` - Get user orders
- `POST /orders` - Place new order

## 🗄️ Database Schema

### Key Models
- **User**: Profile, authentication, age verification
- **Product**: Alcohol products with categories
- **Category**: Product categories (Beer, Wine, Whisky, etc.)
- **Order**: Order management with status tracking
- **OrderItem**: Individual items in orders
- **CartItem**: Shopping cart items

## 🔐 Security Features

- **Age Verification**: 21+ requirement with DOB validation
- **Aadhaar Validation**: Last 4 digits verification
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Zod schemas for all inputs
- **CORS Protection**: Configured for cross-origin requests

## 🚀 Deployment

### Production Environment Variables
```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

### Docker Production
```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Sample Data

The database is seeded with:
- 6 product categories
- 7 sample alcohol products
- 1 demo user account

**Demo Credentials:**
- Email: `demo@yoolivery.com`
- Password: `password123`

## 🧪 Testing

### Mobile App
- Test on physical device with Expo Go
- Test on iOS Simulator or Android Emulator

### Web App
- Test in browser at http://localhost:3000
- Test responsive design on different screen sizes

### API
- Test endpoints with Postman or curl
- Health check: `GET http://localhost:3001/api/health`

## 🔧 Development

### Code Structure
- **Mobile**: Context-based state management
- **Web**: React hooks and local state
- **API**: Express.js with TypeScript
- **Database**: Prisma with PostgreSQL

### Adding New Features
1. Update database schema in `packages/db/prisma/schema.prisma`
2. Add API endpoints in `packages/api/src/index.ts`
3. Update mobile app contexts and screens
4. Update web app pages and components

## 📝 License

This project is for educational purposes. Please ensure compliance with local alcohol delivery regulations.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed description

---

**Note**: This application is for educational purposes. Ensure compliance with local laws and regulations regarding alcohol delivery services.
