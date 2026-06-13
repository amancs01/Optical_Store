"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, LogIn, LogOut, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

const mobileProductLinks = [
  ["Contact Lenses", "/products?category=Contact%20Lenses"],
  ["Kids Frames", "/products?category=Kids%20Frames"],
] as const;

const mobileQuickLinks = [
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

type MobileSidebarProps = {
  open: boolean;
  onClose: () => void;
  onLogout: () => Promise<void>;
  user: { email?: string } | null;
  isAdmin: boolean;
  logoFailed: boolean;
};

export function MobileSidebar({ open, onClose, onLogout, user, isAdmin, logoFailed }: MobileSidebarProps) {
  const [expandedCategory, setExpandedCategory] = useState<"Sunglasses" | "Eyeglasses" | null>(null);

  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  function close() {
    onClose();
    setExpandedCategory(null);
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        className={cn(
          "fixed inset-0 z-[1100] transition-all duration-300 lg:hidden",
          open ? "bg-slate-950/20 backdrop-blur-sm" : "bg-transparent backdrop-blur-none pointer-events-none",
        )}
        onClick={close}
      />
      <nav
        className={cn(
          "fixed bottom-0 right-0 top-0 z-[9999] flex w-[80vw] max-w-[400px] flex-col bg-white shadow-2xl shadow-slate-950/25 transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-100 px-5">
          <Link href="/" className="flex min-w-0 items-center gap-2 text-base font-bold tracking-tight text-slate-950" onClick={close}>
            {!logoFailed ? (
              <Image
                src={SITE_CONFIG.logoPath}
                alt={SITE_CONFIG.name}
                width={38}
                height={38}
                className="h-8 w-8 rounded-md object-contain"
              />
            ) : null}
            <span className="truncate">{SITE_CONFIG.name}</span>
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
            onClick={close}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col overflow-y-auto px-5 pb-4 pt-1">
          <div className="divide-y divide-slate-100 border-b border-slate-100">
            <Link href="/" className="flex items-center px-1 py-4 text-base font-semibold text-slate-800 transition hover:text-emerald-900" onClick={close}>
              Home
            </Link>
            <Link href="/products" className="flex items-center px-1 py-4 text-base font-semibold text-slate-800 transition hover:text-emerald-900" onClick={close}>
              All Products
            </Link>
            <MobileExpandableCategory
              label="Sunglasses"
              expanded={expandedCategory === "Sunglasses"}
              onToggle={() => setExpandedCategory((current) => current === "Sunglasses" ? null : "Sunglasses")}
              options={mobileCategoryOptions.Sunglasses}
              onNavigate={close}
            />
            <MobileExpandableCategory
              label="Eyeglasses"
              expanded={expandedCategory === "Eyeglasses"}
              onToggle={() => setExpandedCategory((current) => current === "Eyeglasses" ? null : "Eyeglasses")}
              options={mobileCategoryOptions.Eyeglasses}
              onNavigate={close}
            />
            {mobileProductLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="flex items-center px-1 py-4 text-base font-normal text-slate-800 transition hover:text-emerald-900"
                onClick={close}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="mt-4">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Quick Links</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {mobileQuickLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-full px-3 py-2 text-xs font-bold transition",
                    label === "Free Eye Checkup"
                      ? "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-100"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                  )}
                  onClick={close}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {user ? (
            <div className="mt-4 border-t border-slate-100 pt-3">
              <Link href="/account" className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50" onClick={close}>
                My Account
              </Link>
              <Link href="/account/orders" className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50" onClick={close}>
                My Orders
              </Link>
              {isAdmin ? (
                <Link href="/admin" className="block rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-100" onClick={close}>
                  Admin Dashboard
                </Link>
              ) : null}
              <button type="button" className="mt-2 block w-full rounded-xl bg-rose-50 px-3 py-3 text-left text-sm font-bold text-rose-700 hover:bg-rose-100" onClick={onLogout}>
                <LogOut className="mr-2 inline h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-4 border-t border-slate-100 pt-3">
              <Link href="/login" className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50" onClick={close}>
                <LogIn className="mr-2 inline h-4 w-4" />
                Login
              </Link>
              <Link href="/register" className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-emerald-50" onClick={close}>
                <UserPlus className="mr-2 inline h-4 w-4" />
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
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
        className="flex w-full items-center justify-between px-1 py-4 text-left text-base font-semibold text-slate-800 transition hover:text-emerald-900"
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
