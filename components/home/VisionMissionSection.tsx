'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Target, Sparkles, Zap, Shield, Award, Heart, Lightbulb, Star, Leaf, X, ChevronRight, Building2, Home, Users, Briefcase, TrendingUp, MapPin, CheckCircle, UserCheck, Clock, ThumbsUp, FileCheck } from 'lucide-react';
import FeaturedProjects from './FeaturedProjects';
import FamilyLegacySection from './FamilyLegacySection';
import TestimonialsSection from './TestimonialSection';
import PublicReviewSection from './PublicReviewSection';

export default function VisionMissionSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="py-10 md:py-12 bg-white dark:bg-black relative overflow-hidden">
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
                <div className="absolute top-10 left-10 w-72 h-72 bg-green-500 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-72 h-72 bg-green-600 rounded-full blur-3xl" />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Compact Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 mb-2">
                        <Sparkles className="w-3 h-3 text-green-600 dark:text-green-500" />
                        <span className="text-green-700 dark:text-green-400 text-xs font-bold tracking-wider uppercase">
                            Our Purpose
                        </span>
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Vision & Mission
                    </h2>
                </motion.div>

                {/* Compact Cards Grid */}
                <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto items-stretch">
                    {/* Vision Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="group relative h-full"
                    >
                        <div className="relative h-full bg-gradient-to-br from-white via-green-50/30 to-white dark:from-gray-900 dark:via-green-950/20 dark:to-gray-900 rounded-xl p-5 md:p-6 shadow-md shadow-gray-200/60 dark:shadow-black/40 border border-green-100/50 dark:border-gray-800 hover:shadow-lg hover:shadow-green-500/20 hover:border-green-200 dark:hover:border-green-500/30 transition-all duration-400 overflow-hidden">

                            {/* Animated Corner Accent */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full group-hover:scale-150 transition-transform duration-500" />

                            {/* Floating Dots Pattern */}
                            <div className="absolute top-3 right-3 flex gap-1 opacity-20 dark:opacity-10">
                                <div className="w-1 h-1 rounded-full bg-green-600" />
                                <div className="w-1 h-1 rounded-full bg-green-600" />
                                <div className="w-1 h-1 rounded-full bg-green-600" />
                            </div>

                            {/* Compact Icon Badge */}
                            <div className="relative mb-3 flex items-center gap-3">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-green-500 rounded-lg blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
                                    <div className="relative w-11 h-11 bg-gradient-to-br from-green-600 via-green-600 to-green-700 dark:from-green-500 dark:to-green-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                                        <Eye className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        Our Vision
                                    </h3>
                                    <div className="h-0.5 w-12 bg-gradient-to-r from-green-600 to-transparent rounded" />
                                </div>
                            </div>

                            {/* Compact Content */}
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed relative z-10">
                                To become Eastern India's most <span className="font-semibold text-green-700 dark:text-green-400">respected and trusted real estate developer</span> by creating sustainable, innovative, and high-quality residential and commercial developments that inspire better living and contribute to the growth of future-ready communities.
                            </p>

                            {/* Bottom Shine Effect */}
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
                        </div>
                    </motion.div>

                    {/* Mission Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="group relative h-full"
                    >
                        <div className="relative h-full flex flex-col bg-gradient-to-br from-white via-green-50/30 to-white dark:from-gray-900 dark:via-green-950/20 dark:to-gray-900 rounded-xl p-5 md:p-6 shadow-md shadow-gray-200/60 dark:shadow-black/40 border border-green-100/50 dark:border-gray-800 hover:shadow-lg hover:shadow-green-500/20 hover:border-green-200 dark:hover:border-green-500/30 transition-all duration-400 overflow-hidden">

                            {/* Animated Corner Accent */}
                            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-bl from-green-500/10 to-transparent rounded-br-full group-hover:scale-150 transition-transform duration-500" />

                            {/* Floating Dots Pattern */}
                            <div className="absolute top-3 left-3 flex gap-1 opacity-20 dark:opacity-10">
                                <div className="w-1 h-1 rounded-full bg-green-600" />
                                <div className="w-1 h-1 rounded-full bg-green-600" />
                                <div className="w-1 h-1 rounded-full bg-green-600" />
                            </div>

                            {/* Compact Icon Badge */}
                            <div className="relative mb-3 flex items-center gap-3">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-green-500 rounded-lg blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
                                    <div className="relative w-11 h-11 bg-gradient-to-br from-green-600 via-green-600 to-green-700 dark:from-green-500 dark:to-green-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                                        <Target className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        Our Mission
                                    </h3>
                                    <div className="h-0.5 w-12 bg-gradient-to-r from-green-600 to-transparent rounded" />
                                </div>
                            </div>

                            {/* Compact Content with Icons */}
                            <div className="space-y-2 relative z-10 flex-grow">
                                <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                                    <li className="flex items-start gap-2">
                                        <Zap className="w-3.5 h-3.5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>Deliver premium developments that exceed expectations</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Zap className="w-3.5 h-3.5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>Maintain highest quality and construction standards</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Zap className="w-3.5 h-3.5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>Uphold transparency and ethical practices</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Read More Button */}
                            <div className="relative z-10 mt-3">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                                >
                                    Read More
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Bottom Shine Effect */}
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
                        </div>
                    </motion.div>
                </div>

                {/* Featured Projects Section */}
                <div className="mt-10">
                    <FeaturedProjects />
                </div>

                {/* Core Values Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-10 max-w-6xl mx-auto"
                >
                    {/* Core Values Header */}
                    <div className="text-center mb-6">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Our Core Values
                        </h3>
                        <div className="h-1 w-16 bg-gradient-to-r from-green-600 to-green-500 rounded-full mx-auto" />
                    </div>

                    {/* Core Values Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
                        {/* Integrity */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="group h-full"
                        >
                            <div className="relative h-full bg-white dark:bg-gray-900 rounded-lg p-4 border border-green-100/50 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-500/40 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <Shield className="w-4.5 h-4.5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                            Integrity
                                        </h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                            We conduct every business transaction with honesty, transparency, and accountability.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quality */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.15 }}
                            className="group h-full"
                        >
                            <div className="relative h-full bg-white dark:bg-gray-900 rounded-lg p-4 border border-green-100/50 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-500/40 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <Award className="w-4.5 h-4.5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                            Quality
                                        </h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                            We never compromise on construction quality, design standards, or customer experience.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Customer Commitment */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="group h-full"
                        >
                            <div className="relative h-full bg-white dark:bg-gray-900 rounded-lg p-4 border border-green-100/50 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-500/40 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <Heart className="w-4.5 h-4.5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                            Customer Commitment
                                        </h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                            Our customers remain at the heart of every decision we make.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Innovation */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.25 }}
                            className="group h-full"
                        >
                            <div className="relative h-full bg-white dark:bg-gray-900 rounded-lg p-4 border border-green-100/50 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-500/40 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <Lightbulb className="w-4.5 h-4.5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                            Innovation
                                        </h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                            We continuously embrace new technologies, smarter planning, and modern construction methods.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Excellence */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="group h-full"
                        >
                            <div className="relative h-full bg-white dark:bg-gray-900 rounded-lg p-4 border border-green-100/50 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-500/40 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <Star className="w-4.5 h-4.5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                            Excellence
                                        </h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                            We strive for excellence in design, execution, and service delivery.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Sustainability */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.35 }}
                            className="group h-full"
                        >
                            <div className="relative h-full bg-white dark:bg-gray-900 rounded-lg p-4 border border-green-100/50 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-500/40 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <Leaf className="w-4.5 h-4.5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                            Sustainability
                                        </h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                            We promote environmentally responsible construction practices that support future generations.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Family Legacy Section */}
                <div className="mt-10">
                    <FamilyLegacySection />
                </div>

                {/* Our Services Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-10 max-w-6xl mx-auto"
                >
                    {/* Services Header */}
                    <div className="text-center mb-6">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Our Services
                        </h3>
                        <div className="h-1 w-16 bg-gradient-to-r from-green-600 to-green-500 rounded-full mx-auto" />
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {/* Residential Development */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="group"
                        >
                            <div className="relative bg-gradient-to-br from-white to-green-50/30 dark:from-gray-900 dark:to-green-950/10 rounded-xl p-5 border border-green-100 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-500/40 shadow-md hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 overflow-hidden">
                                {/* Top Accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 dark:bg-green-500/10 rounded-bl-full" />
                                
                                {/* Icon */}
                                <div className="relative mb-4 inline-block">
                                    <div className="absolute inset-0 bg-green-500 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Home className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                {/* Content */}
                                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                                    Residential Development
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Premium apartments and townships designed for modern family living with world-class amenities.
                                </p>
                            </div>
                        </motion.div>

                        {/* Commercial Development */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="group"
                        >
                            <div className="relative bg-gradient-to-br from-white to-green-50/30 dark:from-gray-900 dark:to-green-950/10 rounded-xl p-5 border border-green-100 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-500/40 shadow-md hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 overflow-hidden">
                                {/* Top Accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 dark:bg-green-500/10 rounded-bl-full" />
                                
                                {/* Icon */}
                                <div className="relative mb-4 inline-block">
                                    <div className="absolute inset-0 bg-green-500 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Building2 className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                {/* Content */}
                                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                                    Commercial Complexes
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Strategic business spaces with excellent connectivity and infrastructure for growth.
                                </p>
                            </div>
                        </motion.div>

                        {/* Mixed-Use Development */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="group"
                        >
                            <div className="relative bg-gradient-to-br from-white to-green-50/30 dark:from-gray-900 dark:to-green-950/10 rounded-xl p-5 border border-green-100 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-500/40 shadow-md hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 overflow-hidden">
                                {/* Top Accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 dark:bg-green-500/10 rounded-bl-full" />
                                
                                {/* Icon */}
                                <div className="relative mb-4 inline-block">
                                    <div className="absolute inset-0 bg-green-500 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Briefcase className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                {/* Content */}
                                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                                    Mixed-Use Development
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Integrated townships combining residential, commercial, and retail spaces seamlessly.
                                </p>
                            </div>
                        </motion.div>

                        {/* Property Consultation */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            className="group"
                        >
                            <div className="relative bg-gradient-to-br from-white to-green-50/30 dark:from-gray-900 dark:to-green-950/10 rounded-xl p-5 border border-green-100 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-500/40 shadow-md hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 overflow-hidden">
                                {/* Top Accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 dark:bg-green-500/10 rounded-bl-full" />
                                
                                {/* Icon */}
                                <div className="relative mb-4 inline-block">
                                    <div className="absolute inset-0 bg-green-500 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                {/* Content */}
                                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                                    Property Consultation
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Expert guidance for property investment, legal assistance, and end-to-end support.
                                </p>
                            </div>
                        </motion.div>

                        {/* Investment Opportunities */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                            className="group"
                        >
                            <div className="relative bg-gradient-to-br from-white to-green-50/30 dark:from-gray-900 dark:to-green-950/10 rounded-xl p-5 border border-green-100 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-500/40 shadow-md hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 overflow-hidden">
                                {/* Top Accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 dark:bg-green-500/10 rounded-bl-full" />
                                
                                {/* Icon */}
                                <div className="relative mb-4 inline-block">
                                    <div className="absolute inset-0 bg-green-500 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <TrendingUp className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                {/* Content */}
                                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                                    Investment Opportunities
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    High-return investment options in prime locations with guaranteed appreciation.
                                </p>
                            </div>
                        </motion.div>

                        {/* Site Selection & Planning */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                            className="group"
                        >
                            <div className="relative bg-gradient-to-br from-white to-green-50/30 dark:from-gray-900 dark:to-green-950/10 rounded-xl p-5 border border-green-100 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-500/40 shadow-md hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 overflow-hidden">
                                {/* Top Accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 dark:bg-green-500/10 rounded-bl-full" />
                                
                                {/* Icon */}
                                <div className="relative mb-4 inline-block">
                                    <div className="absolute inset-0 bg-green-500 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                {/* Content */}
                                <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                                    Site Selection & Planning
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Comprehensive site analysis, planning approval, and project development services.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Our Unique Strength Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-10 max-w-6xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Our Unique Strength
                        </h3>
                        <div className="h-1 w-16 bg-gradient-to-r from-green-600 to-green-500 rounded-full mx-auto" />
                    </div>

                    {/* Strength Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Decade of Experience */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-green-100/50 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-500/40 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 flex items-center justify-center flex-shrink-0">
                                    <Award className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                        Trusted Experience
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                        More than a decade of trusted real estate experience
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Value-Driven Development */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.15 }}
                        >
                            <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-green-100/50 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-500/40 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 flex items-center justify-center flex-shrink-0">
                                    <Target className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                        Value-Driven Developments
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Commitment to delivering value-driven developments
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Premium Locations */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-green-100/50 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-500/40 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                        Premium Locations
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Premium locations with excellent future appreciation potential
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quality Construction */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.25 }}
                        >
                            <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-green-100/50 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-500/40 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 flex items-center justify-center flex-shrink-0">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                        Quality Construction
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Quality construction backed by experienced professionals
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Transparent Documentation */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                        >
                            <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-green-100/50 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-500/40 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 flex items-center justify-center flex-shrink-0">
                                    <FileCheck className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                        Transparent Practices
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Transparent documentation and ethical business practices
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Lifestyle Amenities */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.35 }}
                        >
                            <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-green-100/50 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-500/40 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 flex items-center justify-center flex-shrink-0">
                                    <Home className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                        Lifestyle Amenities
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Lifestyle-focused amenities that enhance everyday living
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Customer Satisfaction */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                        >
                            <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-green-100/50 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-500/40 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 flex items-center justify-center flex-shrink-0">
                                    <ThumbsUp className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                        Customer Satisfaction
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Strong emphasis on customer satisfaction and after-sales support
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Sustainable Development */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.45 }}
                        >
                            <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-green-100/50 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-500/40 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 flex items-center justify-center flex-shrink-0">
                                    <Leaf className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                        Sustainable Development
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Long-term vision focused on sustainable urban development
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Customer Testimonials Section */}
                <div className="mt-10">
                    <TestimonialsSection />
                </div>

                {/* Public Review Section */}
                <div className="mt-10">
                    <PublicReviewSection />
                </div>

                {/* Our Promise Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-10 max-w-5xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Our Promise to You
                        </h3>
                        <div className="h-1 w-16 bg-gradient-to-r from-green-600 to-green-500 rounded-full mx-auto" />
                    </div>

                    {/* Promise Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="relative bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-gray-900 rounded-2xl p-6 md:p-8 border border-green-200 dark:border-green-500/20 shadow-lg overflow-hidden">
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/5 dark:bg-green-500/10 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-500/5 dark:bg-green-500/10 rounded-full blur-3xl" />
                            
                            {/* Promise Introduction Text */}
                            <div className="relative text-center mb-6 max-w-4xl mx-auto">
                                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                                    At RD ECO Developers, every project reflects our unwavering commitment to quality, trust, innovation, and customer satisfaction. We do not simply construct buildings—we create homes, business spaces, and communities where people can live, work, and thrive with confidence.
                                </p>
                                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                    As we continue our journey of excellence, we remain dedicated to shaping Bihar's future skyline through developments that stand as lasting symbols of quality, reliability, and modern living.
                                </p>
                            </div>

                            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Timely Delivery */}
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-green-600 dark:bg-green-500 flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                            Timely Delivery
                                        </h4>
                                        <p className="text-xs text-gray-700 dark:text-gray-300">
                                            We commit to project completion within promised timelines
                                        </p>
                                    </div>
                                </div>

                                {/* Transparency */}
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-green-600 dark:bg-green-500 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                            Complete Transparency
                                        </h4>
                                        <p className="text-xs text-gray-700 dark:text-gray-300">
                                            Clear communication and honest dealings at every step
                                        </p>
                                    </div>
                                </div>

                                {/* Quality Assurance */}
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-green-600 dark:bg-green-500 flex items-center justify-center flex-shrink-0">
                                        <FileCheck className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                            Quality Assurance
                                        </h4>
                                        <p className="text-xs text-gray-700 dark:text-gray-300">
                                            Uncompromised quality standards in every project
                                        </p>
                                    </div>
                                </div>

                                {/* Legal Compliance */}
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-green-600 dark:bg-green-500 flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                            Legal Compliance
                                        </h4>
                                        <p className="text-xs text-gray-700 dark:text-gray-300">
                                            All approvals and documentation handled professionally
                                        </p>
                                    </div>
                                </div>

                                {/* Customer Support */}
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-green-600 dark:bg-green-500 flex items-center justify-center flex-shrink-0">
                                        <UserCheck className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                            Lifelong Support
                                        </h4>
                                        <p className="text-xs text-gray-700 dark:text-gray-300">
                                            Dedicated assistance before, during, and after possession
                                        </p>
                                    </div>
                                </div>

                                {/* Value for Money */}
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-green-600 dark:bg-green-500 flex items-center justify-center flex-shrink-0">
                                        <TrendingUp className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                                            Best Value
                                        </h4>
                                        <p className="text-xs text-gray-700 dark:text-gray-300">
                                            Maximum value for your investment with high returns
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Mission Modal */}
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
                            className="relative w-full max-w-2xl max-h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 border-b border-green-500/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                        <Target className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">
                                        Our Mission
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
                            <div className="overflow-y-auto max-h-[calc(80vh-80px)] px-6 py-6">
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                        Our mission is to deliver exceptional real estate projects that exceed customer expectations through:
                                    </p>
                                    
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                                            <Zap className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong className="text-gray-900 dark:text-white block mb-1">Premium Developments</strong>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    Deliver premium residential and commercial developments that exceed customer expectations
                                                </span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                                            <Zap className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong className="text-gray-900 dark:text-white block mb-1">Quality Standards</strong>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    Maintain the highest standards of quality, safety, and construction excellence
                                                </span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                                            <Zap className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong className="text-gray-900 dark:text-white block mb-1">Transparency</strong>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    Uphold transparency and ethical business practices in every transaction
                                                </span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                                            <Zap className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong className="text-gray-900 dark:text-white block mb-1">Timely Delivery</strong>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    Complete projects within committed timelines while ensuring uncompromised quality
                                                </span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                                            <Zap className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong className="text-gray-900 dark:text-white block mb-1">Innovation</strong>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    Adopt innovative technologies and sustainable construction practices
                                                </span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                                            <Zap className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong className="text-gray-900 dark:text-white block mb-1">Long-term Value</strong>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    Create long-term value for customers, investors, employees, and business partners
                                                </span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                                            <Zap className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <strong className="text-gray-900 dark:text-white block mb-1">Lasting Relationships</strong>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    Build enduring relationships founded on trust, integrity, and customer satisfaction
                                                </span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
