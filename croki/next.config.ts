import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Transpile partykit for client-side usage
  transpilePackages: ["partysocket"],
  // Use empty turbopack config to silence warning (PWA uses webpack)
  turbopack: {},
};

export default withPWA(nextConfig);
