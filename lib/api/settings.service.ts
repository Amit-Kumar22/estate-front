import client from './client';
import type { SiteSettings } from '@/types';

export const settingsService = {
  get: () =>
    client.get('/settings'),

  update: (data: Partial<SiteSettings>) =>
    client.patch('/settings', data),

  updateWithFile: (formData: FormData, field: 'logo' | 'favicon') =>
    client.patch(`/settings?field=${field}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
