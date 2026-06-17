'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import {
  Crown, Calendar, Home, Building2, Users, Star, CheckCircle, User,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { familyLegacyService } from '@/lib/api';
import { queryKeys } from '@/lib/constants/query-keys';
import { FamilyMember, ApiResponse } from '@/types';
import { getImageUrl } from '@/lib/utils/image';

// ─── Fallback data (displayed while API has no records) ───────────────────────
const FALLBACK_MEMBERS: FamilyMember[] = [
  {
    _id: 'f1', order: 1, isActive: true, createdAt: '', updatedAt: '',
    image: 'https://randomuser.me/api/portraits/men/61.jpg',
    name: 'Ram Prasad', designation: 'Founder',
    description: 'Laid the cornerstone with a vision to build honest, quality homes for every family.',
    year: '1985',
  },
  {
    _id: 'f2', order: 2, isActive: true, createdAt: '', updatedAt: '',
    image: 'https://randomuser.me/api/portraits/men/46.jpg',
    name: 'Suresh Kumar', designation: 'Managing Director',
    description: 'Expanded across regions, bringing modern design and world-class infrastructure.',
    year: '2000',
  },
  {
    _id: 'f3', order: 3, isActive: true, createdAt: '', updatedAt: '',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'Amit Sharma', designation: 'CEO',
    description: 'Pioneered smart homes and sustainable communities for a better tomorrow.',
    year: '2015',
  },
  {
    _id: 'f4', order: 4, isActive: true, createdAt: '', updatedAt: '',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    name: 'Rohan Sharma', designation: 'Next Generation',
    description: 'Driving innovation through technology-first strategies and a global vision.',
    year: '2024',
  },
];

const GEN_LABELS = ['Gen 1', 'Gen 2', 'Gen 3', 'Gen 4'];

// ─── Statistics ───────────────────────────────────────────────────────────────
const STATS = [
  { end: 5000, suffix: '+', label: 'Homes Delivered',       icon: Home },
  { end: 25,   suffix: '+', label: 'Projects Completed',    icon: Building2 },
  { end: 3,    suffix: '',  label: 'Generations',           icon: Users },
  { end: 40,   suffix: '+', label: 'Years of Trust',        icon: Star },
  { end: 100,  suffix: '%', label: 'Customer Commitment',   icon: CheckCircle },
];

// ─── Counter ──────────────────────────────────────────────────────────────────
function useCountUp(end: number, duration = 1800, trigger = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let raf: number;
    let startTime: number | null = null;

    const tick = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, trigger]);

  return count;
}

// ─── Single stat chip ─────────────────────────────────────────────────────────
function StatChip({
  end, suffix, label, icon: Icon, inView,
}: { end: number; suffix: string; label: string; icon: React.ElementType; inView: boolean }) {
  const count = useCountUp(end, 1800, inView);
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-3">
      <Icon className="w-4 h-4 text-green-300 mb-0.5" />
      <span className="text-xl font-bold text-white font-display">
        {count}{suffix}
      </span>
      <span className="text-[10px] font-semibold tracking-wide text-green-200 uppercase text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex flex-col items-center gap-3 pt-8 lg:pt-10">
      <div className="w-4 h-4 rounded-full bg-green-200 animate-pulse hidden lg:block" />
      <div className="w-full bg-white dark:bg-[#111] rounded-3xl border border-green-100 dark:border-[#1f1f1f] p-5">
        <div className="w-14 h-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse mx-auto mb-3" />
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse mx-auto mb-3" />
        <div className="w-24 h-3.5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mx-auto mb-2" />
        <div className="w-16 h-2.5 rounded bg-gray-100 dark:bg-gray-800 animate-pulse mx-auto mb-3" />
        <div className="w-full h-2 rounded bg-gray-100 dark:bg-gray-800 animate-pulse mb-1.5" />
        <div className="w-5/6 h-2 rounded bg-gray-100 dark:bg-gray-800 animate-pulse mx-auto" />
      </div>
    </div>
  );
}

