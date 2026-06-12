"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";
import type { Product } from "@/types/product";

export function ProductPurchaseControls({ product }: { product: Product }) {
  const { addProduct } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock_quantity <= 0;
  const maxQuantity = Math.max(1, product.stock_quantity);

  function updateQuantity(nextQuantity: number) {
    setQuantity(Math.min(maxQuantity, Math.max(1, nextQuantity)));
  }

  function addSelectedQuantity() {
    if (outOfStock) return;

    addProduct(product, quantity);

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <>
      <div className="mt-5 hidden md:flex md:items-center md:gap-3">
        <QuantitySelector
          quantity={quantity}
          onChange={updateQuantity}
          disabled={outOfStock}
          maxQuantity={maxQuantity}
        />
        <AddButton added={added} disabled={outOfStock} onClick={addSelectedQuantity} />
      </div>

      <div className="fixed inset-x-0 bottom-[72px] z-[900] border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-10px_30px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <QuantitySelector
            quantity={quantity}
            onChange={updateQuantity}
            disabled={outOfStock}
            maxQuantity={maxQuantity}
            compact
          />
          <AddButton added={added} disabled={outOfStock} onClick={addSelectedQuantity} compact />
        </div>
      </div>
    </>
  );
}

function QuantitySelector({
  quantity,
  onChange,
  disabled,
  maxQuantity,
  compact = false,
}: {
  quantity: number;
  onChange: (quantity: number) => void;
  disabled: boolean;
  maxQuantity: number;
  compact?: boolean;
}) {
  return (
    <div
      className={[
        "grid flex-none grid-cols-3 items-center overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm",
        compact ? "h-[52px] w-32" : "h-12 w-36",
        disabled ? "opacity-60" : "",
      ].join(" ")}
      aria-label="Quantity"
    >
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        disabled={disabled || quantity <= 1}
        className="grid h-full place-items-center text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <span className="grid h-full place-items-center border-x border-slate-200 text-sm font-black">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={disabled || quantity >= maxQuantity}
        className="grid h-full place-items-center text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function AddButton({
  added,
  disabled,
  onClick,
  compact = false,
}: {
  added: boolean;
  disabled: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      className={compact ? "min-h-[52px] flex-1 rounded-xl px-4 text-sm" : "min-h-12 flex-1 rounded-xl px-5"}
    >
      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
      {disabled ? "Out of Stock" : added ? "Added" : "Add to Cart"}
    </Button>
  );
}
