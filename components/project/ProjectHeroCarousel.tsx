'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Lock, Image } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const FREE_IMAGE_COUNT = 2;

interface ProjectHeroCarouselProps {
  images: string[];
  projectName: string;
  unlocked?: boolean;
  onUnlockRequest?: () => void;
}

export default function ProjectHeroCarousel({
  images,
  projectName,
  unlocked = true,
  onUnlockRequest,
}: ProjectHeroCarouselProps) {
  // When locked, restrict to the first FREE_IMAGE_COUNT images
  const visibleImages = unlocked ? images : images?.slice(0, FREE_IMAGE_COUNT);
  const lockedCount = (images?.length ?? 0) - FREE_IMAGE_COUNT;
  const hasLockedImages = !unlocked && lockedCount > 0;

  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images?.length) {
    return (
      <div className="h-72 sm:h-96 md:h-[480px] bg-gray-100 dark:bg-[#111] flex items-center justify-center">
        <span className="text-sm text-gray-400">No images available</span>
      </div>
    );
  }

  const totalVisible = visibleImages.length;

  const next = useCallback(() => {
    if (current === totalVisible - 1 && hasLockedImages) {
      // At the last free image; prompt unlock instead of wrapping
      onUnlockRequest?.();
      return;
    }
    setCurrent((p) => (p + 1) % totalVisible);
  }, [current, totalVisible, hasLockedImages, onUnlockRequest]);

  const prev = useCallback(
    () => setCurrent((p) => (p - 1 + totalVisible) % totalVisible),
    [totalVisible],
  );

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slides = visibleImages.map((img) => ({ src: getImageUrl(img), alt: projectName }));

  return (
    <div className="relative h-72 sm:h-96 md:h-[480px] overflow-hidden">
      {/* Images */}
      {visibleImages.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 bg-cover bg-center ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${getImageUrl(img)})` }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />

      {/* Prev button */}
      {totalVisible > 1 && (
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Next button — shows lock icon when it would exceed free images */}
      {(totalVisible > 1 || hasLockedImages) && (
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all flex items-center justify-center"
        >
          {current === totalVisible - 1 && hasLockedImages
            ? <Lock className="w-4 h-4" />
            : <ChevronRight className="w-5 h-5" />
          }
        </button>
      )}

      {/* Fullscreen */}
      <button
        onClick={() => setLightboxOpen(true)}
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all flex items-center justify-center"
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      {/* Image counter */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
        {current + 1} / {unlocked ? images.length : `${FREE_IMAGE_COUNT}+`}
      </div>

      {/* Locked images badge */}
      {hasLockedImages && (
        <button
          onClick={onUnlockRequest}
          className="absolute bottom-12 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium hover:bg-black/80 transition-all border border-white/20"
        >
          <Image className="w-3.5 h-3.5 text-green-400" />
          <span>+{lockedCount} more</span>
          <Lock className="w-3 h-3 text-green-400" />
        </button>
      )}

      {/* Thumbnail dots */}
      {totalVisible > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
          {visibleImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
          {/* Locked dots placeholder */}
          {hasLockedImages && Array.from({ length: Math.min(lockedCount, 4) }).map((_, i) => (
            <button
              key={`locked-${i}`}
              onClick={onUnlockRequest}
              className="w-1.5 h-1.5 rounded-full bg-white/25 border border-white/40 flex-shrink-0"
            />
          ))}
        </div>
      )}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={current}
      />
    </div>
  );
}
