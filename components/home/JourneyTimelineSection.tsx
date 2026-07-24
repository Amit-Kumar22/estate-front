'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const milestones = [
    {
        year: '2013',
        title: 'The Beginning',
        desc: 'Vision to build quality developments.',
        highlighted: true,
        details: {
            heading: 'The Beginning',
            description: 'RD ECO Developers Pvt. Ltd. was established with a vision to build quality residential and commercial developments while maintaining the highest standards of professionalism and transparency.',
            projects: []
        }
    },
    {
        year: '2014-2015',
        title: 'Building Foundation',
        desc: 'First residential projects launched.',
        highlighted: false,
        details: {
            heading: 'Building Our Foundation',
            description: 'The company began developing its first residential projects, focusing on quality construction, customer trust, and timely delivery.',
            projects: ['Ram Swaroop Apartment', 'RD Heights']
        }
    },
    {
        year: '2016-2018',
        title: 'Expanding Presence',
        desc: 'Portfolio expansion & commercial entry.',
        highlighted: false,
        details: {
            heading: 'Expanding Our Presence',
            description: 'As customer confidence grew, RD ECO Developers expanded its portfolio with larger residential developments and entered the commercial real estate segment.',
            projects: ['SR Chetna Kutir (Commercial)', 'Chetna Residency', 'Devadhari Pratap Commercial Complex']
        }
    },
    {
        year: '2019-2022',
        title: 'Premium Living',
        desc: 'Modern amenities & superior quality.',
        highlighted: false,
        details: {
            heading: 'Creating Premium Living Spaces',
            description: 'With years of experience and customer trust, the company launched premium developments offering modern amenities, superior construction quality, and prime locations.',
            projects: ['AM Pinnacle', 'Premium Residential Developments', 'Lifestyle-Oriented Housing Projects']
        }
    },
    {
        year: '2023-Present',
        title: 'Building Future',
        desc: 'Shaping Bihar\'s modern skyline.',
        highlighted: false,
        details: {
            heading: 'Building the Future',
            description: 'RD ECO Developers continues to shape Bihar\'s skyline with modern residential communities and commercial developments designed for future generations.',
            projects: ['Sushila Complex', 'AM Pinnacle', 'RD Heights', 'Chetna Residency', 'Ram Swaroop Apartment', 'Devadhari Pratap Commercial Complex']
        }
    },
];

/* ── Milestone icon SVGs (gold) ────────────────────────── */
const MilestoneIcons = [
    /* 2013 – flag / founding */
    <svg key="flag" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <path d="M6 4v24M6 4l14 5-14 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    /* 2014-2015 – building */
    <svg key="building" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <rect x="6" y="8" width="20" height="20" rx="1" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v20M20 8v20M6 14h20M6 20h20" stroke="currentColor" strokeWidth="2" />
    </svg>,
    /* 2016-2018 – expansion */
    <svg key="expand" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <rect x="4" y="14" width="24" height="13" rx="1" stroke="currentColor" strokeWidth="2" />
        <path d="M4 14l8-7 8 7M16 14l8-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    /* 2019-2022 – premium */
    <svg key="premium" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <path d="M16 4l4 8 8 1-6 6 1 8-7-4-7 4 1-8-6-6 8-1z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>,
    /* 2023-Present – future */
    <svg key="future" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <path d="M16 4v8m0 8v8m8-12h-8m-8 0h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2" />
        <path d="M16 4l3 3-3 3m0 4l3 3-3 3m0-16l-3 3 3 3m0 4l-3 3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>,
];

