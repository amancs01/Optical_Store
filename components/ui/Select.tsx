"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectItem = { label: string; value: string };

type SelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  items: SelectItem[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
};

export function Select({ value, onValueChange, items, placeholder, className, disabled, ariaLabel }: SelectProps) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectPrimitive.Trigger
        aria-label={ariaLabel}
        className={cn(
          "inline-flex h-11 items-center justify-between gap-2 whitespace-nowrap rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm transition hover:border-slate-300 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50",
          !value && "text-slate-400",
          className,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          className="z-50 max-h-60 w-[var(--radix-select-trigger-width)] overflow-y-auto rounded-md border border-slate-200 bg-white p-1 shadow-lg"
        >
          <SelectPrimitive.Viewport>
            {items.map((item) => (
              <SelectPrimitive.Item
                key={item.value}
                value={item.value}
                className={cn(
                  "flex cursor-pointer items-center rounded-md px-3 py-2 text-sm text-slate-700 outline-none transition hover:bg-emerald-50 hover:text-emerald-900",
                  "data-[state=checked]:bg-emerald-50 data-[state=checked]:text-emerald-900 data-[state=checked]:font-semibold",
                  "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                )}
              >
                <SelectPrimitive.ItemText>{item.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
