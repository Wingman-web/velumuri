import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: { remotePatterns: [] },
  allowedDevOrigins: ['192.168.0.102'],
};

export default nextConfig;
