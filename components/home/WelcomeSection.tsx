'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home, Shield, Award, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function WelcomeSection() {
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/8 border border-emerald-200 dark:border-emerald-500/15 mb-3">
              <Home className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
              <span className="text-emerald-700 dark:text-emerald-400 text-xs font-bold tracking-widest uppercase">
                About Us
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to Real Estate
            </h2>
            <p className="text-base md:text-lg text-emerald-600 dark:text-emerald-400 font-medium">
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
                We are committed to helping individuals and families discover exceptional residential 
                and commercial properties in prime locations. With a focus on <span className="font-semibold text-emerald-600 dark:text-emerald-400">transparency</span>, 
                <span className="font-semibold text-emerald-600 dark:text-emerald-400"> trust</span>, and <span className="font-semibold text-emerald-600 dark:text-emerald-400">customer satisfaction</span>, 
                we make the property-buying experience simple and stress-free.
              </p>
              
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Whether you're looking for your dream home, a profitable investment opportunity, or 
                commercial space for your business, our expert team is here to guide you every step 
                of the way. We combine local market expertise with innovative technology to deliver 
                unparalleled service and results.
              </p>

              {/* CTA Button */}
              <div className="pt-2">
                <Link 
                  href="/projects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
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
              <div className="group p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-500/10 dark:to-emerald-500/5 rounded-xl border border-emerald-200 dark:border-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
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
              <div className="group p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-500/10 dark:to-emerald-500/5 rounded-xl border border-emerald-200 dark:border-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
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
              <div className="group p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-500/10 dark:to-emerald-500/5 rounded-xl border border-emerald-200 dark:border-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
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
              <div className="group p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-500/10 dark:to-emerald-500/5 rounded-xl border border-emerald-200 dark:border-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
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

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  500+
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Happy Families
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  50+
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Premium Projects
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  15+
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Years Experience
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  98%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Satisfaction Rate
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
