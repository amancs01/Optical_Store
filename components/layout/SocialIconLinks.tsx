import { SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

const socialLinks = [
  ["Facebook", SITE_CONFIG.socialLinks.facebook],
  ["Instagram", SITE_CONFIG.socialLinks.instagram],
  ["TikTok", SITE_CONFIG.socialLinks.tiktok],
] as const;

export function SocialIconLinks({ className, variant = "dark" }: { className?: string; variant?: "dark" | "light" }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {socialLinks.map(([label, href]) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Titan Optical on ${label}`}
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-md border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
            variant === "dark"
              ? "border-slate-700 bg-slate-900 text-slate-200 hover:border-emerald-300 hover:bg-emerald-900/40 hover:text-white"
              : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900",
          )}
        >
          {label === "Facebook" ? <FacebookIcon className="h-4 w-4" /> : null}
          {label === "Instagram" ? <InstagramIcon className="h-4 w-4" /> : null}
          {label === "TikTok" ? <TikTokIcon className="h-4 w-4" /> : null}
        </a>
      ))}
    </div>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14 8.4V6.9c0-.7.2-1.1 1.2-1.1h1.5V3.1C16 3 15.2 3 14.3 3c-2.2 0-3.7 1.3-3.7 3.7v1.7H8.1v3h2.5V21H14v-9.6h2.5l.4-3H14Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect width="14" height="14" x="5" y="5" rx="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="16.5" cy="7.5" r="1" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M15.8 3c.4 2.3 1.7 3.8 4.2 4v3.1c-1.5.1-2.9-.4-4.1-1.2v5.9c0 3.1-2 5.2-5.1 5.2-2.9 0-5-1.8-5-4.5 0-2.9 2.4-4.8 5.6-4.5v3.1c-1.4-.2-2.3.3-2.3 1.3 0 .9.7 1.5 1.8 1.5 1.2 0 1.8-.7 1.8-2.1V3h3.1Z" />
    </svg>
  );
}
