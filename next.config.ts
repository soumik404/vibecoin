import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    domains: [
      "unavatar.io",
      "pbs.twimg.com",
      "abs.twimg.com",
      "api.dicebear.com",
    ],
  },
};

export default nextConfig;
