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
    <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 lg:px-8">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">Titan Optical</p>
        <h1 className="mt-1 text-3xl font-black sm:text-4xl">Your cart</h1>
      </div>
      {!hydrated ? (
        <div className="mt-8 rounded-md border border-slate-200 bg-[#fffaf2]/60 p-8 text-center text-slate-600">
          Loading cart...
        </div>
      ) : !items.length ? (
        <div className="mt-8 rounded-md border border-slate-200 bg-[#fffaf2]/60 p-8 text-center">
          <p className="text-xl font-bold text-slate-950">Your cart is waiting for the perfect frame.</p>
          <p className="mt-2 text-sm text-slate-600">Browse Titan Optical eyewear and add your favorite frame when you are ready.</p>
          <LinkButton href="/products" className="mt-4">Continue shopping</LinkButton>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="rounded-md border border-emerald-100 bg-white p-4 shadow-sm lg:hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Total</p>
                <p className="text-xl font-black">{formatCurrency(subtotal)}</p>
              </div>
              <LinkButton href="/checkout">Checkout</LinkButton>
            </div>
          </div>
          <div className="grid gap-3">
            {items.map((item) => (
              <div key={item.productId} className="grid grid-cols-[76px_1fr] gap-3 rounded-md border border-slate-200 bg-[#fffaf2]/60 p-3 shadow-sm sm:grid-cols-[88px_1fr] sm:p-4 sm:items-start">
                <Link href={`/products/${item.slug}`} className="relative h-20 overflow-hidden rounded-md bg-emerald-50 sm:h-24">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill loading="lazy" className="object-cover" sizes="88px" />
                  ) : (
                    <div className="grid h-full place-items-center bg-emerald-700 text-white">
                      <Glasses className="h-8 w-8" aria-hidden="true" />
                    </div>
                  )}
                </Link>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <Link href={`/products/${item.slug}`} className="line-clamp-2 text-sm font-semibold hover:underline sm:text-base">{item.name}</Link>
                    <p className="mt-1 text-sm text-slate-600">{formatCurrency(item.price)} each</p>
                    <p className="mt-1 text-sm font-semibold text-slate-950">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                  <div className="flex items-center justify-between gap-2 sm:justify-end sm:gap-4">
                    <div className="flex items-center gap-3 rounded-md bg-slate-50 p-1.5">
                      <Button variant="secondary" className="h-10 w-10 px-0 sm:h-11 sm:w-11" onClick={() => decrement(item.productId)} aria-label="Decrease"><Minus className="h-5 w-5" /></Button>
                      <span className="min-w-8 text-center text-base font-semibold">{item.quantity}</span>
                      <Button variant="secondary" className="h-10 w-10 px-0 sm:h-11 sm:w-11" onClick={() => increment(item.productId)} aria-label="Increase"><Plus className="h-5 w-5" /></Button>
                    </div>
                    <Button variant="ghost" className="h-10 w-10 px-0 sm:h-11 sm:w-11" onClick={() => remove(item.productId)} aria-label="Remove"><Trash2 className="h-5 w-5" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-md border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className="mb-4 text-xl font-bold">Order summary</h2>
            <div className="flex justify-between text-sm"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
            <div className="mt-3 flex justify-between gap-3 text-sm">
              <div>
                <span>Delivery</span>
                <p className="text-xs text-slate-500">Inside Kathmandu Valley</p>
              </div>
              <strong className="text-emerald-700">Free</strong>
            </div>
            <div className="mt-4 border-t border-slate-200 pt-4 flex justify-between text-lg"><span>Total</span><strong>{formatCurrency(subtotal)}</strong></div>
            <LinkButton href="/checkout" className="mt-5 w-full">Checkout</LinkButton>
            <LinkButton href="/products" variant="secondary" className="mt-3 w-full">Continue shopping</LinkButton>
          </aside>
        </div>
      )}
    </div>
  );
}
