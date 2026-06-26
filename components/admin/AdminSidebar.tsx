'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Building2, ImageIcon, Trophy, Users2,
  Settings, LogOut, Menu, X, HelpCircle, Leaf, FileBarChart, Sparkles, BookOpen, Star,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const navGroups = [
  {
    label: 'MAIN',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true as const },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { label: 'Projects',        href: '/admin/projects',        icon: Building2,     exact: false as const },
      { label: 'Gallery',         href: '/admin/gallery',         icon: ImageIcon,     exact: false as const },
      { label: 'Awards',          href: '/admin/awards',          icon: Trophy,        exact: false as const },
      { label: 'Why Choose Us',   href: '/admin/why-choose-us',   icon: Sparkles,      exact: false as const },
      { label: 'Blogs',           href: '/admin/blogs',           icon: BookOpen,      exact: false as const },
      { label: 'Leads',           href: '/admin/leads',           icon: Users2,        exact: false as const },
      { label: 'Reviews',         href: '/admin/reviews',         icon: Star,          exact: false as const },
      { label: 'Users',           href: '/admin/users',           icon: FileBarChart,  exact: false as const },
      { label: 'Settings',        href: '/admin/settings',        icon: Settings,      exact: false as const },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
      toast.success('Logged out successfully');
    } catch {
      toast.error('Logout failed');
    }
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div
      className="flex flex-col h-full overflow-y-auto [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none' }}
    >

      {/* ── Logo ───────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-200 dark:shadow-emerald-900/30 flex-shrink-0">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Real Estate</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Admin Panel</p>
        </div>
      </div>

      {/* ── Nav Groups ─────────────────────────────────── */}
      <nav className="flex-1 px-3 pb-2 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase px-3 mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      active
                        ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-white/5 hover:text-emerald-700 dark:hover:text-white'
                    }`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {active && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 flex-shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Sign Out ────────────────────────────────────── */}
      <div className="px-3 pb-5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 bg-emerald-50/80 dark:bg-[#0d0d0d] border-r border-emerald-100 dark:border-[#1f1f1f] flex-col fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white dark:bg-[#111] border border-emerald-100 dark:border-[#1f1f1f] text-gray-600 dark:text-gray-400 shadow-sm"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-56 bg-emerald-50/80 dark:bg-[#0d0d0d] border-r border-emerald-100 dark:border-[#1f1f1f] flex flex-col shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-500 hover:text-gray-700 dark:hover:text-white shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
