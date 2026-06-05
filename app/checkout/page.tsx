"use client";

import { useState } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { StateMessage } from "@/components/ui/StateMessage";
import { useCart } from "@/components/cart/CartProvider";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { createOrder } from "@/services/orderService";
import type { CartItem } from "@/types/product";

type CheckoutFields = {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  city: string;
  delivery_address: string;
  notes: string;
};

type Confirmation = {
  orderNumber: string;
  customer: CheckoutFields;
  paymentMethod: string;
  total: number;
  items: CartItem[];
  savedToAccount: boolean;
};

export default function CheckoutPage() {
  const { items, subtotal, clear, hydrated } = useCart();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CheckoutFields, string>>>({});
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length) {
      setError("Your cart is empty. Add products before placing an order.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const customer: CheckoutFields = {
      customer_name: String(form.get("customer_name") || "").trim(),
      customer_phone: String(form.get("customer_phone") || "").trim(),
      customer_email: String(form.get("customer_email") || "").trim(),
      city: String(form.get("city") || "").trim(),
      delivery_address: String(form.get("delivery_address") || "").trim(),
      notes: String(form.get("notes") || "").trim(),
    };
    const validationErrors = validateCheckout(customer);

    setFieldErrors(validationErrors);
    setError("");

    if (Object.keys(validationErrors).length) {
      setError("Please complete the required checkout details.");
      return;
    }

    setSaving(true);
    try {
      const orderedItems = [...items];
      const order = await createOrder(customer, orderedItems);
      clear();
      setConfirmation({
        orderNumber: order.order_number,
        customer,
        paymentMethod: order.payment_method || "Cash on Delivery",
        total: order.total_amount,
        items: orderedItems,
        savedToAccount: Boolean(order.user_id),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place order.");
    } finally {
      setSaving(false);
    }
  }

  if (!isSupabaseConfigured) return <div className="mx-auto max-w-4xl px-4 py-10"><StateMessage title="Supabase is not configured" message="Add Supabase variables before checkout." /></div>;
  if (confirmation) return <OrderConfirmation confirmation={confirmation} />;
  if (!hydrated) return <div className="mx-auto max-w-4xl px-4 py-10"><StateMessage title="Loading cart" message="Checking your saved cart before checkout." /></div>;
  if (!items.length) return <div className="mx-auto max-w-4xl px-4 py-10"><StateMessage title="Your cart is empty" message="Add eyewear to your cart before checkout." /><LinkButton href="/products" className="mt-5">Shop products</LinkButton></div>;

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
      <form onSubmit={submit} className="grid gap-4 rounded-md border border-slate-200 bg-white p-5">
        <h1 className="text-3xl font-black">Checkout</h1>
        {error ? <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="customer_name" label="Full name" required error={fieldErrors.customer_name} />
          <Field name="customer_phone" label="Phone" required error={fieldErrors.customer_phone} />
          <Field name="customer_email" label="Email" type="email" />
          <Field name="city" label="City" required defaultValue="Kathmandu" error={fieldErrors.city} />
        </div>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Delivery address
          <textarea name="delivery_address" required rows={3} aria-invalid={Boolean(fieldErrors.delivery_address)} className="rounded-md border border-slate-200 px-3 py-2 font-normal focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
          {fieldErrors.delivery_address ? <span className="text-xs font-semibold text-rose-700">{fieldErrors.delivery_address}</span> : null}
        </label>
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

function validateCheckout(customer: CheckoutFields) {
  const errors: Partial<Record<keyof CheckoutFields, string>> = {};

  if (!customer.customer_name) errors.customer_name = "Enter your full name.";
  if (!customer.customer_phone) errors.customer_phone = "Enter a phone number we can call.";
  if (!customer.city) errors.city = "Enter your delivery city.";
  if (!customer.delivery_address) errors.delivery_address = "Enter your delivery address.";

  return errors;
}

function OrderConfirmation({ confirmation }: { confirmation: Confirmation }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-md border border-emerald-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase text-emerald-700">Order placed successfully</p>
        <h1 className="mt-2 font-serif text-3xl font-black text-slate-950">Thank you for your order.</h1>
        <p className="mt-2 text-slate-600">Please review the details below. You can use the order number to track your delivery.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Detail label="Order number" value={confirmation.orderNumber} />
          <Detail label="Payment method" value={confirmation.paymentMethod} />
          <Detail label="Customer name" value={confirmation.customer.customer_name} />
          <Detail label="Phone number" value={confirmation.customer.customer_phone} />
          <Detail label="Delivery address" value={`${confirmation.customer.delivery_address}, ${confirmation.customer.city}`} />
          <Detail label="Total amount" value={formatCurrency(confirmation.total)} />
        </div>

        <div className="mt-6 rounded-md border border-slate-200">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-bold">Ordered items</div>
          <div className="divide-y divide-slate-200">
            {confirmation.items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <span className="font-semibold text-slate-800">{item.name}</span>
                <span className="text-slate-600">Qty {item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <LinkButton href="/track-order">Track order</LinkButton>
          {confirmation.savedToAccount ? <LinkButton href="/account/orders" variant="secondary">View my orders</LinkButton> : null}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; error?: string }) {
  const { label, error, ...inputProps } = props;
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <input
        className="rounded-md border border-slate-200 px-3 py-2 font-normal focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        aria-invalid={Boolean(error)}
        {...inputProps}
      />
      {error ? <span className="text-xs font-semibold text-rose-700">{error}</span> : null}
    </label>
  );
}
