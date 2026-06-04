"use client";

import { useState } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { StateMessage } from "@/components/ui/StateMessage";
import { useCart } from "@/components/cart/CartProvider";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { createOrder } from "@/services/orderService";

export default function CheckoutPage() {
  const { items, subtotal, clear, hydrated } = useCart();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length) {
      setError("Your cart is empty. Add products before placing an order.");
      return;
    }
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const order = await createOrder(
        {
          customer_name: String(form.get("customer_name") || ""),
          customer_phone: String(form.get("customer_phone") || ""),
          customer_email: String(form.get("customer_email") || ""),
          city: String(form.get("city") || ""),
          delivery_address: String(form.get("delivery_address") || ""),
          notes: String(form.get("notes") || ""),
        },
        items,
      );
      clear();
      setOrderNumber(order.order_number);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place order.");
    } finally {
      setSaving(false);
    }
  }

  if (!isSupabaseConfigured) return <div className="mx-auto max-w-4xl px-4 py-10"><StateMessage title="Supabase is not configured" message="Add Supabase variables before checkout." /></div>;
  if (orderNumber) return <div className="mx-auto max-w-3xl px-4 py-10"><StateMessage title="Order placed successfully" message={`Your order number is ${orderNumber}. Use it to track your order.`} /><LinkButton href="/track-order" className="mt-5">Track order</LinkButton></div>;
  if (!hydrated) return <div className="mx-auto max-w-4xl px-4 py-10"><StateMessage title="Loading cart" message="Checking your saved cart before checkout." /></div>;
  if (!items.length) return <div className="mx-auto max-w-4xl px-4 py-10"><StateMessage title="Your cart is empty" message="Add eyewear to your cart before checkout." /><LinkButton href="/products" className="mt-5">Shop products</LinkButton></div>;

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
      <form onSubmit={submit} className="grid gap-4 rounded-md border border-slate-200 bg-white p-5">
        <h1 className="text-3xl font-black">Checkout</h1>
        {error ? <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="customer_name" label="Full name" required />
          <Field name="customer_phone" label="Phone" required />
          <Field name="customer_email" label="Email" type="email" />
          <Field name="city" label="City" />
        </div>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">Address<textarea name="delivery_address" required rows={3} className="rounded-md border border-slate-200 px-3 py-2 font-normal" /></label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">Notes<textarea name="notes" rows={3} className="rounded-md border border-slate-200 px-3 py-2 font-normal" /></label>
        <div className="rounded-md bg-slate-50 p-4 text-sm font-semibold">Payment method: Cash on Delivery</div>
        <Button disabled={saving}>{saving ? "Placing order..." : "Place order"}</Button>
      </form>
      <aside className="h-fit rounded-md border border-slate-200 bg-white p-5">
        <h2 className="font-black">Order summary</h2>
        <div className="mt-4 grid gap-3">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between gap-3 text-sm">
              <span>{item.name} x {item.quantity}</span>
              <strong>{formatCurrency(item.price * item.quantity)}</strong>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-slate-200 pt-4 flex justify-between"><span>Total</span><strong>{formatCurrency(subtotal)}</strong></div>
      </aside>
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, ...inputProps } = props;
  return <label className="grid gap-2 text-sm font-semibold text-slate-700">{label}<input className="rounded-md border border-slate-200 px-3 py-2 font-normal" {...inputProps} /></label>;
}
