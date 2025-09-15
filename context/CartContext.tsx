import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Product } from '../data/products';
import { loadJson, saveJson } from '../utils/storage';

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  totalQuantity: number;
  totalPriceINR: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    (async () => {
      const loaded = await loadJson<CartItem[]>('cartItems', []);
      setItems(loaded);
    })();
  }, []);

  const addItem = (product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.product.id === product.id);
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = {
          product,
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((ci) => ci.product.id !== productId));
  };

  const setQuantity = (productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((ci) => ci.product.id !== productId);
      return prev.map((ci) => (ci.product.id === productId ? { ...ci, quantity } : ci));
    });
  };

  const clear = () => setItems([]);

  useEffect(() => {
    saveJson('cartItems', items);
  }, [items]);

  const { totalQuantity, totalPriceINR } = useMemo(() => {
    const tq = items.reduce((sum, ci) => sum + ci.quantity, 0);
    const tp = items.reduce((sum, ci) => sum + ci.quantity * ci.product.priceINR, 0);
    return { totalQuantity: tq, totalPriceINR: tp };
  }, [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, setQuantity, clear, totalQuantity, totalPriceINR }),
    [items, totalQuantity, totalPriceINR]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}


