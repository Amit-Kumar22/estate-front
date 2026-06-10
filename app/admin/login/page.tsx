'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

// ─── Inner component that uses useSearchParams ────────────────────────────────
// Must be wrapped in <Suspense> in Next.js 15 — without it the page bails out
// and renders nothing.
function LoginForm() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const expired      = searchParams.get('expired') === 'true';

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values.email, values.password);
      toast.success('Welcome back!');
      router.push('/admin');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Invalid credentials. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-[#0a0a0a] dark:via-[#0a0a0a] dark:to-[#0a0a0a] flex items-center justify-center px-4">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-green-400/10 dark:bg-green-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-green-300/10 dark:bg-green-500/3 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-white dark:bg-[#111] rounded-3xl border border-green-100 dark:border-[#1f1f1f] shadow-green-lg dark:shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <p className="text-green-100 text-xs mt-1 font-medium">Real Estate Platform</p>
          </div>

          {/* Form */}
          <div className="p-7">
            {expired && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs mb-5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                Your session expired. Please log in again.
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="admin@example.com"
                    className="w-full bg-green-50 dark:bg-[#1a1a1a] border border-green-200 dark:border-[#2a2a2a] rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                  <input
                    {...register('password')}
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-green-50 dark:bg-[#1a1a1a] border border-green-200 dark:border-[#2a2a2a] rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-500 hover:to-green-600 disabled:opacity-60 transition-all shadow-btn-green hover:shadow-btn-green-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-5">
          Secured Admin Access &bull; Real Estate Platform
        </p>
      </div>
    </div>
  );
}

// ─── Page: wraps LoginForm in Suspense (required by Next.js 15) ───────────────
export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:bg-[#0a0a0a] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
