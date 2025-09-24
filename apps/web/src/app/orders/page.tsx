'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    brand: string;
    image: string;
    volumeMl: number;
  };
}

interface Order {
  id: string;
  createdAt: string;
  status: 'PLACED' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED';
  total: number;
  address: string;
  paymentMethod: string;
  items: OrderItem[];
}

const API_BASE_URL = 'http://localhost:3001/api';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLACED':
        return 'text-yellow-400';
      case 'DELIVERING':
        return 'text-blue-400';
      case 'DELIVERED':
        return 'text-green-400';
      case 'CANCELLED':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading orders...</p>
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
              <Link href="/orders" className="text-blue-400">Orders</Link>
              <Link href="/profile" className="text-slate-300 hover:text-white">Profile</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold mb-8">Your Orders</h2>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">No orders yet</h3>
            <p className="text-slate-400 mb-8">Start shopping to see your orders here</p>
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order #{order.id.slice(-6).toUpperCase()}</h3>
                    <p className="text-slate-400 text-sm">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </p>
                    <p className="text-lg font-bold">₹{order.total / 100}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={50}
                        height={50}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-slate-400">{item.product.brand}</p>
                        <p className="text-sm text-slate-500">
                          {item.product.volumeMl}ml • Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold">₹{(item.price * item.quantity) / 100}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <div className="flex justify-between items-center text-sm text-slate-400">
                    <span>Deliver to: {order.address}</span>
                    <span>Payment: {order.paymentMethod}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
