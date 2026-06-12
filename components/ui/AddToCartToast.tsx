"use client";

import { CheckCircle2, Glasses, X } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

export type AddToCartToastItem = {
  id: number;
  name: string;
  imageUrl: string | null;
  price: number;
};

export function AddToCartToast({
  toast,
  onClose,
}: {
  toast: AddToCartToastItem | null;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) {
      setVisible(false);
      return;
    }

    const enterTimer = window.setTimeout(() => setVisible(true), 20);
    const exitTimer = window.setTimeout(() => setVisible(false), 2800);
    const closeTimer = window.setTimeout(onClose, 3150);

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(closeTimer);
    };
  }, [toast, onClose]);

  if (!toast) return null;

  function dismiss() {
    setVisible(false);
    window.setTimeout(onClose, 180);
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "fixed left-4 right-4 top-24 z-[9999] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 transition duration-200 sm:left-auto sm:right-6 sm:w-[360px]",
        visible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
      ].join(" ")}
    >
      <div className="h-1 bg-emerald-600" />
      <div className="grid grid-cols-[56px_1fr_auto] gap-3 p-4">
        <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-emerald-50">
          {toast.imageUrl ? (
            <img src={toast.imageUrl} alt={toast.name} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center bg-emerald-700 text-white">
              <Glasses className="h-6 w-6" aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Added to cart
          </div>
          <p className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-slate-950">{toast.name}</p>
          <p className="mt-1 text-sm font-semibold text-slate-700">{formatCurrency(toast.price)}</p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="grid h-8 w-8 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Dismiss add to cart notification"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
