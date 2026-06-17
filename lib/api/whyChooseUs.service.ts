import client from './client';

export const whyChooseUsService = {
  /**
   * Get all active Why Choose Us items (Public)
   * Used on the home page
   */
  getAll: () =>
    client.get('/why-choose-us'),

  /**
   * Get all Why Choose Us items including inactive (Admin)
   * Used in admin panel for management
   */
  getAllAdmin: () =>
    client.get('/why-choose-us/admin/all'),

  /**
   * Get single Why Choose Us item by ID
   */
  getById: (id: string) =>
    client.get(`/why-choose-us/${id}`),

  /**
   * Create new Why Choose Us item with icon/image upload
   */
  create: (formData: FormData) =>
    client.post('/why-choose-us', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  /**
   * Update existing Why Choose Us item
   * Can optionally include new icon/image
   */
  update: (id: string, formData: FormData) =>
    client.patch(`/why-choose-us/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  /**
   * Delete Why Choose Us item
   */
  remove: (id: string) =>
    client.delete(`/why-choose-us/${id}`),

  /**
   * Toggle active/inactive status
   */
  toggleStatus: (id: string) =>
    client.patch(`/why-choose-us/${id}/toggle-status`),
};
