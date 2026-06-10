import client from './client';

export const awardService = {
  getAll: () =>
    client.get('/awards'),

  getAllAdmin: () =>
    client.get('/awards/admin/all'),

  getById: (id: string) =>
    client.get(`/awards/${id}`),

  create: (formData: FormData) =>
    client.post('/awards', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, formData: FormData) =>
    client.patch(`/awards/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  remove: (id: string) =>
    client.delete(`/awards/${id}`),
};
