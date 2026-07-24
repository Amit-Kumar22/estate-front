'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Home, Shield, Award, TrendingUp, X } from 'lucide-react';
import Link from 'next/link';

export default function WelcomeSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <section className="py-10 md:py-14 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-500/8 border border-green-200 dark:border-green-500/15 mb-3">
              <Home className="w-3.5 h-3.5 text-green-600 dark:text-green-500" />
              <span className="text-green-700 dark:text-green-400 text-xs font-bold tracking-widest uppercase">
                About Us
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to RD Eco Developers Pvt. Ltd. - Your Trusted Real Estate Partner
            </h2>
            <p className="text-base md:text-lg text-green-600 dark:text-green-400 font-medium">
              Find Your Dream Property with Confidence
            </p>
          </motion.div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                RD ECO Developers Pvt. Ltd. is a professionally managed real estate company headquartered in Patna, Bihar. We develop premium residential apartments, integrated townships, commercial complexes, and mixed-use developments that redefine modern living.
              </p>

              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Our approach goes beyond constructing buildings. We create environments where people experience comfort, security, and a superior lifestyle with contemporary architecture and world-class amenities.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm font-semibold rounded-lg transition-all duration-300 border border-gray-300 dark:border-gray-600"
                >
                  Read More
                  <ChevronRight className="w-4 h-4" />
                </button>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5"
                >
                  Explore Properties
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {/* Feature Card 1 */}
              <div className="group p-4 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-500/10 dark:to-green-500/5 rounded-xl border border-green-200 dark:border-green-500/20 hover:border-green-300 dark:hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
                <div className="w-10 h-10 rounded-lg bg-green-600 dark:bg-green-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
                  Trusted Service
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Years of experience delivering reliable and transparent real estate solutions.
                </p>
              </div>

              {/* Feature Card 2 */}
              <div className="group p-4 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-500/10 dark:to-green-500/5 rounded-xl border border-green-200 dark:border-green-500/20 hover:border-green-300 dark:hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
                <div className="w-10 h-10 rounded-lg bg-green-600 dark:bg-green-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
                  Award Winning
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Recognized for excellence in real estate development and customer service.
                </p>
              </div>

              {/* Feature Card 3 */}
              <div className="group p-4 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-500/10 dark:to-green-500/5 rounded-xl border border-green-200 dark:border-green-500/20 hover:border-green-300 dark:hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
                <div className="w-10 h-10 rounded-lg bg-green-600 dark:bg-green-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
                  Premium Locations
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Properties in prime locations with excellent connectivity and amenities.
                </p>
              </div>

              {/* Feature Card 4 */}
              <div className="group p-4 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-500/10 dark:to-green-500/5 rounded-xl border border-green-200 dark:border-green-500/20 hover:border-green-300 dark:hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
                <div className="w-10 h-10 rounded-lg bg-green-600 dark:bg-green-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
                  Smart Investment
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  High-value properties designed for long-term appreciation and returns.
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* About Us Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl max-h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 border-b border-green-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    About RD Eco Developers Pvt. Ltd.
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body with Scroll */}
              <div className="overflow-y-auto max-h-[calc(85vh-80px)] px-6 py-6">
                <div className="space-y-5 text-gray-700 dark:text-gray-300">
                  {/* Introduction */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                      Your Trusted Real Estate Partner
                    </h4>
                    <p className="text-sm md:text-base leading-relaxed">
                      RD ECO Developers Pvt. Ltd. is a professionally managed real estate company headquartered in Patna, Bihar. Since its inception, the company has been engaged in developing premium residential apartments, integrated townships, commercial complexes, and mixed-use developments that redefine modern living.
                    </p>
                  </div>

                  {/* Vision & Approach */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                      Our Vision & Approach
                    </h4>
                    <p className="text-sm md:text-base leading-relaxed mb-3">
                      Our approach goes beyond constructing buildings. We create environments where people experience comfort, security, and a superior lifestyle. Every project is carefully designed with contemporary architecture, intelligent space planning, high-quality materials, landscaped open spaces, and world-class amenities that enhance everyday living.
                    </p>
                    <p className="text-sm md:text-base leading-relaxed">
                      We are committed to delivering projects built on the foundation of{' '}
                      <span className="font-semibold text-green-600 dark:text-green-400">transparency</span>,{' '}
                      <span className="font-semibold text-green-600 dark:text-green-400">trust</span>, and{' '}
                      <span className="font-semibold text-green-600 dark:text-green-400">customer satisfaction</span>.
                    </p>
                  </div>

                  {/* Core Values */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                      Our Core Values
                    </h4>
                    <p className="text-sm md:text-base leading-relaxed">
                      Transparency, quality, customer satisfaction, and ethical business practices are the pillars of our organization. These values have helped us establish long-lasting relationships with homeowners, investors, financial institutions, and business partners.
                    </p>
                  </div>

                  {/* Reputation */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                      Trusted Name in Real Estate
                    </h4>
                    <p className="text-sm md:text-base leading-relaxed">
                      With every completed project, RD ECO Developers continues to strengthen its reputation as a trusted name in Bihar's real estate sector. We take pride in delivering homes and commercial spaces that not only meet but exceed expectations.
                    </p>
                  </div>

                  {/* Key Highlights */}
                  <div className="bg-green-50 dark:bg-green-500/10 rounded-xl p-5 border border-green-200 dark:border-green-500/20">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      Why Choose Us?
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Shield className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm md:text-base">
                          <strong className="text-gray-900 dark:text-white">Professional Management:</strong> Expert team with years of industry experience
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Award className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm md:text-base">
                          <strong className="text-gray-900 dark:text-white">Award-Winning Projects:</strong> Recognized for excellence and innovation
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Home className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm md:text-base">
                          <strong className="text-gray-900 dark:text-white">Premium Locations:</strong> Strategic locations with excellent connectivity
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <TrendingUp className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm md:text-base">
                          <strong className="text-gray-900 dark:text-white">High Returns:</strong> Properties designed for long-term value appreciation
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Call to Action */}
                  <div className="pt-2 text-center">
                    <Link
                      href="/projects"
                      onClick={() => setIsModalOpen(false)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30"
                    >
                      Explore Our Projects
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
