'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  X, Star, Mail, CheckCircle, Loader2, ArrowLeft,
  ShieldCheck, Send, User, MapPin, Sparkles,
} from 'lucide-react';
import { reviewService } from '@/lib/api/review.service';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/lib/utils';

type Step = 'email' | 'otp' | 'review' | 'done';

interface ReviewFormProps {
  onClose: () => void;
}

const STEP_INDEX: Record<Step, number> = { email: 0, otp: 1, review: 2, done: 3 };
const STAR_LABELS = ['Terrible', 'Poor', 'Average', 'Good', 'Excellent'];
const STAR_COLORS = [
  'fill-red-400 text-red-400',
  'fill-orange-400 text-orange-400',
  'fill-yellow-400 text-yellow-400',
  'fill-amber-400 text-amber-400',
  'fill-gold-500 text-gold-500',
];

export default function ReviewForm({ onClose }: ReviewFormProps) {
  const [step, setStep]               = useState<Step>('email');
  const [email, setEmail]             = useState('');
  const [otp, setOtp]                 = useState(['', '', '', '', '', '']);
  const [reviewToken, setReviewToken] = useState('');
  const [name, setName]               = useState('');
  const [city, setCity]               = useState('');
  const [rating, setRating]           = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText]   = useState('');
  const [loading, setLoading]         = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs     = useRef<(HTMLInputElement | null)[]>([]);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startResendCooldown = useCallback(() => {
    setResendCooldown(60);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((v) => {
        if (v <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return v - 1;
      });
    }, 1000);
  }, []);

  const handleSendOTP = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await reviewService.sendOTP(email);
      toast.success('Code sent to your inbox.');
      setStep('otp');
      startResendCooldown();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Failed to send code. Try again.'));
    } finally { setLoading(false); }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleOTPPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split('')); otpRefs.current[5]?.focus(); }
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) { toast.error('Enter the complete 6-digit code.'); return; }
    setLoading(true);
    try {
      const res = await reviewService.verifyOTP(email, otpValue);
      const token = (res.data as { data: { reviewToken: string } }).data.reviewToken;
      setReviewToken(token);
      setStep('review');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Incorrect code. Try again.'));
    } finally { setLoading(false); }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    try {
      await reviewService.sendOTP(email);
      setOtp(['', '', '', '', '', '']);
      toast.success('New code sent!');
      startResendCooldown();
    } catch (err) { toast.error(getErrorMessage(err, 'Failed to resend.')); }
    finally { setLoading(false); }
  };

  const handleSubmitReview = async () => {
    if (!name.trim())       { toast.error('Please enter your name.'); return; }
    if (rating === 0)       { toast.error('Please select a rating.'); return; }
    if (!reviewText.trim()) { toast.error('Please write your review.'); return; }
    setLoading(true);
    try {
      await reviewService.create({ name, email, city, rating, review: reviewText, reviewToken });
      setStep('done');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Failed to submit. Try again.'));
    } finally { setLoading(false); }
  };

  const activeRating = hoverRating || rating;
  const currentStep  = STEP_INDEX[step];

  const STEPS = [
    { label: 'Email',  icon: Mail },
    { label: 'Verify', icon: ShieldCheck },
    { label: 'Review', icon: Star },
  ];

  const inputCls = 'w-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all text-sm rounded-xl';
  const btnCls   = 'w-full py-2.5 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2';

  return (
    /* Overlay — bottom-sheet on mobile, centered on sm+ */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full sm:max-w-sm bg-white dark:bg-[#0f0f0f] rounded-t-2xl sm:rounded-2xl shadow-2xl border-t border-gray-100 dark:border-white/[0.06] sm:border max-h-[92vh] flex flex-col overflow-hidden">

        {/* Top accent */}
        <div className="h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600 flex-shrink-0" />

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-4 pt-4 pb-5">

          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">Share Your Experience</p>
                <p className="text-[10px] text-gray-400">Helps future homebuyers</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step indicator */}
          {step !== 'done' && (
            <div className="flex items-center mb-4">
              {STEPS.map((s, i) => {
                const done   = i < currentStep;
                const active = i === currentStep;
                return (
                  <React.Fragment key={s.label}>
                    <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        done   ? 'bg-green-500 text-white' :
                        active ? 'bg-green-600 text-white ring-2 ring-green-100 dark:ring-green-900/40' :
                                 'bg-gray-100 dark:bg-white/10 text-gray-400'
                      }`}>
                        {done ? <CheckCircle className="w-3 h-3" /> : <s.icon className="w-3 h-3" />}
                      </div>
                      <span className={`text-[9px] font-medium ${active ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-px mx-1.5 mb-3 rounded-full ${i < currentStep ? 'bg-green-400' : 'bg-gray-200 dark:bg-white/10'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* ── Step 1: Email ── */}
          {step === 'email' && (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Enter your email</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">We&apos;ll send a one-time code to verify it&apos;s you.</p>
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                  placeholder="your@email.com"
                  className={`${inputCls} pl-9 pr-3 py-2.5`}
                  autoFocus
                />
              </div>
              <button onClick={handleSendOTP} disabled={loading} className={btnCls}>
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {loading ? 'Sending…' : 'Send Verification Code'}
              </button>
            </div>
          )}

          {/* ── Step 2: OTP ── */}
          {step === 'otp' && (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Check your inbox</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Code sent to <span className="font-semibold text-gray-700 dark:text-gray-200">{email}</span>
                </p>
              </div>
              <div className="flex gap-2 justify-center" onPaste={handleOTPPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(i, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(i, e)}
                    className={`w-10 h-12 text-center text-xl font-bold rounded-xl border-2 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none transition-all ${
                      digit
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-white/10 focus:border-green-500'
                    }`}
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              <button onClick={handleVerifyOTP} disabled={loading || otp.join('').length !== 6} className={btnCls}>
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                {loading ? 'Verifying…' : 'Verify & Continue'}
              </button>
              <div className="flex items-center justify-between text-xs">
                <button
                  onClick={() => { setStep('email'); setOtp(['','','','','','']); }}
                  className="flex items-center gap-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" /> Change email
                </button>
                <button
                  onClick={handleResendOTP}
                  disabled={resendCooldown > 0 || loading}
                  className="font-medium text-green-600 hover:text-green-700 dark:text-green-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Review ── */}
          {step === 'review' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-900 dark:text-white">Write your review</p>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                  <span className="text-[10px] font-semibold text-green-700 dark:text-green-400">Verified</span>
                </div>
              </div>

              {/* Name + City */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className={`${inputCls} pl-7 pr-2 py-2`}
                      autoFocus
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    City
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className={`${inputCls} pl-7 pr-2 py-2`}
                    />
                  </div>
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2 py-2.5 px-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-125 active:scale-110"
                      >
                        <Star className={`w-7 h-7 transition-all duration-100 ${
                          star <= activeRating
                            ? STAR_COLORS[activeRating - 1]
                            : 'fill-gray-200 text-gray-200 dark:fill-white/10 dark:text-white/10'
                        }`} />
                      </button>
                    ))}
                  </div>
                  {activeRating > 0 && (
                    <span className={`text-xs font-semibold ml-1 ${activeRating >= 4 ? 'text-green-600 dark:text-green-400' : activeRating >= 3 ? 'text-yellow-600' : 'text-red-500'}`}>
                      {STAR_LABELS[activeRating - 1]}
                    </span>
                  )}
                </div>
              </div>

              {/* Review text */}
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Your Experience <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with us…"
                  rows={3}
                  maxLength={1000}
                  className={`${inputCls} px-3 py-2 resize-none leading-relaxed`}
                />
                <div className="flex justify-end mt-0.5">
                  <span className={`text-[10px] ${reviewText.length > 900 ? 'text-orange-500' : 'text-gray-400'}`}>
                    {reviewText.length}/1000
                  </span>
                </div>
              </div>

              <button onClick={handleSubmitReview} disabled={loading} className={btnCls}>
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {loading ? 'Submitting…' : 'Submit Review'}
              </button>
            </div>
          )}

          {/* ── Step 4: Done ── */}
          {step === 'done' && (
            <div className="flex flex-col items-center text-center py-2 gap-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-green-500" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold-400 rounded-full flex items-center justify-center text-[10px]">★</div>
              </div>
              <div>
                <p className="text-base font-bold text-gray-900 dark:text-white">Thank You!</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs leading-relaxed">
                  Your review is pending approval and will appear once verified.
                </p>
              </div>
              <div className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-left space-y-1">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= rating ? 'fill-gold-400 text-gold-400' : 'fill-gray-200 text-gray-200 dark:fill-white/10 dark:text-white/10'}`} />
                  ))}
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">&ldquo;{reviewText}&rdquo;</p>
                <p className="text-[10px] text-gray-400">— {name}{city ? `, ${city}` : ''}</p>
              </div>
              <button onClick={onClose} className={btnCls}>Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
