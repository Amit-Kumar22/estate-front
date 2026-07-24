'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import {
  Crown, Calendar, Home, Building2, Users, Star, CheckCircle,
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
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    name: 'Mr. Subodh Kumar Singh', designation: 'Founder & Director',
    description:
      'Mr. Subodh Kumar Singh is the visionary Founder & Director of RD ECO Developers Pvt. Ltd. His unwavering dedication, entrepreneurial spirit, and commitment to quality laid the foundation of the company. Under his leadership, the organization has grown into a trusted real estate brand known for integrity, transparency, and customer satisfaction.',
    year: '2013',
  },
  {
    _id: 'f2', order: 2, isActive: true, createdAt: '', updatedAt: '',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    name: 'Mrs. Sheelu Devi', designation: 'Founder & Director',
    description:
      'Mrs. Sheelu Devi is one of the Founders & Directors of RD ECO Developers Pvt. Ltd. She has been a constant source of inspiration and strength since the company\'s inception. Her values, guidance, and dedication have played a vital role in building a culture of trust, responsibility, and long-term growth.',
    year: '2013',
  },
  {
    _id: 'f3', order: 3, isActive: true, createdAt: '', updatedAt: '',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'Mr. Pramod Kumar', designation: 'Founder & Managing Director',
    description:
      'Mr. Pramod Kumar serves as the Managing Director of RD ECO Developers Pvt. Ltd. and plays a pivotal role in driving the company\'s strategic vision, operational excellence, and sustainable growth. He oversees business operations, project development, financial planning, and organizational management.',
    year: '2013',
  },
  {
    _id: 'f4', order: 4, isActive: true, createdAt: '', updatedAt: '',
    image: 'https://randomuser.me/api/portraits/men/52.jpg',
    name: 'Mr. Raja Singh', designation: 'Group Chief Executive Officer',
    description:
      'Mr. Raja Singh serves as the Group CEO, leading the company\'s strategic direction, business growth, and innovation initiatives. He is focused on strengthening the brand, embracing modern technologies, enhancing customer experiences, and expanding RD ECO Developers into one of the most respected real estate companies in Eastern India.',
    year: '2013',
  },
  {
    _id: 'f5', order: 5, isActive: true, createdAt: '', updatedAt: '',
    image: 'https://randomuser.me/api/portraits/men/61.jpg',
    name: 'Mr. Prince Kumar Singh', designation: 'Operations Head',
    description:
      'Mr. Prince Kumar Singh heads the Operations Department, ensuring the smooth execution of projects and seamless coordination across all business functions. He oversees operational planning, project execution, process optimization, and quality assurance while maintaining the company\'s commitment to timely delivery and operational excellence.',
    year: '2013',
  },
  {
    _id: 'f6', order: 6, isActive: true, createdAt: '', updatedAt: '',
    image: 'https://randomuser.me/api/portraits/men/74.jpg',
    name: 'Mr. Kuwar Kumar Singh', designation: '',
    description:
      'Mr. Kuwar Kumar Singh is committed to strengthening the legacy of RD ECO Developers by embracing innovation, modern thinking, and customer-centric values while preserving the trust and principles established by the founding generation.',
    year: '2013',
  },
];

// Founding Generation: indices 0-2 | Next Generation: indices 3-5
const GEN_LABELS = [
  'Founding Gen', 'Founding Gen', 'Founding Gen',
  'Next Gen', 'Next Gen', 'Next Gen',
];

// ─── Statistics ───────────────────────────────────────────────────────────────
const STATS = [
  { end: 500, suffix: '+', label: 'Homes Delivered',       icon: Home },
  { end: 13,   suffix: '+', label: 'Projects Completed',    icon: Building2 },
  { end: 2,    suffix: '',  label: 'Generations',           icon: Users },
  { end: 13,   suffix: '+', label: 'Years of Trust',        icon: Star },
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
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-widest uppercase mb-3 ${
          index < 3
            ? 'bg-gold-50 dark:bg-gold-500/10 border-gold-200 dark:border-gold-500/20 text-gold-700 dark:text-gold-400'
            : 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400'
        }`}>
          <Crown className="w-2.5 h-2.5" />
          {GEN_LABELS[index] ?? `Gen ${index + 1}`}
        </span>

        {/* Avatar */}
        <div className="relative w-[72px] h-[72px] rounded-full ring-2 ring-green-400 dark:ring-green-600 ring-offset-2 ring-offset-white dark:ring-offset-[#111] overflow-hidden mb-3 flex-shrink-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/30">
          {member.image ? (
            <Image
              src={getImageUrl(member.image)}
              alt={member.name}
              fill
              sizes="72px"
              className="object-cover"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-green-700 dark:text-green-300 select-none">
              {member.name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s*/i, '').trim().split(/\s+/).filter(Boolean).reduce((acc, w, i, arr) => i === 0 || i === arr.length - 1 ? acc + w[0].toUpperCase() : acc, '')}
            </span>
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
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Every successful journey begins with a strong foundation, and our legacy is built on the values of
            integrity, hard work, trust, and commitment. The foundation of this legacy was laid by our founding
            generation, and today the next generation proudly carries this vision forward. At RD ECO Developers,
            our legacy is not only about constructing buildings — it is about creating homes, building
            relationships, and delivering lasting value for every family we serve.
          </p>
          <p className="mt-3 text-xs font-semibold tracking-wide text-green-700 dark:text-green-400 italic">
            &ldquo;Built on Trust. Driven by Vision. Carried Forward by Generations.&rdquo;
          </p>
        </motion.div>

        {/* ── Timeline + Cards ── */}
        <div className="relative">

          {/* Founding Generation */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-50 dark:bg-gold-500/10 border border-gold-200 dark:border-gold-500/20 text-gold-700 dark:text-gold-400 text-xs font-bold tracking-widest uppercase">
                <Crown className="w-3 h-3" /> Founding Generation
              </span>
              <div className="flex-1 h-px bg-gold-200 dark:bg-gold-700/30" />
            </div>
            <div className="flex flex-wrap justify-center gap-4 lg:gap-5">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="w-full sm:w-[calc(50%-8px)] lg:w-72"><SkeletonCard /></div>
                  ))
                : members.slice(0, 3).map((member, i) => (
                    <div key={member._id} className="w-full sm:w-[calc(50%-8px)] lg:w-72">
                      <GenerationCard member={member} index={i} />
                    </div>
                  ))}
            </div>
          </div>

          {/* Next Generation */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold tracking-widest uppercase">
                <Crown className="w-3 h-3" /> Next Generation
              </span>
              <div className="flex-1 h-px bg-green-200 dark:bg-green-700/30" />
            </div>
            <div className="flex flex-wrap justify-center gap-4 lg:gap-5">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="w-full sm:w-[calc(50%-8px)] lg:w-72"><SkeletonCard /></div>
                  ))
                : members.slice(3, 6).map((member, i) => (
                    <div key={member._id} className="w-full sm:w-[calc(50%-8px)] lg:w-72">
                      <GenerationCard member={member} index={i + 3} />
                    </div>
                  ))}
            </div>
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