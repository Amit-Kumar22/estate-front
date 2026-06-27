import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProjectContentGate from '@/components/project/ProjectContentGate';
import { projectApi } from '@/lib/api';
import { Project } from '@/types';

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
        <ProjectContentGate project={project} />
      </main>
      <Footer />
    </>
  );
}
