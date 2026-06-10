'use client';

import React, { useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AutoCarouselProps {
  items: ReactNode[];
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  itemsPerView?: { mobile: number; tablet: number; desktop: number };
  title?: string;
  subtitle?: string;
}

export default function AutoCarousel({
  items,
  autoPlayInterval = 4000,
  showArrows = true,
  showDots = true,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3 },
  title,
  subtitle,
}: AutoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [perView, setPerView] = useState(itemsPerView.desktop);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePerView = () => {
      if (window.innerWidth < 640) setPerView(itemsPerView.mobile);
      else if (window.innerWidth < 1024) setPerView(itemsPerView.tablet);
      else setPerView(itemsPerView.desktop);
    };
    updatePerView();
    window.addEventListener('resize', updatePerView);
    return () => window.removeEventListener('resize', updatePerView);
  }, [itemsPerView]);

  const maxIndex = Math.max(0, items.length - perView);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (autoPlayInterval > 0) {
      autoPlayRef.current = setInterval(next, autoPlayInterval);
      return () => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      };
    }
  }, [next, autoPlayInterval]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStart(x);
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const x = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStart - x;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    setIsDragging(false);
    if (autoPlayInterval > 0) {
      autoPlayRef.current = setInterval(next, autoPlayInterval);
    }
  };

  const translateX = -(currentIndex * (100 / perView));

  return (
    <div>
      {(title || subtitle) && (
        <div className="text-center mb-10">
          {title && (
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="relative">
        {/* Track */}
        <div
          className="overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
        >
          <div
            ref={trackRef}
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(${translateX}%)`,
            }}
          >
            {items.map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 px-2.5"
                style={{ width: `${100 / perView}%` }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        {showArrows && items.length > perView && (
          <>
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 rounded-full bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1f1f1f] shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400 hover:border-green-500/30 transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 rounded-full bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1f1f1f] shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400 hover:border-green-500/30 transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {showDots && items.length > perView && (
        <div className="flex justify-center gap-1.5 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'w-6 h-1.5 bg-green-500'
                  : 'w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-green-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
