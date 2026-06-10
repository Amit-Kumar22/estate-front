'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Phone, Mail, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { leadApi } from '@/lib/api';
import { LeadFormData } from '@/types';
import { LeadPayload } from '@/lib/api/lead.service';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  mobile: z
    .string()
    .min(10, 'Enter a valid mobile number')
    .max(15, 'Mobile number too long')
    .regex(/^[+\d\s-]+$/, 'Invalid mobile number format'),
  email: z.string().email('Enter a valid email address'),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface LeadFormProps {
  source: 'contact' | 'brochure' | 'unlock_content' | 'project_detail';
  projectId?: string;
  projectName?: string;
  unlockedContent?: string;
  onSuccess?: (data: { brochureUrl?: string }) => void;
  title?: string;
  subtitle?: string;
  showMessage?: boolean;
  submitLabel?: string;
}

export default function LeadForm({
  source,
  projectId,
  projectName,
  unlockedContent,
  onSuccess,
  title = 'Get in Touch',
  subtitle = 'Fill in your details and we will contact you shortly.',
  showMessage = false,
  submitLabel = 'Submit',
}: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const payload: LeadPayload = {
        name:            values.name,
        mobile:          values.mobile,
        email:           values.email,
        message:         values.message,
        source,
        projectId,
        unlockedContent,
      };

      const res = await leadApi.create(payload);
      setSubmitted(true);
      toast.success('Thank you! We will contact you soon.');

      if (onSuccess) {
        onSuccess({ brochureUrl: res.data?.data?.brochureUrl });
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-7 h-7 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Thank You, {'{name}'}!
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          We have received your details. Our team will contact you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div>
      {(title || subtitle) && (
        <div className="mb-5">
          {title && (
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
          {projectName && (
            <p className="text-xs text-green-500 font-medium mt-1">Project: {projectName}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        {/* Name */}
        <div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              {...register('name')}
              placeholder="Your Name *"
              className={`input pl-9 ${errors.name ? 'input-error' : ''}`}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Mobile */}
        <div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              {...register('mobile')}
              placeholder="Mobile Number *"
              className={`input pl-9 ${errors.mobile ? 'input-error' : ''}`}
            />
          </div>
          {errors.mobile && (
            <p className="text-xs text-red-400 mt-1">{errors.mobile.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              {...register('email')}
              type="email"
              placeholder="Email Address *"
              className={`input pl-9 ${errors.email ? 'input-error' : ''}`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Message */}
        {showMessage && (
          <div>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-3.5 h-3.5 text-gray-400" />
              <textarea
                {...register('message')}
                placeholder="Your Message (optional)"
                rows={3}
                className="input pl-9 resize-none"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-500 hover:to-green-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-green-500/20"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            submitLabel
          )}
        </button>

        <p className="text-[11px] text-gray-400 text-center">
          We respect your privacy. No spam, ever.
        </p>
      </form>
    </div>
  );
}
