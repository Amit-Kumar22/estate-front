'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { leadApi } from '@/lib/api';
import { Lead } from '@/types';
import { Search, Download, Trash2, Filter, User, Phone, Mail } from 'lucide-react';
import { formatDate, formatRelativeDate } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function AdminLeadsPage() {
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-leads', search, source, page],
    queryFn: async () => {
      const res = await leadApi.getAll({ search: search || undefined, source: source || undefined, page, limit: 20 });
      return { leads: res.data.data.leads as Lead[], pagination: res.data.pagination };
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      toast.success('Lead deleted');
    },
    onError: () => toast.error('Failed to delete lead'),
  });

  const handleExport = async () => {
    try {
      const res = await leadApi.exportCSV({ source: source || undefined });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV exported');
    } catch {
      toast.error('Export failed');
    }
  };

  const leads = data?.leads || [];
  const pagination = data?.pagination;

  const sourceOptions = [
    { value: '', label: 'All Sources' },
    { value: 'contact', label: 'Contact' },
    { value: 'brochure', label: 'Brochure' },
    { value: 'unlock_content', label: 'Unlock Content' },
  ];

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Leads</h2>
          <p className="text-xs text-gray-500">{pagination?.total || 0} total leads</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-all"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, or mobile..."
            className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1f1f1f] rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
          />
        </div>
        <select
          value={source}
          onChange={(e) => { setSource(e.target.value); setPage(1); }}
          className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1f1f1f] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
        >
          {sourceOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden shadow-sm dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1a1a1a]">
                {['Name', 'Mobile', 'Email', 'Source', 'Project', 'Date', ''].map((h, i) => (
                  <th key={i} className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-t border-gray-100 dark:border-[#1a1a1a]">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-3.5 skeleton rounded w-24" />
                        </td>
                      ))}
                    </tr>
                  ))
                : leads.map((lead) => (
                    <tr key={lead._id} className="border-t border-gray-100 dark:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 text-xs font-bold flex-shrink-0">
                            {lead.name[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white text-xs whitespace-nowrap">{lead.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{lead.mobile}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{lead.email}</td>
                      <td className="px-4 py-3">
                        <span className={`badge text-[10px] capitalize ${
                          lead.source === 'contact' ? 'badge-green' :
                          lead.source === 'brochure' ? 'badge-blue' :
                          'bg-orange-500/10 text-orange-400 border-orange-500/20'
                        }`}>
                          {lead.source.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {(lead.project as { name: string } | null | undefined)?.name || lead.projectName || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {formatRelativeDate(lead.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this lead?')) {
                              deleteMutation.mutate(lead._id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>

          {!isLoading && leads.length === 0 && (
            <div className="py-16 text-center text-gray-500">
              <User className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No leads found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-[#1a1a1a] flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, pagination.total)} of {pagination.total}
            </p>
            <div className="flex gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded text-xs border border-gray-200 dark:border-[#2a2a2a] text-gray-500 dark:text-gray-400 hover:border-green-500/30 hover:text-green-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="px-3 py-1 rounded text-xs border border-gray-200 dark:border-[#2a2a2a] text-gray-500 dark:text-gray-400 hover:border-green-500/30 hover:text-green-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
