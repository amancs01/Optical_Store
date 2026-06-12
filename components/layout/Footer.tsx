"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SocialIconLinks } from "@/components/layout/SocialIconLinks";
import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  const pathname = usePathname();
  const hideMobileFooter = shouldHideMobileFooter(pathname);

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-950 text-white">
      <div className={hideMobileFooter ? "hidden md:hidden" : "md:hidden"}>
        <div className="px-4 pb-24 pt-5">
          <div className="flex items-center gap-2.5">
            <Image src={SITE_CONFIG.logoPath} alt={SITE_CONFIG.name} width={36} height={36} loading="lazy" className="h-9 w-9 rounded-md object-contain" />
            <h2 className="text-base font-bold">{SITE_CONFIG.name}</h2>
          </div>
          <p className="mt-2 text-sm text-slate-300">Premium eyewear in New Road, Kathmandu.</p>
          <p className="mt-1 text-xs font-semibold text-emerald-200">Free delivery inside Kathmandu Valley.</p>
          <div className="mt-3 grid gap-1.5 text-sm text-slate-300">
            <a href={`tel:${SITE_CONFIG.phone}`} className="font-semibold text-white transition hover:text-emerald-200">
              {SITE_CONFIG.phone}
            </a>
            <a href={`mailto:${SITE_CONFIG.email}`} className="break-words transition hover:text-white">
              {SITE_CONFIG.email}
            </a>
            <a
              href={SITE_CONFIG.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-xs font-semibold text-emerald-200 transition hover:text-white"
            >
              Open in Google Maps
            </a>
          </div>
          <SocialIconLinks includeWhatsApp className="mt-3" />
          <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold text-slate-400">
            <Link href="/shipping-policy" className="hover:text-white">Shipping</Link>
            <Link href="/return-policy" className="hover:text-white">Returns</Link>
            <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
          <p className="mt-4 border-t border-slate-800 pt-3 text-xs text-slate-500">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}
          </p>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-9 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <Image src={SITE_CONFIG.logoPath} alt={SITE_CONFIG.name} width={44} height={44} loading="lazy" className="h-11 w-11 rounded-md object-contain" />
              <h2 className="text-xl font-bold">{SITE_CONFIG.name}</h2>
            </div>
            <p className="mt-3 text-sm text-slate-300">{SITE_CONFIG.description}</p>
            <p className="mt-3 text-sm font-semibold text-emerald-200">{SITE_CONFIG.deliveryNote}</p>
          </div>
          <div>
            <h3 className="font-semibold">Store</h3>
            <div className="mt-3 grid gap-2 text-sm text-slate-300">
              <Link href="/products" className="transition hover:text-white">Products</Link>
              <Link href="/about" className="transition hover:text-white">About</Link>
              <Link href="/book-eye-checkup" className="transition hover:text-white">Free Eye Checkup</Link>
              <Link href="/track-order" className="transition hover:text-white">Track order</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Policies</h3>
            <div className="mt-3 grid gap-2 text-sm text-slate-300">
              <Link href="/shipping-policy" className="transition hover:text-white">Shipping policy</Link>
              <Link href="/return-policy" className="transition hover:text-white">Return policy</Link>
              <Link href="/privacy-policy" className="transition hover:text-white">Privacy policy</Link>
              <Link href="/terms" className="transition hover:text-white">Terms</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Contact</h3>
            <div className="mt-3 grid gap-2 text-sm text-slate-300">
              <a
                href={SITE_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                {SITE_CONFIG.address}
              </a>
              <a
                href={SITE_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-emerald-200 transition hover:text-white"
              >
                Open in Google Maps
              </a>
              <p>{SITE_CONFIG.openingHours}</p>
              <a href={`tel:${SITE_CONFIG.phone}`} className="font-semibold text-white transition hover:text-emerald-200">
                {SITE_CONFIG.phone}
              </a>
            </div>
          </div>
        </div>
        <div>
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 pb-2 pt-3 text-sm text-slate-300 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-5 lg:px-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1">
              <a href={`mailto:${SITE_CONFIG.email}`} className="break-words transition hover:text-white">
                {SITE_CONFIG.email}
              </a>
            </div>
            <SocialIconLinks includeWhatsApp className="lg:justify-end" />
          </div>
        </div>
        <div className="border-t border-slate-800 px-4 py-2 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function shouldHideMobileFooter(pathname: string | null) {
  if (!pathname) return false;

  return [
    "/products",
    "/cart",
    "/checkout",
    "/account",
    "/admin",
  ].some((route) => pathname === route || pathname.startsWith(`${route}/`));
}
