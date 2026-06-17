'use client';

import { MapPin } from 'lucide-react';

const milestones = ['2011', '2016', '2017', '2020', '2024', '2025'];

export default function JourneyTimelineSection() {
    return (
        <section className="relative py-20 lg:py-28 overflow-hidden">


            {/* Background Video */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src="/journey-bg.mp4" type="video/mp4" />
            </video>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/35" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">

                {/* Story Card */}
                
                <div className="max-w-4xl mx-auto -mt-20">
                  <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-[28px] px-8 py-4 md:px-10 md:py-5 shadow-2xl">

                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                            We Started Our Journey
                        </h2>

                        <p className="text-white/90 text-base md:text-lg leading-8">
                           The new company pvt Ltd. began its journey with a vision
                            to redefine modern living through premium residential and commercial
                            developments. Over the years, we have built a strong reputation for
                            quality, innovation, and customer trust while delivering landmark
                            projects that shape communities.
                        </p>

                    </div>

                </div>

                {/* Timeline Card */}
                <div className="max-w-3xl mx-auto mt-40 relative z-20">
                    <div className="bg-[#031525]/95 backdrop-blur-xl rounded-2xl px-5 py-5 shadow-2xl">

                        {/* Yellow Line */}
                        <div className="w-12 h-[3px] bg-yellow-400 mx-auto rounded-full mb-4" />

                        {/* Heading */}
                        <h3 className="text-center text-white text-xl md:text-2xl font-bold tracking-[3px] mb-6">
                            OUR MILESTONE MOMENTS
                        </h3>

                        {/* Timeline */}
                        <div className="flex justify-between items-center max-w-2xl mx-auto">

                            {milestones.map((year, index) => (
                                <div
                                    key={year}
                                    className="flex flex-col items-center flex-1"
                                >

                                    <div className="w-full h-[2px] bg-white relative">

                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                                            <MapPin
                                                fill="currentColor"
                                                className={`w-5 h-5 ${index === 0
                                                    ? 'text-yellow-400'
                                                    : 'text-white'
                                                    }`}
                                            />
                                        </div>

                                    </div>

                                    <span
                                        className={`mt-4 text-base md:text-lg font-semibold ${index === 0
                                            ? 'text-yellow-400'
                                            : 'text-white'
                                            }`}
                                    >
                                        {year}
                                    </span>

                                </div>
                            ))}

                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}