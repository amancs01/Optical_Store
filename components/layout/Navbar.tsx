"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, CircleUser, LayoutDashboard, LogIn, LogOut, Menu, Package, ShoppingBag, UserPlus, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SITE_CONFIG } from "@/lib/constants";
import { useCart } from "@/components/cart/CartProvider";
import { useCurrentUser } from "@/lib/auth/admin";
import { HoverDropdown } from "@/components/ui/HoverDropdown";
import { cn } from "@/lib/utils";

const nav = [["Home", "/"]];

const moreNav = [
  ["Contact Lenses", "/products?category=Contact%20Lenses"],
  ["Kids Frames", "/products?category=Kids%20Frames"],
  ["Track Order", "/track-order"],
  ["About Us", "/about"],
];

const eyeglassesMenu = [
  ["Men", "/products?category=Eyeglasses&gender=Men"],
  ["Women", "/products?category=Eyeglasses&gender=Women"],
  ["Unisex", "/products?category=Eyeglasses&gender=Unisex"],
  ["Full Frame", "/products?category=Eyeglasses&frame_type=Full%20Rim"],
  ["Half Frame", "/products?category=Eyeglasses&frame_type=Half%20Rim"],
  ["View all Eyeglasses", "/products?category=Eyeglasses"],
];

const sunglassesMenu = [
  ["Men", "/products?category=Sunglasses&gender=Men"],
  ["Women", "/products?category=Sunglasses&gender=Women"],
  ["Unisex", "/products?category=Sunglasses&gender=Unisex"],
  ["Aviator", "/products?category=Sunglasses&shape=Aviator"],
  ["Wayfarer", "/products?category=Sunglasses&shape=Wayfarer"],
  ["View all Sunglasses", "/products?category=Sunglasses"],
];

const mobileLinks = [
  ["Home", "/"],
  ["Eyeglasses", "/products?category=Eyeglasses"],
  ["Sunglasses", "/products?category=Sunglasses"],
  ["Contact Us", "/contact"],
  ["Free Eye Checkup", "/book-eye-checkup"],
  ["Contact Lenses", "/products?category=Contact%20Lenses"],
  ["Kids Frames", "/products?category=Kids%20Frames"],
  ["Track Order", "/track-order"],
  ["About Us", "/about"],
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const { count } = useCart();
  const { user, isAdmin, signOut } = useCurrentUser();
  const pathname = usePathname();

  async function logout() {
    await signOut();
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-[1000] border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2 text-base font-bold tracking-tight text-slate-950 sm:gap-3 sm:text-lg">
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
        <nav className="hidden items-center gap-1 lg:flex lg:gap-2">
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
          <HoverDropdown label="Eyeglasses" items={toDropdownItems(eyeglassesMenu)} />
          <HoverDropdown label="Sunglasses" items={toDropdownItems(sunglassesMenu)} />
          <Link
            href="/contact"
            className={cn(
              "rounded-full px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900",
              isActivePath(pathname, "/contact") && "bg-emerald-50 text-emerald-900",
            )}
          >
            Contact Us
          </Link>
          <HoverDropdown label="More" items={toDropdownItems(moreNav)} contentClassName="w-60" />
        </nav>
        <div className="flex items-center gap-2">
          <CheckupCta className="hidden lg:inline-flex" />
          {user ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className="hidden h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-emerald-200 sm:inline-flex"
                  aria-label="Account menu"
                >
                  <CircleUser className="h-4 w-4" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={8}
                  className="z-[9999] w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-950/15 outline-none"
                >
                  <AccountMenuLink href="/account" label="My Account" icon={<CircleUser className="h-4 w-4" />} />
                  <AccountMenuLink href="/account/orders" label="My Orders" icon={<Package className="h-4 w-4" />} />
                  {isAdmin ? (
                    <AccountMenuLink href="/admin" label="Admin Dashboard" icon={<LayoutDashboard className="h-4 w-4" />} />
                  ) : null}
                  <DropdownMenu.Item
                    onSelect={() => void logout()}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 outline-none hover:bg-slate-50 focus:bg-slate-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ) : (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className="hidden h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-emerald-200 sm:inline-flex"
                  aria-label="Account"
                >
                  <CircleUser className="h-4 w-4" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content align="end" sideOffset={8} className="z-[9999] w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-950/15 outline-none">
                  <AccountMenuLink href="/login" label="Login" icon={<LogIn className="h-4 w-4" />} />
                  <AccountMenuLink href="/register" label="Register" icon={<UserPlus className="h-4 w-4" />} />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          {mobileLinks.map(([label, href]) => {
            const isCheckup = href === "/book-eye-checkup";

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900",
                  isActivePath(pathname, href) && "bg-emerald-50 text-emerald-900",
                  isCheckup && "mb-1 flex items-center justify-between border border-emerald-200 bg-emerald-50 text-emerald-900",
                )}
                onClick={() => setOpen(false)}
              >
                <span className={cn(isCheckup && "inline-flex items-center gap-2")}>
                  {isCheckup ? <CalendarCheck className="h-4 w-4" aria-hidden="true" /> : null}
                  {label}
                </span>
                {isCheckup ? (
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-emerald-700">
                    Free
                  </span>
                ) : null}
              </Link>
            );
          })}
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
            <>
              <Link
                href="/login"
                className="block rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-emerald-50"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-emerald-50"
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      ) : null}
    </header>
  );
}

function CheckupCta({ className }: { className?: string }) {
  return (
    <Link
      href="/book-eye-checkup"
      className={cn(
        "items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm font-bold text-emerald-900 shadow-sm shadow-emerald-950/5 transition hover:border-emerald-300 hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200",
        className,
      )}
    >
      <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
      Free Eye Checkup
    </Link>
  );
}

function toDropdownItems(items: string[][]) {
  return items.map(([label, href], index) => ({ label, href, badge: index === items.length - 1 ? undefined : label.slice(0, 1) }));
}

function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  const [path, query] = href.split("?");
  if (query) return false;
  return pathname === path || (path !== "/" && pathname.startsWith(`${path}/`));
}

function AccountMenuLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <DropdownMenu.Item asChild>
      <Link
        href={href}
        className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 outline-none hover:bg-emerald-50 hover:text-emerald-900 focus:bg-emerald-50 focus:text-emerald-900"
      >
        {icon}
        {label}
      </Link>
    </DropdownMenu.Item>
  );
}
