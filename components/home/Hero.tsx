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

// How long a static image slide stays on screen before advancing. Video
// slides don't use this — they advance on their own `ended` event so the
// next slide starts exactly when the video finishes, not on a blind timer.
const IMAGE_SLIDE_MS = 7000;
// Crossfade duration between slides. Also gates how long the outgoing slot
// must stay untouched after a transition before it's safe to reassign its
// video source (see the re-prime effect below) — keep both in sync.
const CROSSFADE_MS = 1000;

export default function Hero({
  headline,
  subheadline,
  videoUrls,
  backgroundImages,
  stats,
}: HeroProps) {
  const slides: Slide[] = React.useMemo(() => {
    const videoSlides: Slide[] = (videoUrls || []).map((src) => ({ type: 'video', src: getImageUrl(src) }));
    const imageSlides: Slide[] = (backgroundImages || []).map((src) => ({
      type: 'image',
      src: getImageUrl(src),
    }));
    return [...videoSlides, ...imageSlides];
  }, [videoUrls, backgroundImages]);

  const total = slides.length;

  // ── Multi-slide crossfade carousel ──────────────────────────────────────
  // Two DOM "slots" stay permanently mounted for the life of the carousel —
  // we never unmount/remount a <video> mid-playback, since that teardown is
  // exactly what causes a decoder to cold-start and flash a garbage/solid
  // colored frame before the real picture appears. Instead, the slot that's
  // about to become visible is preloaded (buffered, primed) *while hidden*,
  // and becoming "active" is just a CSS opacity crossfade — the browser
  // never has to render an empty/undecoded frame.
  const [slotSlideIndex, setSlotSlideIndex] = React.useState<[number, number]>([0, total > 1 ? 1 % total : 0]);
  const [activeSlot, setActiveSlot] = React.useState<0 | 1>(0);
  const activeSlotRef = React.useRef<0 | 1>(0);
  const activeIndexRef = React.useRef(0);
  const videoRefs: [React.RefObject<HTMLVideoElement>, React.RefObject<HTMLVideoElement>] = [
    React.useRef<HTMLVideoElement>(null),
    React.useRef<HTMLVideoElement>(null),
  ];

  const activeIndex = slotSlideIndex[activeSlot];
  activeSlotRef.current = activeSlot;
  activeIndexRef.current = activeIndex;

  const goToSlide = React.useCallback(
    (targetIndex: number) => {
      if (total <= 1) return;
      const inactive = activeSlotRef.current === 0 ? 1 : 0;
      setSlotSlideIndex((prev) => {
        if (prev[inactive] === targetIndex) return prev;
        const updated = [...prev] as [number, number];
        updated[inactive] = targetIndex;
        return updated;
      });
      setActiveSlot(inactive);
    },
    [total]
  );

  const next = React.useCallback(() => {
    goToSlide((activeIndexRef.current + 1) % total);
  }, [goToSlide, total]);

  const prev = React.useCallback(() => {
    goToSlide((activeIndexRef.current - 1 + total) % total);
  }, [goToSlide, total]);

  // Keep the hidden slot always primed with whatever comes right after the
  // active slide, so it's ready — and, for video, already buffering — well
  // before it's ever needed.
  //
  // The re-prime is deliberately delayed until the CSS crossfade has fully
  // finished (CROSSFADE_MS), not fired the instant `activeSlot` flips. The
  // slot we're about to repurpose is the one that was just visible — its
  // opacity is still animating 100% → 0% for the next second. Reassigning
  // its `src` (a completely different video) while it's still on screen and
  // partially transparent forces the decoder to cold-start mid-fade, which
  // is exactly the flash this whole effect exists to prevent. Waiting for
  // the fade to finish means the slot is fully invisible before its content
  // ever changes.
  React.useEffect(() => {
    if (total <= 1) return;
    const inactive = activeSlot === 0 ? 1 : 0;
    const desiredIndex = (slotSlideIndex[activeSlot] + 1) % total;
    if (slotSlideIndex[inactive] === desiredIndex) return;
    const id = setTimeout(() => {
      setSlotSlideIndex((prev) => {
        if (prev[inactive] === desiredIndex) return prev;
        const updated = [...prev] as [number, number];
        updated[inactive] = desiredIndex;
        return updated;
      });
    }, CROSSFADE_MS);
    return () => clearTimeout(id);
  }, [activeSlot, slotSlideIndex, total]);

  // Reset + preload a slot's video (paused — it just needs to buffer, not
  // play) whenever the slide *assigned to that slot* actually changes. By
  // the time this fires, the effect above has already waited out the
  // crossfade, so the slot being touched here is guaranteed fully hidden.
  React.useEffect(() => {
    if (total <= 1) return;
    ([0, 1] as const).forEach((slot) => {
      if (slot === activeSlot) return; // never touch the visible slot
      const slide = slides[slotSlideIndex[slot]];
      const el = videoRefs[slot].current;
      if (slide?.type === 'video' && el) {
        el.pause();
        el.currentTime = 0;
        el.load();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotSlideIndex[0], slotSlideIndex[1], total]);

  // Drive the active slot: play its video from the start (video slides
  // advance via their own onEnded handler below) or schedule the timed
  // advance for image slides.
  React.useEffect(() => {
    if (total === 0) return;
    const slide = slides[activeIndex];
    if (!slide) return;

    if (slide.type === 'video') {
      const el = videoRefs[activeSlot].current;
      if (el) {
        el.muted = true;
        el.currentTime = 0;
        el.play().catch(() => {});
      }
      return;
    }

    if (total <= 1) return;
    const id = setTimeout(next, IMAGE_SLIDE_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlot, activeIndex, slides, total, next]);

  const activeSlide = total > 0 ? slides[activeIndex] : undefined;

  // Only use a video URL if it is actually configured — no external CDN fallback
  // because third-party CDNs (Mixkit, Pexels, etc.) block cross-origin embedding.
  // When neither videoUrl nor backgroundImage is set, a rich animated gold
  // gradient renders as the background instead.
  const singleVideoUrl =
    total === 1 && activeSlide?.type === 'video'
      ? activeSlide.src
      : total === 0
      ? appConfig.hero.fallbackVideoUrl || ''
      : '';
  const singleBackgroundImage = total === 1 && activeSlide?.type === 'image' ? activeSlide.src : '';

  const hasMedia = total > 0 || !!appConfig.hero.fallbackVideoUrl;
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

        {total > 1 ? (
          /* ── Crossfade carousel: two permanently-mounted slots, only ──
             opacity changes on transition. Neither slot is ever unmounted
             mid-playback, so there's no decoder cold-start and therefore no
             flash/blank frame between slides. */
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-green-900" />
            {([0, 1] as const).map((slot) => {
              const slideData = slides[slotSlideIndex[slot]];
              if (!slideData) return null;
              const isActive = activeSlot === slot;
              return (
                <div
                  key={slot}
                  className={`absolute inset-0 transition-opacity ease-in-out ${
                    isActive ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
                  }`}
                  style={{ transitionDuration: `${CROSSFADE_MS}ms` }}
                >
                  {slideData.type === 'video' ? (
                    <video
                      ref={videoRefs[slot]}
                      src={slideData.src}
                      muted
                      playsInline
                      disablePictureInPicture
                      preload="auto"
                      onEnded={next}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${slideData.src})` }}
                    />
                  )}
                </div>
              );
            })}
          </>
        ) : singleVideoUrl ? (
          /* ── Single video background (only one slide — no crossfade needed) ── */
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-green-900" />
            <video
              src={singleVideoUrl}
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </>
        ) : singleBackgroundImage ? (
          /* ── Static image background ── */
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${singleBackgroundImage})` }}
          />
        ) : (
          /* ── Animated gradient — used when no media is configured ── */
          /* Base: clearly dark warm brown (NOT black). */
          <div className="absolute inset-0 bg-[#1a1200]">
            {/* Slow-moving gradient sweep */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-800/50 via-transparent to-green-900/40" />
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
              className="absolute bottom-1/3 left-1/4 w-[380px] h-[380px] rounded-full bg-green-400/20 blur-3xl pointer-events-none"
            />
            {/* Subtle grid overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(240,180,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(240,180,0,0.15) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
              }}
            />
          </div>
        )}

        {/* Dark overlay — lightened when using the gradient fallback so gold shows through */}
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
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
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
              className="text-base sm:text-lg text-gold-600 max-w-2xl mx-auto mb-10 leading-relaxed"
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
