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

export const dashboardApi = dashboardService;
export const settingsApi = settingsService;

// Also export new canonical names
export {
  authService,
  projectService,
  leadService,
  galleryService,
  awardService,
  dashboardService,
  settingsService,
};

