import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['api.hobyhub.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.hobyhub.com',
        pathname: '/uploaded/**',
      },
    ],
    unoptimized: true, // Disable Vercel's image optimization
  },
};

export default nextConfig;
