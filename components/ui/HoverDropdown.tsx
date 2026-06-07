"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type HoverDropdownItem = {
  href: string;
  label: string;
  badge?: string;
};

export function HoverDropdown({
  label,
  items,
  children,
  className,
  triggerClassName,
  contentClassName,
  itemClassName,
  align = "start",
  desktopOnly = false,
}: {
  label: string;
  items: HoverDropdownItem[];
  children?: ReactNode;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  align?: "start" | "center";
  desktopOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent | TouchEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("touchstart", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("touchstart", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn("relative z-[9999]", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children ? (
        children
      ) : (
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((value) => !value)}
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-slate-700 outline-none hover:bg-emerald-50 hover:text-emerald-900 focus-visible:ring-2 focus-visible:ring-emerald-200",
            triggerClassName,
          )}
        >
          {label}
          <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
        </button>
      )}

      <div
        className={cn(
          "absolute top-full z-[9999] pt-2",
          align === "center" ? "left-1/2 -translate-x-1/2" : "left-0",
          desktopOnly && "hidden md:block",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div
          role="menu"
          aria-label={label}
          className={cn(
            "max-h-80 w-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-950/15",
            contentClassName,
          )}
        >
          {items.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={cn(
                "flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 outline-none hover:bg-emerald-50 hover:text-emerald-900 focus-visible:bg-emerald-50 focus-visible:text-emerald-900",
                index === items.length - 1 && "mt-1 border-t border-slate-100 pt-3 font-black text-emerald-800",
                itemClassName,
              )}
            >
              {item.badge ? (
                <span className="grid h-7 w-7 flex-none place-items-center rounded-md bg-emerald-50 text-xs font-black text-emerald-700">
                  {item.badge}
                </span>
              ) : null}
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {index === items.length - 1 ? <span aria-hidden="true">-&gt;</span> : null}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
