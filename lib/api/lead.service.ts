import client from './client';

export interface LeadPayload {
  name: string;
  mobile: string;
  email: string;
  source: 'contact' | 'brochure' | 'unlock_content';
  projectId?: string;
  message?: string;
  unlockedContent?: string;
}

export interface LeadQueryParams {
  source?: string;
  projectId?: string;
  search?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export const leadService = {
  create: (data: LeadPayload) =>
    client.post('/leads', data),

  getAll: (params?: LeadQueryParams) =>
    client.get('/leads', { params }),

  getToday: () =>
    client.get('/leads/today'),

  getById: (id: string) =>
    client.get(`/leads/${id}`),

  remove: (id: string) =>
    client.delete(`/leads/${id}`),

  exportCSV: (params?: LeadQueryParams) =>
    client.get('/leads/export/csv', { params, responseType: 'blob' }),
};
