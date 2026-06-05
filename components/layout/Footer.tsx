import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  const socialLinks = [
    ["Facebook", SITE_CONFIG.socialLinks.facebook],
    ["Instagram", SITE_CONFIG.socialLinks.instagram],
    ["TikTok", SITE_CONFIG.socialLinks.tiktok],
  ];

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Image src={SITE_CONFIG.logoPath} alt={SITE_CONFIG.name} width={44} height={44} className="h-11 w-11 rounded-md object-contain" />
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
            <Link href="/book-eye-checkup" className="transition hover:text-white">Book eye checkup</Link>
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
            <p>{SITE_CONFIG.address}</p>
            <a href={`tel:${SITE_CONFIG.phone}`} className="transition hover:text-white">{SITE_CONFIG.phoneDisplay}</a>
            <a href={`https://wa.me/977${SITE_CONFIG.whatsapp}`} className="transition hover:text-white">WhatsApp: {SITE_CONFIG.whatsapp}</a>
            <a href={`mailto:${SITE_CONFIG.email}`} className="transition hover:text-white">{SITE_CONFIG.email}</a>
            <p className="text-xs text-slate-400">{SITE_CONFIG.emailNote}</p>
            <p>{SITE_CONFIG.openingHours}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-teal-200">
            {socialLinks.map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="transition hover:text-white">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
      </div>
    </footer>
  );
}
