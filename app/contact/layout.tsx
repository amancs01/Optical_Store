import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Titan Optical",
  description:
    "Contact Titan Optical at Kichapokhari, New Road, opposite NMB Bank for eyewear, orders, and eye checkup booking support.",
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
