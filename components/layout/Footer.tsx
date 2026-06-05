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
            <h2 className="text-xl font-black">{SITE_CONFIG.name}</h2>
          </div>
          <p className="mt-3 text-sm text-slate-300">{SITE_CONFIG.description}</p>
          <p className="mt-3 text-sm font-semibold text-teal-200">{SITE_CONFIG.deliveryNote}</p>
        </div>
        <div>
          <h3 className="font-semibold">Store</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-300">
            <Link href="/products">Products</Link>
            <Link href="/book-eye-checkup">Book eye checkup</Link>
            <Link href="/track-order">Track order</Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Policies</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-300">
            <Link href="/shipping-policy">Shipping policy</Link>
            <Link href="/return-policy">Return policy</Link>
            <Link href="/privacy-policy">Privacy policy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Contact</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-300">
            <p>{SITE_CONFIG.address}</p>
            <a href={`tel:${SITE_CONFIG.phone}`}>{SITE_CONFIG.phoneDisplay}</a>
            <a href={`https://wa.me/977${SITE_CONFIG.whatsapp}`}>WhatsApp: {SITE_CONFIG.whatsapp}</a>
            <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
            <p>{SITE_CONFIG.openingHours}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-teal-200">
            {socialLinks.map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer">
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
