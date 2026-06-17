import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import GallerySection from '@/components/home/GallerySection';
import WelcomeSection from '@/components/home/WelcomeSection';
import FamilyLegacySection from '@/components/home/FamilyLegacySection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import BlogSection from '@/components/home/BlogSection';
import AwardsSection from '@/components/home/AwardsSection';
import JourneyTimelineSection from '@/components/home/JourneyTimelineSection';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import Footer from '@/components/layout/Footer';
import MapSectionWrapper from '@/components/home/MapSectionWrapper';
import { settingsApi } from '@/lib/api';
import TestimonialsSection from '@/components/home/TestimonialSection';

async function getSettings(): Promise<Record<string, string> | null> {
  try {
    const res = await settingsApi.get();
    return (res.data?.data?.settings ?? null) as Record<string, string> | null;
  } catch {
    return null;
  }
}

/** Build the hero stats array from settings fields stored in MongoDB */
function buildHeroStats(settings: Record<string, string> | null) {
  if (!settings) return undefined;

  const stats: { value: string; label: string }[] = [];
  if (settings.heroStat1Value && settings.heroStat1Label) {
    stats.push({ value: settings.heroStat1Value, label: settings.heroStat1Label });
  }
  if (settings.heroStat2Value && settings.heroStat2Label) {
    stats.push({ value: settings.heroStat2Value, label: settings.heroStat2Label });
  }
  if (settings.heroStat3Value && settings.heroStat3Label) {
    stats.push({ value: settings.heroStat3Value, label: settings.heroStat3Label });
  }
  return stats.length > 0 ? stats : undefined;
}

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <>
      <Navbar />
    <main>
  <Hero
    headline={settings?.heroHeadline ?? undefined}
    subheadline={settings?.heroSubheadline ?? undefined}
    videoUrl={settings?.heroVideoUrl ?? undefined}
    backgroundImage={settings?.heroBackgroundImage ?? undefined}
    stats={buildHeroStats(settings)}
  />

  <WelcomeSection />

  <FamilyLegacySection />

  <FeaturedProjects />
  <TestimonialsSection />

  <JourneyTimelineSection />

  <GallerySection />

  <WhyChooseUsSection />

  <BlogSection />

  <MapSectionWrapper />

  <AwardsSection />
</main>
      <Footer />
      <WhatsAppButton
        phone={settings?.whatsappNumber ?? undefined}
        message={settings?.whatsappMessage ?? undefined}
      />
    </>
  );
}
