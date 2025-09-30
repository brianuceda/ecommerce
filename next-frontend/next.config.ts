import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
        port: "8080",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
