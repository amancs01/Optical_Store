"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

export function AddToCartButton({ product, compact = false }: { product: Product; compact?: boolean }) {
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
      className={cn(
        "w-full px-3",
        compact ? "min-h-9 text-xs sm:min-h-9 sm:text-xs" : "min-h-10 text-xs sm:min-h-11 sm:text-sm",
      )}
    >
      <ShoppingBag className="h-4 w-4" />
      {product.stock_quantity <= 0 ? "Out of Stock" : added ? "Added" : compact ? "Add" : "Add to Cart"}
    </Button>
  );
}
