'use client';

import { useState } from 'react';
import { Star, PenLine } from 'lucide-react';
import ReviewForm from '@/components/home/ReviewForm';

interface WriteReviewButtonProps {
  variant?: 'navbar' | 'footer' | 'sidebar';
}

export default function WriteReviewButton({ variant = 'navbar' }: WriteReviewButtonProps) {
  const [open, setOpen] = useState(false);

  if (variant === 'sidebar') {
    return (
      <>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 rounded-xl border border-green-100 dark:border-green-800/30 p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-xs font-semibold text-green-700 dark:text-green-400">Share Your Experience</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
            Visited or bought through us? Your review helps other homebuyers make confident decisions.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white text-sm font-semibold transition-all shadow-md shadow-green-200 dark:shadow-green-900/30"
          >
            <PenLine className="w-4 h-4" />
            Write a Review
          </button>
        </div>
        {open && <ReviewForm onClose={() => setOpen(false)} />}
      </>
    );
  }

  if (variant === 'footer') {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-green-200 dark:border-green-800/50 bg-white dark:bg-green-900/10 text-green-700 dark:text-green-400 text-xs font-semibold hover:bg-green-600 hover:text-white hover:border-green-600 dark:hover:bg-green-600 dark:hover:text-white dark:hover:border-green-600 transition-all group"
        >
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 group-hover:fill-white group-hover:text-white transition-colors" />
          Write a Review
        </button>
        {open && <ReviewForm onClose={() => setOpen(false)} />}
      </>
    );
  }

  // navbar variant
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border border-green-200 dark:border-green-700/40 text-green-700 dark:text-green-400 hover:bg-green-600 hover:text-white hover:border-green-600 dark:hover:bg-green-600 dark:hover:text-white dark:hover:border-green-600 transition-all group"
      >
        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 group-hover:fill-white group-hover:text-white transition-colors" />
        Review
      </button>
      {open && <ReviewForm onClose={() => setOpen(false)} />}
    </>
  );
}
