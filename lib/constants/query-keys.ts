/**
 * React Query Key Factory
 * Centralised, typed query keys for all data domains.
 * Ensures consistent cache invalidation across the app.
 */

export const queryKeys = {
  // ─── Projects ─────────────────────────────────────────────────────────────
  projects: {
    all:      () => ['projects'] as const,
    lists:    () => [...queryKeys.projects.all(), 'list'] as const,
    list:     (params: Record<string, unknown>) => [...queryKeys.projects.lists(), params] as const,
    featured: () => [...queryKeys.projects.all(), 'featured'] as const,
    map:      () => [...queryKeys.projects.all(), 'map'] as const,
    detail:   (slug: string) => [...queryKeys.projects.all(), 'detail', slug] as const,
    byId:     (id: string)   => [...queryKeys.projects.all(), 'id', id] as const,
  },

  // ─── Leads ────────────────────────────────────────────────────────────────
  leads: {
    all:    () => ['leads'] as const,
    lists:  () => [...queryKeys.leads.all(), 'list'] as const,
    list:   (params: Record<string, unknown>) => [...queryKeys.leads.lists(), params] as const,
    today:  () => [...queryKeys.leads.all(), 'today'] as const,
    detail: (id: string) => [...queryKeys.leads.all(), 'detail', id] as const,
  },

  // ─── Gallery ──────────────────────────────────────────────────────────────
  gallery: {
    all:        () => ['gallery'] as const,
    lists:      () => [...queryKeys.gallery.all(), 'list'] as const,
    list:       (params: Record<string, unknown>) => [...queryKeys.gallery.lists(), params] as const,
    categories: () => [...queryKeys.gallery.all(), 'categories'] as const,
  },

  // ─── Awards ───────────────────────────────────────────────────────────────
  awards: {
    all:    () => ['awards'] as const,
    public: () => [...queryKeys.awards.all(), 'public'] as const,
    admin:  () => [...queryKeys.awards.all(), 'admin'] as const,
    detail: (id: string) => [...queryKeys.awards.all(), 'detail', id] as const,
  },

  // ─── Settings ─────────────────────────────────────────────────────────────
  settings: {
    all:  () => ['settings'] as const,
    site: () => [...queryKeys.settings.all(), 'site'] as const,
  },

  // ─── Dashboard ────────────────────────────────────────────────────────────
  dashboard: {
    all:   () => ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all(), 'stats'] as const,
  },

  // ─── Why Choose Us ────────────────────────────────────────────────────────
  whyChooseUs: {
    all:    () => ['whyChooseUs'] as const,
    public: () => [...queryKeys.whyChooseUs.all(), 'public'] as const,
    admin:  () => [...queryKeys.whyChooseUs.all(), 'admin'] as const,
    detail: (id: string) => [...queryKeys.whyChooseUs.all(), 'detail', id] as const,
  },

  // ─── Blogs ────────────────────────────────────────────────────────────────
  blogs: {
    all:        () => ['blogs'] as const,
    lists:      () => [...queryKeys.blogs.all(), 'list'] as const,
    list:       (params: Record<string, unknown>) => [...queryKeys.blogs.lists(), params] as const,
    public:     () => [...queryKeys.blogs.all(), 'public'] as const,
    admin:      () => [...queryKeys.blogs.all(), 'admin'] as const,
    detail:     (slug: string) => [...queryKeys.blogs.all(), 'detail', slug] as const,
    byId:       (id: string)   => [...queryKeys.blogs.all(), 'id', id] as const,
    categories: () => [...queryKeys.blogs.all(), 'categories'] as const,
    tags:       () => [...queryKeys.blogs.all(), 'tags'] as const,
  },
  // ─── Family Legacy ────────────────────────────────────────────────────────
  familyLegacy: {
    all:    () => ['familyLegacy'] as const,
    public: () => [...queryKeys.familyLegacy.all(), 'public'] as const,
    admin:  () => [...queryKeys.familyLegacy.all(), 'admin'] as const,
    detail: (id: string) => [...queryKeys.familyLegacy.all(), 'detail', id] as const,
  },

  // ─── Public Reviews ───────────────────────────────────────────────────────
  publicReviews: {
    all:    () => ['publicReviews'] as const,
    public: () => [...queryKeys.publicReviews.all(), 'public'] as const,
    admin:  () => [...queryKeys.publicReviews.all(), 'admin'] as const,
    detail: (id: string) => [...queryKeys.publicReviews.all(), 'detail', id] as const,
  },
} as const;
