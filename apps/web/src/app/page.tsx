'use client';

import { useState, useEffect } from 'react';
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
}

const API_BASE_URL = 'http://localhost:3001/api';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Beer', 'Wine', 'Whisky', 'Rum', 'Vodka', 'Brandy'];

  useEffect(() => {
    loadProducts();
  }, [category, search]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category !== 'All') params.append('category', category);
      if (search) params.append('search', search);
      params.append('limit', '20');

      const response = await fetch(`${API_BASE_URL}/products?${params}`);
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Delivering across Manipur</h2>
          <p className="text-xl text-slate-300 mb-8">Premium alcohol delivery service</p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder="Search beer, wine, spirits..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Popular Categories</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                  category === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6">Popular Products</h3>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-slate-400">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-600 transition-colors">
                  <Link href={`/product/${product.id}`}>
                    <div className="aspect-square bg-slate-700 relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/product/${product.id}`}>
                      <h4 className="font-bold text-lg mb-2 hover:text-blue-400 transition-colors">
                        {product.name}
                      </h4>
                    </Link>
                    <p className="text-slate-400 text-sm mb-2">
                      {product.brand} • {product.volumeMl}ml
                      {product.abv && ` • ${product.abv}%`}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">₹{product.price / 100}</span>
                      <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}