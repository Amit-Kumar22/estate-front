'use client';

import { useEffect, useRef } from 'react';

const milestones = [
    {
        year: '2011',
        title: 'Company Founded',
        desc: 'The foundation of our journey.',
        highlighted: true,
    },
    {
        year: '2016',
        title: '100+ Projects Completed',
        desc: 'Delivering quality and building trust.',
        highlighted: false,
    },
    {
        year: '2017',
        title: 'New Manufacturing Unit',
        desc: 'Expanding our capabilities.',
        highlighted: false,
    },
    {
        year: '2020',
        title: 'ISO 9001:2015 Certified',
        desc: 'Commitment to certified quality.',
        highlighted: false,
    },
    {
        year: '2024',
        title: 'AI & Automation Division',
        desc: 'Innovation driving the future.',
        highlighted: false,
    },
    {
        year: '2025',
        title: 'Global Expansion Initiated',
        desc: 'Taking our vision worldwide.',
        highlighted: false,
    },
];

/* ── Milestone icon SVGs (blue / gold) ─────────────────────────── */
const MilestoneIcons = [
    /* 2011 – flag / founding */
    <svg key="flag" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <path d="M6 4v24M6 4l14 5-14 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    /* 2016 – checkmark badge */
    <svg key="check" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2" />
        <path d="M10 16l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    /* 2017 – factory */
    <svg key="factory" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <rect x="4" y="14" width="24" height="13" rx="1" stroke="currentColor" strokeWidth="2" />
        <path d="M4 14l8-7 8 7M16 14l8-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="13" y="20" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>,
    /* 2020 – shield */
    <svg key="shield" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <path d="M16 4L6 8v8c0 5.5 4.4 10.7 10 12 5.6-1.3 10-6.5 10-12V8L16 4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M11 16l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
    /* 2024 – chip / AI */
    <svg key="chip" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <rect x="9" y="9" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M13 4v5M19 4v5M13 23v5M19 23v5M4 13h5M4 19h5M23 13h5M23 19h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="13" y="13" width="6" height="6" rx="1" fill="currentColor" opacity=".4" />
    </svg>,
    /* 2025 – globe */
    <svg key="globe" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2" />
        <path d="M5 16h22M16 5c-3 3-5 6.5-5 11s2 8 5 11M16 5c3 3 5 6.5 5 11s-2 8-5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>,
];

export default function JourneyTimelineSection() {
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
                    background: linear-gradient(90deg, #F5C542 0%, #2D6BFF 100%);
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
                    box-shadow: 0 12px 40px rgba(45, 107, 255, 0.25);
                }

                /* gold glow on first node icon */
                .journey-icon-gold {
                    filter: drop-shadow(0 0 8px rgba(245, 197, 66, 0.7));
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
                                background: 'rgba(6, 18, 40, 0.65)',
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
                                    OUR STORY
                                </span>
                                <h2 className="text-white font-bold text-xl md:text-2xl leading-tight mb-2">
                                    We Started Our&nbsp;Journey
                                </h2>
                                <p
                                    className="text-xs leading-5 mb-3"
                                    style={{ color: 'rgba(255,255,255,0.78)' }}
                                >
                                    RD Heights Pvt. Ltd. began its journey with a vision to redefine
                                    modern living through premium residential and commercial
                                    developments. Over the years, we have built a strong reputation
                                    for quality, innovation, and customer trust — delivering landmark
                                    projects that shape communities.
                                </p>
                                <a
                                    href="#"
                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300"
                                    style={{
                                        border: '1.5px solid #F5C542',
                                        color: '#F5C542',
                                        background: 'transparent',
                                    }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLElement).style.background = '#F5C542';
                                        (e.currentTarget as HTMLElement).style.color = '#061A2E';
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                                        (e.currentTarget as HTMLElement).style.color = '#F5C542';
                                    }}
                                >
                                    Know More <span>→</span>
                                </a>
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
                                background: 'linear-gradient(135deg, #061A2E 0%, #0B2540 60%, #061A2E 100%)',
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
                                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-3 gap-y-6 lg:gap-y-3">
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
                                                        ? 'linear-gradient(135deg, #F5C542, #e0a800)'
                                                        : '#FFFFFF',
                                                    color: m.highlighted ? '#061A2E' : '#2D6BFF',
                                                    boxShadow: m.highlighted
                                                        ? '0 0 0 3px rgba(245,197,66,0.35), 0 6px 20px rgba(245,197,66,0.3)'
                                                        : '0 4px 16px rgba(0,0,0,0.25)',
                                                    border: m.highlighted ? 'none' : '2px solid rgba(45,107,255,0.2)',
                                                }}
                                            >
                                                <span className={m.highlighted ? 'journey-icon-gold' : ''}>
                                                    {MilestoneIcons[i]}
                                                </span>
                                            </div>

                                            {/* Year */}
                                            <span
                                                className="font-bold text-xs mb-0.5"
                                                style={{ color: m.highlighted ? '#F5C542' : '#FFFFFF' }}
                                            >
                                                {m.year}
                                            </span>

                                            {/* Title */}
                                            <span
                                                className="text-center font-semibold leading-tight mb-0.5"
                                                style={{ fontSize: '10px', color: m.highlighted ? '#F5C542' : 'rgba(255,255,255,0.9)' }}
                                            >
                                                {m.title}
                                            </span>

                                            {/* Description */}
                                            <span
                                                className="text-center leading-snug"
                                                style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}
                                            >
                                                {m.desc}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}
