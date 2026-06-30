'use client';

import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { publicReviewService } from '@/lib/api';
import { PublicReview } from '@/types';
import {
  Plus, Trash2, Edit2, X, Loader2, Clapperboard,
  ChevronUp, ChevronDown, Eye, EyeOff, PlayCircle,
} from 'lucide-react';
import { getImageUrl } from '@/lib/utils';
import { queryKeys } from '@/lib/constants/query-keys';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface FormData {
  name: string;
  quote: string;
  videoUrl: string;
  order: number;
  isActive: boolean;
}

const emptyForm: FormData = { name: '', quote: '', videoUrl: '', order: 0, isActive: true };

export default function AdminPublicReviewsPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<PublicReview | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.publicReviews.admin(),
    queryFn: async () => {
      const res = await publicReviewService.getAllAdmin();
      return res.data.data.publicReviews as PublicReview[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => publicReviewService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.publicReviews.all() });
      toast.success('Public review deleted');
    },
    onError: () => toast.error('Failed to delete public review'),
  });

  const items = data ?? [];

  const openCreate = () => {
    setEditItem(null);
    setForm({ ...emptyForm, order: items.length });
    setThumbnailFile(null);
    setThumbnailPreview('');
    setShowForm(true);
  };

  const openEdit = (item: PublicReview) => {
    setEditItem(item);
    setForm({
      name: item.name,
      quote: item.quote,
      videoUrl: item.videoUrl,
      order: item.order,
      isActive: item.isActive,
    });
    setThumbnailFile(null);
    setThumbnailPreview(getImageUrl(item.thumbnail));
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Client name is required');
    if (!form.quote.trim()) return toast.error('Quote is required');
    if (!form.videoUrl.trim()) return toast.error('Video URL is required');
    if (!editItem && !thumbnailFile) return toast.error('Please upload a thumbnail image');

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name.trim());
      fd.append('quote', form.quote.trim());
      fd.append('videoUrl', form.videoUrl.trim());
      fd.append('order', String(form.order));
      fd.append('isActive', String(form.isActive));
      if (thumbnailFile) fd.append('thumbnail', thumbnailFile);

      if (editItem) {
        await publicReviewService.update(editItem._id, fd);
        toast.success('Public review updated');
      } else {
        await publicReviewService.create(fd);
        toast.success('Public review created');
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.publicReviews.all() });
      setShowForm(false);
      setThumbnailFile(null);
      setThumbnailPreview('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save public review');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item: PublicReview) => {
    try {
      const fd = new FormData();
      fd.append('isActive', String(!item.isActive));
      await publicReviewService.update(item._id, fd);
      queryClient.invalidateQueries({ queryKey: queryKeys.publicReviews.all() });
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleOrderChange = async (item: PublicReview, direction: 'up' | 'down') => {
    const sorted = [...items].sort((a, b) => a.order - b.order);
    const currentIndex = sorted.findIndex((i) => i._id === item._id);
    if ((direction === 'up' && currentIndex === 0) || (direction === 'down' && currentIndex === sorted.length - 1)) return;

    const swapItem = sorted[direction === 'up' ? currentIndex - 1 : currentIndex + 1];
    try {
      const fd1 = new FormData();
      fd1.append('order', String(swapItem.order));
      await publicReviewService.update(item._id, fd1);

      const fd2 = new FormData();
      fd2.append('order', String(item.order));
      await publicReviewService.update(swapItem._id, fd2);

      queryClient.invalidateQueries({ queryKey: queryKeys.publicReviews.all() });
      toast.success('Order updated');
    } catch {
      toast.error('Failed to update order');
    }
  };

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Public Review</h2>
          <p className="text-xs text-gray-500">
            {items.length} total video testimonials • {items.filter((i) => i.isActive).length} active
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-green-600 hover:bg-green-700 text-white transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Public Review
        </button>
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#1f1f1f] p-5 space-y-4 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              {editItem ? 'Edit Public Review' : 'New Public Review'}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-300">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Client Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/30"
                placeholder="e.g., Priyanka and Tarun"
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Video URL *</label>
              <input
                value={form.videoUrl}
                onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/30"
                placeholder="YouTube / Vimeo / .mp4 link"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1.5">Quote *</label>
              <textarea
                value={form.quote}
                onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/30 resize-none"
                placeholder='"We wanted our new home to look contemporary..."'
                maxLength={500}
              />
              <p className="text-[10px] text-gray-500 mt-1">{form.quote.length}/500 characters</p>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">
                Thumbnail * {editItem && !thumbnailFile && '(current image will be kept)'}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-[#1f1f1f] file:text-gray-300 hover:file:bg-[#2a2a2a]"
              />
              {thumbnailPreview && (
                <div className="mt-2 relative w-28 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-[#1f1f1f]">
                  <Image src={thumbnailPreview} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Display Order</label>
                <input
                  type="number"
                  min="0"
                  value={form.order}
                  onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/30"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="isActive" className="text-xs text-gray-400">
                  Active (visible on home page)
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs rounded-lg border border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-60"
            >
              {saving && <Loader2 className="w-3 h-3 animate-spin" />}
              {saving ? 'Saving…' : editItem ? 'Update Review' : 'Create Review'}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl h-56 skeleton" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items
            .sort((a, b) => a.order - b.order)
            .map((item, index) => (
              <div
                key={item._id}
                className={`group bg-white dark:bg-[#111] rounded-xl border overflow-hidden transition-all shadow-sm dark:shadow-none ${
                  item.isActive
                    ? 'border-gray-200 dark:border-[#1f1f1f] hover:border-gray-300 dark:hover:border-[#2f2f2f]'
                    : 'border-gray-300 dark:border-gray-700 opacity-50'
                }`}
              >
                <div className="relative h-32 bg-gray-200 dark:bg-[#1a1a1a]">
                  <Image src={getImageUrl(item.thumbnail)} alt={item.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <PlayCircle className="w-9 h-9 text-white/90" />
                  </div>
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="text-[10px] text-gray-700 bg-white/90 px-1.5 py-0.5 rounded">
                      #{item.order}
                    </span>
                    {item.isActive ? (
                      <span className="text-[10px] text-green-700 bg-green-50/90 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Eye className="w-2.5 h-2.5" /> Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-600 bg-gray-100/90 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <EyeOff className="w-2.5 h-2.5" /> Inactive
                      </span>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOrderChange(item, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded bg-white/90 hover:bg-white disabled:opacity-30"
                      title="Move up"
                    >
                      <ChevronUp className="w-3 h-3 text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleOrderChange(item, 'down')}
                      disabled={index === items.length - 1}
                      className="p-1 rounded bg-white/90 hover:bg-white disabled:opacity-30"
                      title="Move down"
                    >
                      <ChevronDown className="w-3 h-3 text-gray-700" />
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{item.name}</h3>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">&ldquo;{item.quote}&rdquo;</p>
                </div>

                <div className="px-3 pb-3 flex gap-2">
                  <button
                    onClick={() => toggleActive(item)}
                    className="flex-1 py-1.5 text-[11px] rounded-lg border border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center gap-1 hover:border-gray-300 dark:hover:border-[#2f2f2f] transition-all"
                  >
                    {item.isActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => openEdit(item)}
                    className="flex-1 py-1.5 text-[11px] rounded-lg border border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center gap-1 hover:border-gray-300 dark:hover:border-[#2f2f2f] transition-all"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this public review?')) deleteMutation.mutate(item._id);
                    }}
                    className="flex-1 py-1.5 text-[11px] rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-1 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-20 text-gray-500">
          <Clapperboard className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm">No public reviews yet. Add your first video testimonial.</p>
        </div>
      )}
    </div>
  );
}
