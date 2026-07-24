'use client';

import { useState } from 'react';
import { Star, Quote, BadgeCheck, PenLine, MessageSquare, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { reviewService, PublicReview } from '@/lib/api/review.service';
import ReviewForm from './ReviewForm';

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'w-4 h-4' : 'w-3 h-3';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`${cls} ${star <= rating ? 'fill-gold-400 text-gold-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'}`} />
      ))}
    </div>
  );
}

function ReviewModal({ item, onClose }: { item: PublicReview; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-sm bg-white dark:bg-[#111] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">

        {/* accent */}
        <div className="h-0.5 bg-gradient-to-r from-green-400 to-green-500" />

        <div className="p-4">
          {/* close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* profile */}
          <div className="flex items-center gap-2.5 mb-3 pr-6">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white font-bold text-sm">{item.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">{item.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {item.city && <span className="text-[11px] text-gray-400">{item.city}</span>}
                <span className="inline-flex items-center gap-0.5 text-[10px] text-green-600 dark:text-green-400 font-medium">
                  <BadgeCheck className="w-3 h-3" />
                  Verified Buyer
                </span>
              </div>
            </div>
          </div>

          {/* rating + date */}
          <div className="flex items-center justify-between mb-3">
            <StarRating rating={item.rating} size="md" />
            {item.createdAt && (
              <span className="text-[10px] text-gray-400">
                {new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>

          {/* full review */}
          <div className="relative">
            <Quote className="absolute -top-1 -left-0.5 w-5 h-5 text-green-100 dark:text-green-900/50" />
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-5">
              {item.review}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#111] rounded-xl p-3 border border-gray-100 dark:border-[#1f1f1f] shadow-sm animate-pulse w-full sm:w-52">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-white/10 flex-shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="h-2.5 w-20 bg-gray-200 dark:bg-white/10 rounded-full" />
          <div className="h-2 w-12 bg-gray-200 dark:bg-white/10 rounded-full" />
        </div>
      </div>
      <div className="flex gap-0.5 mb-2">
        {[...Array(5)].map((_, i) => <div key={i} className="w-3 h-3 rounded bg-gray-200 dark:bg-white/10" />)}
      </div>
      <div className="space-y-1.5">
        <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full w-full" />
        <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full w-4/5" />
        <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full w-3/5" />
      </div>
    </div>
  );
}

function ReviewCard({ item, featured, onClick }: { item: PublicReview; featured?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative text-left bg-white dark:bg-[#111] rounded-xl p-3 border border-green-100 dark:border-[#1f1f1f] shadow-sm hover:shadow-md hover:border-green-300 dark:hover:border-green-800 transition-all w-full sm:w-52 cursor-pointer group"
    >
      <Quote className="absolute top-3 right-3 w-5 h-5 text-green-100 dark:text-green-900/40 group-hover:text-green-200 dark:group-hover:text-green-800/60 transition-colors" />

      {featured && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
          <span className="px-2.5 py-0.5 rounded-full bg-green-600 text-white text-[10px] font-semibold tracking-wide shadow-sm whitespace-nowrap">
            Featured
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xs">{item.name.charAt(0).toUpperCase()}</span>
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-xs text-gray-900 dark:text-white truncate">{item.name}</h4>
          {item.city && <p className="text-[10px] text-gray-400 leading-none">{item.city}</p>}
          <div className="inline-flex items-center gap-0.5 text-[10px] text-green-600 dark:text-green-400 font-medium">
            <BadgeCheck className="w-2.5 h-2.5" />
            Verified
          </div>
        </div>
      </div>

      <StarRating rating={item.rating} />

      <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed mt-2 line-clamp-3">
        &ldquo;{item.review}&rdquo;
      </p>

      {item.review.length > 120 && (
        <p className="text-[10px] text-green-600 dark:text-green-400 font-medium mt-1.5">Read more →</p>
      )}
    </button>
  );
}

function EmptyState({ onWrite }: { onWrite: () => void }) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12 gap-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
        <MessageSquare className="w-6 h-6 text-green-400" />
      </div>
      <div>
        <p className="font-semibold text-gray-800 dark:text-white text-sm">No reviews yet</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Be the first to share your experience</p>
      </div>
      <button
        onClick={onWrite}
        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md"
      >
        <PenLine className="w-3.5 h-3.5" />
        Write the First Review
      </button>
    </div>
  );
}

export default function TestimonialSection() {
  const [showForm, setShowForm]           = useState(false);
  const [selectedReview, setSelectedReview] = useState<PublicReview | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['public-reviews'],
    queryFn: async () => {
      const res = await reviewService.getPublic();
      return res.data.data.reviews as PublicReview[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const reviews    = data ?? [];
  const hasReviews = reviews.length > 0;
  const avgRating  = hasReviews
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section className="py-10 md:py-14 bg-gradient-to-b from-white via-green-50/60 to-white dark:from-[#0d0d0d] dark:via-[#111] dark:to-[#0d0d0d] overflow-hidden">
      <div className="container-custom">

        {avgRating && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#111] shadow border border-green-100 dark:border-[#1f1f1f]">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => <Star key={s} className="w-3 h-3 fill-gold-400 text-gold-400" />)}
              </div>
              <span className="text-xs font-semibold text-gray-800 dark:text-white">
                {avgRating} / 5 &nbsp;·&nbsp; {reviews.length} verified {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          </div>
        )}

        <div className="text-center mb-6">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
            Every review is from a verified buyer — honest words from real homeowners.
          </p>
        </div>

        {hasReviews && (
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">500+</p>
              <p className="text-[10px] text-gray-500">Families</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{avgRating}★</p>
              <p className="text-[10px] text-gray-500">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">10+</p>
              <p className="text-[10px] text-gray-500">Years</p>
            </div>
          </div>
        )}

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {isLoading ? (
            [0, 1, 2].map((i) => <ReviewCardSkeleton key={i} />)
          ) : !hasReviews ? (
            <EmptyState onWrite={() => setShowForm(true)} />
          ) : (
            reviews.slice(0, 3).map((item, index) => (
              <ReviewCard
                key={item._id}
                item={item}
                featured={index === 1 && reviews.length >= 3}
                onClick={() => setSelectedReview(item)}
              />
            ))
          )}
        </div>

        {!isLoading && hasReviews && (
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-green-200 dark:shadow-green-900/30"
            >
              <PenLine className="w-4 h-4" />
              Write a Review
            </button>
            <p className="text-[10px] text-gray-400">Email verification required</p>
          </div>
        )}
      </div>

      {selectedReview && (
        <ReviewModal item={selectedReview} onClose={() => setSelectedReview(null)} />
      )}
      {showForm && <ReviewForm onClose={() => setShowForm(false)} />}
    </section>
  );
}
