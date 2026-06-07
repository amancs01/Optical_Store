"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, ChevronDown, CircleUser, LayoutDashboard, LogIn, LogOut, Menu, Package, ShoppingBag, UserPlus, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SITE_CONFIG } from "@/lib/constants";
import { useCart } from "@/components/cart/CartProvider";
import { useCurrentUser } from "@/lib/auth/admin";
import { cn } from "@/lib/utils";

const nav = [
  ["Home", "/"],
];

const moreNav = [
  ["Contact Lenses", "/products?category=Contact%20Lenses"],
  ["Kids Frames", "/products?category=Kids%20Frames"],
  ["Track Order", "/track-order"],
  ["About Us", "/about"],
];

const eyeglassesMenu = [
  {
    title: "Eyeglasses",
    links: [
      ["Men", "/products?category=Eyeglasses&gender=Men"],
      ["Women", "/products?category=Eyeglasses&gender=Women"],
      ["Unisex", "/products?category=Eyeglasses&gender=Unisex"],
      ["Full Frame", "/products?category=Eyeglasses&frame_type=Full%20Rim"],
      ["Half Frame", "/products?category=Eyeglasses&frame_type=Half%20Rim"],
    ],
  },
];

const sunglassesMenu = [
  {
    title: "Sunglasses",
    links: [
      ["Men", "/products?category=Sunglasses&gender=Men"],
      ["Women", "/products?category=Sunglasses&gender=Women"],
      ["Unisex", "/products?category=Sunglasses&gender=Unisex"],
      ["Aviator", "/products?category=Sunglasses&shape=Aviator"],
      ["Wayfarer", "/products?category=Sunglasses&shape=Wayfarer"],
    ],
  },
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
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
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
          <ProductDropdown label="Eyeglasses" columns={eyeglassesMenu} viewAllLabel="View all Eyeglasses" viewAllHref="/products?category=Eyeglasses" />
          <ProductDropdown label="Sunglasses" columns={sunglassesMenu} viewAllLabel="View all Sunglasses" viewAllHref="/products?category=Sunglasses" />
          <Link
            href="/contact"
            className={cn(
              "rounded-full px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900",
              isActivePath(pathname, "/contact") && "bg-emerald-50 text-emerald-900",
            )}
          >
            Contact Us
          </Link>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-slate-700 outline-none hover:bg-emerald-50 hover:text-emerald-900 focus-visible:ring-2 focus-visible:ring-emerald-200"
              >
                More
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content align="start" sideOffset={8} className="z-50 w-60 rounded-md border border-slate-200 bg-white p-2 shadow-lg outline-none">
                {moreNav.map(([label, href]) => (
                  <DropdownMenu.Item key={href} asChild>
                    <Link
                      href={href}
                      className="flex cursor-pointer rounded-md px-3 py-2 text-sm font-semibold text-slate-700 outline-none hover:bg-emerald-50 hover:text-emerald-900 focus:bg-emerald-50 focus:text-emerald-900"
                    >
                      {label}
                    </Link>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
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
                  className="z-50 w-56 rounded-md border border-slate-200 bg-white p-2 shadow-lg outline-none"
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
                <DropdownMenu.Content align="end" sideOffset={8} className="z-50 w-48 rounded-md border border-slate-200 bg-white p-2 shadow-lg outline-none">
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

function ProductDropdown({
  label,
  columns,
  viewAllLabel,
  viewAllHref,
}: {
  label: string;
  columns: Array<{ title: string; links: string[][] }>;
  viewAllLabel: string;
  viewAllHref: string;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-slate-700 outline-none hover:bg-emerald-50 hover:text-emerald-900 focus-visible:ring-2 focus-visible:ring-emerald-200"
        >
          {label}
          <ChevronDown className="h-4 w-4" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={8}
          className="z-50 w-72 rounded-md border border-slate-200 bg-white p-2 shadow-lg shadow-slate-950/10 outline-none"
        >
          <div className="grid gap-1">
            {columns.map((column) => (
              <div key={column.title}>
                <div className="grid gap-1">
                  {column.links.map(([itemLabel, href]) => (
                    <DropdownMenu.Item key={href} asChild>
                      <Link
                        href={href}
                        className="rounded-md px-2 py-2 text-sm font-semibold text-slate-700 outline-none hover:bg-emerald-50 hover:text-emerald-900 focus:bg-emerald-50 focus:text-emerald-900"
                      >
                        {itemLabel}
                      </Link>
                    </DropdownMenu.Item>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-slate-100 pt-3">
            <DropdownMenu.Item asChild>
              <Link
                href={viewAllHref}
                className="flex items-center justify-between rounded-md bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-900 outline-none hover:bg-emerald-100 focus:bg-emerald-100"
              >
                {viewAllLabel}
                <span aria-hidden="true">→</span>
              </Link>
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
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
