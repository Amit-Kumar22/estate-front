'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '@/lib/api';
import { Project } from '@/types';
import { Plus, Edit2, Trash2, MapPin, Star, Eye, Search, Building2 } from 'lucide-react';
import Link from 'next/link';
import { getStatusColor, getStatusLabel, formatDate, getImageUrl, getErrorMessage } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminProjectsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-projects', search, status],
    queryFn: async () => {
      const res = await projectApi.getAll({ search: search || undefined, status: (status as 'current' | 'upcoming' | 'completed') || undefined, limit: 50 });
      return res.data.data.projects as Project[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast.success('Project deleted successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to delete project')),
  });

  const handleDelete = (project: Project) => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      deleteMutation.mutate(project._id);
    }
  };

  const projects = data || [];

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">All Projects</h2>
          <p className="text-xs text-gray-500">{projects.length} total projects</p>
        </div>
        <Link
          href="/admin/projects/create"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-500 hover:to-green-600 transition-all shadow-lg shadow-green-500/20"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1f1f1f] rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1f1f1f] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
        >
          <option value="">All Status</option>
          <option value="current">Current</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden shadow-sm dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1a1a1a]">
                {['Project', 'Location', 'Price', 'Status', 'Featured', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-gray-100 dark:border-[#1a1a1a]">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-3.5 skeleton rounded w-24" />
                        </td>
                      ))}
                    </tr>
                  ))
                : projects.map((project) => (
                    <tr key={project._id} className="border-t border-gray-100 dark:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {project.heroImages?.[0] && (
                            <div
                              className="w-10 h-10 rounded-lg bg-cover bg-center flex-shrink-0"
                              style={{ backgroundImage: `url(${getImageUrl(project.heroImages[0])})` }}
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-xs">{project.name}</p>
                            <p className="text-[10px] text-gray-500">/{project.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-gray-400 text-xs whitespace-nowrap">
                          <MapPin className="w-3 h-3 text-green-500 flex-shrink-0" />
                          {project.location}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-green-400 font-medium text-xs whitespace-nowrap">
                        {project.price}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge text-[10px] ${getStatusColor(project.status)}`}>
                          {getStatusLabel(project.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {project.featured && (
                          <Star className="w-3.5 h-3.5 text-crimson-400 fill-crimson-400" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {formatDate(project.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/projects/${project.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gold-400 hover:bg-gold-500/10 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/admin/projects/${project._id}/edit`}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-green-400 hover:bg-green-500/10 transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(project)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>

          {!isLoading && projects.length === 0 && (
            <div className="py-16 text-center text-gray-500">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No projects found</p>
              <Link href="/admin/projects/create" className="text-xs text-green-400 hover:underline mt-1 inline-block">
                Create your first project
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
