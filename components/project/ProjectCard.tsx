'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, IndianRupee, ArrowRight, Calendar } from 'lucide-react';
import { Project } from '@/types';
import { getImageUrl, getStatusLabel, getStatusColor } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const imageUrl = getImageUrl(project.heroImages?.[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white dark:bg-[#111] rounded-2xl overflow-hidden
        border border-green-100 dark:border-[#1f1f1f]
        shadow-card dark:shadow-none
        hover:shadow-card-hover dark:hover:shadow-xl
        hover:border-green-300 dark:hover:border-green-500/20
        transition-all duration-400 hover:-translate-y-1.5"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge ${getStatusColor(project.status)}`}>
            {getStatusLabel(project.status)}
          </span>
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
              ★ Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-gray-900 dark:text-white text-base mb-1 group-hover:text-green-400 transition-colors duration-200 line-clamp-1">
          {project.name}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mb-2">
          <MapPin className="w-3 h-3 text-green-500 flex-shrink-0" />
          <span className="line-clamp-1">{project.location}</span>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
          {project.shortDescription}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Starting From</p>
            <p className="text-sm font-bold text-green-400">{project.price}</p>
          </div>

          {project.possessionDate && (
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Possession</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="w-3 h-3" />
                {project.possessionDate}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/projects/${project.slug}`}
          className="mt-3 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-semibold
            bg-green-600 text-white hover:bg-green-700
            dark:bg-green-500/8 dark:text-green-400 dark:border dark:border-green-500/20
            dark:hover:bg-green-500/15 dark:hover:border-green-500/40
            shadow-green-sm hover:shadow-green dark:shadow-none dark:hover:shadow-none
            transition-all duration-200"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
