import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  serverExternalPackages: ['pdf-parse', '@napi-rs/canvas'],
};

export default nextConfig;

