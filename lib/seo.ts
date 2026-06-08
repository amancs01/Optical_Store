import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

function defaultSiteUrl() {
  if (process.env.NODE_ENV === "development") return "http://localhost:3000";
  return "https://titanopticals.com";
}

export function getSiteUrl() {
  const fallback = defaultSiteUrl();
  try {
    const url = new URL(SITE_CONFIG.siteUrl);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return fallback;
    return url.origin;
  } catch {
    return fallback;
  }
}

export function absoluteUrl(path = "/") {
  const baseUrl = getSiteUrl().replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      type: "website",
      locale: "en_NP",
      images: [
        {
          url: absoluteUrl(SITE_CONFIG.logoPath),
          width: 512,
          height: 512,
          alt: SITE_CONFIG.name,
        },
      ],
    },
  };
}
