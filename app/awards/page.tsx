'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { awardApi } from '@/lib/api';
import { Award } from '@/types';
import { getImageUrl } from '@/lib/utils';
import { queryKeys } from '@/lib/constants/query-keys';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function AwardsPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.awards.public(),
    queryFn: async () => {
      const res = await awardApi.getAll();
      return res.data.data.awards as Award[];
    },
  });

  const awards = data ?? [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-20 bg-gray-50 dark:bg-[#0d0d0d]">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 pt-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/8 border border-yellow-500/15 mb-4">
            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-yellow-400 text-xs font-semibold tracking-wider uppercase">
              Recognition
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Awards &amp; Accolades
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl mx-auto">
            Proudly recognized by industry leaders for excellence in real estate development.
          </p>
        </motion.div>

        {/* Awards grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl h-52 skeleton" />
            ))}
          </div>
        ) : awards.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {awards.map((award, i) => (
              <motion.div
                key={award._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="group bg-white dark:bg-[#111] rounded-2xl p-5 border border-gray-100 dark:border-[#1f1f1f] hover:border-yellow-500/20 hover:-translate-y-1 transition-all duration-300 text-center"
              >
                {/* Award image */}
                <div className="relative h-32 mb-4 rounded-xl overflow-hidden bg-gray-50 dark:bg-[#1a1a1a]">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${getImageUrl(award.image)})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/90 text-white">
                      {award.year}
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug mb-1 line-clamp-2">
                  {award.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                  {award.organization}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-24 text-gray-400">
            <Trophy className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">No awards to display yet.</p>
          </div>
        )}
      </div>
    </main>
    <Footer />
    </>
  );
}
