'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: { name: string };
  volumeMl: number;
  price: number;
  image: string;
  abv?: number;
  origin?: string;
  rating?: number;
  description?: string;
  stock: number;
}

const API_BASE_URL = 'http://localhost:3001/api';

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.id) {
      loadProduct(params.id as string);
    }
  }, [params.id]);

  const loadProduct = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      const data = await response.json();
      setProduct(data.product);
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!product) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
        }),
      });

      if (response.ok) {
        alert('Added to cart!');
      } else {
        alert('Please login to add items to cart');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Image
                src="/icon.png"
                alt="Yoolivery"
                width={40}
                height={40}
                className="mr-3"
              />
              <h1 className="text-xl font-bold">Yoolivery</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-slate-300 hover:text-white">Home</Link>
              <Link href="/search" className="text-slate-300 hover:text-white">Search</Link>
              <Link href="/cart" className="text-slate-300 hover:text-white">Cart</Link>
              <Link href="/orders" className="text-slate-300 hover:text-white">Orders</Link>
              <Link href="/profile" className="text-slate-300 hover:text-white">Profile</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square bg-slate-800 rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-xl text-slate-400 mb-4">{product.brand}</p>
              <div className="flex items-center space-x-4 text-sm text-slate-300">
                <span>{product.category.name}</span>
                <span>•</span>
                <span>{product.volumeMl}ml</span>
                {product.abv && (
                  <>
                    <span>•</span>
                    <span>{product.abv}% ABV</span>
                  </>
                )}
                {product.origin && (
                  <>
                    <span>•</span>
                    <span>{product.origin}</span>
                  </>
                )}
              </div>
            </div>

            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-slate-300">{product.description}</p>
              </div>
            )}

            {product.rating && (
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold">Rating:</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-slate-600'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-2 text-slate-300">({product.rating})</span>
                </div>
              </div>
            )}

            <div className="border-t border-slate-700 pt-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-bold">₹{product.price / 100}</span>
                <span className="text-slate-400">Stock: {product.stock}</span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <label className="text-lg font-semibold">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={addToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
