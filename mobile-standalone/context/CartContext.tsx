import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Product } from '../data/products';
import { apiService } from '../services/api';

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
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      const response = await apiService.getCart();
      setItems(response.items);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const addItem = async (product: Product, quantity: number = 1) => {
    try {
      await apiService.addToCart(product.id, quantity);
      loadCartItems(); // Reload cart from server
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await apiService.updateCartItem(productId, 0);
      loadCartItems(); // Reload cart from server
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  };

  const setQuantity = async (productId: string, quantity: number) => {
    try {
      await apiService.updateCartItem(productId, quantity);
      loadCartItems(); // Reload cart from server
    } catch (error) {
      console.error('Failed to update cart item:', error);
    }
  };

  const clear = async () => {
    try {
      await apiService.clearCart();
      setItems([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  // Remove local storage sync since we're using API

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


