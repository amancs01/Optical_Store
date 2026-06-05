"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";
import type { Product } from "@/types/product";

export function AddToCartButton({ product }: { product: Product }) {
  const { addProduct } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <Button
      disabled={product.stock_quantity <= 0}
      onClick={() => {
        addProduct(product);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
      className="min-h-10 w-full px-3 text-xs sm:min-h-11 sm:text-sm"
    >
      <ShoppingBag className="h-4 w-4" />
      {product.stock_quantity <= 0 ? "Out of Stock" : added ? "Added" : "Add to Cart"}
    </Button>
  );
}
