'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Play, X, Quote, Clapperboard } from 'lucide-react';
import Image from 'next/image';
import { publicReviewService } from '@/lib/api';
import { PublicReview } from '@/types';
import { getImageUrl } from '@/lib/utils';
import { queryKeys } from '@/lib/constants/query-keys';
import AutoCarousel from './AutoCarousel';

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : null;
}

function getVimeoEmbedUrl(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:.*\/)?(\d+)/);
  return match ? `https://player.vimeo.com/video/${match[1]}?autoplay=1` : null;
}

function getEmbedUrl(url: string): string | null {
  return getYouTubeEmbedUrl(url) || getVimeoEmbedUrl(url);
}

function VideoModal({ item, onClose }: { item: PublicReview; onClose: () => void }) {
  const embedUrl = getEmbedUrl(item.videoUrl);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-3xl bg-[#0b0b0b] rounded-2xl shadow-2xl overflow-hidden border border-white/10">
        {/* Header bar */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#111]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
              <Clapperboard className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{item.name}</p>
              <p className="text-[11px] text-gray-400 truncate">Public Review</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close video"
            className="flex-shrink-0 w-9 h-9 rounded-full bg-white/10 hover:bg-red-500 text-white flex items-center justify-center transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video */}
        <div className="relative w-full aspect-video bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={item.name}
              className="absolute inset-0 w-full h-full"
              allow="accelerate-compute; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video
              src={item.videoUrl}
              controls
              autoPlay
              className="absolute inset-0 w-full h-full object-contain"
            />
          )}
        </div>

        {/* Quote footer */}
        <div className="px-5 py-4 bg-[#111] border-t border-white/5">
          <p className="text-sm text-gray-300 italic leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ item, onPlay }: { item: PublicReview; onPlay: () => void }) {
  return (
    <button
      onClick={onPlay}
      className="group relative w-full text-left bg-white dark:bg-[#111] rounded-xl overflow-hidden border border-gray-200 dark:border-[#1f1f1f] shadow-sm hover:shadow-lg hover:border-green-300 dark:hover:border-green-800 transition-all duration-300"
    >
      <div className="relative w-full aspect-[16/10] bg-gray-200 dark:bg-[#1a1a1a] overflow-hidden">
        <Image
          src={getImageUrl(item.thumbnail)}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/95 shadow-md group-hover:scale-110 group-hover:bg-white transition-all duration-300">
            <Play className="w-3.5 h-3.5 text-green-600 fill-green-600 translate-x-0.5" />
          </span>
        </div>
      </div>

      <div className="relative p-2.5">
        <Quote className="absolute top-2 right-2 w-3.5 h-3.5 text-green-100 dark:text-green-900/40" />
        <p className="text-xs text-gray-700 dark:text-gray-300 italic leading-snug line-clamp-2 pr-3">
          &ldquo;{item.quote}&rdquo;
        </p>
        <p className="mt-1.5 text-xs font-semibold text-gray-900 dark:text-white">{item.name}</p>
      </div>
    </button>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#111] animate-pulse">
      <div className="aspect-[16/10] bg-gray-200 dark:bg-white/10" />
      <div className="p-2.5 space-y-1.5">
        <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full w-full" />
        <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full w-4/5" />
        <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full w-1/2 mt-2" />
      </div>
    </div>
  );
}

export default function PublicReviewSection() {
  const [selected, setSelected] = useState<PublicReview | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.publicReviews.public(),
    queryFn: async () => {
      const res = await publicReviewService.getAll();
      return res.data.data.publicReviews as PublicReview[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const reviews = data ?? [];
  if (!isLoading && reviews.length === 0) return null;

  return (
    <section className="py-6 md:py-8 bg-gray-50 dark:bg-[#0d0d0d]">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              See Why Homeowners Choose Us
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Hear It from Our Clients
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <AutoCarousel
            items={reviews.map((item) => (
              <ReviewCard key={item._id} item={item} onPlay={() => setSelected(item)} />
            ))}
            itemsPerView={{ mobile: 2, tablet: 3, desktop: 4 }}
            autoPlayInterval={reviews.length > 1 ? 5000 : 0}
            showArrows={reviews.length > 1}
            showDots={reviews.length > 1}
          />
        )}
      </div>

      {selected && <VideoModal item={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
