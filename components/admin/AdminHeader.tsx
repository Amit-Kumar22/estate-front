'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggle from '@/components/common/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User, Settings, ExternalLink, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  '/admin':            { title: 'Dashboard',   subtitle: 'Overview of your real estate platform' },
  '/admin/projects':   { title: 'Projects',    subtitle: 'Manage and track all property listings' },
  '/admin/gallery':    { title: 'Gallery',     subtitle: 'Upload and organise project images' },
  '/admin/awards':     { title: 'Awards',      subtitle: 'Showcase company awards and accolades' },
  '/admin/leads':      { title: 'Leads',       subtitle: 'Track and manage enquiries from visitors' },
  '/admin/users':      { title: 'Admin Users', subtitle: 'Manage admin accounts and permissions' },
  '/admin/settings':   { title: 'Settings',    subtitle: 'Configure company details and preferences' },
};

export default function AdminHeader() {
  const pathname = usePathname();
  const router   = useRouter();
  const { admin, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const meta = pageMeta[pathname] ?? { title: 'Admin Panel', subtitle: 'Manage your real estate platform' };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/');          // ← redirect to home page
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-emerald-100 via-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:via-[#0a0a0a] dark:to-[#0a0a0a] backdrop-blur-md border-b border-emerald-200 dark:border-[#1f1f1f] px-6 py-1">
      <div className="flex items-center justify-between">

        {/* Left — Page title + subtitle */}
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{meta.title}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{meta.subtitle}</p>
        </div>

        {/* Right — Theme toggle + profile dropdown */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Divider */}
          <div className="w-px h-8 bg-gray-200 dark:bg-[#2a2a2a]" />

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 hover:bg-emerald-50 dark:hover:bg-white/5 transition-all"
            >
              {/* Name + role */}
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                  {admin?.name || 'Admin'}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 capitalize">
                  {admin?.role?.replace('_', ' ') || 'Administrator'}
                </p>
              </div>
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30 flex-shrink-0">
                {admin?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown menu */}
            {open && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-[#141414] border border-gray-100 dark:border-[#2a2a2a] shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden z-50">

                {/* User info header */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-[#2a2a2a] bg-emerald-50/60 dark:bg-emerald-500/5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {admin?.name?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{admin?.name}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{admin?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-1.5">
                  <Link
                    href="/admin/settings"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    Settings
                  </Link>
                  <Link
                    href="/"
                    target="_blank"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                    View Site
                  </Link>
                </div>

                {/* Logout */}
                <div className="p-1.5 border-t border-gray-100 dark:border-[#2a2a2a]">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
