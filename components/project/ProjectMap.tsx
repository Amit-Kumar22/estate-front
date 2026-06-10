'use client';

import React, { useEffect, useRef } from 'react';
import appConfig from '@/config/app.config';

interface ProjectMapProps {
  lat: number;
  lng: number;
  name: string;
  location: string;
}

export default function ProjectMap({ lat, lng, name, location }: ProjectMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error – leaflet CSS module is valid at runtime
        await import('leaflet/dist/leaflet.css');

        if (mapInstanceRef.current) {
          (mapInstanceRef.current as { remove: () => void }).remove();
        }

        const map = L.map(mapRef.current!, {
          center: [lat, lng],
          zoom: appConfig.map.projectZoom,
          scrollWheelZoom: false,
        });

        mapInstanceRef.current = map;

        // OpenStreetMap tile layer from centralized config
        L.tileLayer(appConfig.map.tiles.url, {
          attribution: appConfig.map.tiles.attribution,
          maxZoom: appConfig.map.tiles.maxZoom,
        }).addTo(map);

        const customIcon = L.divIcon({
          className: '',
          html: `
            <div style="
              width: 36px; height: 36px;
              background: #16a34a;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid white;
              box-shadow: 0 4px 12px rgba(22, 163, 74, 0.4);
            "></div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -40],
        });

        L.marker([lat, lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(`<strong>${name}</strong><br/>${location}`)
          .openPopup();
      } catch (err) {
        console.error('Map init failed:', err);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, name, location]);

  return (
    <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-[#1f1f1f] shadow-md">
      <div ref={mapRef} className="w-full h-72" />
    </div>
  );
}

