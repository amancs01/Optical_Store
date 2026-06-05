import type { NextConfig } from "next";
import path from "node:path";

process.env.NEXT_FONT_GOOGLE_MOCKED_RESPONSES ??= path.join(process.cwd(), "next-font-google-mocks.cjs");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "xejrfzdlvtxosgggcjwm.supabase.co",
      },
    ],
  },
};

export default nextConfig;
