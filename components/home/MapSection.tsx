'use client';

import React, { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { projectApi } from '@/lib/api';
import { Project } from '@/types';
import { getImageUrl } from '@/lib/utils';
import appConfig from '@/config/app.config';

export default function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  const { data } = useQuery({
    queryKey: ['projects-map'],
    queryFn: async () => {
      const res = await projectApi.getForMap();
      return res.data.data.projects as Project[];
    },
  });

  const projects = data || [];

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || !projects.length) return;

    let L: typeof import('leaflet') | null = null;

    const initMap = async () => {
      try {
        L = (await import('leaflet')).default;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error – leaflet CSS module is valid at runtime
        await import('leaflet/dist/leaflet.css');

        // Fix leaflet default marker icons using centralized config
        const DefaultIcon = L.icon({
          iconUrl: appConfig.map.marker.iconUrl,
          iconRetinaUrl: appConfig.map.marker.iconRetinaUrl,
          shadowUrl: appConfig.map.marker.shadowUrl,
          iconSize: appConfig.map.marker.iconSize,
          iconAnchor: appConfig.map.marker.iconAnchor,
          popupAnchor: appConfig.map.marker.popupAnchor,
        });
        L.Marker.prototype.options.icon = DefaultIcon;

        // Destroy existing map
        if (mapInstanceRef.current) {
          (mapInstanceRef.current as ReturnType<typeof L.map>).remove();
        }

        const map = L.map(mapRef.current!, {
          center: [appConfig.map.defaultCenter.lat, appConfig.map.defaultCenter.lng],
          zoom: appConfig.map.defaultZoom,
          zoomControl: true,
          scrollWheelZoom: false,
        });

        mapInstanceRef.current = map;

        // OpenStreetMap tile layer from centralized config
        L.tileLayer(appConfig.map.tiles.url, {
          attribution: appConfig.map.tiles.attribution,
          maxZoom: appConfig.map.tiles.maxZoom,
        }).addTo(map);

        // Add project markers
        projects.forEach((project) => {
          if (!project.latitude || !project.longitude) return;
          if (!L) return;

          const imageUrl = getImageUrl(project.heroImages?.[0]);
          const statusColors: Record<string, string> = {
            current: '#16a34a',
            upcoming: '#3b82f6',
            completed: '#6b7280',
          };
          const color = statusColors[project.status] || '#16a34a';

          const customIcon = L.divIcon({
            className: '',
            html: `
              <div style="
                width: 36px; height: 36px;
                background: ${color};
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 3px solid white;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                display: flex; align-items: center; justify-content: center;
              ">
                <div style="transform: rotate(45deg); font-size: 14px;">●</div>
              </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 36],
            popupAnchor: [0, -40],
          });

          const popupContent = `
            <div style="width: 220px; font-family: Inter, sans-serif; border-radius: 8px; overflow: hidden; background: #111; color: #f1f5f9;">
              <div style="height: 100px; background: url(${imageUrl}) center/cover no-repeat; position: relative;">
                <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.6), transparent)"></div>
                <div style="position: absolute; bottom: 8px; left: 8px;">
                  <span style="background: ${color}; color: white; padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: 600; text-transform: capitalize;">${project.status}</span>
                </div>
              </div>
              <div style="padding: 12px;">
                <h4 style="font-weight: 700; font-size: 13px; margin-bottom: 4px; color: #f1f5f9;">${project.name}</h4>
                <p style="font-size: 11px; color: #9ca3af; margin-bottom: 6px;">📍 ${project.location}</p>
                <p style="font-size: 12px; font-weight: 700; color: ${color}; margin-bottom: 10px;">${project.price}</p>
                <a href="/projects/${project.slug}" style="display: block; text-align: center; padding: 8px; background: ${color}; color: white; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 600;">
                  View Details →
                </a>
              </div>
            </div>
          `;

          L.marker([project.latitude, project.longitude], { icon: customIcon })
            .addTo(map)
            .bindPopup(L.popup({ maxWidth: 240, className: 'custom-popup' }).setContent(popupContent));
        });

        // Fit bounds to all markers
        if (projects.length > 1) {
          const validProjects = projects.filter((p) => p.latitude && p.longitude);
          if (validProjects.length > 1) {
            const bounds = L.latLngBounds(validProjects.map((p) => [p.latitude, p.longitude]));
            map.fitBounds(bounds, { padding: [50, 50] });
          }
        }
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
  }, [projects]);

  return (
    <section className="section bg-white dark:bg-[#0a0a0a]">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-500/8 border border-green-200 dark:border-green-500/15 mb-4">
            <MapPin className="w-3.5 h-3.5 text-green-600 dark:text-green-500" />
            <span className="text-green-700 dark:text-green-400 text-xs font-bold tracking-widest uppercase">
              Project Locations
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Find Us on the Map
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Explore all our project locations across India. Click on markers for project details.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden border border-green-200 dark:border-[#1f1f1f] shadow-green-md dark:shadow-xl"
        >
          <div ref={mapRef} className="w-full h-[450px] md:h-[500px]" />
          {projects.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-[#111]">
              <div className="text-center text-gray-400">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Loading map...</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6">
          {[
            { color: 'bg-green-500', label: 'Current' },
            { color: 'bg-blue-500', label: 'Upcoming' },
            { color: 'bg-gray-500', label: 'Completed' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
