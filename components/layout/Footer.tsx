import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-xl font-black">{SITE_CONFIG.name}</h2>
          <p className="mt-3 text-sm text-slate-300">{SITE_CONFIG.description}</p>
        </div>
        <div>
          <h3 className="font-semibold">Store</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-300">
            <Link href="/products">Products</Link>
            <Link href="/book-eye-checkup">Book eye checkup</Link>
            <Link href="/track-order">Track order</Link>
            <Link href="/admin/login">Admin</Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Help</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-300">
            <Link href="/shipping-policy">Shipping policy</Link>
            <Link href="/return-policy">Return policy</Link>
            <Link href="/privacy-policy">Privacy policy</Link>
            <Link href="/terms">Terms</Link>
          </div>
          <p className="mt-4 text-sm text-slate-300">{SITE_CONFIG.phone}</p>
          <p className="text-sm text-slate-300">{SITE_CONFIG.email}</p>
        </div>
      </div>
    </footer>
  );
}
