'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Award as AwardIcon, Trophy } from 'lucide-react';
import Image from 'next/image';
import { awardApi } from '@/lib/api';
import { Award } from '@/types';
import { getImageUrl } from '@/lib/utils';

export default function AwardsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['awards'],
    queryFn: async () => {
      const res = await awardApi.getAll();
      return res.data.data.awards as Award[];
    },
  });

  const awards = data || [];

  if (!isLoading && awards.length === 0) return null;

  return (
    <section className="py-3 md:py-5 bg-gradient-to-br from-green-50 via-green-100 to-gold-50 dark:from-[#0d2210] dark:via-[#0f1f0f] dark:to-[#111]">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-50 dark:bg-gold-500/8 border border-gold-200 dark:border-gold-500/15 mb-4">
            <Trophy className="w-3.5 h-3.5 text-gold-600 dark:text-gold-500" />
            <span className="text-gold-700 dark:text-gold-400 text-xs font-bold tracking-widest uppercase">
              Recognition
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Awards & Accolades
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Proudly recognized by industry leaders for excellence in real estate development.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl h-52 skeleton" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {awards.map((award, i) => (
              <motion.div
                key={award._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group bg-white dark:bg-[#111] rounded-2xl p-5
                  border border-green-100 dark:border-[#1f1f1f]
                  shadow-card dark:shadow-none
                  hover:shadow-card-hover dark:hover:border-gold-500/20
                  hover:-translate-y-1.5 transition-all duration-300"
              >
                {/* Award Image */}
                <div className="relative h-28 mb-4 rounded-xl overflow-hidden bg-green-50 dark:bg-[#1a1a1a]">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${getImageUrl(award.image)})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="text-center">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-gold-500/10 text-gold-500 mb-2">
                    {award.year}
                  </span>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug mb-1 line-clamp-2">
                    {award.title}
                  </h3>
                  {award.organization && (
                    <p className="text-[11px] text-gray-400">{award.organization}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
