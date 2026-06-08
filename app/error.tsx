"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto grid min-h-[64vh] max-w-3xl place-items-center px-4 py-12 text-center sm:px-6 lg:px-8">
      <div className="rounded-md border border-emerald-100 bg-white p-8 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">Titan Optical</p>
        <h1 className="mt-3 font-serif text-4xl font-black text-slate-950">Something went wrong</h1>
        <p className="mt-3 text-slate-600">
          We could not load this page properly. Please try again, or return home and continue browsing.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={() => reset()}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Try again
          </Button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-emerald-200 bg-white px-4 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
