import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import BrochureDownloadButton from '@/components/common/BrochureDownloadButton';
import ProjectHeroCarousel from '@/components/project/ProjectHeroCarousel';
import ProjectOverview from '@/components/project/ProjectOverview';
import AmenitiesSection from '@/components/project/AmenitiesSection';
import ProjectContactForm from '@/components/project/ProjectContactForm';
import ImageUnlockSection from '@/components/project/ImageUnlockSection';
import ProjectMapWrapper from '@/components/project/ProjectMapWrapper';
import { projectApi } from '@/lib/api';
import { Project } from '@/types';
import WriteReviewButton from '@/components/common/WriteReviewButton';

async function getProject(slug: string): Promise<Project | null> {
  try {
    const res = await projectApi.getBySlug(slug);
    return res.data.data.project;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: project.metaTitle || project.name,
    description: project.metaDescription || project.shortDescription,
    openGraph: {
      title: project.name,
      description: project.shortDescription,
      images: project.heroImages?.[0] ? [project.heroImages[0]] : [],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Carousel */}
        <ProjectHeroCarousel images={project.heroImages} projectName={project.name} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <ProjectOverview project={project} />
              <AmenitiesSection amenities={project.amenities} />

              {/* Unlock-able Content */}
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

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-5">
                <ProjectContactForm projectId={project._id} projectName={project.name} />
                {project.brochureUrl && (
                  <div className="bg-white dark:bg-[#111] rounded-xl border border-gray-100 dark:border-[#1f1f1f] p-5 text-center">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Download Project Brochure
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Get detailed floor plans and project specifications.
                    </p>
                    <button className="btn-primary w-full justify-center">
                      Download Brochure
                    </button>
                  </div>
                )}
                <WriteReviewButton variant="sidebar" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      <BrochureDownloadButton
        projectId={project._id}
        projectName={project.name}
        brochureUrl={project.brochureUrl}
      />
    </>
  );
}
