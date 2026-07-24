'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, Star, PenLine } from 'lucide-react';
import appConfig from '@/config/app.config';
import { settingsApi } from '@/lib/api';
import ReviewForm from '@/components/home/ReviewForm';
import type { SiteSettings } from '@/types';

const footerLinks = [
  { label: 'About Us',           href: '/about' },
  { label: 'Awards',             href: '/awards' },
  { label: 'Gallery',            href: '/gallery' },
  { label: 'Contact',            href: '/contact' },
  { label: 'Current Projects',   href: '/projects?status=current' },
  { label: 'Upcoming Projects',  href: '/projects?status=upcoming' },
  { label: 'Completed Projects', href: '/projects?status=completed' },
  { label: 'Privacy Policy',     href: '/privacy' },
  { label: 'Terms of Service',   href: '/terms' },
  { label: 'RERA Disclosure',    href: '/rera' },
];

export default function Footer() {
  const [reviewOpen, setReviewOpen] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await settingsApi.get();
      return (res.data?.data?.settings ?? null) as Partial<SiteSettings> | null;
    },
    staleTime: 5 * 60 * 1000,
  });

  const companyName    = settings?.companyName    || appConfig.site.name;
  const companyPhone   = settings?.companyPhone   || appConfig.site.phone;
  const companyEmail   = settings?.companyEmail   || appConfig.site.email;
  const companyAddress = settings?.companyAddress || appConfig.site.address;

  const socialLinks = [
    { icon: Facebook,  href: settings?.socialLinks?.facebook,  label: 'Facebook' },
    { icon: Instagram, href: settings?.socialLinks?.instagram, label: 'Instagram' },
    { icon: Twitter,   href: settings?.socialLinks?.twitter,   label: 'Twitter' },
    { icon: Linkedin,  href: settings?.socialLinks?.linkedin,  label: 'LinkedIn' },
    { icon: Youtube,   href: settings?.socialLinks?.youtube,   label: 'YouTube' },
  ].filter((s): s is { icon: typeof Facebook; href: string; label: string } => !!s.href);

  return (
    <>
      <footer className="bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Main row ── */}
          <div className="py-5 flex flex-col lg:flex-row lg:items-start gap-5 border-b border-gray-100 dark:border-[#1a1a1a]">

            {/* Brand + contact */}
            <div className="flex-shrink-0 min-w-0 lg:w-72">
              <Link href="/" className="inline-flex items-center gap-2 mb-2.5 group">
                <Image
                  src="/logo.png"
                  alt={`${companyName} logo`}
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain shrink-0 transition-transform duration-300 group-hover:scale-105"
                />
                <span className="font-display font-bold text-base tracking-tight text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">
                  {companyName}
                </span>
              </Link>

              {/* Contact inline chips */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                <a href={`tel:${companyPhone}`} className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <Phone className="w-3 h-3 text-green-500 flex-shrink-0" />
                  {companyPhone}
                </a>
                <a href={`mailto:${companyEmail}`} className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <Mail className="w-3 h-3 text-green-500 flex-shrink-0" />
                  {companyEmail}
                </a>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3 h-3 text-green-500 flex-shrink-0" />
                  {companyAddress}
                </span>
              </div>
            </div>

            {/* Nav links — wrapping flex */}
            <div className="flex-1 flex flex-wrap gap-x-5 gap-y-1.5 lg:justify-end lg:pt-0.5">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[11px] text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="py-3 flex flex-col sm:flex-row items-center justify-between gap-3">

            {/* Copyright + review */}
            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
              <p className="text-[11px] text-gray-400 dark:text-gray-600">
                © {new Date().getFullYear()} {companyName}. All rights reserved.
              </p>
              <span className="hidden sm:block w-px h-3 bg-gray-200 dark:bg-gray-700" />
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map((s) => <Star key={s} className="w-3 h-3 fill-gold-400 text-gold-400" />)}
              </div>
              <button
                onClick={() => setReviewOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
              >
                <PenLine className="w-3 h-3" />
                Write a Review
              </button>
            </div>

            {/* Social icons — only rendered for links actually configured in settings */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-1.5">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg border border-gray-200 dark:border-[#222] flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-white hover:bg-green-600 hover:border-green-600 transition-all duration-200"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            )}
          </div>

        </div>
      </footer>

      {reviewOpen && <ReviewForm onClose={() => setReviewOpen(false)} />}
    </>
  );
}
