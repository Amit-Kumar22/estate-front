'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { projectApi } from '@/lib/api';
import ProjectCard from '@/components/project/ProjectCard';
import { Project } from '@/types';

const GATE_KEY = 'project_detail_gate_passed';

export default function FeaturedProjects() {
  const router = useRouter();
  const [gateOpen, setGateOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['featured-projects'],
    queryFn: async () => {
      const res = await projectApi.getFeatured();
      return res.data.data.projects as Project[];
    },
  });

  const projects = data || [];
  const visibleProjects = showAll ? projects : projects.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMore = projects.length > INITIAL_VISIBLE_COUNT;

  const handleToggleShowAll = useCallback(() => {
    setShowAll((prev) => !prev);
  }, []);

  const handleViewAll = useCallback(() => {
    router.push('/projects');
  }, [router]);

  return (
    <section className="section bg-green-50 dark:bg-[#0d0d0d]">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-500/8 border border-green-200 dark:border-green-500/15 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-500" />
            <span className="text-green-700 dark:text-green-400 text-xs font-bold tracking-widest uppercase">
              Our Projects
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Featured Residences
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl mx-auto">
            Explore our handpicked selection of premium properties designed for exceptional living.
          </p>
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-green-50 dark:bg-[#111] rounded-2xl h-64 skeleton border border-green-100 dark:border-[#1f1f1f]" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <AnimatePresence initial={false}>
                {visibleProjects.map((project, i) => (
                  <ProjectCard key={project._id} project={project} index={i % INITIAL_VISIBLE_COUNT} />
                ))}
              </AnimatePresence>
            </div>

            {/* View More / View Less */}
            {hasMore && (
              <div className="mt-8 text-center">
                
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p>No featured projects available at the moment.</p>
          </div>
        )}

        {/* View All */}
        <div className="mt-6 text-center">
          <button onClick={handleViewAll} className="btn-outline">
            View All Projects
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
