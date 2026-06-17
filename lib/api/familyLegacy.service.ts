import client from './client';
import { FamilyMemberFormData } from '@/types';

export const familyLegacyService = {
  getAll: () => client.get('/family-legacy'),

  getAllAdmin: () => client.get('/family-legacy/admin/all'),

  getById: (id: string) => client.get(`/family-legacy/${id}`),

  create: (data: FamilyMemberFormData) => {
    const form = new FormData();
    form.append('name', data.name);
    form.append('designation', data.designation);
    form.append('description', data.description);
    form.append('year', data.year);
    form.append('order', String(data.order));
    if (data.image instanceof File) form.append('image', data.image);
    return client.post('/family-legacy', form);
  },

  update: (id: string, data: Partial<FamilyMemberFormData>) => {
    const form = new FormData();
    if (data.name)        form.append('name', data.name);
    if (data.designation) form.append('designation', data.designation);
    if (data.description) form.append('description', data.description);
    if (data.year)        form.append('year', data.year);
    if (data.order !== undefined) form.append('order', String(data.order));
    if (data.image instanceof File) form.append('image', data.image);
    return client.patch(`/family-legacy/${id}`, form);
  },

  remove: (id: string) => client.delete(`/family-legacy/${id}`),
};
