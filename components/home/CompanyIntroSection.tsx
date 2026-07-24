'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Sparkles, X, ChevronRight } from 'lucide-react';

export default function CompanyIntroSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <section className="relative py-8 md:py-10 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 dark:bg-green-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/5 dark:bg-green-500/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    {/* Card Container */}
                    <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-lg shadow-gray-200/50 dark:shadow-black/30 border border-gray-100 dark:border-gray-800 overflow-hidden group hover:shadow-xl hover:shadow-green-500/10 transition-all duration-500">
                        {/* Top Accent Line */}
                        <div className="h-0.5 bg-gradient-to-r from-green-500 via-green-600 to-green-500" />

                        {/* Content */}
                        <div className="px-5 py-6 md:px-8 md:py-7">
                            {/* Icon */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="flex justify-center mb-3"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-green-500/20 dark:bg-green-500/30 rounded-full blur-xl animate-pulse" />
                                    <div className="relative w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                                        <Building2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Company Name */}
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2 bg-gradient-to-r from-gray-900 via-green-900 to-gray-900 dark:from-white dark:via-green-400 dark:to-white bg-clip-text text-transparent"
                            >
                                RD ECO Developers Pvt. Ltd.
                            </motion.h2>

                            {/* Decorative Divider */}
                            <motion.div
                                initial={{ opacity: 0, scaleX: 0 }}
                                whileInView={{ opacity: 1, scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="flex items-center justify-center gap-2 mb-3"
                            >
                                <div className="h-px w-12 md:w-16 bg-gradient-to-r from-transparent via-green-500 to-green-500" />
                                <Sparkles className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                <div className="h-px w-12 md:w-16 bg-gradient-to-l from-transparent via-green-500 to-green-500" />
                            </motion.div>

                            {/* Tagline */}
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="font-serif text-sm sm:text-base md:text-lg text-center text-gray-700 dark:text-gray-300 tracking-wide leading-relaxed max-w-xl mx-auto mb-3"
                            >
                                Building Trust. Creating Landmarks. Enriching Lives.
                            </motion.p>

                            {/* Brief Description */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="max-w-xl mx-auto mb-4"
                            >
                                <p className="text-xs md:text-sm text-center text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Founded in 2013, RD ECO Developers Pvt. Ltd. has emerged as one of Bihar's fast-growing real estate developers, combining quality construction, modern architecture, and long-term value to transform urban living.
                                </p>
                            </motion.div>

                            {/* Read More Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="flex justify-center"
                            >
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5"
                                >
                                    Read More
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </motion.div>

                            {/* Bottom Decorative Elements */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                                className="mt-4 flex justify-center gap-1.5"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-500 animate-pulse" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-500 animate-pulse" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-500 animate-pulse" style={{ animationDelay: '300ms' }} />
                            </motion.div>
                        </div>

                        {/* Subtle Bottom Gradient */}
                        <div className="h-10 bg-gradient-to-b from-transparent via-green-50/30 to-green-50/50 dark:via-green-950/20 dark:to-green-950/30" />
                    </div>

                    {/* Floating Accent Corners */}
                    <div className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-green-500 dark:border-green-400 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-green-500 dark:border-green-400 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
            </div>

            {/* Company Info Modal */}
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
                                        <Building2 className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">
                                        RD ECO Developers Pvt. Ltd.
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
                                    {/* Tagline */}
                                    <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
                                        <p className="font-serif text-lg md:text-xl text-green-600 dark:text-green-400 font-semibold">
                                            Building Trust. Creating Landmarks. Enriching Lives.
                                        </p>
                                    </div>

                                    {/* Introduction */}
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                            Our Journey
                                        </h4>
                                        <p className="text-sm md:text-base leading-relaxed">
                                            Founded in 2013, RD ECO Developers Pvt. Ltd. has emerged as one of Bihar's fast-growing real estate developers, dedicated to creating thoughtfully designed residential and commercial developments that combine quality construction, modern architecture, and long-term value. With a vision to transform urban living, the company has consistently focused on delivering projects that exceed customer expectations while maintaining transparency, integrity, and excellence in every aspect of its work.
                                        </p>
                                    </div>

                                    {/* Trust & Quality */}
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                            Commitment to Excellence
                                        </h4>
                                        <p className="text-sm md:text-base leading-relaxed">
                                            Over the years, RD ECO Developers has earned the trust of thousands of homebuyers and investors through its commitment to quality, timely execution, and customer satisfaction. Every development reflects careful planning, superior craftsmanship, and a deep understanding of modern lifestyle requirements. Our projects are strategically located to provide excellent connectivity to schools, hospitals, business hubs, transportation networks, and essential civic infrastructure, ensuring convenience and a better quality of life for our residents.
                                        </p>
                                    </div>

                                    {/* Philosophy */}
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                            Our Philosophy
                                        </h4>
                                        <p className="text-sm md:text-base leading-relaxed">
                                            At RD ECO Developers, we believe that purchasing a home is one of life's most significant decisions. It is not merely about acquiring a property; it is about creating a secure environment where families can grow, celebrate milestones, and build a prosperous future. This philosophy inspires us to deliver homes that seamlessly combine comfort, functionality, aesthetics, and sustainability.
                                        </p>
                                    </div>

                                    {/* Team & Expertise */}
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                            Expert Team
                                        </h4>
                                        <p className="text-sm md:text-base leading-relaxed">
                                            Our experienced team of engineers, architects, planners, designers, project managers, and customer relationship professionals works collaboratively to ensure that every project meets the highest standards of construction quality and regulatory compliance. From project conceptualization to possession and after-sales support, we maintain complete transparency and professionalism throughout the customer journey.
                                        </p>
                                    </div>

                                    {/* Future Vision */}
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                            Our Vision Forward
                                        </h4>
                                        <p className="text-sm md:text-base leading-relaxed">
                                            As we continue to grow, our commitment remains unchanged—to create exceptional developments that deliver lasting value, foster vibrant communities, and contribute meaningfully to Bihar's evolving urban landscape.
                                        </p>
                                    </div>

                                    {/* Key Highlights */}
                                    <div className="bg-green-50 dark:bg-green-500/10 rounded-xl p-5 border border-green-200 dark:border-green-500/20">
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                            Our Core Strengths
                                        </h4>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Sparkles className="w-3.5 h-3.5 text-white" />
                                                </div>
                                                <span className="text-sm md:text-base">
                                                    <strong className="text-gray-900 dark:text-white">Quality Construction:</strong> Superior craftsmanship with premium materials
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Sparkles className="w-3.5 h-3.5 text-white" />
                                                </div>
                                                <span className="text-sm md:text-base">
                                                    <strong className="text-gray-900 dark:text-white">Strategic Locations:</strong> Prime areas with excellent connectivity
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Sparkles className="w-3.5 h-3.5 text-white" />
                                                </div>
                                                <span className="text-sm md:text-base">
                                                    <strong className="text-gray-900 dark:text-white">Timely Delivery:</strong> Committed to on-time project completion
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Sparkles className="w-3.5 h-3.5 text-white" />
                                                </div>
                                                <span className="text-sm md:text-base">
                                                    <strong className="text-gray-900 dark:text-white">Customer First:</strong> Transparency and support at every step
                                                </span>
                                            </li>
                                        </ul>
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
