'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, User, Crown } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ALL_TEAM_MEMBERS, TeamMember } from '@/components/home/TeamSection';

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className="group bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-[#1f1f1f] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 p-7 flex flex-col items-center text-center"
    >
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/30 flex items-center justify-center mb-5 ring-2 ring-green-400 dark:ring-green-600 ring-offset-2 ring-offset-white dark:ring-offset-[#111] flex-shrink-0">
        <User className="w-12 h-12 text-green-600 dark:text-green-400" />
      </div>

      {/* Name */}
      <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
        {member.name}
      </h3>

      {/* Role badge */}
      <span className="inline-block px-3 py-1 rounded-full bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-[11px] font-bold tracking-wide uppercase mb-4">
        {member.role}
      </span>

      {/* Description */}
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        {member.description}
      </p>
    </motion.div>
  );
}

export default function TeamPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#050505]">

        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-green-800 via-green-700 to-green-900 dark:from-green-950 dark:via-green-900 dark:to-black py-16 md:py-20 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-4">
              <Users className="w-4 h-4 text-green-200" />
              <span className="text-green-100 text-xs font-bold tracking-widest uppercase">
                Our Leadership Team
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Meet Our Team
            </h1>
            <p className="text-green-100 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              At RD ECO Developers Pvt. Ltd., our leadership team represents a perfect blend of vision,
              experience, and innovation. Guided by our founders and strengthened by dynamic professionals
              across every department, we are committed to delivering excellence in every project.
            </p>
            <p className="mt-4 text-xs font-semibold text-green-200 italic">
              &ldquo;Leadership Built on Trust • Powered by Innovation • Committed to Excellence.&rdquo;
            </p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

          {/* Founders Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold tracking-widest uppercase">
                <Crown className="w-3.5 h-3.5" /> Founders
              </span>
              <div className="flex-1 h-px bg-amber-200 dark:bg-amber-700/30" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ALL_TEAM_MEMBERS.slice(0, 3).map((member, i) => (
                <MemberCard key={member.id} member={member} index={i} />
              ))}
            </div>
          </div>

          {/* Leadership Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold tracking-widest uppercase">
                <Users className="w-3.5 h-3.5" /> Leadership &amp; Department Heads
              </span>
              <div className="flex-1 h-px bg-green-200 dark:bg-green-700/30" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ALL_TEAM_MEMBERS.slice(3).map((member, i) => (
                <MemberCard key={member.id} member={member} index={i} />
              ))}
            </div>
          </div>

          {/* Bottom quote */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-14 text-center rounded-2xl bg-gradient-to-r from-green-800 via-green-700 to-green-800 dark:from-green-900 dark:via-green-800 dark:to-green-900 py-10 px-6 shadow-lg"
          >
            <p className="text-white text-lg md:text-xl font-semibold font-display">
              &ldquo;Together We Lead with Excellence&rdquo;
            </p>
            <p className="text-green-100 text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
              At RD ECO Developers Pvt. Ltd., our leadership is united by a shared vision — to create exceptional
              developments, uphold the highest standards of integrity, and deliver outstanding value to every customer.
              From our founders and Managing Director to the next generation of leadership and experienced department
              heads, every member is committed to shaping a future built on trust, innovation, quality, and excellence.
            </p>
          </motion.div>

        </div>
      </main>
      <Footer />
    </>
  );
}
