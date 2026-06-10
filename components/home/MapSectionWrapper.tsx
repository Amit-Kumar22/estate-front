'use client';

import dynamic from 'next/dynamic';

// `ssr: false` is only valid inside a Client Component.
// This wrapper exists solely to satisfy that constraint.
const MapSection = dynamic(() => import('@/components/home/MapSection'), {
  ssr: false,
  loading: () => (
    <div className="section bg-white dark:bg-[#0a0a0a]">
      <div className="container-custom">
        <div className="h-96 rounded-2xl skeleton" />
      </div>
    </div>
  ),
});

export default function MapSectionWrapper() {
  return <MapSection />;
}
