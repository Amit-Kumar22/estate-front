import client from './client';
import { Blog, BlogFormData } from '@/types';

export const blogService = {
  // Get all blogs (Public - only published)
  getAll: async (params?: {
    category?: string;
    tag?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const response = await client.get('/blogs', { params });
    return response.data;
  },

  // Get all blogs for admin (includes drafts)
  getAllAdmin: async (params?: {
    category?: string;
    tag?: string;
    status?: 'published' | 'draft';
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const response = await client.get('/blogs/admin/all', { params });
    return response.data;
  },

  // Get blog by slug (Public)
  getBySlug: async (slug: string) => {
    const response = await client.get(`/blogs/slug/${slug}`);
    return response.data;
  },

  // Get blog by ID (Admin)
  getById: async (id: string) => {
    const response = await client.get(`/blogs/${id}`);
    return response.data;
  },

  // Create new blog
  create: async (data: BlogFormData) => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'tags' && Array.isArray(value)) {
          formData.append(key, value.join(','));
        } else if (key === 'featuredImage' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await client.post('/blogs', formData);
    return response.data;
  },

  // Update blog
  update: async (id: string, data: Partial<BlogFormData>) => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'tags' && Array.isArray(value)) {
          formData.append(key, value.join(','));
        } else if (key === 'featuredImage' && value instanceof File) {
          formData.append(key, value);
        } else if (typeof value !== 'object') {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await client.patch(`/blogs/${id}`, formData);
    return response.data;
  },

  // Delete blog
  remove: async (id: string) => {
    const response = await client.delete(`/blogs/${id}`);
    return response.data;
  },

  // Toggle blog status
  toggleStatus: async (id: string) => {
    const response = await client.patch(`/blogs/${id}/toggle-status`);
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    const response = await client.get('/blogs/categories');
    return response.data;
  },

  // Get all tags
  getTags: async () => {
    const response = await client.get('/blogs/tags');
    return response.data;
  },
};
