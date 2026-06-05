import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const styles = {
  primary: "bg-emerald-700 text-white shadow-sm shadow-emerald-950/10 hover:bg-emerald-800",
  secondary: "border border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50",
  ghost: "text-slate-700 hover:bg-emerald-50 hover:text-emerald-900",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        "hover:-translate-y-0.5 hover:shadow-md disabled:hover:translate-y-0 disabled:hover:shadow-none motion-reduce:hover:translate-y-0",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}

export function LinkButton({
  href,
  className,
  variant = "primary",
  children,
}: {
  href: string;
  className?: string;
  variant?: keyof typeof styles;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition",
        "hover:-translate-y-0.5 hover:shadow-md motion-reduce:hover:translate-y-0",
        styles[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
