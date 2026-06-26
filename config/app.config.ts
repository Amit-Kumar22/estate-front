/**
 * Centralized Application Configuration
 *
 * Single source of truth for all app-level settings.
 * Components must NEVER import process.env directly — always use this file.
 * The .env.local file is only used as a build-time injection layer;
 * all application code references appConfig.
 *
 * Business-specific values (name, phone, etc.) come from the Settings API
 * at runtime. The values below are FALLBACK defaults only.
 */

const appConfig = {
  // ─── API ───────────────────────────────────────────────────────────────────
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1',
    /** Base URL without /api/v1, used for resolving file/media URLs */
    storageBase: (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1').replace(/\/api\/v1$/, ''),
    timeout: 30_000,
    version: 'v1',
  },

  // ─── Site (all values read from env; fallback used if env not set) ─────────
  site: {
    url:                process.env.NEXT_PUBLIC_SITE_URL   ?? 'http://localhost:3000',
    name:               process.env.NEXT_PUBLIC_SITE_NAME  ?? 'Real Estate',
    tagline:            process.env.NEXT_PUBLIC_SITE_TAGLINE  ?? 'Premium Properties',
    defaultTitle:       process.env.NEXT_PUBLIC_SITE_TITLE    ?? 'Premium Real Estate',
    defaultDescription: process.env.NEXT_PUBLIC_SITE_DESC     ?? 'Explore premium residential projects.',
    locale:   'en_IN',
    currency: 'INR',
    /** Contact details — editable via Admin → Settings in the database */
    phone:   process.env.NEXT_PUBLIC_SITE_PHONE   ?? '',
    email:   process.env.NEXT_PUBLIC_SITE_EMAIL   ?? '',
    address: process.env.NEXT_PUBLIC_SITE_ADDRESS ?? '',
  },

  // ─── WhatsApp ──────────────────────────────────────────────────────────────
  whatsapp: {
    number:         process.env.NEXT_PUBLIC_WHATSAPP_NUMBER  ?? '',
    defaultMessage: process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ?? 'Hello, I am interested in your projects.',
    apiUrl: 'https://wa.me',
  },

  // ─── Map (Leaflet + OpenStreetMap) ─────────────────────────────────────────
  map: {
    defaultCenter: { lat: 20.5937, lng: 78.9629 } as const,
    defaultZoom: 5,
    projectZoom: 14,
    tiles: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    },
    marker: {
      iconUrl:        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl:  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl:      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize:    [25, 41] as [number, number],
      iconAnchor:  [12, 41] as [number, number],
      popupAnchor: [1, -34] as [number, number],
      shadowSize:  [41, 41] as [number, number],
    },
  },

  // ─── Auth ──────────────────────────────────────────────────────────────────
  auth: {
    /** Non-sensitive display data (name, email, role) — localStorage is fine */
    userKey:       'admin_user',
    /** Theme preference — UI only, localStorage is fine */
    themeKey:      'theme',
    loginPath:     '/admin/login',
    dashboardPath: '/admin',
  },

  // ─── Pagination ────────────────────────────────────────────────────────────
  pagination: {
    defaultPage:  1,
    defaultLimit: 12,
    adminLimit:   20,
  },

  // ─── Upload ────────────────────────────────────────────────────────────────
  upload: {
    maxImageSizeMB:    10,
    maxImageSizeBytes: 10 * 1024 * 1024,
    acceptedImages:    'image/jpeg,image/jpg,image/png,image/webp',
    acceptedDocs:      'application/pdf',
  },

  // ─── Hero Fallback ────────────────────────────────────────────────────────
  hero: {
    /**
     * Served from Next.js public folder — same origin, zero CORS issues.
     * Replace /videos/luxury-home1.mp4 with your own real estate footage once live.
     * Admin can also override this via Admin → Settings → Hero Video URL.
     */
    fallbackVideoUrl: '/videos/luxury-home4.mp4',
  },

  // ─── Social (set via Admin → Settings; defaults empty) ─────────────────────
  social: {
    facebook:  '',
    instagram: '',
    twitter:   '',
    linkedin:  '',
    youtube:   '',
  },
} as const;

export type AppConfig = typeof appConfig;
export default appConfig;