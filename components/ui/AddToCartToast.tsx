"use client";

import { CheckCircle2, Glasses, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const router = useRouter();
  const toastRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"entering" | "visible" | "flying" | "dismissing">("entering");
  const [flyTransform, setFlyTransform] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) {
      setState("entering");
      setFlyTransform(null);
      return;
    }

    setState("entering");
    setFlyTransform(null);
    const enterTimer = window.setTimeout(() => setState("visible"), 20);
    let shakeTimer: number | undefined;
    let closeTimer: number | undefined;

    const flyTimer = window.setTimeout(() => {
      setFlyTransform(getCartFlyTransform(toastRef.current));
      setState("flying");
      shakeTimer = window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent("cart-target-shake"));
      }, 430);
      closeTimer = window.setTimeout(onClose, 650);
    }, 2800);

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(flyTimer);
      if (shakeTimer) window.clearTimeout(shakeTimer);
      if (closeTimer) window.clearTimeout(closeTimer);
    };
  }, [toast?.id, toast, onClose]);

  if (!toast) return null;

  function dismiss() {
    setState("dismissing");
    window.setTimeout(onClose, 180);
  }

  function openCart() {
    onClose();
    router.push("/cart");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCart();
    }
  }

  const stateClass = {
    entering: "-translate-y-2 scale-95 opacity-0",
    visible: "translate-x-0 translate-y-0 scale-100 opacity-100",
    flying: flyTransform ? "opacity-0" : "translate-x-20 translate-y-56 scale-[0.35] opacity-0 sm:-translate-y-10",
    dismissing: "-translate-y-2 scale-95 opacity-0",
  }[state];

  return (
    <div
      ref={toastRef}
      role="button"
      tabIndex={0}
      aria-label="View cart"
      onClick={openCart}
      onKeyDown={handleKeyDown}
      className={[
        "fixed left-4 right-4 top-24 z-[9999] cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 outline-none transition-all duration-500 ease-in-out focus-visible:ring-2 focus-visible:ring-emerald-300 sm:left-auto sm:right-6 sm:w-[360px]",
        stateClass,
      ].join(" ")}
      style={state === "flying" && flyTransform ? { transform: flyTransform } : undefined}
    >
      <span className="sr-only" aria-live="polite">Added to cart. Select to view cart.</span>
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
          onClick={(event) => {
            event.stopPropagation();
            dismiss();
          }}
          onKeyDown={(event) => event.stopPropagation()}
          className="grid h-8 w-8 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function getCartFlyTransform(toastElement: HTMLDivElement | null) {
  if (!toastElement || typeof document === "undefined") {
    return null;
  }

  const toastRect = toastElement.getBoundingClientRect();
  const cartTarget = getVisibleCartTarget();

  if (!cartTarget) {
    return null;
  }

  const cartRect = cartTarget.getBoundingClientRect();
  const toastCenterX = toastRect.left + toastRect.width / 2;
  const toastCenterY = toastRect.top + toastRect.height / 2;
  const cartCenterX = cartRect.left + cartRect.width / 2;
  const cartCenterY = cartRect.top + cartRect.height / 2;

  return `translate(${Math.round(cartCenterX - toastCenterX)}px, ${Math.round(cartCenterY - toastCenterY)}px) scale(0.18)`;
}

function getVisibleCartTarget() {
  const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-cart-icon-target]"));
  const visibleTargets = targets.filter((target) => {
    const rect = target.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });

  if (!visibleTargets.length) {
    return null;
  }

  const preferredTarget = window.innerWidth < 768
    ? visibleTargets.find((target) => target.dataset.cartIconTarget === "bottom")
    : visibleTargets.find((target) => target.dataset.cartIconTarget === "top");

  return preferredTarget || visibleTargets[0];
}
