"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, ChevronDown, CircleUser, LayoutDashboard, LogIn, LogOut, Menu, Package, Search, ShoppingBag, UserPlus, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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

const mobileMoreLinks = [
  ["Contact Lenses", "/products?category=Contact%20Lenses"],
  ["Kids Frames", "/products?category=Kids%20Frames"],
  ["Free Eye Checkup", "/book-eye-checkup"],
  ["Track Order", "/track-order"],
  ["About Us", "/about"],
  ["Contact Us", "/contact"],
] as const;

const mobileCategoryOptions = {
  Sunglasses: [
    ["Men", "/products?category=Sunglasses&gender=Men"],
    ["Women", "/products?category=Sunglasses&gender=Women"],
    ["Round", "/products?category=Sunglasses&shape=Round"],
    ["Square", "/products?category=Sunglasses&shape=Square"],
    ["Cat Eye", "/products?category=Sunglasses&shape=Cat%20Eye"],
    ["Aviator", "/products?category=Sunglasses&shape=Aviator"],
  ],
  Eyeglasses: [
    ["Men", "/products?category=Eyeglasses&gender=Men"],
    ["Women", "/products?category=Eyeglasses&gender=Women"],
    ["Round", "/products?category=Eyeglasses&shape=Round"],
    ["Rectangle", "/products?category=Eyeglasses&shape=Rectangle"],
    ["Cat Eye", "/products?category=Eyeglasses&shape=Cat%20Eye"],
  ],
} as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [cartShaking, setCartShaking] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<"Sunglasses" | "Eyeglasses" | null>(null);
  const [mobileSearch, setMobileSearch] = useState("");
  const { count } = useCart();
  const { user, isAdmin, signOut } = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    if (open) document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  useEffect(() => {
    function shakeCart() {
      setCartShaking(false);
      window.setTimeout(() => setCartShaking(true), 10);
      window.setTimeout(() => setCartShaking(false), 620);
    }

    window.addEventListener("cart-target-shake", shakeCart);
    return () => window.removeEventListener("cart-target-shake", shakeCart);
  }, []);

  async function logout() {
    await signOut();
    setOpen(false);
  }

  function closeMobileMenu() {
    setOpen(false);
    setExpandedMobileCategory(null);
  }

  function submitMobileSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = mobileSearch.trim();
    router.push(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
    closeMobileMenu();
  }

  return (
    <>
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
            data-cart-icon-target="top"
            className={cn(
              "relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50",
              cartShaking && "cart-target-shake",
            )}
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {hydrated && count > 0 ? (
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
    </header>
    {open ? (
      <>
      <button
        type="button"
        aria-label="Close menu"
        className="fixed inset-x-0 bottom-[72px] top-0 z-[1100] bg-slate-950/20 backdrop-blur-sm lg:hidden"
        onClick={closeMobileMenu}
      />
      <nav className="fixed bottom-[72px] right-0 top-0 z-[9999] w-[82vw] max-w-[420px] overflow-y-auto bg-white shadow-2xl shadow-slate-950/25 lg:hidden">
        <div className="flex h-[72px] items-center justify-between border-b border-slate-100 px-5">
          <Link href="/" className="flex min-w-0 items-center gap-2 text-base font-bold tracking-tight text-slate-950" onClick={closeMobileMenu}>
            {!logoFailed ? (
              <Image
                src={SITE_CONFIG.logoPath}
                alt={SITE_CONFIG.name}
                width={38}
                height={38}
                className="h-8 w-8 rounded-md object-contain"
                onError={() => setLogoFailed(true)}
              />
            ) : null}
            <span className="truncate">{SITE_CONFIG.name}</span>
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-4">
          <form onSubmit={submitMobileSearch} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={mobileSearch}
              onChange={(event) => setMobileSearch(event.target.value)}
              placeholder="Search products..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-medium outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </form>

          <div className="mt-4 divide-y divide-slate-100 border-y border-slate-100">
            <Link
              href="/"
              className="flex min-h-12 items-center px-1 text-base font-semibold text-slate-800 transition hover:text-emerald-900"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="flex min-h-12 items-center px-1 text-base font-semibold text-slate-800 transition hover:text-emerald-900"
              onClick={closeMobileMenu}
            >
              All Products
            </Link>
            <MobileExpandableCategory
              label="Sunglasses"
              expanded={expandedMobileCategory === "Sunglasses"}
              onToggle={() => setExpandedMobileCategory((current) => current === "Sunglasses" ? null : "Sunglasses")}
              options={mobileCategoryOptions.Sunglasses}
              onNavigate={closeMobileMenu}
            />
            <MobileExpandableCategory
              label="Eyeglasses"
              expanded={expandedMobileCategory === "Eyeglasses"}
              onToggle={() => setExpandedMobileCategory((current) => current === "Eyeglasses" ? null : "Eyeglasses")}
              options={mobileCategoryOptions.Eyeglasses}
              onNavigate={closeMobileMenu}
            />
          </div>

          <div className="mt-5">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">More Categories</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {mobileMoreLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-full px-3 py-2 text-xs font-bold transition",
                    label === "Free Eye Checkup"
                      ? "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-100"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                  )}
                  onClick={closeMobileMenu}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {user ? (
            <div className="mt-3 border-t border-slate-100 pt-3">
              <Link
                href="/account"
                className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50"
                onClick={closeMobileMenu}
              >
                My Account
              </Link>
              <Link
                href="/account/orders"
                className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50"
                onClick={closeMobileMenu}
              >
                My Orders
              </Link>
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="block rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
                  onClick={closeMobileMenu}
                >
                  Admin Dashboard
                </Link>
              ) : null}
              <button
                type="button"
                className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-3 border-t border-slate-100 pt-3">
              <Link
                href="/login"
                className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50"
                onClick={closeMobileMenu}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
      </>
    ) : null}
    </>
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
  const [path] = href.split("?");
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

function MobileExpandableCategory({
  label,
  expanded,
  onToggle,
  options,
  onNavigate,
}: {
  label: string;
  expanded: boolean;
  onToggle: () => void;
  options: readonly (readonly [string, string])[];
  onNavigate: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex min-h-12 w-full items-center justify-between px-1 text-left text-base font-semibold text-slate-800 transition hover:text-emerald-900"
      >
        {label}
        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition", expanded && "rotate-180 text-emerald-700")} aria-hidden="true" />
      </button>
      {expanded ? (
        <div className="flex flex-wrap gap-2 pb-3 pl-1">
          {options.map(([optionLabel, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-900"
              onClick={onNavigate}
            >
              {optionLabel}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
