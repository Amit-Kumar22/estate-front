'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';
import { DashboardData } from '@/types';
import { formatRelativeDate } from '@/lib/utils';
import {
  Building2, Users2, TrendingUp, Download,
  MessageSquare, Unlock, ArrowUpRight,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await dashboardApi.getStats();
      return res.data.data as DashboardData;
    },
    refetchInterval: 60000,
  });

  const stats = data?.stats;

  const statCards = [
    { label: 'Total Projects', value: stats?.totalProjects ?? '-', icon: Building2, color: 'text-gold-500', bg: 'bg-gold-500/10' },
    { label: 'Total Leads', value: stats?.totalLeads ?? '-', icon: Users2, color: 'text-crimson-500', bg: 'bg-crimson-500/10' },
    { label: "Today's Leads", value: stats?.todayLeads ?? '-', icon: TrendingUp, color: 'text-gold-400', bg: 'bg-gold-400/10' },
    { label: 'Brochure Downloads', value: stats?.brochureDownloads ?? '-', icon: Download, color: 'text-crimson-400', bg: 'bg-crimson-400/10' },
    { label: 'Contact Requests', value: stats?.contactRequests ?? '-', icon: MessageSquare, color: 'text-gold-700', bg: 'bg-gold-700/10' },
    { label: 'Content Unlocks', value: stats?.unlockLeads ?? '-', icon: Unlock, color: 'text-crimson-700', bg: 'bg-crimson-700/10' },
  ];

  const COLORS = ['#ad7a00', '#c81e3a', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {statCards.map((card, i) => (
          <div
            key={card.label}
            className="bg-white dark:bg-[#111] rounded-xl p-4 border border-gray-200 dark:border-[#1f1f1f] hover:border-gray-300 dark:hover:border-[#2f2f2f] shadow-sm dark:shadow-none transition-all"
          >
            <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            {isLoading ? (
              <div className="h-6 w-12 skeleton rounded mb-1" />
            ) : (
              <p className="text-xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            )}
            <p className="text-[11px] text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Monthly Leads Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111] rounded-xl p-5 border border-gray-200 dark:border-[#1f1f1f] shadow-sm dark:shadow-none">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Monthly Leads</h3>
          {isLoading ? (
            <div className="h-56 skeleton rounded" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data?.monthlyLeads || []} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }}
                />
                <Bar dataKey="count" fill="#f0b400" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Project-wise Leads Pie */}
        <div className="bg-white dark:bg-[#111] rounded-xl p-5 border border-gray-200 dark:border-[#1f1f1f] shadow-sm dark:shadow-none">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Leads by Project</h3>
          {isLoading ? (
            <div className="h-56 skeleton rounded" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data?.projectWiseLeads || []}
                  dataKey="count"
                  nameKey="project"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={10}
                >
                  {(data?.projectWiseLeads || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden shadow-sm dark:shadow-none">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-[#1f1f1f] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Leads</h3>
          <a href="/admin/leads" className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1">
            View All <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1a1a1a]">
                {['Name', 'Mobile', 'Email', 'Source', 'Project', 'Date'].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-gray-100 dark:border-[#1a1a1a]">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-3 skeleton rounded w-20" />
                        </td>
                      ))}
                    </tr>
                  ))
                : (data?.recentLeads || []).map((lead) => (
                    <tr key={lead._id} className="border-t border-gray-100 dark:border-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">{lead.name}</td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{lead.mobile}</td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{lead.email}</td>
                      <td className="px-4 py-3">
                        <span className={`badge text-[10px] capitalize ${
                          lead.source === 'contact' ? 'badge-red' :
                          lead.source === 'brochure' ? 'badge-yellow' : 'badge-gray'
                        }`}>
                          {lead.source.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                        {(lead.project as { name: string } | null | undefined)?.name || lead.projectName || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                        {formatRelativeDate(lead.createdAt)}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
