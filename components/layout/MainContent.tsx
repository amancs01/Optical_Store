"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className={cn("flex-1", !pathname?.startsWith("/admin") && "pb-24 md:pb-0")}>
      {children}
    </main>
  );
}
