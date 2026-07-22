import client from './client';

export const settingsService = {
  get: () =>
    client.get('/settings'),

  /**
   * Always multipart/form-data — hero videos/images upload as files
   * (`heroVideos`/`heroImages` fields) alongside the rest of the settings.
   * `field` is only used for the logo/favicon single-file flow.
   */
  update: (formData: FormData, field?: 'logo' | 'favicon') =>
    client.patch(field ? `/settings?field=${field}` : '/settings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
