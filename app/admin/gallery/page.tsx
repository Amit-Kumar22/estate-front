'use client';

import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryApi } from '@/lib/api';
import { GalleryItem } from '@/types';
import { Plus, Trash2, Edit2, Upload, X, ZoomIn, Filter } from 'lucide-react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { getImageUrl } from '@/lib/utils';
import { queryKeys } from '@/lib/constants/query-keys';
import toast from 'react-hot-toast';

export default function AdminGalleryPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploading, setUploading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.gallery.list({}),
    queryFn: async () => {
      const res = await galleryApi.getAll();
      return res.data.data.images as GalleryItem[];
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: queryKeys.gallery.categories(),
    queryFn: async () => {
      const res = await galleryApi.getCategories();
      return res.data.data.categories as string[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => galleryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all() });
      toast.success('Image deleted');
    },
    onError: () => toast.error('Failed to delete image'),
  });

  const images = data ?? [];
  const allCategories = ['all', ...(categoriesData ?? [])];
  const filtered = selectedCategory === 'all'
    ? images
    : images.filter((img) => img.category === selectedCategory);

  const slides = filtered.map((img) => ({ src: getImageUrl(img.url), alt: img.caption ?? '' }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append('images', f));
      await galleryApi.upload(formData);
      queryClient.invalidateQueries({ queryKey: queryKeys.gallery.all() });
      toast.success(`${files.length} image(s) uploaded`);
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Gallery Management</h2>
          <p className="text-xs text-gray-500">{images.length} total images</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-green-600 hover:bg-green-700 text-white transition-all disabled:opacity-60"
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading…' : 'Upload Images'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {/* Category filter */}
      {allCategories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {allCategories.map((cat, i) => (
            <button
              key={`${cat}-${i}`}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                selectedCategory === cat
                  ? 'bg-green-500 text-white border-green-500'
                  : 'text-gray-600 dark:text-gray-400 border-gray-200 dark:border-[#1f1f1f] hover:border-green-500/30'
              }`}
            >
              <Filter className="w-3 h-3" />
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="rounded-xl h-36 skeleton" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((image, i) => (
            <div
              key={image._id}
              className="group relative rounded-xl overflow-hidden border border-gray-200 dark:border-[#1f1f1f] bg-gray-100 dark:bg-[#111] aspect-square"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                style={{ backgroundImage: `url(${getImageUrl(image.url)})` }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center gap-2">
                <button
                  onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                  className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this image?')) deleteMutation.mutate(image._id);
                  }}
                  className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-red-500/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-500 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {image.category && (
                <div className="absolute bottom-1.5 left-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/60 text-gray-200 capitalize">
                    {image.category}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-20 text-gray-500">
          <Upload className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm">No images yet. Upload your first image.</p>
        </div>
      )}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={lightboxIndex}
      />
    </div>
  );
}
