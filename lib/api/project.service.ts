import client from './client';

export interface ProjectQueryParams {
  status?: 'current' | 'upcoming' | 'completed';
  featured?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}

export const projectService = {
  getAll: (params?: ProjectQueryParams) =>
    client.get('/projects', { params }),

  getFeatured: () =>
    client.get('/projects/featured'),

  getForMap: () =>
    client.get('/projects/map'),

  getBySlug: (slug: string) =>
    client.get(`/projects/slug/${slug}`),

  getById: (id: string) =>
    client.get(`/projects/${id}`),

  create: (formData: FormData) =>
    client.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, formData: FormData) =>
    client.patch(`/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  remove: (id: string) =>
    client.delete(`/projects/${id}`),

  removeImage: (id: string, imageUrl: string, field: string) =>
    client.delete(`/projects/${id}/image`, { data: { imageUrl, field } }),
};
