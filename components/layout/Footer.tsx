'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Building2, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, Star, PenLine } from 'lucide-react';
import appConfig from '@/config/app.config';
import ReviewForm from '@/components/home/ReviewForm';

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

const socialLinks = [
  { icon: Facebook,  href: appConfig.social.facebook  || '#', label: 'Facebook' },
  { icon: Instagram, href: appConfig.social.instagram || '#', label: 'Instagram' },
  { icon: Twitter,   href: appConfig.social.twitter   || '#', label: 'Twitter' },
  { icon: Linkedin,  href: appConfig.social.linkedin  || '#', label: 'LinkedIn' },
  { icon: Youtube,   href: appConfig.social.youtube   || '#', label: 'YouTube' },
];

export default function Footer() {
  const [reviewOpen, setReviewOpen] = useState(false);

  return (
    <>
      <footer className="bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Main row ── */}
          <div className="py-5 flex flex-col lg:flex-row lg:items-start gap-5 border-b border-gray-100 dark:border-[#1a1a1a]">

            {/* Brand + contact */}
            <div className="flex-shrink-0 min-w-0 lg:w-72">
              <Link href="/" className="inline-flex items-center gap-2 mb-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-baseline leading-none select-none">
                  <span className="font-display font-bold text-base tracking-tight text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">RD Eco</span>
                  <span className="font-display font-medium text-base tracking-tight ml-1 text-gray-400 dark:text-gray-400 group-hover:text-green-400 transition-colors">Developers</span>
                </div>
              </Link>

              {/* Contact inline chips */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                <a href={`tel:${appConfig.site.phone}`} className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <Phone className="w-3 h-3 text-green-500 flex-shrink-0" />
                  {appConfig.site.phone}
                </a>
                <a href={`tel:${appConfig.site.phone2}`} className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <Phone className="w-3 h-3 text-green-500 flex-shrink-0" />
                  {appConfig.site.phone2}
                </a>
                <a href={`mailto:${appConfig.site.email}`} className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  <Mail className="w-3 h-3 text-green-500 flex-shrink-0" />
                  {appConfig.site.email}
                </a>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3 h-3 text-green-500 flex-shrink-0" />
                  {appConfig.site.address}
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
                © {new Date().getFullYear()} {appConfig.site.name}. All rights reserved.
              </p>
              <span className="hidden sm:block w-px h-3 bg-gray-200 dark:bg-gray-700" />
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map((s) => <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
              </div>
              <button
                onClick={() => setReviewOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
              >
                <PenLine className="w-3 h-3" />
                Write a Review
              </button>
            </div>

            {/* Social icons */}
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
          </div>

        </div>
      </footer>

      {reviewOpen && <ReviewForm onClose={() => setReviewOpen(false)} />}
    </>
  );
}

