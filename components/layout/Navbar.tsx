"use client";

import Image from "next/image";
import Link from "next/link";
import { CircleUser, Menu, MessageCircle, Phone, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { SITE_CONFIG } from "@/lib/constants";
import { supabase } from "@/lib/supabase/client";
import { useCart } from "@/components/cart/CartProvider";
import { cn } from "@/lib/utils";

const nav = [
  ["Shop", "/products"],
  ["Eye Checkup", "/book-eye-checkup"],
  ["Track Order", "/track-order"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { count } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2 text-base font-black tracking-tight text-slate-950 sm:gap-3 sm:text-lg">
          {!logoFailed ? (
            <Image
              src={SITE_CONFIG.logoPath}
              alt={SITE_CONFIG.name}
              width={42}
              height={42}
              className="h-8 w-8 rounded-md object-contain sm:h-10 sm:w-10"
              onError={() => setLogoFailed(true)}
              priority
            />
          ) : null}
          <span className="truncate">{SITE_CONFIG.name}</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900",
                isActivePath(pathname, href) && "bg-emerald-50 text-emerald-900",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={`tel:${SITE_CONFIG.phone}`}
            className="hidden h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 lg:inline-flex"
          >
            <Phone className="h-4 w-4" />
            {SITE_CONFIG.phone}
          </a>
          <a
            href={`https://wa.me/977${SITE_CONFIG.whatsapp}`}
            className="hidden h-10 items-center justify-center rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:inline-flex"
            aria-label="WhatsApp Titan Opticals"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
          <Link
            href={user ? "/account" : "/login"}
            className="hidden h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:inline-flex"
          >
            <CircleUser className="h-4 w-4" />
            {user ? "Account" : "Login"}
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 ? (
              <span key={count} className="badge-pop absolute -right-1 -top-1 rounded-full bg-rose-600 px-1.5 text-xs font-bold text-white">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900",
                isActivePath(pathname, href) && "bg-emerald-50 text-emerald-900",
              )}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <a
            href={`tel:${SITE_CONFIG.phone}`}
            className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Call {SITE_CONFIG.phone}
          </a>
          <a
            href={`https://wa.me/977${SITE_CONFIG.whatsapp}`}
            className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            WhatsApp
          </a>
          <Link
            href={user ? "/account/orders" : "/login"}
            className="block rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-emerald-50"
            onClick={() => setOpen(false)}
          >
            {user ? "My Orders" : "Customer Login"}
          </Link>
        </nav>
      ) : null}
    </header>
  );
}

function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}
