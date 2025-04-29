import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {},
  serverExternalPackages: ["pdf-parse"],
  images: {
    remotePatterns: [
      {
        hostname: "cdn.weatherapi.com", // For weather icons
      },
    ],
  },
};

export default withNextIntl(nextConfig);
