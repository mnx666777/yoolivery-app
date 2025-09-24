import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiService } from '../services/api';
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
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await apiService.getOrders();
      setOrders(response.orders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const placeOrder = async ({ items, totalPriceINR, address, paymentMethod }: { items: CartItem[]; totalPriceINR: number; address: string; paymentMethod: 'COD' }) => {
    try {
      const response = await apiService.createOrder({ address, paymentMethod });
      loadOrders(); // Reload orders from server
      return response.order;
    } catch (error) {
      console.error('Failed to place order:', error);
      throw error;
    }
  };

  const value = useMemo(() => ({ orders, placeOrder }), [orders]);
  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}