// ─── Generation card ──────────────────────────────────────────────────────────
function GenerationCard({ member, index }: { member: FamilyMember; index: number }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center pt-0 lg:pt-10"
    >
      {/* Timeline dot — desktop */}
      <div className="hidden lg:flex items-center justify-center w-5 h-5 rounded-full bg-green-500 border-2 border-white dark:border-black ring-2 ring-green-300 dark:ring-green-700 shadow-md mb-[-2px] z-10" />

      {/* Card */}
      <div className="group w-full bg-white dark:bg-[#111] rounded-3xl border border-green-100 dark:border-[#1f1f1f] shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 p-5 flex flex-col items-center text-center">

        {/* Generation badge */}
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-[10px] font-bold tracking-widest uppercase mb-3">
          <Crown className="w-2.5 h-2.5" />
          {GEN_LABELS[index] ?? `Gen ${index + 1}`}
        </span>

        {/* Avatar */}
        <div className="relative w-[72px] h-[72px] rounded-full ring-2 ring-green-400 dark:ring-green-600 ring-offset-2 ring-offset-white dark:ring-offset-[#111] overflow-hidden mb-3 flex-shrink-0 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/10">
          {member.image ? (
            <Image
              src={getImageUrl(member.image)}
              alt={member.name}
              fill
              sizes="72px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-end bg-gradient-to-b from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/30 overflow-hidden">
              <User className="w-10 h-10 text-green-400 dark:text-green-600 translate-y-1.5" />
            </div>
          )}
        </div>

        {/* Name + Designation */}
        <h3 className="font-display font-bold text-[15px] text-gray-900 dark:text-white leading-tight mb-0.5 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors duration-300">
          {member.name}
        </h3>
        <p className="text-[11px] font-semibold text-green-600 dark:text-green-500 uppercase tracking-wide mb-2.5">
          {member.designation}
        </p>

        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 mb-3">
          {member.description}
        </p>

        {/* Since badge */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#2a2a2a] text-[10px] font-semibold text-gray-500 dark:text-gray-400">
          <Calendar className="w-2.5 h-2.5 text-green-500" />
          Since {member.year}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function FamilyLegacySection() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' });

  const { data, isLoading } = useQuery<ApiResponse<{ members: FamilyMember[] }>>({
    queryKey: queryKeys.familyLegacy.public(),
    queryFn: async () => {
      const res = await familyLegacyService.getAll();
      return res.data;
    },
    retry: 1,
  });

  const members: FamilyMember[] =
    (data?.data?.members && data.data.members.length > 0)
      ? [...data.data.members].sort((a, b) => a.order - b.order)
      : FALLBACK_MEMBERS;

  return (
    <section className="py-10 md:py-12 bg-white dark:bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-500/8 border border-green-200 dark:border-green-500/15 mb-3">
            <Crown className="w-3.5 h-3.5 text-green-600 dark:text-green-500" />
            <span className="text-green-700 dark:text-green-400 text-xs font-bold tracking-widest uppercase">
              Our Legacy
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Building Trust Across Generations
          </h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            From our founder&apos;s vision to the next generation&apos;s innovation, every milestone has
            shaped the legacy of RD Heights.
          </p>
        </motion.div>

        {/* ── Timeline + Cards ── */}
        <div className="relative">

          {/* Horizontal connector line — desktop (behind cards, at dot level) */}
          <div className="hidden lg:block absolute top-[22px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-green-400 to-transparent dark:via-green-600 z-0" />

          {/* Vertical connector line — mobile single-column */}
          <div className="lg:hidden absolute left-[9px] top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-green-400 to-transparent dark:via-green-600 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : members.slice(0, 4).map((member, i) => (
                  /* Mobile: left dot + indent */
                  <div key={member._id} className="flex items-start gap-3 sm:block">
                    {/* Mobile-only dot */}
                    <div className="flex-shrink-0 mt-4 sm:hidden">
                      <div className="w-[18px] h-[18px] rounded-full bg-green-500 border-2 border-white dark:border-black ring-2 ring-green-300 dark:ring-green-700 shadow" />
                    </div>
                    <div className="flex-1">
                      <GenerationCard member={member} index={i} />
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* ── Achievements Bar ── */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 rounded-2xl overflow-hidden bg-gradient-to-r from-green-800 via-green-700 to-green-800 dark:from-green-900 dark:via-green-800 dark:to-green-900 shadow-glow"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-green-600/40 dark:divide-green-700/50">
            {STATS.map(({ end, suffix, label, icon }) => (
              <StatChip
                key={label}
                end={end}
                suffix={suffix}
                label={label}
                icon={icon}
                inView={statsInView}
              />
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
