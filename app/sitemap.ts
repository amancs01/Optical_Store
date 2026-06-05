import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

const publicRoutes = [
  ["/", 1],
  ["/products", 0.9],
  ["/book-eye-checkup", 0.8],
  ["/contact", 0.8],
  ["/about", 0.7],
  ["/track-order", 0.6],
  ["/shipping-policy", 0.5],
  ["/return-policy", 0.5],
  ["/privacy-policy", 0.4],
  ["/terms", 0.4],
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map(([path, priority]) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: path === "/products" ? "weekly" : "monthly",
    priority,
  }));
}
