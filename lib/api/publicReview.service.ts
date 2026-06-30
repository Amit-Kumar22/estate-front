import client from './client';

export const publicReviewService = {
  getAll: () =>
    client.get('/public-reviews'),

  getAllAdmin: () =>
    client.get('/public-reviews/admin/all'),

  getById: (id: string) =>
    client.get(`/public-reviews/${id}`),

  create: (formData: FormData) =>
    client.post('/public-reviews', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, formData: FormData) =>
    client.patch(`/public-reviews/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  remove: (id: string) =>
    client.delete(`/public-reviews/${id}`),
};
