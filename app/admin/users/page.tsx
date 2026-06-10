'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { Admin } from '@/types';
import { Plus, Trash2, Edit2, User, Shield, X, Loader2, UserCheck, UserX } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface UserForm {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin';
}

export default function AdminUsersPage() {
  const { admin: currentAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<UserForm>({
    name: '', email: '', password: '', role: 'admin',
  });
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await authApi.getAdmins();
      return res.data.data.admins as Admin[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => authApi.deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted');
    },
    onError: () => toast.error('Failed to delete user'),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      authApi.updateAdmin(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const admins = data ?? [];

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error('All fields are required');
      return;
    }
    setSaving(true);
    try {
      await authApi.createAdmin(form);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Admin user created');
      setShowForm(false);
      setForm({ name: '', email: '', password: '', role: 'admin' });
    } catch {
      toast.error('Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Admin Users</h2>
          <p className="text-xs text-gray-500">{admins.length} registered admin(s)</p>
        </div>
        {currentAdmin?.role === 'super_admin' && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-green-600 hover:bg-green-700 text-white transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Admin
          </button>
        )}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#1f1f1f] p-5 space-y-4 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">New Admin User</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-300">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              { field: 'name',     label: 'Full Name', type: 'text',     placeholder: 'Admin name' },
              { field: 'email',    label: 'Email',     type: 'email',    placeholder: 'admin@yourcompany.com' },
              { field: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            ] as const).map(({ field, label, type, placeholder }) => (
              <div key={field}>
                <label className="block text-xs text-gray-400 mb-1.5">{label} *</label>
                <input
                  type={type}
                  value={form[field as keyof UserForm]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/30"
                />
              </div>
            ))}

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Role *</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserForm['role'] }))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/30"
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-xs rounded-lg border border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-60"
            >
              {saving && <Loader2 className="w-3 h-3 animate-spin" />}
              {saving ? 'Creating…' : 'Create Admin'}
            </button>
          </div>
        </div>
      )}

      {/* Users table */}
      <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden shadow-sm dark:shadow-none">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl skeleton" />
            ))}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#1f1f1f]">
                {['User', 'Role', 'Status', 'Last Login', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#1f1f1f]">
              {admins.map((admin) => (
                <tr key={admin._id} className="hover:bg-gray-50 dark:hover:bg-[#151515] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <User className="w-3.5 h-3.5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{admin.name}</p>
                        <p className="text-[11px] text-gray-500">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                      admin.role === 'super_admin'
                        ? 'bg-purple-500/10 text-purple-400'
                        : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      <Shield className="w-2.5 h-2.5" />
                      {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActiveMutation.mutate({ id: admin._id, isActive: !admin.isActive })}
                      disabled={admin._id === currentAdmin?._id}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-all disabled:cursor-not-allowed ${
                        admin.isActive
                          ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                          : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      }`}
                    >
                      {admin.isActive ? <UserCheck className="w-2.5 h-2.5" /> : <UserX className="w-2.5 h-2.5" />}
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {admin.lastLogin ? formatDate(admin.lastLogin) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {admin._id !== currentAdmin?._id && currentAdmin?.role === 'super_admin' && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete admin "${admin.name}"?`)) {
                            deleteMutation.mutate(admin._id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
