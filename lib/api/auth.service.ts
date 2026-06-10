import client from './client';

export const authService = {
  login: (email: string, password: string) =>
    client.post('/auth/login', { email, password }),

  logout: () =>
    client.post('/auth/logout'),

  getMe: () =>
    client.get('/auth/me'),

  updatePassword: (currentPassword: string, newPassword: string) =>
    client.patch('/auth/update-password', { currentPassword, newPassword }),

  // Admin management (super_admin only)
  getAdmins: () =>
    client.get('/auth/admins'),

  createAdmin: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => client.post('/auth/admins', data),

  updateAdmin: (
    id: string,
    data: Partial<{ name: string; email: string; isActive: boolean }>
  ) => client.patch(`/auth/admins/${id}`, data),

  deleteAdmin: (id: string) =>
    client.delete(`/auth/admins/${id}`),
};
