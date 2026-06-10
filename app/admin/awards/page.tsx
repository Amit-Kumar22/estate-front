'use client';

import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { awardApi } from '@/lib/api';
import { Award } from '@/types';
import { Plus, Trash2, Edit2, Trophy, X, Loader2 } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';
import { queryKeys } from '@/lib/constants/query-keys';
import toast from 'react-hot-toast';

interface AwardFormData {
  title: string;
  organization: string;
  year: string;
  description: string;
}

export default function AdminAwardsPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [editAward, setEditAward] = useState<Award | null>(null);
  const [form, setForm] = useState<AwardFormData>({
    title: '', organization: '', year: new Date().getFullYear().toString(), description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.awards.admin(),
    queryFn: async () => {
      const res = await awardApi.getAllAdmin();
      return res.data.data.awards as Award[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => awardApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.awards.all() });
      toast.success('Award deleted');
    },
    onError: () => toast.error('Failed to delete award'),
  });

  const awards = data ?? [];

  const openCreate = () => {
    setEditAward(null);
    setForm({ title: '', organization: '', year: new Date().getFullYear().toString(), description: '' });
    setImageFile(null);
    setShowForm(true);
  };

  const openEdit = (award: Award) => {
    setEditAward(award);
    setForm({
      title: award.title,
      organization: award.organization ?? '',
      year: String(award.year),
      description: award.description ?? '',
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.organization || !form.year) {
      toast.error('Title, organization and year are required');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('organization', form.organization);
      fd.append('year', form.year);
      fd.append('description', form.description);
      if (imageFile) fd.append('image', imageFile);

      if (editAward) {
        await awardApi.update(editAward._id, fd);
        toast.success('Award updated');
      } else {
        await awardApi.create(fd);
        toast.success('Award created');
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.awards.all() });
      setShowForm(false);
    } catch {
      toast.error('Failed to save award');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Awards &amp; Accolades</h2>
          <p className="text-xs text-gray-500">{awards.length} total awards</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-green-600 hover:bg-green-700 text-white transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Award
        </button>
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#1f1f1f] p-5 space-y-4 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              {editAward ? 'Edit Award' : 'New Award'}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-300">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(['title', 'organization', 'year'] as const).map((field) => (
              <div key={field}>
                <label className="block text-xs text-gray-400 mb-1.5 capitalize">{field} *</label>
                <input
                  value={form[field]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/30"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                />
              </div>
            ))}

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-[#1f1f1f] file:text-gray-300 hover:file:bg-[#2a2a2a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/30 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-xs rounded-lg border border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-60"
            >
              {saving && <Loader2 className="w-3 h-3 animate-spin" />}
              {saving ? 'Saving…' : 'Save Award'}
            </button>
          </div>
        </div>
      )}

      {/* Awards grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl h-48 skeleton" />
          ))}
        </div>
      ) : awards.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {awards.map((award) => (
            <div
              key={award._id}
              className="group bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-[#1f1f1f] hover:border-gray-300 dark:hover:border-[#2f2f2f] overflow-hidden transition-all shadow-sm dark:shadow-none"
            >
              <div
                className="h-28 bg-cover bg-center bg-gray-200 dark:bg-[#1a1a1a]"
                style={{ backgroundImage: award.image ? `url(${getImageUrl(award.image)})` : undefined }}
              />
              <div className="p-3">
                <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded">
                  {award.year}
                </span>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-1.5 mb-0.5 line-clamp-2 leading-snug">
                  {award.title}
                </h3>
                <p className="text-[11px] text-gray-500 line-clamp-1">{award.organization}</p>
              </div>
              <div className="px-3 pb-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(award)}
                  className="flex-1 py-1.5 text-[11px] rounded-lg border border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center gap-1 hover:border-gray-300 dark:hover:border-[#2f2f2f] transition-all"
                >
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this award?')) deleteMutation.mutate(award._id);
                  }}
                  className="flex-1 py-1.5 text-[11px] rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-1 transition-all"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-20 text-gray-500">
          <Trophy className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm">No awards yet. Add your first award.</p>
        </div>
      )}
    </div>
  );
}
