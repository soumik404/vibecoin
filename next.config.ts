import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
     // Add fallback for React Native async-storage to fix MetaMask SDK error
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      "@react-native-async-storage/async-storage": false,
    };
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
