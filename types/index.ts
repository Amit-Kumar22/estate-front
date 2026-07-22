// ─── Project Types ───────────────────────────────────────────────────────────
export interface Configuration {
  type: string;
  area: string;
  price: string;
}

export interface GalleryImage {
  url: string;
  caption?: string;
  category?: string;
}

export interface Project {
  _id: string;
  name: string;
  slug: string;
  status: 'current' | 'upcoming' | 'completed';
  location: string;
  latitude: number;
  longitude: number;
  price: string;
  shortDescription: string;
  description: string;
  highlights: string[];
  amenities: string[];
  configuration: Configuration[];
  possessionDate: string;
  heroImages: string[];
  galleryImages: GalleryImage[];
  floorPlans: string[];
  interiorPhotos: string[];
  virtualTourUrl?: string;
  brochureUrl?: string;
  featured: boolean;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Lead Types ───────────────────────────────────────────────────────────────
export interface Lead {
  _id: string;
  name: string;
  mobile: string;
  email: string;
  source: 'contact' | 'brochure' | 'unlock_content' | 'project_detail';
  project?: { _id: string; name: string; slug: string } | null;
  projectName?: string;
  message?: string;
  unlockedContent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFormData {
  name: string;
  mobile: string;
  email: string;
  message?: string;
  source: 'contact' | 'brochure' | 'unlock_content' | 'project_detail';
  projectId?: string;
  unlockedContent?: string;
}

// ─── Gallery Types ─────────────────────────────────────────────────────────────
export interface GalleryItem {
  _id: string;
  url: string;
  caption?: string;
  category: string;
  featured: boolean;
  order: number;
  createdAt: string;
}

// ─── Award Types ──────────────────────────────────────────────────────────────
export interface Award {
  _id: string;
  title: string;
  year: string;
  description: string;
  image: string;
  organization?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

// ─── Public Review Types ──────────────────────────────────────────────────────
export interface PublicReview {
  _id: string;
  name: string;
  quote: string;
  thumbnail: string;
  videoUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

// ─── Why Choose Us Types ──────────────────────────────────────────────────────
export interface WhyChooseUs {
  _id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Blog Types ────────────────────────────────────────────────────────────────
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  featuredImage: string;
  shortDescription: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  publishDate: string;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  status: 'published' | 'draft';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFormData {
  title: string;
  slug?: string;
  featuredImage?: File | string;
  shortDescription: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  publishDate?: string;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  status: 'published' | 'draft';
}

// ─── Settings Types ───────────────────────────────────────────────────────────
export interface SiteSettings {
  companyName: string;
  companyTagline: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  whatsappNumber: string;
  whatsappMessage: string;
  heroVideoUrls: string[];
  heroBackgroundImages: string[];
  heroHeadline: string;
  heroSubheadline: string;
  heroStat1Value?: string;
  heroStat1Label?: string;
  heroStat2Value?: string;
  heroStat2Label?: string;
  heroStat3Value?: string;
  heroStat3Label?: string;
  metaTitle: string;
  metaDescription: string;
  logoUrl: string;
  faviconUrl: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
}

// ─── Admin Types ──────────────────────────────────────────────────────────────
export interface Admin {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
  isActive: boolean;
  lastLogin?: string;
}

// ─── Dashboard Types ──────────────────────────────────────────────────────────
export interface DashboardStats {
  totalProjects: number;
  totalLeads: number;
  todayLeads: number;
  brochureDownloads: number;
  contactRequests: number;
  unlockLeads: number;
}

export interface MonthlyLead {
  month: string;
  count: number;
}

export interface ProjectLead {
  project: string;
  count: number;
}

export interface DashboardData {
  stats: DashboardStats;
  monthlyLeads: MonthlyLead[];
  projectWiseLeads: ProjectLead[];
  recentLeads: Lead[];
}

// ─── Family Legacy Types ──────────────────────────────────────────────────────
export interface FamilyMember {
  _id: string;
  image: string;
  name: string;
  designation: string;
  description: string;
  year: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMemberFormData {
  image?: File | string;
  name: string;
  designation: string;
  description: string;
  year: string;
  order: number;
}

// ─── API Response Types ───────────────────────────────────────────────────────
export interface ApiResponse<T> {
  status: 'success' | 'error' | 'fail';
  message?: string;
  data?: T;
  results?: number;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}
