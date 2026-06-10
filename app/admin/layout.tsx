'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();

  // The login page lives inside /admin/ folder but must NOT be auth-gated.
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return;          // never redirect from the login page itself
    if (!isLoading && !isAuthenticated) {
      router.push('/');               // ← unauthenticated → go to home page
    }
  }, [isAuthenticated, isLoading, router, isLoginPage]);

  // Login page: render children directly — no sidebar, no auth guard
  if (isLoginPage) return <>{children}</>;

  // All other admin pages: show spinner while auth is resolving
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-700 animate-pulse" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated + not login page — hide content while redirect fires
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 md:pl-56">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

