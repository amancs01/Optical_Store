"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AddToCartToast, type AddToCartToastItem } from "@/components/ui/AddToCartToast";
import type { CartItem, Product } from "@/types/product";
import { getSalePrice } from "@/lib/utils";

type CartContextValue = {
  items: CartItem[];
  count: number;
  hydrated: boolean;
  subtotal: number;
  addProduct: (product: Product) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "optical-store-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<AddToCartToastItem | null>(null);

  useEffect(() => {
    window.queueMicrotask(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) setItems(JSON.parse(saved));
      } catch {
        window.localStorage.removeItem(storageKey);
      }
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, ready]);

  const closeToast = useCallback(() => setToast(null), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      hydrated: ready,
      subtotal,
      count,
      addProduct(product) {
        const price = getSalePrice(product);

        setItems((current) => {
          const existing = current.find((item) => item.productId === product.id);
          if (existing) {
            return current.map((item) =>
              item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item,
            );
          }

          return [
            ...current,
            {
              productId: product.id,
              name: product.name,
              slug: product.slug,
              imageUrl: product.image_url,
              price,
              quantity: 1,
              selectedColor: product.color,
            },
          ];
        });

        setToast({
          id: Date.now(),
          name: product.name,
          imageUrl: product.image_url,
          price,
        });
      },
      increment(productId) {
        setItems((current) =>
          current.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        );
      },
      decrement(productId) {
        setItems((current) =>
          current
            .map((item) =>
              item.productId === productId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item,
            )
            .filter((item) => item.quantity > 0),
        );
      },
      remove(productId) {
        setItems((current) => current.filter((item) => item.productId !== productId));
      },
      clear() {
        setItems([]);
      },
    };
  }, [items, ready]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <AddToCartToast toast={toast} onClose={closeToast} />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
