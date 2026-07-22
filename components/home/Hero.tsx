'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import appConfig from '@/config/app.config';
import { getImageUrl } from '@/lib/utils';

interface HeroStat {
  value: string;
  label: string;
}

interface HeroProps {
  headline?: string;
  subheadline?: string;
  videoUrls?: string[];
  backgroundImages?: string[];
  stats?: HeroStat[];
}

type Slide = { type: 'video'; src: string } | { type: 'image'; src: string };

const SLIDE_INTERVAL_MS = 7000;

export default function Hero({
  headline,
  subheadline,
  videoUrls,
  backgroundImages,
  stats,
}: HeroProps) {
  const slides: Slide[] = React.useMemo(() => {
    const videoSlides: Slide[] = (videoUrls || []).map((src) => ({ type: 'video', src }));
    const imageSlides: Slide[] = (backgroundImages || []).map((src) => ({
      type: 'image',
      src: getImageUrl(src),
    }));
    return [...videoSlides, ...imageSlides];
  }, [videoUrls, backgroundImages]);

  const total = slides.length;
  const [current, setCurrent] = React.useState(0);

  const next = React.useCallback(() => {
    setCurrent((i) => (i + 1) % total);
  }, [total]);

  const prev = React.useCallback(() => {
    setCurrent((i) => (i - 1 + total) % total);
  }, [total]);

  React.useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(next, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [total, next]);

  const activeSlide = total > 0 ? slides[current % total] : undefined;

  // Only use a video URL if it is actually configured — no external CDN fallback
  // because third-party CDNs (Mixkit, Pexels, etc.) block cross-origin embedding.
  // When neither videoUrl nor backgroundImage is set, a rich animated green
  // gradient renders as the background instead.
  const activeVideoUrl =
    (activeSlide?.type === 'video' ? activeSlide.src : '') ||
    (total === 0 ? appConfig.hero.fallbackVideoUrl : '') ||
    '';
  const backgroundImage = activeSlide?.type === 'image' ? activeSlide.src : '';

  const hasMedia = !!(activeVideoUrl || backgroundImage);
  const displayHeadline    = headline    || '';
  const displaySubheadline = subheadline || '';

  const words    = displayHeadline.trim().split(' ');
  const midpoint = Math.ceil(words.length / 2);
  const line1    = words.slice(0, midpoint).join(' ');
  const line2    = words.slice(midpoint).join(' ');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ── Background layer ──────────────────────────────────────────────── */}
      <div className="absolute inset-0">

        {activeVideoUrl ? (
          /* ── Video background ── */
          <>
            {/* Poster/gradient shown while video buffers */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-emerald-900" />
            <video
              key={activeVideoUrl}
              src={activeVideoUrl}
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </>
        ) : backgroundImage ? (
          /* ── Static image background ── */
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        ) : (
          /* ── Animated gradient — used when no media is configured ── */
          /* Base: clearly dark green (NOT black). */
          <div className="absolute inset-0 bg-[#0b1f12]">
            {/* Slow-moving gradient sweep */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-800/50 via-transparent to-emerald-900/40" />
            {/* Animated glow orb — top right */}
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.55, 0.35] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/4 right-1/4 w-[480px] h-[480px] rounded-full bg-green-500/25 blur-3xl pointer-events-none"
            />
            {/* Animated glow orb — bottom left */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.40, 0.2] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute bottom-1/3 left-1/4 w-[380px] h-[380px] rounded-full bg-emerald-400/20 blur-3xl pointer-events-none"
            />
            {/* Subtle grid overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(34,197,94,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.15) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
              }}
            />
          </div>
        )}

        {/* Dark overlay — lightened when using the gradient fallback so green shows through */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${
            hasMedia
              ? 'from-black/10 via-black/20 to-black/55'
              : 'from-black/20 via-black/30 to-black/60'
          }`}
        />
        {hasMedia && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
        )}
      </div>

      {/* Carousel controls — only shown when there's more than one slide */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Headline — from settings API */}
          {displayHeadline && (
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight mb-6"
            >
              {line2 ? (
                <>
                  <span className="block">{line1}</span>
                  <span className="block text-gradient">{line2}</span>
                </>
              ) : (
                <span className="text-gradient">{displayHeadline}</span>
              )}
            </motion.h1>
          )}

          {/* Subheadline — from settings API */}
          {displaySubheadline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              {displaySubheadline}
            </motion.p>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link href="/projects?status=current" className="btn-primary px-8 py-3 text-base">
              Explore Projects
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-base text-white border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-200"
            >
              Contact Us
            </Link>
          </motion.div>

          {/* Stats Row — only rendered when real data is provided via settings API */}
          {stats && stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-white font-display">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 tracking-wide">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
