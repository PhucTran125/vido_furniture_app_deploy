import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: false, // Enable Next.js image optimization
  },
  trailingSlash: true,
};

export default nextConfig;
