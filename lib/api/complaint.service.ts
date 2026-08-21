import client from './client';

export interface ComplaintPayload {
  name: string;
  email: string;
  mobile?: string;
  subject: string;
  message: string;
  complaintToken: string;
}

export interface ComplaintQueryParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export const complaintService = {
  sendOTP: (email: string) =>
    client.post('/complaints/send-otp', { email }),

  verifyOTP: (email: string, otp: string) =>
    client.post('/complaints/verify-otp', { email, otp }),

  create: (data: ComplaintPayload) =>
    client.post('/complaints', data),

  // Admin
  getAll: (params?: ComplaintQueryParams) =>
    client.get('/complaints', { params }),

  getById: (id: string) =>
    client.get(`/complaints/${id}`),

  updateStatus: (id: string, data: { status?: 'pending' | 'in_progress' | 'resolved'; adminNote?: string }) =>
    client.patch(`/complaints/${id}/status`, data),

  remove: (id: string) =>
    client.delete(`/complaints/${id}`),
};
