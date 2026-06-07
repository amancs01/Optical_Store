"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, CircleUser, LayoutDashboard, LogIn, LogOut, Menu, Package, ShoppingBag, UserPlus, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SITE_CONFIG } from "@/lib/constants";
import { useCart } from "@/components/cart/CartProvider";
import { useCurrentUser } from "@/lib/auth/admin";
import { cn } from "@/lib/utils";

const nav = [
  ["Home", "/"],
  ["Eyeglasses", "/products?category=Eyeglasses"],
  ["Sunglasses", "/products?category=Sunglasses"],
  ["Eye Checkup", "/book-eye-checkup"],
];

const moreNav = [
  ["Contact Lenses", "/products?category=Contact%20Lenses"],
  ["Kids Frames", "/products?category=Kids%20Frames"],
  ["Track Order", "/track-order"],
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Delivery Policy", "/shipping-policy"],
  ["Return Policy", "/return-policy"],
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
        <nav className="hidden items-center gap-1 md:flex lg:gap-2">
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
              <DropdownMenu.Content align="center" sideOffset={10} className="z-50 w-56 rounded-md border border-slate-200 bg-white p-2 shadow-lg outline-none">
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
          <SocialLinks className="hidden sm:flex" />
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
          {[...nav, ...moreNav].map(([label, href]) => (
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
          <SocialLinks className="px-3 py-3" />
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

function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  const [path, query] = href.split("?");
  if (query) return false;
  return pathname === path || (path !== "/" && pathname.startsWith(`${path}/`));
}

function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("items-center gap-1", className)}>
      <SocialLink href={SITE_CONFIG.socialLinks.facebook} label="Facebook">
        <FacebookIcon className="h-4 w-4" />
      </SocialLink>
      <SocialLink href={SITE_CONFIG.socialLinks.instagram} label="Instagram">
        <InstagramIcon className="h-4 w-4" />
      </SocialLink>
      <SocialLink href={SITE_CONFIG.socialLinks.tiktok} label="TikTok">
        <TikTokIcon className="h-4 w-4" />
      </SocialLink>
    </div>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-emerald-900"
      aria-label={`Titan Optical on ${label}`}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14 8.4V6.9c0-.7.2-1.1 1.2-1.1h1.5V3.1C16 3 15.2 3 14.3 3c-2.2 0-3.7 1.3-3.7 3.7v1.7H8.1v3h2.5V21H14v-9.6h2.5l.4-3H14Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect width="14" height="14" x="5" y="5" rx="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="16.5" cy="7.5" r="1" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M15.8 3c.4 2.3 1.7 3.8 4.2 4v3.1c-1.5.1-2.9-.4-4.1-1.2v5.9c0 3.1-2 5.2-5.1 5.2-2.9 0-5-1.8-5-4.5 0-2.9 2.4-4.8 5.6-4.5v3.1c-1.4-.2-2.3.3-2.3 1.3 0 .9.7 1.5 1.8 1.5 1.2 0 1.8-.7 1.8-2.1V3h3.1Z" />
    </svg>
  );
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
