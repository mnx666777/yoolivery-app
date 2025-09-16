import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadJson, saveJson } from '../utils/storage';
import type { CartItem } from './CartContext';

export type Order = {
  id: string;
  createdAt: number; // epoch ms
  items: CartItem[];
  totalPriceINR: number;
  address: string;
  paymentMethod: 'COD';
  status: 'PLACED' | 'DELIVERING' | 'DELIVERED';
};

type OrdersContextValue = {
  orders: Order[];
  placeOrder: (input: { items: CartItem[]; totalPriceINR: number; address: string; paymentMethod: 'COD' }) => Promise<Order>;
};

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    (async () => {
      const loaded = await loadJson<Order[]>('orders.list', []);
      if (!loaded || loaded.length === 0) {
        const sample: Order[] = [
          { 
            id: 'o_demo1', 
            createdAt: Date.now() - 86400000, 
            items: [
              { product: { id: 'beer-kingfisher-650', name: 'Kingfisher Strong 650ml', brand: 'Kingfisher', category: 'Beer' as const, volumeMl: 650, priceINR: 190, image: require('../assets/icon.png') }, quantity: 2 },
              { product: { id: 'whisky-mc-750', name: "McDowell's No.1 750ml", brand: "McDowell's", category: 'Whisky' as const, volumeMl: 750, priceINR: 680, image: require('../assets/icon.png') }, quantity: 1 }
            ], 
            totalPriceINR: 1060, 
            address: 'Imphal West', 
            paymentMethod: 'COD', 
            status: 'DELIVERED' 
          },
          { 
            id: 'o_demo2', 
            createdAt: Date.now() - 43200000, 
            items: [
              { product: { id: 'rum-oldmonk-750', name: 'Old Monk 750ml', brand: 'Old Monk', category: 'Rum' as const, volumeMl: 750, priceINR: 560, image: require('../assets/icon.png') }, quantity: 1 }
            ], 
            totalPriceINR: 560, 
            address: 'Imphal East', 
            paymentMethod: 'COD', 
            status: 'PLACED' 
          },
        ];
        setOrders(sample);
        await saveJson('orders.list', sample);
      } else {
        setOrders(loaded);
      }
    })();
  }, []);

  useEffect(() => {
    saveJson('orders.list', orders);
  }, [orders]);

  const placeOrder = async ({ items, totalPriceINR, address, paymentMethod }: { items: CartItem[]; totalPriceINR: number; address: string; paymentMethod: 'COD' }) => {
    const order: Order = {
      id: 'o_' + Math.random().toString(36).slice(2),
      createdAt: Date.now(),
      items,
      totalPriceINR,
      address,
      paymentMethod,
      status: 'PLACED',
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  const value = useMemo(() => ({ orders, placeOrder }), [orders]);
  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}


