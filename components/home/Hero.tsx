'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import appConfig from '@/config/app.config';

interface HeroStat {
  value: string;
  label: string;
}

interface HeroProps {
  headline?: string;
  subheadline?: string;
  videoUrl?: string;
  backgroundImage?: string;
  stats?: HeroStat[];
}

export default function Hero({
  headline,
  subheadline,
  videoUrl,
  backgroundImage,
  stats,
}: HeroProps) {
  // Only use a video URL if it is actually configured — no external CDN fallback
  // because third-party CDNs (Mixkit, Pexels, etc.) block cross-origin embedding.
  // When neither videoUrl nor backgroundImage is set, a rich animated green
  // gradient renders as the background instead.
  const activeVideoUrl = videoUrl || appConfig.hero.fallbackVideoUrl || '';

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
              ? 'from-black/40 via-black/50 to-black/80'
              : 'from-black/20 via-black/30 to-black/60'
          }`}
        />
        {hasMedia && (
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-6"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400 text-xs font-semibold tracking-wider uppercase">
              Premium RD Heights Pvt Ltd. 
            </span>
          </motion.div>

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

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-400 tracking-wider uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-green-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}