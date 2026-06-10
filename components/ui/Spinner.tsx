export function Spinner({ className = "", page, size }: { className?: string; page?: boolean; size?: "sm" | "md" | "lg" }) {
  const wh = size === "lg" ? "h-10 w-10" : size === "sm" ? "h-4 w-4" : "h-6 w-6";
  return (
    <div
      className={`flex items-center justify-center ${page ? "min-h-[50vh]" : ""} ${className}`}
    >
      <div className={`${wh} animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-700`} />
    </div>
  );
}
