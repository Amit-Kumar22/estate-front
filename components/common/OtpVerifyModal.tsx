'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Lock, Eye, Loader2, Mail, Phone, User,
  ShieldCheck, ArrowLeft, Send, X, CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { reviewService } from '@/lib/api/review.service';
import { leadApi } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';

export interface OtpVerifyModalProps {
  projectId: string;
  projectName: string;
  source: 'project_detail' | 'brochure';
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  onClose: () => void;
  onSuccess: (data: { brochureUrl?: string }) => void;
}

type Step = 'details' | 'otp';

export default function OtpVerifyModal({
  projectId,
  projectName,
  source,
  title = 'Unlock Full Details',
  subtitle = 'Verify your identity to access complete project information.',
  submitLabel = 'Verify & Unlock',
  onClose,
  onSuccess,
}: OtpVerifyModalProps) {
  const [step, setStep] = useState<Step>('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (cooldownRef.current) clearInterval(cooldownRef.current); }, []);

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
    if (!name.trim() || name.trim().length < 2) {
      toast.error('Please enter your name (at least 2 characters).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!/^[+\d\s-]{10,15}$/.test(mobile)) {
      toast.error('Please enter a valid mobile number.');
      return;
    }
    setLoading(true);
    try {
      await reviewService.sendOTP(email);
      toast.success('Verification code sent to your email.');
      setStep('otp');
      startResendCooldown();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Failed to send code. Please try again.'));
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

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) { toast.error('Enter the complete 6-digit code.'); return; }
    setLoading(true);
    try {
      await reviewService.verifyOTP(email, otpValue);

      // Save lead to backend
      const res = await leadApi.create({
        name: name.trim(),
        email,
        mobile,
        source,
        projectId,
      });

      const brochureUrl = (res.data as { data?: { brochureUrl?: string } })?.data?.brochureUrl;

      const successMsg = source === 'brochure'
        ? 'Verified! Your brochure is ready.'
        : 'Verified! Full project details unlocked.';
      toast.success(successMsg);
      onSuccess({ brochureUrl });
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Incorrect code. Please try again.'));
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
    } catch (err) { toast.error(getErrorMessage(err, 'Failed to resend code.')); }
    finally { setLoading(false); }
  };

  const inputCls =
    'w-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all text-sm rounded-xl';
  const btnCls =
    'w-full py-2.5 bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full sm:max-w-sm bg-white dark:bg-[#0f0f0f] rounded-t-2xl sm:rounded-2xl shadow-2xl border-t border-gray-100 dark:border-white/[0.06] sm:border max-h-[92vh] flex flex-col overflow-hidden">

        {/* Top accent */}
        <div className="h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600 flex-shrink-0" />

        <div className="overflow-y-auto flex-1 px-4 pt-4 pb-5">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Lock className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{title}</p>
                <p className="text-[10px] text-gray-400">{projectName}</p>
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
          <div className="flex items-center mb-4">
            {[{ label: 'Details', icon: User }, { label: 'Verify', icon: ShieldCheck }].map((s, i) => {
              const done = (step === 'otp' && i === 0);
              const active = (step === 'details' && i === 0) || (step === 'otp' && i === 1);
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
                  {i === 0 && (
                    <div className={`flex-1 h-px mx-1.5 mb-3 rounded-full ${step === 'otp' ? 'bg-green-400' : 'bg-gray-200 dark:bg-white/10'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* ── Step 1: Details ── */}
          {step === 'details' && (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Your details</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
              </div>

              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name *"
                  className={`${inputCls} pl-9 pr-3 py-2.5`}
                  autoFocus
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                  placeholder="Email Address *"
                  className={`${inputCls} pl-9 pr-3 py-2.5`}
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Mobile Number *"
                  className={`${inputCls} pl-9 pr-3 py-2.5`}
                />
              </div>

              <button onClick={handleSendOTP} disabled={loading} className={btnCls}>
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {loading ? 'Sending…' : 'Send Verification Code'}
              </button>

              <p className="text-[11px] text-gray-400 text-center">We respect your privacy. No spam, ever.</p>
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

              <button
                onClick={handleVerify}
                disabled={loading || otp.join('').length !== 6}
                className={btnCls}
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                {loading ? 'Verifying…' : submitLabel}
              </button>

              <div className="flex items-center justify-between text-xs">
                <button
                  onClick={() => { setStep('details'); setOtp(['', '', '', '', '', '']); }}
                  className="flex items-center gap-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" /> Change details
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
        </div>
      </div>
    </div>
  );
}
