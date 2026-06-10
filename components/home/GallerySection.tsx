'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Image as ImageIcon, ZoomIn, Filter } from 'lucide-react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { galleryApi } from '@/lib/api';
import { GalleryItem } from '@/types';
import { getImageUrl } from '@/lib/utils';

export default function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { data: galleryData, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const res = await galleryApi.getAll();
      return res.data.data.images as GalleryItem[];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['gallery-categories'],
    queryFn: async () => {
      const res = await galleryApi.getCategories();
      return res.data.data.categories as string[];
    },
  });

  const allImages = galleryData || [];
  const allCategories = ['all', ...(categories || [])];

  const filtered =
    selectedCategory === 'all'
      ? allImages
      : allImages.filter((img) => img.category === selectedCategory);

  const lightboxSlides = filtered.map((img) => ({
    src: getImageUrl(img.url),
    alt: img.caption || '',
  }));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (!isLoading && allImages.length === 0) return null;

  return (
    <section className="section bg-white dark:bg-[#0a0a0a]">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-500/8 border border-green-200 dark:border-green-500/15 mb-4">
            <ImageIcon className="w-3.5 h-3.5 text-green-600 dark:text-green-500" />
            <span className="text-green-700 dark:text-green-400 text-xs font-bold tracking-widest uppercase">Gallery</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Visual Showcase
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            A glimpse into the world of luxury craftsmanship and thoughtful design.
          </p>
        </motion.div>

        {/* Category Filter */}
        {allCategories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {allCategories.map((cat, i) => (
              <button
                key={`${cat}-${i}`}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 capitalize ${
                  selectedCategory === cat
                    ? 'bg-green-600 text-white border-green-600 shadow-green-sm dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30 dark:shadow-none'
                    : 'border-green-200 dark:border-[#1f1f1f] text-gray-600 dark:text-gray-400 hover:border-green-500 hover:text-green-600 dark:hover:border-green-500/20 dark:hover:text-green-400 bg-white dark:bg-transparent'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Masonry Grid */}
        {isLoading ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`skeleton rounded-xl w-full ${i % 3 === 0 ? 'h-52' : i % 3 === 1 ? 'h-36' : 'h-44'}`}
              />
            ))}
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {filtered.slice(0, 12).map((image, i) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => openLightbox(i)}
                className="group relative cursor-pointer rounded-xl overflow-hidden break-inside-avoid"
              >
                <div
                  className="w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${getImageUrl(image.url)})`,
                    paddingBottom: `${60 + Math.floor(Math.random() * 40)}%`,
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100" />
                </div>
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-[11px] font-medium line-clamp-1">{image.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
        index={lightboxIndex}
      />
    </section>
  );
}
