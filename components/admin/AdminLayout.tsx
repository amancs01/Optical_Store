"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarCheck,
  ChevronDown,
  CircleUser,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Package,
  ShoppingBag,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { useCurrentUser } from "@/lib/auth/admin";
import { cn } from "@/lib/utils";

const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Messages", href: "/admin/messages", icon: MessageSquareText },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useCurrentUser();

  async function logout() {
    await signOut();
    setMobileOpen(false);
    router.push("/admin/login");
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-100">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen((value) => !value)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 lg:hidden"
                aria-label="Admin menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <Link href="/admin" className="truncate text-base font-black text-slate-950 sm:text-lg">
                Titan Opticals Admin
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="hidden h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:inline-flex"
              >
                <Home className="h-4 w-4" />
                View Store
              </Link>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-emerald-200"
                  >
                    <CircleUser className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    sideOffset={8}
                    className="z-50 w-56 rounded-md border border-slate-200 bg-white p-2 shadow-lg outline-none"
                  >
                    <AdminMenuLink href="/" label="View Store" icon={<Home className="h-4 w-4" />} />
                    <AdminMenuLink href="/admin" label="Admin Dashboard" icon={<LayoutDashboard className="h-4 w-4" />} />
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
            </div>
          </div>
          {mobileOpen ? (
            <div className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
              <AdminNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />
              <button
                type="button"
                onClick={() => void logout()}
                className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : null}
        </header>
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
          <aside className="hidden h-fit rounded-md border border-slate-200 bg-white p-3 shadow-sm lg:block">
            <AdminNav pathname={pathname} />
            <button
              type="button"
              onClick={() => void logout()}
              className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </aside>
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}

function AdminNav({ pathname, onNavigate }: { pathname: string | null; onNavigate?: () => void }) {
  return (
    <nav className="grid gap-1">
      {links.map(({ label, href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100",
            isActiveAdminPath(pathname, href) && "bg-slate-950 text-white hover:bg-slate-900",
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function AdminMenuLink({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
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

function isActiveAdminPath(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