export default function JourneyTimelineSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [timelineModalOpen, setTimelineModalOpen] = useState(false);
    const [selectedMilestone, setSelectedMilestone] = useState<typeof milestones[0] | null>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
    const cardRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        /* story card fade-up */
        if (cardRef.current) {
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('journey-card-visible');
                        obs.disconnect();
                    }
                },
                { threshold: 0.25 }
            );
            obs.observe(cardRef.current);
            observers.push(obs);
        }

        /* timeline line draw + sequential nodes */
        if (panelRef.current) {
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        if (lineRef.current) lineRef.current.classList.add('journey-line-draw');
                        nodesRef.current.forEach((node, i) => {
                            if (node) {
                                setTimeout(() => node.classList.add('journey-node-visible'), i * 150);
                            }
                        });
                        obs.disconnect();
                    }
                },
                { threshold: 0.2 }
            );
            obs.observe(panelRef.current);
            observers.push(obs);
        }

        return () => observers.forEach(o => o.disconnect());
    }, []);

    return (
        <>
            <style>{`
                /* story card */
                .journey-card-init {
                    opacity: 0;
                    transform: translateY(40px);
                    transition: opacity 0.7s ease, transform 0.7s ease;
                }
                .journey-card-visible {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }

                /* timeline line */
                .journey-line-track {
                    position: relative;
                    height: 2px;
                    background: rgba(255,255,255,0.15);
                    border-radius: 9999px;
                    overflow: hidden;
                }
                .journey-line-fill {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg, #F5C542 0%, #ad7a00 100%);
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 1.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 9999px;
                }
                .journey-line-draw .journey-line-fill {
                    transform: scaleX(1);
                }

                /* milestone nodes */
                .journey-node-init {
                    opacity: 0;
                    transform: translateY(20px) scale(0.85);
                    transition: opacity 0.45s ease, transform 0.45s ease;
                }
                .journey-node-visible {
                    opacity: 1 !important;
                    transform: translateY(0) scale(1) !important;
                }

                /* hover on card */
                .journey-milestone-card {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .journey-milestone-card:hover {
                    transform: translateY(-6px) scale(1.04);
                    box-shadow: 0 12px 40px rgba(240, 180, 0, 0.3);
                }

                /* red accent glow on first (highlighted) node icon */
                .journey-icon-crimson {
                    filter: drop-shadow(0 0 8px rgba(200, 30, 58, 0.7));
                }
            `}</style>

            <section className="relative py-12 lg:py-16 overflow-hidden">

                {/* ── Background Video (unchanged) ── */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="/journey-bg.mp4" type="video/mp4" />
                </video>
                {/* overlay */}
                <div className="absolute inset-0 bg-black/40" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center gap-6">

                    {/* ══════════════════════════════════════
                        TOP STORY CARD
                    ══════════════════════════════════════ */}
                    <div
                        ref={cardRef}
                        className="journey-card-init w-full lg:max-w-[60%]"
                    >
                        <div
                            className="w-full flex flex-col md:flex-row items-center gap-4 px-5 py-4 rounded-[16px]"
                            style={{
                                background: 'rgba(10, 10, 10, 0.65)',
                                backdropFilter: 'blur(15px)',
                                WebkitBackdropFilter: 'blur(15px)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                boxShadow: '0 12px 40px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255,255,255,0.05)',
                            }}
                        >
                            {/* Left */}
                            <div className="flex-1 min-w-0 w-full text-center md:text-left">
                                <span
                                    className="inline-block text-xs font-bold tracking-[3px] uppercase mb-1"
                                    style={{ color: '#F5C542' }}
                                >
                                    OUR JOURNEY
                                </span>
                                <h2 className="text-white font-bold text-xl md:text-2xl leading-tight mb-2">
                                    We Started Our&nbsp;Journey
                                </h2>
                                <p
                                    className="text-xs leading-5 mb-3"
                                    style={{ color: 'rgba(255,255,255,0.78)' }}
                                >
                                    Every successful journey begins with a vision. For RD ECO Developers Pvt. Ltd., that vision started in 2013 with a commitment to redefine urban living by delivering quality homes, commercial spaces, and lifestyle-driven communities across Bihar.
                                </p>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300"
                                    style={{
                                        border: '1.5px solid #F5C542',
                                        color: '#F5C542',
                                        background: 'transparent',
                                    }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLElement).style.background = '#F5C542';
                                        (e.currentTarget as HTMLElement).style.color = '#1a1200';
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                                        (e.currentTarget as HTMLElement).style.color = '#F5C542';
                                    }}
                                >
                                    Learn More <span>→</span>
                                </button>
                            </div>

                            {/* Right – gold line-art growth icon */}
                            <div
                                className="flex-shrink-0 flex items-center justify-center"
                                style={{ width: '80px', height: '80px', color: '#F5C542', opacity: 0.92 }}
                            >
                                <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                    {/* building silhouette */}
                                    <rect x="30" y="60" width="28" height="70" rx="3" stroke="currentColor" strokeWidth="2.5" />
                                    <rect x="66" y="40" width="28" height="90" rx="3" stroke="currentColor" strokeWidth="2.5" />
                                    <rect x="102" y="20" width="28" height="110" rx="3" stroke="currentColor" strokeWidth="2.5" />
                                    {/* windows */}
                                    <rect x="37" y="70" width="7" height="7" rx="1" fill="currentColor" opacity=".5" />
                                    <rect x="37" y="84" width="7" height="7" rx="1" fill="currentColor" opacity=".5" />
                                    <rect x="37" y="98" width="7" height="7" rx="1" fill="currentColor" opacity=".5" />
                                    <rect x="73" y="50" width="7" height="7" rx="1" fill="currentColor" opacity=".5" />
                                    <rect x="73" y="64" width="7" height="7" rx="1" fill="currentColor" opacity=".5" />
                                    <rect x="73" y="78" width="7" height="7" rx="1" fill="currentColor" opacity=".5" />
                                    <rect x="73" y="92" width="7" height="7" rx="1" fill="currentColor" opacity=".5" />
                                    <rect x="109" y="30" width="7" height="7" rx="1" fill="currentColor" opacity=".5" />
                                    <rect x="109" y="44" width="7" height="7" rx="1" fill="currentColor" opacity=".5" />
                                    <rect x="109" y="58" width="7" height="7" rx="1" fill="currentColor" opacity=".5" />
                                    <rect x="109" y="72" width="7" height="7" rx="1" fill="currentColor" opacity=".5" />
                                    {/* ground line */}
                                    <line x1="20" y1="130" x2="140" y2="130" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    {/* growth arrow */}
                                    <path d="M22 115 Q55 80 90 65 Q115 55 138 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 3" opacity=".6" />
                                    <path d="M130 28l10 3-3 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* ══════════════════════════════════════
                        TIMELINE PANEL
                    ══════════════════════════════════════ */}
                    <div
                        ref={panelRef}
                        className="w-full lg:max-w-[78%]"
                    >
                        <div
                            className="w-full px-5 py-4 rounded-[20px]"
                            style={{
                                background: 'linear-gradient(135deg, #0a0a0a 0%, #161616 60%, #0a0a0a 100%)',
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                boxShadow: '0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
                            }}
                        >
                            {/* Panel heading */}
                            <div className="text-center mb-4">
                                <span
                                    className="inline-block text-xs font-bold tracking-[3px] uppercase mb-0.5"
                                    style={{ color: '#F5C542', fontSize: '10px' }}
                                >
                                    OUR MILESTONE MOMENTS
                                </span>
                                <h3 className="text-white font-bold text-lg md:text-xl">
                                    A Journey of Growth &amp; Excellence
                                </h3>
                            </div>

                            {/* Timeline row */}
                            <div className="relative">

                                {/* Connecting line */}
                                <div
                                    ref={lineRef}
                                    className="journey-line-track mx-auto mb-0 hidden lg:block"
                                    style={{
                                        position: 'absolute',
                                        top: '17px',
                                        left: '8%',
                                        right: '8%',
                                        zIndex: 0,
                                    }}
                                >
                                    <div className="journey-line-fill" />
                                </div>

                                {/* Nodes */}
                                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-3 gap-y-6 lg:gap-y-3">
                                    {milestones.map((m, i) => (
                                        <div
                                            key={m.year}
                                            ref={el => { nodesRef.current[i] = el; }}
                                            className="journey-node-init flex flex-col items-center"
                                        >
                                            {/* Circular icon card */}
                                            <div
                                                className="journey-milestone-card flex items-center justify-center rounded-full mb-1.5 cursor-pointer"
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    background: m.highlighted
                                                        ? 'linear-gradient(135deg, #e26478, #a8152f)'
                                                        : '#FFFFFF',
                                                    color: m.highlighted ? '#ffffff' : '#ad7a00',
                                                    boxShadow: m.highlighted
                                                        ? '0 0 0 3px rgba(200,30,58,0.35), 0 6px 20px rgba(200,30,58,0.3)'
                                                        : '0 4px 16px rgba(0,0,0,0.25)',
                                                    border: m.highlighted ? 'none' : '2px solid rgba(214,153,0,0.25)',
                                                }}
                                            >
                                                <span className={m.highlighted ? 'journey-icon-crimson' : ''}>
                                                    {MilestoneIcons[i]}
                                                </span>
                                            </div>

                                            {/* Year */}
                                            <span
                                                className="font-bold text-xs mb-0.5"
                                                style={{ color: m.highlighted ? '#e26478' : '#FFFFFF' }}
                                            >
                                                {m.year}
                                            </span>

                                            {/* Title */}
                                            <span
                                                className="text-center font-semibold leading-tight mb-0.5"
                                                style={{ fontSize: '10px', color: m.highlighted ? '#e26478' : 'rgba(255,255,255,0.9)' }}
                                            >
                                                {m.title}
                                            </span>

                                            {/* Description */}
                                            <span
                                                className="text-center leading-snug mb-1"
                                                style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}
                                            >
                                                {m.desc}
                                            </span>

                                            {/* Read More Button */}
                                            <button
                                                onClick={() => {
                                                    setSelectedMilestone(m);
                                                    setTimelineModalOpen(true);
                                                }}
                                                className="text-[8px] font-semibold transition-all duration-300 px-2 py-0.5 rounded-full"
                                                style={{
                                                    color: '#F5C542',
                                                    background: 'rgba(240, 180, 0, 0.15)',
                                                    border: '1px solid rgba(240, 180, 0, 0.35)',
                                                }}
                                                onMouseEnter={e => {
                                                    (e.currentTarget as HTMLElement).style.background = 'rgba(240, 180, 0, 0.28)';
                                                }}
                                                onMouseLeave={e => {
                                                    (e.currentTarget as HTMLElement).style.background = 'rgba(240, 180, 0, 0.15)';
                                                }}
                                            >
                                                Read More
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Journey Story Modal */}
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
                                {/* Header */}
                                <div className="sticky top-0 z-10 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 px-6 py-4 flex items-center justify-between">
                                    <div>
                                        <span className="block text-xs font-semibold text-green-100 uppercase tracking-wider mb-1">
                                            OUR JOURNEY
                                        </span>
                                        <h3 className="text-xl font-bold text-white">
                                            Building Trust. Creating Landmarks. Shaping Bihar's Future.
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="ml-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors flex-shrink-0"
                                        aria-label="Close modal"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="overflow-y-auto px-6 py-6 space-y-5" style={{ maxHeight: 'calc(85vh - 88px)' }}>
                                    {/* Introduction */}
                                    <div>
                                        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                            Every successful journey begins with a vision. For RD ECO Developers Pvt. Ltd., that vision started in <span className="font-semibold text-green-700 dark:text-green-400">2013</span> with a commitment to redefine urban living by delivering quality homes, commercial spaces, and lifestyle-driven communities across Bihar.
                                        </p>
                                    </div>

                                    {/* Growth Story */}
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                            <div className="w-1 h-6 bg-green-600 rounded-full" />
                                            From Dream to Reality
                                        </h4>
                                        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                            What began as a dream has grown into a <span className="font-semibold text-green-700 dark:text-green-400">trusted real estate brand</span> known for quality construction, transparency, timely delivery, and customer satisfaction. Every project we develop reflects our dedication to excellence, innovation, and long-term value.
                                        </p>
                                    </div>

                                    {/* Expansion */}
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                            <div className="w-1 h-6 bg-green-600 rounded-full" />
                                            Continuous Growth & Impact
                                        </h4>
                                        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                            Over the years, we have continuously expanded our footprint, successfully delivering residential and commercial developments that have transformed the lives of <span className="font-semibold text-green-700 dark:text-green-400">thousands of families</span>. From affordable homes to premium apartments and commercial landmarks, our journey is built on trust, integrity, and an unwavering commitment to quality.
                                        </p>
                                    </div>

                                    {/* Present & Future */}
                                    <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-gray-800 rounded-xl p-5 border border-green-200 dark:border-green-500/20">
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                            <div className="w-1 h-6 bg-green-600 rounded-full" />
                                            Today & Tomorrow
                                        </h4>
                                        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                                            Today, RD ECO Developers proudly stands among Bihar's growing real estate leaders, dedicated to creating sustainable, modern developments that enhance the quality of life for our residents while contributing to the region's urban transformation.
                                        </p>
                                    </div>

                                    {/* Core Pillars */}
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Our Journey is Built On:</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                                                <div>
                                                    <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Trust & Transparency</h5>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Honest dealings and clear communication</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                                                <div>
                                                    <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Quality Construction</h5>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Superior materials and craftsmanship</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                                                <div>
                                                    <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Timely Delivery</h5>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Projects completed on schedule</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                                                <div>
                                                    <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Customer Satisfaction</h5>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Dedicated support and after-sales service</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Timeline Details Modal - Compact Popup */}
                <AnimatePresence>
                    {timelineModalOpen && selectedMilestone && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            {/* Backdrop with blur */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                                onClick={() => setTimelineModalOpen(false)}
                            />

                            {/* Compact Modal Card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                className="relative w-full max-w-md max-h-[70vh] rounded-xl shadow-2xl overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, #ad7a00 0%, #0a0a0a 100%)',
                                }}
                            >
                                {/* Header */}
                                <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
                                    <div>
                                        <span className="block text-xs font-semibold text-gold-300 uppercase tracking-wider">
                                            {selectedMilestone.year}
                                        </span>
                                        <h3 className="text-base font-bold text-white">
                                            {selectedMilestone.details.heading}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setTimelineModalOpen(false)}
                                        className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex-shrink-0"
                                        aria-label="Close"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="overflow-y-auto px-4 py-4 space-y-3" style={{ maxHeight: 'calc(70vh - 70px)' }}>
                                    {/* Description */}
                                    <p className="text-xs leading-relaxed text-white/90">
                                        {selectedMilestone.details.description}
                                    </p>

                                    {/* Projects List */}
                                    {selectedMilestone.details.projects.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-bold text-white mb-2">Key Projects:</h4>
                                            <div className="space-y-1.5">
                                                {selectedMilestone.details.projects.map((project, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-start gap-2 px-2.5 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm"
                                                    >
                                                        <div className="w-1 h-1 rounded-full bg-gold-400 mt-1.5 flex-shrink-0" />
                                                        <span className="text-xs text-white/90">{project}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </section>
        </>
    );
}
