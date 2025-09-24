'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    image: string;
    volumeMl: number;
    abv?: number;
  };
}

const API_BASE_URL = 'http://localhost:3001/api';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setItems([]);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data.items);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.ok) {
        loadCart();
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  const removeItem = async (productId: string) => {
    await updateQuantity(productId, 0);
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setItems([]);
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading cart...</p>
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
              <Link href="/cart" className="text-blue-400">Cart</Link>
              <Link href="/orders" className="text-slate-300 hover:text-white">Orders</Link>
              <Link href="/profile" className="text-slate-300 hover:text-white">Profile</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold mb-8">Shopping Cart</h2>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">Your cart is empty</h3>
            <p className="text-slate-400 mb-8">Add some products to get started</p>
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex items-center space-x-4">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.product.name}</h3>
                    <p className="text-slate-400">{item.product.brand}</p>
                    <p className="text-sm text-slate-500">
                      {item.product.volumeMl}ml
                      {item.product.abv && ` • ${item.product.abv}%`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">₹{(item.product.price * item.quantity) / 100}</p>
                      <p className="text-sm text-slate-400">₹{item.product.price / 100} each</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-400 hover:text-red-300 ml-4"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold">Total</span>
                <span className="text-2xl font-bold">₹{totalPrice / 100}</span>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={clearCart}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-semibold transition-colors"
                >
                  Clear Cart
                </button>
                <Link
                  href="/checkout"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold text-center transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
