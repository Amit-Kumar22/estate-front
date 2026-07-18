'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Users, ArrowRight } from 'lucide-react';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  designation: string;
  description: string;
  image?: string;
}

/** Returns 1–2 capital initials from a name like "Mr. Pramod Kumar" → "PK" */
function getInitials(name: string): string {
  const words = name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s*/i, '').trim().split(/\s+/);
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export const ALL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm1',
    name: 'Mr. Pramod Kumar',
    role: 'Founder & Managing Director',
    designation: 'Founder & Managing Director',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    description:
      'Mr. Pramod Kumar serves as the Managing Director of RD ECO Developers Pvt. Ltd. and plays a pivotal role in driving the company\'s strategic vision, operational excellence, and sustainable growth. With extensive experience in the real estate sector, he oversees business operations, project development, financial planning, and organizational management. Under his leadership, RD ECO Developers has strengthened its reputation for quality construction, transparent business practices, and customer-centric development. His commitment to innovation, professionalism, and long-term value continues to guide the company toward new milestones while ensuring every project reflects the highest standards of excellence.',
  },
  {
    id: 'tm2',
    name: 'Mr. Subodh Kumar Singh',
    role: 'Founder & Director',
    designation: 'Founder & Director',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    description:
      'Mr. Subodh Kumar Singh is the visionary Founder & Director of RD ECO Developers Pvt. Ltd. His unwavering dedication, entrepreneurial spirit, and commitment to quality laid the foundation of the company. Under his leadership, the organization has grown into a trusted real estate brand known for integrity, transparency, and customer satisfaction.',
  },
  {
    id: 'tm3',
    name: 'Mrs. Sheelu Devi',
    role: 'Founder & Director',
    designation: 'Founder & Director',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    description:
      'Mrs. Sheelu Devi is one of the Founders & Directors of RD ECO Developers Pvt. Ltd. She has been a constant source of inspiration and strength since the company\'s inception. Her values, guidance, and dedication have played a vital role in building a culture of trust, responsibility, and long-term growth.',
  },
  {
    id: 'tm4',
    name: 'Mr. Raja Singh',
    role: 'Group Chief Executive Officer (Group CEO)',
    designation: 'Group CEO',
    image: 'https://randomuser.me/api/portraits/men/52.jpg',
    description:
      'Mr. Raja Singh serves as the Group Chief Executive Officer (Group CEO), leading the company\'s strategic direction, business growth, and innovation initiatives. He is focused on strengthening the brand, embracing modern technologies, enhancing customer experiences, and expanding RD ECO Developers into one of the most respected real estate companies in Eastern India.',
  },
  {
    id: 'tm5',
    name: 'Mr. Prince Kumar Singh',
    role: 'Operations Head',
    designation: 'Operations Head',
    image: 'https://randomuser.me/api/portraits/men/61.jpg',
    description:
      'Mr. Prince Kumar Singh heads the Operations Department, ensuring the smooth execution of projects and seamless coordination across all business functions. He oversees operational planning, project execution, process optimization, and quality assurance while maintaining the company\'s commitment to timely delivery and operational excellence.',
  },
  {
    id: 'tm6',
    name: 'Ms. Chetna Kumari',
    role: 'Head – Human Resources & Development (HR&D)',
    designation: 'Head – HR&D',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    description:
      'Ms. Chetna Kumari heads the Human Resources & Development (HR&D) department. She oversees talent acquisition, employee engagement, training and development, organizational culture, and performance management. Her leadership helps build a motivated workforce that drives the company\'s continued growth and success.',
  },
  {
    id: 'tm7',
    name: 'Mr. Anil Kumar',
    role: 'Head – Projects & Planning',
    designation: 'Head – Projects & Planning',
    image: 'https://randomuser.me/api/portraits/men/74.jpg',
    description:
      'Mr. Anil Kumar leads the Projects & Planning division, overseeing project execution from concept to completion. He is responsible for project planning, construction management, quality control, engineering coordination, and timely delivery. His strategic approach ensures that every development meets the highest standards of quality and efficiency.',
  },
  {
    id: 'tm8',
    name: 'Mr. Manoranjan Kumar',
    role: 'Head – Post Sales & Finance',
    designation: 'Head – Post Sales & Finance',
    image: 'https://randomuser.me/api/portraits/men/83.jpg',
    description:
      'Mr. Manoranjan Kumar manages the Post Sales & Finance department, ensuring a seamless customer experience after booking while overseeing financial operations. His responsibilities include customer support, payment management, documentation, financial planning, and maintaining long-term relationships with homeowners and investors.',
  },
  {
    id: 'tm9',
    name: 'Mr. Sunil Kumar',
    role: 'Head – Legal',
    designation: 'Head – Legal',
    image: 'https://randomuser.me/api/portraits/men/91.jpg',
    description:
      'Mr. Sunil Kumar heads the Legal Department and is responsible for ensuring legal compliance across all company operations. He oversees property documentation, regulatory approvals, contract management, statutory compliance, and legal due diligence, ensuring every project adheres to applicable laws and regulations.',
  },
  {
    id: 'tm10',
    name: 'Mr. Alexender Tirkey',
    role: 'Head – Sales & CRM',
    designation: 'Head – Sales & CRM',
    image: 'https://randomuser.me/api/portraits/men/27.jpg',
    description:
      'Mr. Alexender Tirkey leads the Sales & Customer Relationship Management (CRM) team. He is responsible for business development, sales strategy, customer engagement, lead management, and after-sales coordination. His customer-first approach helps build lasting relationships and ensures a smooth home-buying experience.',
  },
];

// Show first 4 on home page
const PREVIEW_MEMBERS = ALL_TEAM_MEMBERS.slice(0, 4);

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-[#1f1f1f] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col items-center text-center"
    >
      {/* Avatar */}
      <div className="relative w-20 h-20 rounded-full ring-2 ring-green-400 dark:ring-green-600 ring-offset-2 ring-offset-white dark:ring-offset-[#111] overflow-hidden mb-4 flex-shrink-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/30">
        {member.image ? (
          <Image src={member.image} alt={member.name} fill sizes="80px" className="object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-green-700 dark:text-green-300 select-none">
            {getInitials(member.name)}
          </span>
        )}
      </div>

      <h3 className="font-display font-bold text-base text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
        {member.name}
      </h3>
      <p className="text-[11px] font-semibold text-green-600 dark:text-green-500 uppercase tracking-wide mb-3">
        {member.designation}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
        {member.description}
      </p>
    </motion.div>
  );
}

export default function TeamSection() {
  return (
    <section className="py-12 md:py-16 bg-gray-50 dark:bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-500/8 border border-green-200 dark:border-green-500/15 mb-3">
            <Users className="w-3.5 h-3.5 text-green-600 dark:text-green-500" />
            <span className="text-green-700 dark:text-green-400 text-xs font-bold tracking-widest uppercase">
              Our Leadership Team
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Meet Our Team
          </h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            At RD ECO Developers Pvt. Ltd., our leadership team represents a perfect blend of vision,
            experience, and innovation. Together, we work with integrity, transparency, and a customer-first
            approach to create exceptional residential and commercial developments across Bihar.
          </p>
          <p className="mt-2 text-xs font-semibold text-green-700 dark:text-green-400 italic">
            &ldquo;Leadership Built on Trust • Powered by Innovation • Committed to Excellence.&rdquo;
          </p>
        </motion.div>

        {/* Preview Grid – 4 members */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {PREVIEW_MEMBERS.map((member, i) => (
            <MemberCard key={member.id} member={member} index={i} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center"
        >
          <Link
            href="/team"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Meet Our Full Team
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
