'use client';

import React from 'react';
import { Project } from '@/types';
import { MapPin, Calendar, CheckCircle2, IndianRupee } from 'lucide-react';
import { getStatusColor, getStatusLabel } from '@/lib/utils';

interface ProjectOverviewProps {
  project: Project;
  hideConfiguration?: boolean;
}

export default function ProjectOverview({ project, hideConfiguration = false }: ProjectOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Title & Status */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`badge ${getStatusColor(project.status)}`}>
            {getStatusLabel(project.status)}
          </span>
          {project.featured && (
            <span className="badge bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
              ★ Featured
            </span>
          )}
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {project.name}
        </h1>
        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm">
          <MapPin className="w-3.5 h-3.5 text-green-500" />
          {project.location}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Starting Price', value: project.price, color: 'text-green-400' },
          { label: 'Possession', value: project.possessionDate || 'TBA' },
          { label: 'Status', value: getStatusLabel(project.status) },
          { label: 'Location', value: project.location.split(',')[0] },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-50 dark:bg-[#111] rounded-xl p-3 border border-gray-100 dark:border-[#1f1f1f]"
          >
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className={`text-sm font-semibold ${stat.color || 'text-gray-900 dark:text-white'} line-clamp-1`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Description */}
      <div>
        <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-3">
          About the Project
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Highlights */}
      {project.highlights?.length > 0 && (
        <div>
          <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-3">
            Key Highlights
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {project.highlights.map((highlight, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                {highlight}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Configuration Table */}
      {!hideConfiguration && project.configuration?.length > 0 && (
        <div>
          <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-3">
            Configuration & Pricing
          </h2>
          <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-[#1f1f1f]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#1a1a1a]">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Area
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {project.configuration.map((config, i) => (
                  <tr
                    key={i}
                    className={`border-t border-gray-50 dark:border-[#1f1f1f] ${
                      i % 2 === 0 ? 'bg-white dark:bg-[#111]' : 'bg-gray-50/50 dark:bg-[#0f0f0f]'
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{config.type}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{config.area}</td>
                    <td className="px-4 py-3 text-green-400 font-semibold">{config.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
