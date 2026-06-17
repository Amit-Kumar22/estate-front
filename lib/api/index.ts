/**
 * API Services – Barrel Export
 * Import all API services from this single entry point.
 *
 * Usage:
 *   import { projectService, leadService } from '@/lib/api';
 */

export { authService }      from './auth.service';
export { projectService }   from './project.service';
export { leadService }      from './lead.service';
export { galleryService }   from './gallery.service';
export { awardService }     from './award.service';
export { dashboardService } from './dashboard.service';
export { settingsService }  from './settings.service';
export { whyChooseUsService } from './whyChooseUs.service';
export { blogService }      from './blog.service';
export { familyLegacyService } from './familyLegacy.service';
export { default as apiClient } from './client';
