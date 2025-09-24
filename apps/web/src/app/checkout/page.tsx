'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  };
}

const API_BASE_URL = 'http://localhost:3001/api';

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
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
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    if (!address.trim()) {
      alert('Please enter a delivery address');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: address.trim(),
          paymentMethod: 'COD',
        }),
      });

      if (response.ok) {
        alert('Order placed successfully!');
        router.push('/orders');
      } else {
        alert('Failed to place order');
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold mb-8">Checkout</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4">Delivery Address</h3>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your complete delivery address..."
                className="w-full h-32 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                <span>Cash on Delivery (COD)</span>
              </div>
              <p className="text-sm text-slate-400 mt-2">
                Pay when your order is delivered
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.product.name}</h4>
                      <p className="text-sm text-slate-400">{item.product.brand}</p>
                      <p className="text-sm text-slate-500">
                        {item.product.volumeMl}ml • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold">₹{(item.product.price * item.quantity) / 100}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-slate-700 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold">₹{totalPrice / 100}</span>
                </div>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={submitting || !address.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
