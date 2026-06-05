import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/components/cart/CartProvider";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { MainContent } from "@/components/layout/MainContent";
import { Navbar } from "@/components/layout/Navbar";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { SITE_CONFIG } from "@/lib/constants";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_CONFIG.name} | Premium Optical Store in Kathmandu`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: `${SITE_CONFIG.name} | Premium Optical Store in Kathmandu`,
    description: SITE_CONFIG.description,
    url: absoluteUrl("/"),
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_NP",
    images: [
      {
        url: absoluteUrl(SITE_CONFIG.logoPath),
        width: 512,
        height: 512,
        alt: SITE_CONFIG.name,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#fffaf2] text-slate-950">
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <MainContent>{children}</MainContent>
            <Footer />
            <WhatsAppButton />
            <BottomNav />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
