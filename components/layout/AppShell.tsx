"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { MainContent } from "@/components/layout/MainContent";
import { Navbar } from "@/components/layout/Navbar";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname?.startsWith("/admin/");

  if (isAdminRoute) {
    return <div className="min-h-screen bg-slate-100 text-slate-950">{children}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <MainContent>{children}</MainContent>
      <Footer />
      <WhatsAppButton />
      <BottomNav />
    </div>
  );
}
