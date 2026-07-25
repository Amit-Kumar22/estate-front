'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { whyChooseUsService } from '@/lib/api';
import { WhyChooseUs } from '@/types';
import { queryKeys } from '@/lib/constants/query-keys';
import { getImageUrl, PLACEHOLDER_IMAGE } from '@/lib/utils';
import Image from 'next/image';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

/** Falls back to the placeholder if the resolved image URL fails to load
 *  (e.g. the file was removed, or a stale path is stored in the DB) so a
 *  broken icon is never shown to visitors. */
function WhyChooseUsIcon({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes="56px"
      className="object-contain p-2.5 group-hover:scale-110 transition-transform duration-300"
      onError={() => setImgSrc(PLACEHOLDER_IMAGE)}
    />
  );
}

export default function WhyChooseUsSection() {
  const [isMounted, setIsMounted] = useState(false);

  // Only fetch data after component is mounted on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: queryKeys.whyChooseUs.public(),
    queryFn: async () => {
      console.log('🔍 [WhyChooseUs] Fetching data from API...');
      try {
        const res = await whyChooseUsService.getAll();
        console.log('✅ [WhyChooseUs] API Response:', res.data);
        return res.data.data.items as WhyChooseUs[];
      } catch (err) {
        console.error('❌ [WhyChooseUs] API Error:', err);
        throw err;
      }
    },
    enabled: isMounted, // Only run query after component is mounted
  });

  const items = data ?? [];

  // Debug logging
  useEffect(() => {
    console.log('📊 [WhyChooseUs] Component State:', {
      isLoading,
      isError,
      itemCount: items.length,
      items,
    });
  }, [isLoading, isError, items]);

  // Always render the section - don't hide it if empty
  // This allows debugging and shows proper empty state

  return (
    <section className="py-10 md:py-14 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Our Advantages
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Why Choose Us
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover what makes us the preferred choice for your real estate needs
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-7 h-7 animate-spin text-green-500" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="max-w-md mx-auto text-center py-8 px-4">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              Failed to Load Content
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              {error instanceof Error ? error.message : 'Unable to fetch Why Choose Us items'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State - Show when no items exist */}
        {!isLoading && !isError && items.length === 0 && (
          <div className="max-w-md mx-auto text-center py-8 px-4">
            <Sparkles className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              No Items Yet
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Why Choose Us items will appear here once they are added by the administrator.
            </p>
          </div>
        )}

        {/* Items Grid */}
        {!isLoading && !isError && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {items.map((item, index) => (
              <div
                key={item._id}
                className="group relative bg-white dark:bg-[#111] rounded-xl p-4 md:p-5 border border-gray-200 dark:border-[#1f1f1f] hover:border-green-200 dark:hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5 hover:-translate-y-0.5"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Icon/Image */}
                <div className="relative w-12 h-12 md:w-14 md:h-14 mb-3 md:mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/20 dark:from-green-500/10 dark:to-green-700/10 rounded-xl transform group-hover:scale-110 transition-transform duration-300" />
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <WhyChooseUsIcon src={getImageUrl(item.icon)} alt={item.title} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-500/5 to-transparent dark:from-green-500/10 rounded-bl-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
