import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Shop Eyewear",
  description:
    "Browse Titan Optical eyeglasses, sunglasses, contact lenses, and frame options with delivery inside Kathmandu Valley.",
  path: "/products",
});

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
