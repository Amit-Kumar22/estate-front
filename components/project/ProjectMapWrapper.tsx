'use client';

import dynamic from 'next/dynamic';

// `ssr: false` is only valid inside a Client Component.
// This wrapper exists solely to satisfy that Next.js 15 constraint.
const ProjectMap = dynamic(() => import('@/components/project/ProjectMap'), {
  ssr: false,
  loading: () => <div className="h-72 rounded-xl skeleton" />,
});

interface Props {
  lat: number;
  lng: number;
  name: string;
  location: string;
}

export default function ProjectMapWrapper({ lat, lng, name, location }: Props) {
  return <ProjectMap lat={lat} lng={lng} name={name} location={location} />;
}
