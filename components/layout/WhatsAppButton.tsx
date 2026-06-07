"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { SITE_CONFIG } from "@/lib/constants";

export function WhatsAppButton() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  const message = encodeURIComponent("Hello Titan Optical, I need help choosing eyewear.");

  return (
    <a
      href={`https://wa.me/977${SITE_CONFIG.whatsapp}?text=${message}`}
      className="fixed bottom-[88px] right-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 md:bottom-6 md:right-6 md:h-12 md:w-12"
      aria-label="Chat with Titan Optical on WhatsApp"
      target="_blank"
      rel="noreferrer"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
    </a>
  );
}
