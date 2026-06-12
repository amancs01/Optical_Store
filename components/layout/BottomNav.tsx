"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { cn } from "@/lib/utils";

const items = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/products", icon: ShoppingBag },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
  { label: "Account", href: "/account", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();
  const [hydrated, setHydrated] = useState(false);
  const [cartShaking, setCartShaking] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    function shakeCart() {
      setCartShaking(false);
      window.setTimeout(() => setCartShaking(true), 10);
      window.setTimeout(() => setCartShaking(false), 620);
    }

    window.addEventListener("cart-target-shake", shakeCart);
    return () => window.removeEventListener("cart-target-shake", shakeCart);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pb-2 pt-1 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {items.map(({ label, href, icon: Icon }) => {
          const active = isActivePath(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              data-cart-icon-target={href === "/cart" ? "bottom" : undefined}
              className={cn(
                "relative grid min-h-14 place-items-center rounded-md px-2 py-1 text-[11px] font-bold text-slate-500",
                active && "bg-emerald-50 text-emerald-800",
                href === "/cart" && cartShaking && "cart-target-shake",
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{label}</span>
              {href === "/cart" && hydrated && count > 0 ? (
                <span key={count} className="badge-pop absolute right-3 top-1 rounded-full bg-rose-600 px-1.5 text-[10px] leading-4 text-white">
                  {count}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
