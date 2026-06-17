import type { NextConfig } from 'next';

/**
 * Derive the API hostname from the env var so image domains never need
 * to be hardcoded. Defaults to localhost for local development.
 */
function getApiHostname(): string {
  const url = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';
  try {
    return new URL(url).hostname;
  } catch {
    return 'localhost';
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local / development backend
      { protocol: 'http',  hostname: 'localhost' },
      // Production API — derived from NEXT_PUBLIC_API_URL (no hardcoded CDNs)
      { protocol: 'https', hostname: getApiHostname() },
      // Allow any subdomain of the same production hostname (e.g. cdn.yourdomain.com)
      { protocol: 'https', hostname: `*.${getApiHostname()}` },
      // Placeholder portraits used by fallback family-legacy cards
      { protocol: 'https', hostname: 'randomuser.me' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'X-Frame-Options',          value: 'DENY' },
          { key: 'X-XSS-Protection',         value: '1; mode=block' },
          { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;

