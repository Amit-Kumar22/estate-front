'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Building2, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, Star, PenLine } from 'lucide-react';
import appConfig from '@/config/app.config';
import ReviewForm from '@/components/home/ReviewForm';

const footerLinks = {
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Awards',   href: '/awards' },
    { label: 'Gallery',  href: '/gallery' },
    { label: 'Contact',  href: '/contact' },
  ],
  Projects: [
    { label: 'Current Projects',   href: '/projects?status=current' },
    { label: 'Upcoming Projects',  href: '/projects?status=upcoming' },
    { label: 'Completed Projects', href: '/projects?status=completed' },
  ],
  Legal: [
    { label: 'Privacy Policy',  href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'RERA Disclosure', href: '/rera' },
  ],
};

const socialLinks = [
  { icon: Facebook,  href: appConfig.social.facebook  || '#', label: 'Facebook' },
  { icon: Instagram, href: appConfig.social.instagram || '#', label: 'Instagram' },
  { icon: Twitter,   href: appConfig.social.twitter   || '#', label: 'Twitter' },
  { icon: Linkedin,  href: appConfig.social.linkedin  || '#', label: 'LinkedIn' },
  { icon: Youtube,   href: appConfig.social.youtube   || '#', label: 'YouTube' },
];

export default function Footer() {
  const [reviewOpen, setReviewOpen] = useState(false);

  const contactDetails = [
    { icon: Phone,  text: appConfig.site.phone },
    { icon: Mail,   text: appConfig.site.email },
    { icon: MapPin, text: appConfig.site.address },
  ];

  return (
    <>
    <footer className="bg-green-50 dark:bg-[#050505] border-t border-green-100 dark:border-[#111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-btn-green group-hover:shadow-btn-green-lg transition-all duration-300">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-baseline leading-none select-none">
                  <span className="font-display font-bold text-xl tracking-tight text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-green-500">
                    RD
                  </span>
                  <span className="font-display font-medium text-xl tracking-tight ml-1.5 text-gray-500 dark:text-gray-300 transition-colors duration-300 group-hover:text-green-400">
                    Heights
                  </span>
                </div>
                <span className="block text-green-600 dark:text-green-400 text-[9px] font-semibold tracking-[0.2em] uppercase leading-none mt-0.5">
                  {appConfig.site.tagline}
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-500 leading-relaxed mb-5 max-w-xs">
              {appConfig.site.defaultDescription}
            </p>
            <div className="space-y-2.5">
              {contactDetails.map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-gray-500">
                  <div className="w-6 h-6 rounded-lg bg-green-100 dark:bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3 h-3 text-green-600 dark:text-green-500" />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-gray-900 dark:text-white font-bold text-sm mb-4 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-green-500 rounded-full" />
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-gray-500 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-green-300 dark:bg-green-700 group-hover:bg-green-500 transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Review CTA strip */}
        <div className="py-4 border-t border-green-100 dark:border-[#111] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((s) => <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Had a great experience? <span className="font-semibold text-gray-700 dark:text-gray-300">Let others know.</span>
            </p>
          </div>
          <button
            onClick={() => setReviewOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-green-200 dark:border-green-800/50 bg-white dark:bg-green-900/10 text-green-700 dark:text-green-400 text-xs font-semibold hover:bg-green-600 hover:text-white hover:border-green-600 dark:hover:bg-green-600 dark:hover:text-white dark:hover:border-green-600 transition-all flex-shrink-0 group"
          >
            <PenLine className="w-3.5 h-3.5" />
            Write a Review
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="pt-5 border-t border-green-100 dark:border-[#111] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            © {new Date().getFullYear()} {appConfig.site.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-white dark:bg-[#111] border border-green-200 dark:border-[#1f1f1f] flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-white hover:bg-green-600 hover:border-green-600 dark:hover:text-green-400 dark:hover:border-green-500/40 shadow-green-sm dark:shadow-none hover:shadow-green transition-all duration-200"
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
