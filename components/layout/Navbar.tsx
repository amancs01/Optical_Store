"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, CircleUser, LayoutDashboard, LogOut, Menu, MessageCircle, Package, Phone, ShoppingBag, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SITE_CONFIG } from "@/lib/constants";
import { supabase } from "@/lib/supabase/client";
import { useCart } from "@/components/cart/CartProvider";
import { useCurrentUser } from "@/lib/auth/admin";
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
  const [accountOpen, setAccountOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const { count } = useCart();
  const { user, isAdmin } = useCurrentUser();
  const pathname = usePathname();

  async function logout() {
    await supabase?.auth.signOut();
    setOpen(false);
    setAccountOpen(false);
  }

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
          {user ? (
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setAccountOpen((value) => !value)}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
              >
                <CircleUser className="h-4 w-4" />
                Account
                <ChevronDown className="h-4 w-4" />
              </button>
              {accountOpen ? (
                <div className="absolute right-0 top-12 z-50 w-56 rounded-md border border-slate-200 bg-white p-2 shadow-lg" role="menu">
                  <AccountMenuLink href="/account" label="My Account" icon={<CircleUser className="h-4 w-4" />} onClick={() => setAccountOpen(false)} />
                  <AccountMenuLink href="/account/orders" label="My Orders" icon={<Package className="h-4 w-4" />} onClick={() => setAccountOpen(false)} />
                  {isAdmin ? (
                    <AccountMenuLink href="/admin" label="Admin Dashboard" icon={<LayoutDashboard className="h-4 w-4" />} onClick={() => setAccountOpen(false)} />
                  ) : null}
                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:inline-flex"
            >
              <CircleUser className="h-4 w-4" />
              Login
            </Link>
          )}
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
          {user ? (
            <>
              <Link
                href="/account"
                className="block rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-emerald-50"
                onClick={() => setOpen(false)}
              >
                My Account
              </Link>
              <Link
                href="/account/orders"
                className="block rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-emerald-50"
                onClick={() => setOpen(false)}
              >
                My Orders
              </Link>
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="block rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
                  onClick={() => setOpen(false)}
                >
                  Admin Dashboard
                </Link>
              ) : null}
              <button
                type="button"
                className="block w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="block rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-emerald-50"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          )}
        </nav>
      ) : null}
    </header>
  );
}

function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

function AccountMenuLink({
  href,
  label,
  icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900"
      role="menuitem"
    >
      {icon}
      {label}
    </Link>
  );
}
