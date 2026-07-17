'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown, Building2, Home, Image, Award,
  Phone, LogIn, Layers, Star,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/common/ThemeToggle';
import ReviewForm from '@/components/home/ReviewForm';
import appConfig from '@/config/app.config';

const navLinks = [
  { label: 'Home', href: '/', icon: Home },
  {
    label: 'Projects',
    icon: Building2,
    dropdown: [
      { label: 'Current Projects',   href: '/projects?status=current',   icon: Layers },
      { label: 'Upcoming Projects',  href: '/projects?status=upcoming',  icon: Layers },
      { label: 'Completed Projects', href: '/projects?status=completed', icon: Layers },
    ],
  },
  { label: 'Gallery', href: '/gallery', icon: Image },
  { label: 'Awards',  href: '/awards',  icon: Award },
  { label: 'Contact', href: '/contact', icon: Phone },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setActiveDropdown(null);
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const isActive = (href?: string) =>
    href ? pathname === href || pathname.startsWith(href + '/') : false;

  // ── Theme-aware computed classes ────────────────────────────────────────────
  // On the home page the hero has a dark video/gradient behind the navbar so
  // we can start transparent with white text.
  // On every other page the background is white/light, so we must show the
  // solid navbar immediately — otherwise text is invisible.
  const isHomePage = pathname === '/';

  // "solidMode" = navbar should show solid background + dark text
  const solidMode = scrolled || !isHomePage;
  const isLightSolid = solidMode && !isDark;

  const headerClass = solidMode
    ? isDark
      ? 'py-2 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl'
      : 'py-2 bg-white border-b border-green-100 shadow-navbar'
    : 'py-4 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-none'; // transparent with legibility gradient

  const logoTextClass = isLightSolid ? 'text-gray-900' : 'text-white';

  const getLinkClass = (active: boolean) =>
    `px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active
        ? isLightSolid
          ? 'text-green-600 bg-green-50 font-semibold'
          : 'text-green-400 bg-green-500/10'
        : isLightSolid
          ? 'text-gray-700 hover:text-green-600 hover:bg-green-50'
          : 'text-white hover:text-green-300 hover:bg-white/10'
    }`;

  const getDropdownBtnClass = (active: boolean) =>
    `flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active
        ? isLightSolid
          ? 'text-green-600 bg-green-50 font-semibold'
          : 'text-green-400 bg-green-500/10'
        : isLightSolid
          ? 'text-gray-700 hover:text-green-600 hover:bg-green-50'
          : 'text-white hover:text-green-300 hover:bg-white/10'
    }`;

  const dropdownMenuClass = isLightSolid
    ? 'bg-white border border-green-100 shadow-[0_8px_32px_rgba(22,163,74,0.14)]'
    : 'bg-[#111] border border-[#1f1f1f] shadow-2xl';

  const dropdownItemClass = isLightSolid
    ? 'text-gray-700 hover:text-green-600 hover:bg-green-50 border-green-50'
    : 'text-gray-300 hover:text-white hover:bg-green-500/8 border-[#1a1a1a]';

  const mobileMenuClass = isDark
    ? 'bg-[#0a0a0a]/98 backdrop-blur-xl border-b border-white/5'
    : 'bg-white border-b border-green-100 shadow-[0_8px_40px_rgba(22,163,74,0.18)]';

  const getMobileLinkClass = (active: boolean) =>
    `flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      active
        ? isDark
          ? 'text-green-400 bg-green-500/10'
          : 'text-green-600 bg-green-50 font-semibold'
        : isDark
          ? 'text-gray-300 hover:text-white hover:bg-white/5'
          : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
    }`;

  const mobileBtnClass = isDark
    ? 'text-gray-300 hover:text-white hover:bg-white/5'
    : 'text-gray-700 hover:text-green-600 hover:bg-green-50';

  const mobileSubLinkClass = isDark
    ? 'text-gray-400 hover:text-white hover:bg-white/5'
    : 'text-gray-600 hover:text-green-600 hover:bg-green-50';

  const mobileDividerClass = isDark ? 'border-[#1f1f1f]' : 'border-green-100';

  const mobileToggleClass = isLightSolid
    ? 'text-gray-700 hover:text-green-600 hover:bg-green-100'
    : 'text-white hover:text-green-300 hover:bg-white/10';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerClass}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-btn-green group-hover:shadow-btn-green-lg transition-all duration-300 group-hover:-translate-y-0.5">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-baseline leading-none select-none">
                <span className={`font-display font-bold text-xl tracking-tight transition-colors duration-300 group-hover:text-green-500 ${logoTextClass}`}>
                  RD Eco
                </span>
                <span className={`font-display font-medium text-xl tracking-tight ml-1.5 transition-colors duration-300 group-hover:text-green-400 ${isLightSolid ? 'text-gray-500' : 'text-gray-300'}`}>
                  Developers
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5" ref={dropdownRef}>
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div key={link.label} className="relative">
                    <button
                      onClick={() =>
                        setActiveDropdown(activeDropdown === link.label ? null : link.label)
                      }
                      className={getDropdownBtnClass(activeDropdown === link.label)}
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          activeDropdown === link.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className={`absolute top-full left-0 mt-2 w-52 rounded-2xl overflow-hidden ${dropdownMenuClass}`}
                        >
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`flex items-center gap-2.5 px-4 py-3 text-sm transition-all duration-150 border-b last:border-0 ${dropdownItemClass}`}
                            >
                              <item.icon className="w-3.5 h-3.5 text-green-500" />
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href!}
                    className={getLinkClass(isActive(link.href))}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {/* Write a Review — desktop */}
              <button
                onClick={() => setReviewOpen(true)}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all group ${
                  isLightSolid
                    ? 'border-green-200 text-green-700 hover:bg-green-600 hover:text-white hover:border-green-600'
                    : 'border-green-700/40 text-green-400 hover:bg-green-600 hover:text-white hover:border-green-600'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 group-hover:fill-white group-hover:text-white transition-colors" />
                Review
              </button>
              {/* Desktop: Login or Dashboard based on auth state */}
              {isAuthenticated ? (
                <Link
                  href="/admin"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-500 hover:to-green-600 transition-all duration-200 shadow-btn-green hover:shadow-btn-green-lg hover:-translate-y-0.5"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/admin/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-500 hover:to-green-600 transition-all duration-200 shadow-btn-green hover:shadow-btn-green-lg hover:-translate-y-0.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Login
                </Link>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2 rounded-lg transition-all ${mobileToggleClass}`}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-0 left-0 right-0 z-40 pt-20 pb-6 overflow-hidden ${mobileMenuClass}`}
          >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 space-y-1">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div key={link.label}>
                    <button
                      onClick={() =>
                        setActiveDropdown(activeDropdown === link.label ? null : link.label)
                      }
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${mobileBtnClass}`}
                    >
                      <span className="flex items-center gap-2.5">
                        <link.icon className="w-4 h-4 text-green-500" />
                        {link.label}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          activeDropdown === link.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-4 mt-1 space-y-0.5 overflow-hidden"
                        >
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all ${mobileSubLinkClass}`}
                            >
                              <item.icon className="w-3.5 h-3.5 text-green-500" />
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href!}
                    className={getMobileLinkClass(isActive(link.href))}
                  >
                    <link.icon className="w-4 h-4 text-green-500" />
                    {link.label}
                  </Link>
                )
              )}
              <div className={`pt-3 border-t ${mobileDividerClass} space-y-2`}>
                <button
                  onClick={() => { setMobileOpen(false); setReviewOpen(true); }}
                  className={`flex items-center gap-2.5 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${getMobileLinkClass(false)}`}
                >
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  Write a Review
                </button>
                {isAuthenticated ? (
                  <Link
                    href="/admin"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-600 to-green-700 text-white shadow-btn-green"
                  >
                    <Building2 className="w-4 h-4" />
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/admin/login"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-600 to-green-700 text-white shadow-btn-green"
                  >
                    <LogIn className="w-4 h-4" />
                    Admin Login
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {reviewOpen && <ReviewForm onClose={() => setReviewOpen(false)} />}
    </>
  );
}
