import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Allow local network devices (phones, tablets) to access the dev server
  allowedDevOrigins: ['10.140.254.137', '192.168.*', '10.*'],
};

export default nextConfig;
