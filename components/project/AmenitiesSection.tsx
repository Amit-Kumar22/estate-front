'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';
import { resolveAmenity } from '@/lib/constants/amenities';

interface AmenitiesSectionProps {
  amenities: string[];
}

export default function AmenitiesSection({ amenities }: AmenitiesSectionProps) {
  if (!amenities?.length) return null;

  return (
    <section className="py-10">
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-7"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/8 border border-green-500/15 mb-3">
          <LayoutGrid className="w-3.5 h-3.5 text-green-500" />
          <span className="text-green-400 text-xs font-semibold tracking-wider uppercase">
            Amenities
          </span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          World-Class Facilities
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
          Every amenity thoughtfully crafted to elevate your everyday living experience.
        </p>
      </motion.div>

      {/* Amenity grid — icons resolved dynamically from centralized AMENITY_MAP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {amenities.map((amenity, i) => {
          const { label, icon: Icon } = resolveAmenity(amenity);
          return (
            <motion.div
              key={amenity}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group flex flex-col items-center gap-2.5 p-4 rounded-xl bg-white dark:bg-[#111] border border-gray-100 dark:border-[#1f1f1f] hover:border-green-500/25 hover:-translate-y-0.5 transition-all duration-200 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors duration-200">
                <Icon className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-snug">
                {label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

