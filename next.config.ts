import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

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
