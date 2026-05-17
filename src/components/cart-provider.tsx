"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { CartItem, Product, ProductColor } from "@/types";
import { CartDrawer } from "./cart-drawer";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, color: ProductColor, size: number) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback(
    (product: Product, color: ProductColor, size: number) => {
      setItems((prev) => {
        const existing = prev.findIndex(
          (item) =>
            item.product.id === product.id &&
            item.color.hex === color.hex &&
            item.size === size
        );
        if (existing >= 0) {
          const next = [...prev];
          next[existing] = { ...next[existing], quantity: next[existing].quantity + 1 };
          return next;
        }
        return [...prev, { product, color, size, quantity: 1 }];
      });
      setIsOpen(true);
    },
    []
  );

  const removeItem = useCallback((index: number) => {
    const item = items[index];
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, [items]);

  const updateQuantity = useCallback((index: number, quantity: number) => {
    const item = items[index];
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], quantity };
      return next;
    });
  }, [items]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        itemCount,
      }}
    >
      {children}
      <CartDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
      />
    </CartContext.Provider>
  );
}
