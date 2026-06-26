import client from './client';

export interface PublicReview {
  _id: string;
  name: string;
  city?: string;
  rating: number;
  review: string;
  createdAt: string;
}

export interface AdminReview extends PublicReview {
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  emailVerified: boolean;
  updatedAt: string;
}

export interface ReviewQueryParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const reviewService = {
  sendOTP: (email: string) =>
    client.post('/reviews/send-otp', { email }),

  verifyOTP: (email: string, otp: string) =>
    client.post('/reviews/verify-otp', { email, otp }),

  create: (data: {
    name: string;
    email: string;
    city?: string;
    rating: number;
    review: string;
    reviewToken: string;
  }) => client.post('/reviews', data),

  getPublic: () =>
    client.get<{ data: { reviews: PublicReview[] } }>('/reviews/public'),

  // Admin
  getAll: (params?: ReviewQueryParams) =>
    client.get('/reviews', { params }),

  updateStatus: (id: string, status: 'approved' | 'rejected' | 'pending') =>
    client.patch(`/reviews/${id}/status`, { status }),

  remove: (id: string) =>
    client.delete(`/reviews/${id}`),
};
