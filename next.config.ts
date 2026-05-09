import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    // Use webpack instead of turbopack to avoid workspace root detection issues
  },
};

export default nextConfig;
