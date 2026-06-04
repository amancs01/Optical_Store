import Link from "next/link";
import { AdminGuard } from "@/components/admin/AdminGuard";

const links = [
  ["Dashboard", "/admin"],
  ["Products", "/admin/products"],
  ["Orders", "/admin/orders"],
  ["Bookings", "/admin/bookings"],
  ["Messages", "/admin/messages"],
  ["Logout", "/admin/logout"],
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
        <aside className="h-fit rounded-md border border-slate-200 bg-white p-3">
          <h2 className="px-3 py-2 text-sm font-black uppercase text-slate-500">Admin</h2>
          <nav className="grid gap-1">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </AdminGuard>
  );
}
