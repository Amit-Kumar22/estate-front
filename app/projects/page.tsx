'use client';

import React, { Suspense, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Building2, X } from 'lucide-react';
import { projectApi } from '@/lib/api';
import { Project } from '@/types';
import ProjectCard from '@/components/project/ProjectCard';
import { queryKeys } from '@/lib/constants/query-keys';
import appConfig from '@/config/app.config';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const STATUS_TABS = [
  { value: '',          label: 'All Projects' },
  { value: 'current',   label: 'Current' },
  { value: 'upcoming',  label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
];

// ─── Inner component that reads search params ─────────────────────────────────
function ProjectsContent() {
  const searchParams  = useSearchParams();
  const initialStatus = searchParams.get('status') ?? '';

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [page,   setPage]   = useState<number>(appConfig.pagination.defaultPage);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.projects.list({ search, status, page }),
    queryFn: async () => {
      const res = await projectApi.getAll({
        search: search || undefined,
        status: (status as 'current' | 'upcoming' | 'completed') || undefined,
        page,
        limit: appConfig.pagination.defaultLimit,
      });
      return res.data.data as { projects: Project[]; total: number; pages: number };
    },
    placeholderData: (prev) => prev,
  });

  const projects   = data?.projects ?? [];
  const totalPages = data?.pages    ?? 1;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatus = (val: string) => {
    setStatus(val);
    setPage(1);
  };

  return (
    <div className="container-custom">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 pt-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 mb-4">
          <Building2 className="w-3.5 h-3.5 text-green-600 dark:text-green-500" />
          <span className="text-green-700 dark:text-green-400 text-xs font-bold tracking-widest uppercase">
            Our Portfolio
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3">
          Explore All Projects
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl mx-auto">
          Discover our carefully crafted residential developments across prime locations.
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by name or location…"
            className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl border border-green-200 dark:border-[#1f1f1f] bg-white dark:bg-[#111] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 shadow-green-sm dark:shadow-none"
          />
          {search && (
            <button
              onClick={() => { setSearch(''); setPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-green-50 dark:bg-[#111] border border-green-200 dark:border-[#1f1f1f]">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => handleStatus(tab.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                status === tab.value
                  ? 'bg-green-600 text-white shadow-green-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      {!isLoading && (
        <p className="text-xs text-gray-400 mb-5">
          Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
          {data?.total ? ` of ${data.total}` : ''}
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl h-64 skeleton" />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={project._id} project={project} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <SlidersHorizontal className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">No projects found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
          <button
            onClick={() => { setSearch(''); setStatus(''); setPage(1); }}
            className="mt-4 text-xs text-green-600 hover:text-green-700 underline underline-offset-2"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 text-xs rounded-xl border border-green-200 dark:border-[#1f1f1f] text-gray-600 dark:text-gray-400 hover:border-green-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 text-xs rounded-xl border transition-all ${
                page === p
                  ? 'bg-green-600 text-white border-green-600 shadow-green-sm'
                  : 'border-green-200 dark:border-[#1f1f1f] text-gray-600 dark:text-gray-400 hover:border-green-500'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 text-xs rounded-xl border border-green-200 dark:border-[#1f1f1f] text-gray-600 dark:text-gray-400 hover:border-green-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Page wrapper: Navbar + Suspense + Footer ─────────────────────────────────
export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16 bg-white dark:bg-[#0a0a0a]">
        <Suspense
          fallback={
            <div className="container-custom pt-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-2xl h-64 skeleton" />
                ))}
              </div>
            </div>
          }
        >
          <ProjectsContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
