'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Image as ImageIcon, ZoomIn, Filter, X } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { galleryApi } from '@/lib/api';
import { GalleryItem } from '@/types';
import { getImageUrl } from '@/lib/utils';
import { queryKeys } from '@/lib/constants/query-keys';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { data: galleryData, isLoading } = useQuery({
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

  const allImages = galleryData ?? [];
  const allCategories = ['all', ...(categoriesData ?? [])];
  const filtered = selectedCategory === 'all'
    ? allImages
    : allImages.filter((img) => img.category === selectedCategory);

  const slides = filtered.map((img) => ({
    src: getImageUrl(img.url),
    alt: img.caption ?? '',
  }));

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-20 bg-white dark:bg-[#0a0a0a]">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 pt-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/8 border border-green-500/15 mb-4">
            <ImageIcon className="w-3.5 h-3.5 text-green-500" />
            <span className="text-green-400 text-xs font-semibold tracking-wider uppercase">Gallery</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Visual Showcase
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl mx-auto">
            A glimpse into the world of luxury craftsmanship and thoughtful design.
          </p>
        </motion.div>

        {/* Category filter */}
        {allCategories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {allCategories.map((cat, i) => (
              <button
                key={`${cat}-${i}`}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 capitalize ${
                  selectedCategory === cat
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-transparent text-gray-500 dark:text-gray-400 border-gray-200 dark:border-[#1f1f1f] hover:border-green-500/40'
                }`}
              >
                <Filter className="w-3 h-3" />
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Masonry grid */}
        {isLoading ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`rounded-xl skeleton ${i % 3 === 0 ? 'h-52' : 'h-36'}`} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
            {filtered.map((image, i) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
                className="relative group mb-3 overflow-hidden rounded-xl cursor-pointer break-inside-avoid"
                onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(image.url)}
                  alt={image.caption ?? ''}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-[11px] line-clamp-1">{image.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-24 text-gray-400">
            <ImageIcon className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">No images in this category.</p>
          </div>
        )}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={lightboxIndex}
      />
    </main>
    <Footer />
    </>
  );
}
