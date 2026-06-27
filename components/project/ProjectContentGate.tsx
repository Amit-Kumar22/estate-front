'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Eye } from 'lucide-react';
import { Project } from '@/types';
import OtpVerifyModal from '@/components/common/OtpVerifyModal';
import ProjectHeroCarousel from './ProjectHeroCarousel';
import ProjectOverview from './ProjectOverview';
import ProjectContactForm from './ProjectContactForm';
import AmenitiesSection from './AmenitiesSection';
import ImageUnlockSection from './ImageUnlockSection';
import ProjectMapWrapper from './ProjectMapWrapper';
import WriteReviewButton from '@/components/common/WriteReviewButton';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import BrochureDownloadButton from '@/components/common/BrochureDownloadButton';

interface ProjectContentGateProps {
  project: Project;
}

export default function ProjectContentGate({ project }: ProjectContentGateProps) {
  const UNLOCK_KEY = `project_unlocked_${project._id}`;
  const [unlocked, setUnlocked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(UNLOCK_KEY)) {
      setUnlocked(true);
    }
  }, [UNLOCK_KEY]);

  const handleUnlockSuccess = useCallback(() => {
    if (typeof window !== 'undefined') localStorage.setItem(UNLOCK_KEY, '1');
    setUnlocked(true);
    setModalOpen(false);
  }, [UNLOCK_KEY]);

  return (
    <>
      {/* Hero Carousel — first 2 images free, rest gated */}
      <ProjectHeroCarousel
        images={project.heroImages}
        projectName={project.name}
        unlocked={unlocked}
        onUnlockRequest={() => setModalOpen(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main Content Column ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Always visible: title, stats, description, key highlights */}
            <ProjectOverview project={project} hideConfiguration />

            {/* ── Gated Section ── */}
            <div className="relative">
              {/* Gradient fade at top edge of blurred area */}
              {!unlocked && (
                <div className="absolute -top-6 left-0 right-0 h-10 bg-gradient-to-b from-white dark:from-[#0a0a0a] to-transparent z-20 pointer-events-none" />
              )}

              {/* Content (blurred when locked) */}
              <div className={!unlocked ? 'blur-sm pointer-events-none select-none' : 'space-y-8'}>

                {/* Configuration & Pricing */}
                {project.configuration?.length > 0 && (
                  <div className={!unlocked ? 'mb-8' : ''}>
                    <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-3">
                      Configuration &amp; Pricing
                    </h2>
                    <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-[#1f1f1f]">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-[#1a1a1a]">
                            <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Area</th>
                            <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {project.configuration.map((config, i) => (
                            <tr
                              key={i}
                              className={`border-t border-gray-50 dark:border-[#1f1f1f] ${
                                i % 2 === 0 ? 'bg-white dark:bg-[#111]' : 'bg-gray-50/50 dark:bg-[#0f0f0f]'
                              }`}
                            >
                              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{config.type}</td>
                              <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{config.area}</td>
                              <td className="px-4 py-3 text-green-400 font-semibold">{config.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Amenities */}
                <AmenitiesSection amenities={project.amenities} />

                {/* Unlockable media (floor plans / interior photos) */}
                {(project.floorPlans?.length > 0 || project.interiorPhotos?.length > 0) && (
                  <ImageUnlockSection
                    projectId={project._id}
                    projectName={project.name}
                    floorPlans={project.floorPlans}
                    interiorPhotos={project.interiorPhotos}
                    virtualTourUrl={project.virtualTourUrl}
                  />
                )}

                {/* Map */}
                {project.latitude && project.longitude && (
                  <div>
                    <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Project Location
                    </h2>
                    <ProjectMapWrapper
                      lat={project.latitude}
                      lng={project.longitude}
                      name={project.name}
                      location={project.location}
                    />
                  </div>
                )}
              </div>

              {/* Unlock overlay */}
              {!unlocked && (
                <div className="absolute inset-0 flex items-start justify-center pt-16 px-4 z-10">
                  <div className="bg-white/95 dark:bg-[#111]/95 backdrop-blur-md rounded-2xl p-7 shadow-2xl border border-gray-100 dark:border-[#2a2a2a] text-center max-w-sm w-full">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
                      Unlock Full Project Details
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
                      Verify your identity to access configuration, amenities, floor plans, and project location.
                    </p>
                    <button
                      onClick={() => setModalOpen(true)}
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-all shadow-lg shadow-green-500/20"
                    >
                      <Eye className="w-4 h-4" />
                      Show Full
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Sidebar — always visible ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-5">
              <ProjectContactForm
                projectId={project._id}
                projectName={project.name}
                brochureUrl={project.brochureUrl}
              />
              <WriteReviewButton variant="sidebar" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating buttons */}
      <WhatsAppButton />
      <BrochureDownloadButton
        projectId={project._id}
        projectName={project.name}
        brochureUrl={project.brochureUrl}
      />

      {/* OTP Unlock Modal */}
      {modalOpen && (
        <OtpVerifyModal
          projectId={project._id}
          projectName={project.name}
          source="project_detail"
          title="Unlock Full Details"
          subtitle="Enter your details — we'll verify your email with a one-time code."
          onClose={() => setModalOpen(false)}
          onSuccess={handleUnlockSuccess}
        />
      )}
    </>
  );
}
