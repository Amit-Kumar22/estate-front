'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { projectApi } from '@/lib/api';
import ProjectCard from '@/components/project/ProjectCard';
import Modal from '@/components/common/Modal';
import LeadForm from '@/components/common/LeadForm';
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

  const handleViewAll = useCallback(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(GATE_KEY)) {
      router.push('/projects');
    } else {
      setGateOpen(true);
    }
  }, [router]);

  const handleGateSuccess = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(GATE_KEY, '1');
    }
    setGateOpen(false);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-green-50 dark:bg-[#111] rounded-2xl h-72 skeleton border border-green-100 dark:border-[#1f1f1f]" />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {projects.map((project, i) => (
              <ProjectCard key={project._id} project={project} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p>No featured projects available at the moment.</p>
          </div>
        )}

        {/* View All */}
        <div className="mt-10 text-center">
          <button onClick={handleViewAll} className="btn-outline">
            View All Projects
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lead Gate Modal */}
      <Modal
        isOpen={gateOpen}
        onClose={() => setGateOpen(false)}
        title="Get Project Details"
        size="sm"
      >
        <div className="px-5 pb-5">
          <LeadForm
            source="project_detail"
            title=""
            subtitle="Please share your details to explore all our projects."
            submitLabel="View All Projects"
            onSuccess={handleGateSuccess}
          />
        </div>
      </Modal>
    </section>
  );
}
