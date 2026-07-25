import type { NextConfig } from 'next';

/**
 * Derive the API origin from the env var so image domains never need to be
 * hardcoded. The protocol MUST match the real backend (e.g. a VPS serving
 * plain http on an IP:port has no https) — hardcoding 'https' here caused
 * Next's image optimizer to reject every production image with
 * `400 "url" parameter is not allowed` even though the backend served the
 * file fine. Defaults to localhost for local development.
 */
function getApiOrigin(): { protocol: 'http' | 'https'; hostname: string } {
  const url = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';
  try {
    const { protocol, hostname } = new URL(url);
    return { protocol: protocol === 'https:' ? 'https' : 'http', hostname };
  } catch {
    return { protocol: 'http', hostname: 'localhost' };
  }
}

const apiOrigin = getApiOrigin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local / development backend
      { protocol: 'http',  hostname: 'localhost' },
      // Production API — protocol + host both derived from NEXT_PUBLIC_API_URL
      { protocol: apiOrigin.protocol, hostname: apiOrigin.hostname },
      // Allow any subdomain of the same production hostname (e.g. cdn.yourdomain.com)
      { protocol: apiOrigin.protocol, hostname: `*.${apiOrigin.hostname}` },
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

