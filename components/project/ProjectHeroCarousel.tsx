'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface ProjectHeroCarouselProps {
  images: string[];
  projectName: string;
}

export default function ProjectHeroCarousel({ images, projectName }: ProjectHeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // If no images are provided by the API, render nothing — no dummy/placeholder CDN images
  if (!images?.length) {
    return (
      <div className="h-72 sm:h-96 md:h-[480px] bg-gray-100 dark:bg-[#111] flex items-center justify-center">
        <span className="text-sm text-gray-400">No images available</span>
      </div>
    );
  }

  const safeguardedImages = images;
  const totalImages = safeguardedImages.length;

  const next = useCallback(() => setCurrent((p) => (p + 1) % totalImages), [totalImages]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + totalImages) % totalImages), [totalImages]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slides = safeguardedImages.map((img) => ({ src: getImageUrl(img), alt: projectName }));

  return (
    <div className="relative h-72 sm:h-96 md:h-[480px] overflow-hidden">
      {/* Images */}
      {safeguardedImages.map((img, i) => (
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

      {/* Controls */}
      {totalImages > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Fullscreen Button */}
      <button
        onClick={() => setLightboxOpen(true)}
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all flex items-center justify-center"
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      {/* Counter */}
      {totalImages > 1 && (
        <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
          {current + 1} / {totalImages}
        </div>
      )}

      {/* Thumbnail strip */}
      {totalImages > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
          {safeguardedImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
              }`}
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
