'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, Lightbulb } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    question: 'Why Invest in Patna Real Estate in 2026?',
    answer: "Discover why Patna is emerging as one of Eastern India's fastest-growing real estate destinations. Learn about infrastructure development, increasing property values, and the best investment opportunities for homebuyers and investors.",
  },
  {
    id: 2,
    question: '10 Things to Check Before Buying a Flat',
    answer: 'Buying a home is a lifetime decision. This guide explains the most important factors every buyer should verify, including legal documents, RERA registration, construction quality, builder reputation, location, and future appreciation.',
  },
  {
    id: 3,
    question: 'Benefits of Buying a Home in a Gated Community',
    answer: 'Explore how gated communities offer enhanced security, modern amenities, better maintenance, and a higher quality of life for families.',
  },
  {
    id: 4,
    question: 'Home Loan Guide for First-Time Buyers',
    answer: 'Understand the complete home loan process, eligibility, required documents, EMI calculation, and tips for getting your loan approved with ease.',
  },
  {
    id: 5,
    question: 'RERA – Why It Matters for Every Homebuyer',
    answer: 'Learn how RERA protects homebuyers by ensuring transparency, timely project delivery, and legal accountability from developers.',
  },
  {
    id: 6,
    question: 'Ready-to-Move vs Under-Construction Property',
    answer: 'Compare the advantages and disadvantages of ready-to-move and under-construction properties to make the right investment decision.',
  },
  {
    id: 7,
    question: 'Modern Amenities That Add Value to Your Home',
    answer: "Discover how amenities such as clubhouses, swimming pools, landscaped gardens, gyms, children's play areas, and 24×7 security improve both lifestyle and long-term property value.",
  },
  {
    id: 8,
    question: 'Why Location is the Key to Real Estate Success',
    answer: 'Learn why proximity to schools, hospitals, airports, railway stations, highways, and commercial hubs significantly influences property appreciation and convenience.',
  },
  {
    id: 9,
    question: 'Smart Tips for Property Investment',
    answer: 'Explore expert investment strategies that help maximize returns while minimizing risks in the real estate market.',
  },
  {
    id: 10,
    question: 'Future of Real Estate in Bihar',
    answer: "Get an overview of Bihar's rapidly developing infrastructure, government initiatives, and future opportunities in residential and commercial real estate.",
  },
  {
    id: 11,
    question: 'Sustainable Living and Green Buildings',
    answer: 'Understand the importance of eco-friendly construction, rainwater harvesting, energy-efficient buildings, and sustainable urban development.',
  },
  {
    id: 12,
    question: 'Why Choose RD ECO Developers?',
    answer: 'Learn about our commitment to quality construction, transparent business practices, modern amenities, strategic locations, and customer satisfaction. Discover how RD ECO Developers creates homes and commercial spaces that offer long-term value and a better lifestyle for every family.',
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-8 md:py-10 bg-gradient-to-b from-white to-emerald-50/30 dark:from-black dark:to-emerald-950/10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* ── Section Header ─────────────────────────────────────── */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-medium mb-2">
            <HelpCircle className="w-3 h-3" />
            Expert Guidance
          </div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1.5">
            Frequently Asked Questions
          </h2>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Find answers to the most common real estate questions and make informed property decisions with expert guidance from RD ECO Developers Pvt. Ltd.
          </p>
        </div>

        {/* ── FAQ Grid (2 columns on desktop) ────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group"
            >
              <div
                className={[
                  'relative overflow-hidden rounded-xl transition-all duration-300',
                  'bg-white dark:bg-gray-900/50',
                  'border border-gray-200 dark:border-gray-800',
                  'hover:border-emerald-300 dark:hover:border-emerald-700',
                  openId === faq.id
                    ? 'shadow-lg shadow-emerald-500/10 dark:shadow-emerald-500/5'
                    : 'shadow-sm hover:shadow-md',
                ].join(' ')}
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left p-3.5 flex items-start justify-between gap-2.5 group/btn"
                  aria-expanded={openId === faq.id}
                >
                  <span className="flex-1 text-xs md:text-sm font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {faq.question}
                  </span>
                  <span
                    className={[
                      'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300',
                      openId === faq.id
                        ? 'bg-emerald-500 text-white rotate-180'
                        : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover/btn:bg-emerald-200 dark:group-hover/btn:bg-emerald-900/50',
                    ].join(' ')}
                  >
                    {openId === faq.id ? (
                      <Minus className="w-3 h-3" />
                    ) : (
                      <Plus className="w-3 h-3" />
                    )}
                  </span>
                </button>

                {/* Answer (Animated) */}
                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-3.5 pb-3.5 pt-0">
                        <div className="pt-2.5 border-t border-gray-200 dark:border-gray-800">
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom CTA Banner ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 p-4 md:p-6"
          style={{
            boxShadow: '0 8px 32px rgba(22, 163, 74, 0.25)',
          }}
        >
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm mb-3">
              <Lightbulb className="w-4.5 h-4.5 text-white" />
            </div>
            <h3 className="text-base md:text-lg font-bold text-white mb-1.5">
              Stay Updated with the Latest Real Estate Insights
            </h3>
            <p className="text-xs md:text-sm text-emerald-50 max-w-3xl mx-auto mb-3">
              From market trends and investment opportunities to home-buying guides and construction innovations, our content is created to keep you informed and empowered throughout your real estate journey.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="text-xs md:text-sm font-semibold text-white">
                "Knowledge Builds Better Investments."
              </span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
