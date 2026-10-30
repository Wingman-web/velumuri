import type { NextConfig } from 'next';

// STATIC_EXPORT=1 next build → plain HTML/CSS/JS in out/ for shared hosting
// (e.g. Hostinger public_html). trailingSlash makes each route a folder with
// its own index.html, so Apache serves /about/ without rewrite rules.
const staticExport = process.env.STATIC_EXPORT === '1';

const nextConfig: NextConfig = {
  ...(staticExport ? { output: 'export', trailingSlash: true } : {}),
  images: { remotePatterns: [], ...(staticExport ? { unoptimized: true } : {}) },
  allowedDevOrigins: ['192.168.0.102'],
};

export default nextConfig;
