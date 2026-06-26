'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Star, Search, CheckCircle, XCircle, Trash2, Clock,
  MessageSquare, Mail, MapPin, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { reviewService, AdminReview } from '@/lib/api/review.service';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending:  'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
  approved: 'bg-green-100  text-green-700  dark:bg-green-500/10  dark:text-green-400',
  rejected: 'bg-red-100    text-red-700    dark:bg-red-500/10    dark:text-red-400',
};

const STATUS_ICONS = {
  pending:  <Clock className="w-3 h-3" />,
  approved: <CheckCircle className="w-3 h-3" />,
  rejected: <XCircle className="w-3 h-3" />,
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${
            s <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
          }`}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const limit = 15;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews', search, statusFilter, page],
    queryFn: async () => {
      const res = await reviewService.getAll({ search, status: statusFilter || undefined, page, limit });
      return res.data as {
        data: { reviews: AdminReview[] };
        pagination: { total: number; pages: number };
      };
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' | 'pending' }) =>
      reviewService.updateStatus(id, status),
    onSuccess: (_data, variables) => {
      toast.success(`Review ${variables.status} successfully.`);
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['public-reviews'] });
    },
    onError: () => toast.error('Failed to update review status.'),
  });

  const deleteReview = useMutation({
    mutationFn: (id: string) => reviewService.remove(id),
    onSuccess: () => {
      toast.success('Review deleted.');
      setDeleteConfirm(null);
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['public-reviews'] });
    },
    onError: () => toast.error('Failed to delete review.'),
  });

  const reviews = data?.data?.reviews ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.pages ?? 1;

  const counts = {
    total: pagination?.total ?? 0,
    pending: reviews.filter((r) => r.status === 'pending').length,
    approved: reviews.filter((r) => r.status === 'approved').length,
    rejected: reviews.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Reviews</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Approve or reject reviews before they go live on the website
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <MessageSquare className="w-4 h-4" />
          {counts.total} total
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: 'All', value: '' },
          { label: 'Pending', value: 'pending' },
          { label: 'Approved', value: 'approved' },
          { label: 'Rejected', value: 'rejected' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatusFilter(tab.value); setPage(1); }}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              statusFilter === tab.value
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-[#111] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#1f1f1f] hover:border-emerald-300 dark:hover:border-emerald-800'
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
          placeholder="Search by name, email, city..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#111] text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Loading reviews...</p>
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
            <MessageSquare className="w-10 h-10 opacity-30" />
            <p className="text-sm">No reviews found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[#0d0d0d]">
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Reviewer</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Review</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Rating</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Date</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#1f1f1f]">
                {reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-4">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-gray-900 dark:text-white">{review.name}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Mail className="w-3 h-3" />
                          {review.email}
                        </div>
                        {review.city && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <MapPin className="w-3 h-3" />
                            {review.city}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 max-w-xs">
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                        &ldquo;{review.review}&rdquo;
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-gray-400 mt-1">{review.rating}/5</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[review.status]}`}>
                        {STATUS_ICONS[review.status]}
                        {review.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {review.status !== 'approved' && (
                          <button
                            onClick={() => updateStatus.mutate({ id: review._id, status: 'approved' })}
                            disabled={updateStatus.isPending}
                            title="Approve — will show on website"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20 text-xs font-medium transition-all disabled:opacity-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Approve
                          </button>
                        )}
                        {review.status === 'approved' && (
                          <button
                            onClick={() => updateStatus.mutate({ id: review._id, status: 'rejected' })}
                            disabled={updateStatus.isPending}
                            title="Deactivate — will hide from website"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-500/20 text-xs font-medium transition-all disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Deactivate
                          </button>
                        )}
                        {review.status === 'pending' && (
                          <button
                            onClick={() => updateStatus.mutate({ id: review._id, status: 'rejected' })}
                            disabled={updateStatus.isPending}
                            title="Reject"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 text-xs font-medium transition-all disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteConfirm(review._id)}
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
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#1f1f1f] text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-emerald-300 dark:hover:border-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#1f1f1f] text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-emerald-300 dark:hover:border-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#111] rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-[#1f1f1f]">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Review?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              This action cannot be undone. The review will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-[#1f1f1f] text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteReview.mutate(deleteConfirm)}
                disabled={deleteReview.isPending}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-all disabled:opacity-60"
              >
                {deleteReview.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
