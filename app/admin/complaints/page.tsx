'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MessageSquareWarning, Search, Trash2, Clock, Loader2, CheckCircle,
  Mail, Phone, ChevronLeft, ChevronRight, Eye, ShieldCheck,
} from 'lucide-react';
import { complaintService } from '@/lib/api/complaint.service';
import { Complaint } from '@/types';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/lib/utils';
import Modal from '@/components/common/Modal';

type Status = Complaint['status'];

const STATUS_COLORS: Record<Status, string> = {
  pending:     'bg-gold-100 text-gold-700 dark:bg-gold-500/10 dark:text-gold-400',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  resolved:    'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',
};

const STATUS_ICONS: Record<Status, React.ReactNode> = {
  pending:     <Clock className="w-3 h-3" />,
  in_progress: <Loader2 className="w-3 h-3" />,
  resolved:    <CheckCircle className="w-3 h-3" />,
};

const STATUS_LABELS: Record<Status, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

export default function AdminComplaintsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const limit = 15;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-complaints', search, statusFilter, page],
    queryFn: async () => {
      const res = await complaintService.getAll({ search, status: statusFilter || undefined, page, limit });
      return res.data as {
        data: { complaints: Complaint[] };
        pagination: { total: number; pages: number };
      };
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status, adminNote }: { id: string; status?: Status; adminNote?: string }) =>
      complaintService.updateStatus(id, { status, adminNote }),
    onSuccess: (_data, variables) => {
      toast.success(variables.status ? `Complaint marked ${STATUS_LABELS[variables.status].toLowerCase()}.` : 'Note saved.');
      queryClient.invalidateQueries({ queryKey: ['admin-complaints'] });
      setSelected(null);
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to update complaint.')),
  });

  const deleteComplaint = useMutation({
    mutationFn: (id: string) => complaintService.remove(id),
    onSuccess: () => {
      toast.success('Complaint deleted.');
      setDeleteConfirm(null);
      queryClient.invalidateQueries({ queryKey: ['admin-complaints'] });
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to delete complaint.')),
  });

  const complaints = data?.data?.complaints ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.pages ?? 1;

  const openDetail = (c: Complaint) => {
    setSelected(c);
    setNoteDraft(c.adminNote ?? '');
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Complaints</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Complaints submitted by site visitors — only visible here in the admin panel
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <MessageSquareWarning className="w-4 h-4" />
          {pagination?.total ?? 0} total
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: 'All', value: '' },
          { label: 'Pending', value: 'pending' },
          { label: 'In Progress', value: 'in_progress' },
          { label: 'Resolved', value: 'resolved' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatusFilter(tab.value); setPage(1); }}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              statusFilter === tab.value
                ? 'bg-green-600 text-white shadow-sm'
                : 'bg-white dark:bg-[#111] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#1f1f1f] hover:border-green-300 dark:hover:border-green-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name, email, subject..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#111] text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Loading complaints...</p>
            </div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
            <MessageSquareWarning className="w-10 h-10 opacity-30" />
            <p className="text-sm">No complaints found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[#0d0d0d]">
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Complainant</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Subject</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Date</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#1f1f1f]">
                {complaints.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-4">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-gray-900 dark:text-white">{c.name}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Mail className="w-3 h-3" />
                          {c.email}
                        </div>
                        {c.mobile && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Phone className="w-3 h-3" />
                            {c.mobile}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 max-w-xs">
                      <p className="font-medium text-gray-800 dark:text-gray-200 text-sm mb-0.5">{c.subject}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2">{c.message}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[c.status]}`}>
                        {STATUS_ICONS[c.status]}
                        {STATUS_LABELS[c.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openDetail(c)}
                          title="View complaint"
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20 text-xs font-medium transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(c._id)}
                          title="Delete permanently"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#1f1f1f] text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-green-300 dark:hover:border-green-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#1f1f1f] text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-green-300 dark:hover:border-green-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detail modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Complaint Details" size="sm">
        {selected && (
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{selected.name}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                <Mail className="w-3 h-3" /> {selected.email}
              </div>
              {selected.mobile && (
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <Phone className="w-3 h-3" /> {selected.mobile}
                </div>
              )}
              {selected.emailVerified && (
                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-1.5 font-medium">
                  <ShieldCheck className="w-3 h-3" /> Email verified via OTP
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Subject</p>
              <p className="text-sm text-gray-800 dark:text-gray-200">{selected.subject}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Message</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Status</p>
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus.mutate({ id: selected._id, status: s })}
                    disabled={updateStatus.isPending}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${
                      selected.status === s
                        ? STATUS_COLORS[s]
                        : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Admin Note (internal)</p>
              <textarea
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                rows={3}
                placeholder="Internal notes about this complaint..."
                className="w-full rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[#0d0d0d] px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 resize-none"
              />
              <button
                onClick={() => updateStatus.mutate({ id: selected._id, adminNote: noteDraft })}
                disabled={updateStatus.isPending}
                className="mt-2 w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-all disabled:opacity-60"
              >
                {updateStatus.isPending ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#111] rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-[#1f1f1f]">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Complaint?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              This action cannot be undone. The complaint will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-[#1f1f1f] text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteComplaint.mutate(deleteConfirm)}
                disabled={deleteComplaint.isPending}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-all disabled:opacity-60"
              >
                {deleteComplaint.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
