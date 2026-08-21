'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User, Phone, Mail, MessageSquare, Tag, Loader2, CheckCircle2,
  ShieldCheck, ArrowLeft, Send,
} from 'lucide-react';
import { complaintApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  mobile: z
    .string()
    .optional()
    .refine((v) => !v || /^[+\d\s-]{10,15}$/.test(v), 'Enter a valid mobile number'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(150, 'Subject is too long'),
  message: z.string().min(10, 'Please describe your complaint in at least 10 characters').max(2000, 'Message is too long'),
});

type FormValues = z.infer<typeof schema>;
type Step = 'details' | 'otp' | 'done';

interface ComplaintFormProps {
  onSuccess?: () => void;
}

export default function ComplaintForm({ onSuccess }: ComplaintFormProps) {
  const [step, setStep] = useState<Step>('details');
  const [details, setDetails] = useState<FormValues | null>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (cooldownRef.current) clearInterval(cooldownRef.current); }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const startResendCooldown = useCallback(() => {
    setResendCooldown(60);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((v) => {
        if (v <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return v - 1;
      });
    }, 1000);
  }, []);

  const onSubmitDetails = async (values: FormValues) => {
    try {
      await complaintApi.sendOTP(values.email);
      setDetails(values);
      setOtp(['', '', '', '', '', '']);
      setStep('otp');
      startResendCooldown();
      toast.success('Verification code sent to your email.');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to send code. Please try again.'));
    }
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

  const handleVerifyAndSubmit = async () => {
    if (!details) return;
    const otpValue = otp.join('');
    if (otpValue.length !== 6) { toast.error('Enter the complete 6-digit code.'); return; }

    setVerifying(true);
    try {
      const verifyRes = await complaintApi.verifyOTP(details.email, otpValue);
      const complaintToken = (verifyRes.data as { data?: { complaintToken?: string } })?.data?.complaintToken;
      if (!complaintToken) throw new Error('Verification failed. Please try again.');

      await complaintApi.create({
        name: details.name,
        email: details.email,
        mobile: details.mobile || undefined,
        subject: details.subject,
        message: details.message,
        complaintToken,
      });

      setStep('done');
      toast.success('Your complaint has been submitted.');
      onSuccess?.();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Incorrect code. Please try again.'));
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0 || !details) return;
    setSendingOtp(true);
    try {
      await complaintApi.sendOTP(details.email);
      setOtp(['', '', '', '', '', '']);
      toast.success('New code sent!');
      startResendCooldown();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to resend code.'));
    } finally {
      setSendingOtp(false);
    }
  };

  if (step === 'done') {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-7 h-7 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Complaint Submitted
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Thank you for letting us know. Our team has been notified and will look into it shortly.
        </p>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div>
        <div className="mb-5">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
            Verify Your Email
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Code sent to <span className="font-semibold text-gray-700 dark:text-gray-200">{details?.email}</span>. This confirms your complaint isn&apos;t from a fake address.
          </p>
        </div>

        <div className="space-y-4">
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
            onClick={handleVerifyAndSubmit}
            disabled={verifying || otp.join('').length !== 6}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-red-500/20"
          >
            {verifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Verify & Submit Complaint
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => setStep('details')}
              className="flex items-center gap-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Edit details
            </button>
            <button
              onClick={handleResendOTP}
              disabled={resendCooldown > 0 || sendingOtp}
              className="font-medium text-green-600 hover:text-green-700 dark:text-green-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
          Raise a Complaint
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          We&apos;ll verify your email with a one-time code before submitting. Only our admin team can see this — it stays private to you.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmitDetails)} className="space-y-3.5">
        {/* Name */}
        <div>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            <input
              {...register('name')}
              placeholder="Your Name *"
              className={`input !pl-14 ${errors.name ? 'input-error' : ''}`}
            />
          </div>
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            <input
              {...register('email')}
              type="email"
              placeholder="Email Address *"
              className={`input !pl-14 ${errors.email ? 'input-error' : ''}`}
            />
          </div>
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
        </div>

        {/* Mobile */}
        <div>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            <input
              {...register('mobile')}
              placeholder="Mobile Number (optional)"
              className={`input !pl-14 ${errors.mobile ? 'input-error' : ''}`}
            />
          </div>
          {errors.mobile && <p className="text-xs text-red-400 mt-1">{errors.mobile.message}</p>}
        </div>

        {/* Subject */}
        <div>
          <div className="relative">
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            <input
              {...register('subject')}
              placeholder="Subject *"
              className={`input !pl-14 ${errors.subject ? 'input-error' : ''}`}
            />
          </div>
          {errors.subject && <p className="text-xs text-red-400 mt-1">{errors.subject.message}</p>}
        </div>

        {/* Message */}
        <div>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-3 w-3.5 h-3.5 text-gray-400" />
            <textarea
              {...register('message')}
              placeholder="Describe your complaint *"
              rows={4}
              className={`input pl-14 resize-none ${errors.message ? 'input-error' : ''}`}
            />
          </div>
          {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-red-500/20"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending code...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Verification Code
            </>
          )}
        </button>

        <p className="text-[11px] text-gray-400 text-center">
          Your complaint is private — only our admin team can view it.
        </p>
      </form>
    </div>
  );
}
