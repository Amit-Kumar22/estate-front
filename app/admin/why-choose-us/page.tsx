'use client';

import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { whyChooseUsService } from '@/lib/api';
import { WhyChooseUs } from '@/types';
import { Plus, Trash2, Edit2, X, Loader2, Sparkles, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { getImageUrl, getErrorMessage, PLACEHOLDER_IMAGE } from '@/lib/utils';
import { queryKeys } from '@/lib/constants/query-keys';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface FormData {
  title: string;
  description: string;
  order: number;
  isActive: boolean;
}

export default function AdminWhyChooseUsPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<WhyChooseUs | null>(null);
  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    order: 0,
    isActive: true,
  });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // Fetch all Why Choose Us items (including inactive)
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.whyChooseUs.admin(),
    queryFn: async () => {
      const res = await whyChooseUsService.getAllAdmin();
      return res.data.data.items as WhyChooseUs[];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => whyChooseUsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.whyChooseUs.all() });
      toast.success('Item deleted successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to delete item')),
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => whyChooseUsService.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.whyChooseUs.all() });
      toast.success('Status updated');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to update status')),
  });

  const items = data ?? [];

  const openCreate = () => {
    setEditItem(null);
    setForm({
      title: '',
      description: '',
      order: items.length,
      isActive: true,
    });
    setIconFile(null);
    setIconPreview('');
    setShowForm(true);
  };

  const openEdit = (item: WhyChooseUs) => {
    setEditItem(item);
    setForm({
      title: item.title,
      description: item.description,
      order: item.order,
      isActive: item.isActive,
    });
    setIconFile(null);
    setIconPreview(getImageUrl(item.icon));
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!editItem && !iconFile) {
      toast.error('Please upload an icon/image');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('order', String(form.order));
      fd.append('isActive', String(form.isActive));
      if (iconFile) fd.append('icon', iconFile);

      if (editItem) {
        await whyChooseUsService.update(editItem._id, fd);
        toast.success('Item updated successfully');
      } else {
        await whyChooseUsService.create(fd);
        toast.success('Item created successfully');
      }
      
      queryClient.invalidateQueries({ queryKey: queryKeys.whyChooseUs.all() });
      setShowForm(false);
      setIconFile(null);
      setIconPreview('');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to save item'));
    } finally {
      setSaving(false);
    }
  };

  const handleOrderChange = async (item: WhyChooseUs, direction: 'up' | 'down') => {
    const sortedItems = [...items].sort((a, b) => a.order - b.order);
    const currentIndex = sortedItems.findIndex((i) => i._id === item._id);
    
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sortedItems.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const swapItem = sortedItems[newIndex];

    try {
      // Swap orders
      const fd1 = new FormData();
      fd1.append('order', String(swapItem.order));
      await whyChooseUsService.update(item._id, fd1);

      const fd2 = new FormData();
      fd2.append('order', String(item.order));
      await whyChooseUsService.update(swapItem._id, fd2);

      queryClient.invalidateQueries({ queryKey: queryKeys.whyChooseUs.all() });
      toast.success('Order updated');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update order'));
    }
  };

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Why Choose Us</h2>
          <p className="text-xs text-gray-500">
            {items.length} total items • {items.filter((i) => i.isActive).length} active
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-green-600 hover:bg-green-700 text-white transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#1f1f1f] p-5 space-y-4 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              {editItem ? 'Edit Item' : 'New Item'}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-300">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1.5">Title *</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/30"
                placeholder="e.g., Expert Team"
                maxLength={100}
              />
              <p className="text-[10px] text-gray-500 mt-1">{form.title.length}/100 characters</p>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1.5">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/30 resize-none"
                placeholder="Brief description of this feature"
                maxLength={500}
              />
              <p className="text-[10px] text-gray-500 mt-1">{form.description.length}/500 characters</p>
            </div>

            {/* Icon Upload */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">
                Icon/Image * {editItem && !iconFile && '(current icon will be kept)'}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-[#1f1f1f] file:text-gray-300 hover:file:bg-[#2a2a2a]"
              />
              {iconPreview && (
                <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-[#1f1f1f]">
                  <Image
                    src={iconPreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Order & Status */}
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
              {saving ? 'Saving…' : editItem ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </div>
      )}

      {/* Items List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl h-24 skeleton" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-3">
          {items
            .sort((a, b) => a.order - b.order)
            .map((item, index) => (
              <div
                key={item._id}
                className={`group bg-white dark:bg-[#111] rounded-xl border ${
                  item.isActive
                    ? 'border-gray-200 dark:border-[#1f1f1f]'
                    : 'border-gray-300 dark:border-gray-700 opacity-50'
                } hover:border-gray-300 dark:hover:border-[#2f2f2f] transition-all shadow-sm dark:shadow-none p-4`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-[#1f1f1f] flex-shrink-0">
                    <Image
                      src={getImageUrl(item.icon)}
                      alt={item.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-[10px] text-gray-500 bg-gray-100 dark:bg-[#1a1a1a] px-2 py-0.5 rounded">
                          Order: {item.order}
                        </span>
                        {item.isActive ? (
                          <span className="text-[10px] text-green-600 bg-green-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                            <Eye className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-500 bg-gray-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                            <EyeOff className="w-3 h-3" /> Inactive
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleOrderChange(item, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleOrderChange(item, 'down')}
                      disabled={index === items.length - 1}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#1a1a1a] flex gap-2">
                  <button
                    onClick={() => toggleStatusMutation.mutate(item._id)}
                    className="flex-1 py-1.5 text-[11px] rounded-lg border border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center gap-1 hover:border-gray-300 dark:hover:border-[#2f2f2f] transition-all"
                  >
                    {item.isActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {item.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => openEdit(item)}
                    className="flex-1 py-1.5 text-[11px] rounded-lg border border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center gap-1 hover:border-gray-300 dark:hover:border-[#2f2f2f] transition-all"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this item? This action cannot be undone.')) {
                        deleteMutation.mutate(item._id);
                      }
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
          <Sparkles className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm">No items yet. Create your first "Why Choose Us" item.</p>
        </div>
      )}
    </div>
  );
}
