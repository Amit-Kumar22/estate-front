import client from './client';

export const dashboardService = {
  getStats: () =>
    client.get('/dashboard/stats'),
};
