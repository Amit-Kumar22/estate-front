import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import CompanyIntroSection from '@/components/home/CompanyIntroSection';
import GallerySection from '@/components/home/GallerySection';
import WelcomeSection from '@/components/home/WelcomeSection';
import VisionMissionSection from '@/components/home/VisionMissionSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import BlogSection from '@/components/home/BlogSection';
import FAQSection from '@/components/home/FAQSection';
import AwardsSection from '@/components/home/AwardsSection';
import JourneyTimelineSection from '@/components/home/JourneyTimelineSection';
import FamilyLegacySection from '@/components/home/FamilyLegacySection';
import TeamSection from '@/components/home/TeamSection';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import BrochureDownloadButton from '@/components/common/BrochureDownloadButton';
import Footer from '@/components/layout/Footer';
import MapSectionWrapper from '@/components/home/MapSectionWrapper';
import { settingsApi } from '@/lib/api';
import type { SiteSettings } from '@/types';

// Hero video/settings are managed live from the admin panel and must never be
// served from a stale build-time snapshot, so this route is opted out of
// static rendering/caching and re-fetches settings on every request.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getSettings(): Promise<Partial<SiteSettings> | null> {
  try {
    const res = await settingsApi.get();
    return (res.data?.data?.settings ?? null) as Partial<SiteSettings> | null;
  } catch {
    return null;
  }
}

/** Build the hero stats array from settings fields stored in MongoDB */
function buildHeroStats(settings: Partial<SiteSettings> | null) {
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
    videoUrls={settings?.heroVideoUrls ?? undefined}
    backgroundImages={settings?.heroBackgroundImages ?? undefined}
    stats={buildHeroStats(settings)}
  />

  <CompanyIntroSection />

  <WelcomeSection />

  <VisionMissionSection />

  <JourneyTimelineSection />

  {/* <FamilyLegacySection /> */}

  {/* <TeamSection /> */}

  <GallerySection />

  <WhyChooseUsSection />

  <BlogSection />

  <FAQSection />

  <MapSectionWrapper />

  <AwardsSection />
</main>
      <Footer />
      <WhatsAppButton
        phone={settings?.whatsappNumber ?? undefined}
        message={settings?.whatsappMessage ?? undefined}
      />
      <BrochureDownloadButton />
    </>
  );
}
