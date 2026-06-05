"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { SITE_CONFIG } from "@/lib/constants";

export function WhatsAppButton() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <a
      href={`https://wa.me/977${SITE_CONFIG.whatsapp}`}
      className="fixed bottom-4 right-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 sm:bottom-6 sm:right-6"
      aria-label="Chat with Titan Opticals on WhatsApp"
      target="_blank"
      rel="noreferrer"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
    </a>
  );
}
