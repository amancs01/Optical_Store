"use client";

import Image from "next/image";
import Link from "next/link";
import { Glasses, Minus, Plus, Trash2 } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, increment, decrement, remove, hydrated } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black">Cart</h1>
      {!hydrated ? (
        <div className="mt-8 rounded-md border border-slate-200 bg-white p-8 text-center text-slate-600">
          Loading cart...
        </div>
      ) : !items.length ? (
        <div className="mt-8 rounded-md border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">Your cart is empty.</p>
          <LinkButton href="/products" className="mt-4">Continue shopping</LinkButton>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-3">
            {items.map((item) => (
              <div key={item.productId} className="grid gap-4 rounded-md border border-slate-200 bg-white p-4 sm:grid-cols-[88px_1fr]">
                <Link href={`/products/${item.slug}`} className="relative h-24 overflow-hidden rounded-md bg-emerald-50">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="88px" />
                  ) : (
                    <div className="grid h-full place-items-center bg-emerald-700 text-white">
                      <Glasses className="h-8 w-8" aria-hidden="true" />
                    </div>
                  )}
                </Link>
                <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <Link href={`/products/${item.slug}`} className="font-bold hover:underline">{item.name}</Link>
                    <p className="mt-1 text-sm text-slate-600">{formatCurrency(item.price)} each</p>
                    <p className="mt-1 text-sm font-semibold text-slate-950">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="flex items-center gap-3 rounded-md bg-slate-50 p-1.5">
                      <Button variant="secondary" className="h-12 w-12 px-0 sm:h-11 sm:w-11" onClick={() => decrement(item.productId)} aria-label="Decrease"><Minus className="h-5 w-5" /></Button>
                      <span className="min-w-10 text-center text-lg font-black">{item.quantity}</span>
                      <Button variant="secondary" className="h-12 w-12 px-0 sm:h-11 sm:w-11" onClick={() => increment(item.productId)} aria-label="Increase"><Plus className="h-5 w-5" /></Button>
                    </div>
                    <Button variant="ghost" className="h-12 w-12 px-0 sm:h-11 sm:w-11" onClick={() => remove(item.productId)} aria-label="Remove"><Trash2 className="h-5 w-5" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-md border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="mb-4 text-xl font-black">Order summary</h2>
            <div className="flex justify-between text-sm"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
            <div className="mt-3 flex justify-between text-sm"><span>Delivery</span><strong>{formatCurrency(0)}</strong></div>
            <div className="mt-4 border-t border-slate-200 pt-4 flex justify-between text-lg"><span>Total</span><strong>{formatCurrency(subtotal)}</strong></div>
            <LinkButton href="/checkout" className="mt-5 w-full">Checkout</LinkButton>
            <LinkButton href="/products" variant="secondary" className="mt-3 w-full">Continue shopping</LinkButton>
          </aside>
        </div>
      )}
    </div>
  );
}
