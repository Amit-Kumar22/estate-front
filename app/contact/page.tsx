'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { leadApi } from '@/lib/api';
import appConfig from '@/config/app.config';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/lib/utils';
import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const MapSection = dynamic(() => import('@/components/home/MapSection'), { ssr: false });

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  mobile: z.string().min(10, 'Enter a valid mobile number').regex(/^[+\d\s-]+$/),
  email: z.string().email('Enter a valid email'),
  message: z.string().min(5, 'Please write a short message').optional(),
});

type FormValues = z.infer<typeof schema>;

const contactDetails = [
  {
    icon: Phone,
    label: 'Phone',
    value: `${appConfig.site.phone}\n${appConfig.site.phone2}`,
    href: `tel:${appConfig.site.phone}`,
  },
  { icon: Mail, label: 'Email', value: appConfig.site.email, href: `mailto:${appConfig.site.email}` },
  {
    icon: MapPin,
    label: 'Corporate Office',
    value: appConfig.site.address,
    href: '#map',
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      await leadApi.create({ ...values, source: 'contact' });
      setSubmitted(true);
      toast.success('Message sent! We will get back to you shortly.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-20 bg-white dark:bg-[#0a0a0a]">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 pt-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/8 border border-green-500/15 mb-4">
            <MessageSquare className="w-3.5 h-3.5 text-green-500" />
            <span className="text-green-400 text-xs font-semibold tracking-wider uppercase">
              Contact Us
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Get In Touch
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl mx-auto">
            Our team is ready to help. Reach out and we will respond within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-14">
          {/* Contact details */}
          <div className="lg:col-span-2 space-y-4">
            {contactDetails.map(({ icon: Icon, label, value, href }) => (
              <motion.a
                key={label}
                href={href}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-[#1f1f1f] hover:border-green-500/25 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                  <Icon className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
                    {label}
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 whitespace-pre-line">{value}</p>
                </div>
              </motion.a>
            ))}

            {/* WhatsApp CTA */}
            <a
              href={`${appConfig.whatsapp.apiUrl}/${appConfig.whatsapp.number}?text=${encodeURIComponent(appConfig.whatsapp.defaultMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#1fb359] transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3 bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-[#1f1f1f] p-6 sm:p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Message Sent!
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Thank you for reaching out. Our team will contact you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-5">
                  Send Us a Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      {...register('name')}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50"
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-[11px] text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                      Mobile Number *
                    </label>
                    <input
                      {...register('mobile')}
                      type="tel"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50"
                      placeholder="+91 98765 43210"
                    />
                    {errors.mobile && (
                      <p className="mt-1 text-[11px] text-red-500">{errors.mobile.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-[11px] text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                    Message
                  </label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 resize-none"
                    placeholder="How can we help you?"
                  />
                  {errors.message && (
                    <p className="mt-1 text-[11px] text-red-500">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {isSubmitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Map */}
          <div id="map">
            <MapSection />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
