/**
 * lib/api.ts — Backward-compatibility shim
 *
 * Re-exports the professional service layer under the legacy `*Api` names
 * so existing components continue to work without changes.
 *
 * New code should import directly from '@/lib/api' services:
 *   import { projectService, leadService } from '@/lib/api/index';
 */

import {
  authService,
  projectService,
  leadService,
  galleryService,
  awardService,
  dashboardService,
  settingsService,
  whyChooseUsService,
  blogService,
  familyLegacyService,
  reviewService,
  publicReviewService,
  complaintService,
} from './api/index';

// Legacy aliases — method names bridged where they changed
export const authApi = authService;

export const projectApi = {
  ...projectService,
  /** @deprecated use projectService.remove() */
  delete: projectService.remove,
  /** @deprecated use projectService.removeImage() */
  deleteImage: projectService.removeImage,
};

export const leadApi = {
  ...leadService,
  /** @deprecated use leadService.remove() */
  delete: leadService.remove,
};

export const galleryApi = {
  ...galleryService,
  /** @deprecated use galleryService.remove() */
  delete: galleryService.remove,
};

export const awardApi = {
  ...awardService,
  /** @deprecated use awardService.remove() */
  delete: awardService.remove,
};

export const whyChooseUsApi = {
  ...whyChooseUsService,
  /** @deprecated use whyChooseUsService.remove() */
  delete: whyChooseUsService.remove,
};

export const blogApi = {
  ...blogService,
  /** @deprecated use blogService.remove() */
  delete: blogService.remove,
};

export const dashboardApi = dashboardService;
export const settingsApi = settingsService;
export const familyLegacyApi = familyLegacyService;
export const reviewApi = reviewService;
export const publicReviewApi = publicReviewService;

export const complaintApi = {
  ...complaintService,
  /** @deprecated use complaintService.remove() */
  delete: complaintService.remove,
};

// Also export new canonical names
export {
  authService,
  whyChooseUsService,
  projectService,
  leadService,
  galleryService,
  awardService,
  dashboardService,
  settingsService,
  blogService,
  familyLegacyService,
  reviewService,
  publicReviewService,
  complaintService,
};

