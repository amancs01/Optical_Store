import { Home, ShoppingBag } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-[64vh] max-w-3xl place-items-center px-4 py-12 text-center sm:px-6 lg:px-8">
      <div className="rounded-md border border-emerald-100 bg-white p-8 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">{SITE_CONFIG.name}</p>
        <h1 className="mt-3 font-serif text-4xl font-black text-slate-950">Page not found</h1>
        <p className="mt-3 text-slate-600">
          The page you are looking for may have moved, or the link may no longer be available.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <LinkButton href="/">
            <Home className="h-4 w-4" aria-hidden="true" /> Go Home
          </LinkButton>
          <LinkButton href="/products" variant="secondary">
            <ShoppingBag className="h-4 w-4" aria-hidden="true" /> Browse Products
          </LinkButton>
        </div>
      </div>
    </main>
  );
}
