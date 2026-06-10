import client from './client';

export interface GalleryQueryParams {
  category?: string;
  featured?: boolean;
}

export const galleryService = {
  getAll: (params?: GalleryQueryParams) =>
    client.get('/gallery', { params }),

  getCategories: () =>
    client.get('/gallery/categories'),

  upload: (formData: FormData) =>
    client.post('/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, data: { caption?: string; category?: string; featured?: boolean; order?: number }) =>
    client.patch(`/gallery/${id}`, data),

  remove: (id: string) =>
    client.delete(`/gallery/${id}`),

  reorder: (items: Array<{ id: string; order: number }>) =>
    client.patch('/gallery/reorder', { items }),
};
