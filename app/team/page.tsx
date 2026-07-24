'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Crown, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ALL_TEAM_MEMBERS, TeamMember } from '@/components/home/TeamSection';

function getInitials(name: string): string {
  const words = name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s*/i, '').trim().split(/\s+/);
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function Avatar({ member, size = 'md' }: { member: TeamMember; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'w-20 h-20' : size === 'sm' ? 'w-12 h-12' : 'w-16 h-16';
  const textClass = size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-sm' : 'text-base';
  return (
    <div className={`relative ${sizeClass} rounded-full ring-2 ring-green-400 dark:ring-green-600 ring-offset-2 ring-offset-white dark:ring-offset-[#111] overflow-hidden flex-shrink-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/30`}>
      {member.image ? (
        <Image src={member.image} alt={member.name} fill sizes="80px" className="object-cover" />
      ) : (
        <span className={`absolute inset-0 flex items-center justify-center font-bold ${textClass} text-green-700 dark:text-green-300 select-none`}>
          {getInitials(member.name)}
        </span>
      )}
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────────
function MemberModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.22 }}
          className="relative z-10 w-full max-w-md bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-[#2a2a2a] shadow-2xl overflow-hidden"
        >
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-green-500 to-green-700" />

          <div className="p-6">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-[#1f1f1f] hover:bg-gray-200 dark:hover:bg-[#2a2a2a] text-gray-500 dark:text-gray-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Avatar + Name */}
            <div className="flex items-center gap-4 mb-4">
              <Avatar member={member} size="sm" />
              <div>
                <h3 className="font-display font-bold text-base text-gray-900 dark:text-white leading-tight">
                  {member.name}
                </h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-[10px] font-bold tracking-wide uppercase">
                  {member.role}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 dark:bg-[#1f1f1f] mb-4" />

            {/* Full description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {member.description}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────────
function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
        className="group bg-white dark:bg-[#111] rounded-xl border border-gray-100 dark:border-[#1f1f1f] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-5 flex flex-col items-center text-center h-full"
      >
        {/* Avatar */}
        <div className="mb-3">
          <Avatar member={member} size="md" />
        </div>

        {/* Name */}
        <h3 className="font-display font-bold text-sm text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
          {member.name}
        </h3>

        {/* Role badge */}
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-[10px] font-bold tracking-wide uppercase mb-3">
          {member.designation}
        </span>

        {/* Description — clamped, grows to fill card */}
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 flex-1 mb-3">
          {member.description}
        </p>

        {/* Read More */}
        <button
          onClick={() => setModalOpen(true)}
          className="text-[11px] font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 border border-green-200 dark:border-green-700/40 hover:border-green-500 dark:hover:border-green-500 rounded-full px-3 py-1 transition-colors duration-200"
        >
          Read More
        </button>
      </motion.div>

      {modalOpen && (
        <MemberModal member={member} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function TeamPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#050505]">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Founders */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-50 dark:bg-gold-500/10 border border-gold-200 dark:border-gold-500/20 text-gold-700 dark:text-gold-400 text-xs font-bold tracking-widest uppercase">
                <Crown className="w-3 h-3" /> Founders
              </span>
              <div className="flex-1 h-px bg-gold-200 dark:bg-gold-700/30" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALL_TEAM_MEMBERS.slice(0, 3).map((member, i) => (
                <MemberCard key={member.id} member={member} index={i} />
              ))}
            </div>
          </div>

          {/* Leadership & Heads */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold tracking-widest uppercase">
                <Users className="w-3 h-3" /> Leadership &amp; Department Heads
              </span>
              <div className="flex-1 h-px bg-green-200 dark:bg-green-700/30" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALL_TEAM_MEMBERS.slice(3).map((member, i) => (
                <MemberCard key={member.id} member={member} index={i} />
              ))}
            </div>
          </div>

          {/* Bottom quote */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center rounded-xl bg-gradient-to-r from-green-800 via-green-700 to-green-800 dark:from-green-900 dark:via-green-800 dark:to-green-900 py-8 px-6 shadow-md"
          >
            <p className="text-white text-base font-semibold font-display">
              &ldquo;Together We Lead with Excellence&rdquo;
            </p>
            <p className="text-green-100 text-xs mt-2 max-w-xl mx-auto leading-relaxed">
              Our leadership is united by a shared vision — to create exceptional developments, uphold the highest
              standards of integrity, and deliver outstanding value to every customer.
            </p>
          </motion.div>

        </div>
      </main>
      <Footer />
    </>
  );
}

