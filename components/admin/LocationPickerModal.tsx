'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Search, MapPin, Loader2, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import appConfig from '@/config/app.config';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (lat: number, lng: number, address: string) => void;
}

interface SearchResult {
  lat: string;
  lon: string;
  display_name: string;
}

interface SelectedLocation {
  lat: number;
  lng: number;
  address: string;
}

type LeafletType = typeof import('leaflet');

export default function LocationPickerModal({ isOpen, onClose, onSelect }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<ReturnType<LeafletType['map']> | null>(null);
  const markerRef = useRef<ReturnType<LeafletType['marker']> | null>(null);
  const lRef = useRef<LeafletType | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<SelectedLocation | null>(null);

  const formatAddress = (addr: Record<string, string | undefined>) => {
    const suburb = addr.suburb || addr.neighbourhood || addr.road || '';
    const city = addr.city || addr.town || addr.village || addr.county || '';
    const state = addr.state || '';
    const parts = [suburb, city, state].filter(Boolean);
    return [...new Set(parts)].join(', ');
  };

  const placeMarker = useCallback(async (lat: number, lng: number) => {
    if (!mapInstanceRef.current || !lRef.current) return;
    const L = lRef.current;
    if (markerRef.current) markerRef.current.remove();
    const marker = L.marker([lat, lng]).addTo(mapInstanceRef.current);
    markerRef.current = marker;
  }, []);

  // Init / destroy map when isOpen changes
  useEffect(() => {
    if (!isOpen) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
      return;
    }

    // Small delay so the modal DOM is fully mounted and visible
    const timer = setTimeout(async () => {
      if (!mapRef.current) return;
      try {
        const L = (await import('leaflet')).default;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error – leaflet CSS is valid at runtime
        await import('leaflet/dist/leaflet.css');

        lRef.current = L;

        const DefaultIcon = L.icon({
          iconUrl: appConfig.map.marker.iconUrl,
          iconRetinaUrl: appConfig.map.marker.iconRetinaUrl,
          shadowUrl: appConfig.map.marker.shadowUrl,
          iconSize: appConfig.map.marker.iconSize,
          iconAnchor: appConfig.map.marker.iconAnchor,
          popupAnchor: appConfig.map.marker.popupAnchor,
        });
        L.Marker.prototype.options.icon = DefaultIcon;

        if (mapInstanceRef.current) mapInstanceRef.current.remove();

        const map = L.map(mapRef.current, {
          center: [appConfig.map.defaultCenter.lat, appConfig.map.defaultCenter.lng],
          zoom: appConfig.map.defaultZoom,
          zoomControl: true,
          scrollWheelZoom: true,
        });
        mapInstanceRef.current = map;

        L.tileLayer(appConfig.map.tiles.url, {
          attribution: appConfig.map.tiles.attribution,
          maxZoom: appConfig.map.tiles.maxZoom,
        }).addTo(map);

        map.on('click', async (e: import('leaflet').LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          await placeMarker(lat, lng);
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
              { headers: { 'Accept-Language': 'en' } }
            );
            const data = await res.json();
            const address = formatAddress(data.address || {}) || data.display_name;
            setSelected({ lat, lng, address });
          } catch {
            setSelected({ lat, lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` });
          }
        });
      } catch (err) {
        console.error('Map init failed:', err);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [isOpen, placeMarker]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchResults([]);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data: SearchResult[] = await res.json();
      setSearchResults(data);
    } catch {
      // ignore
    } finally {
      setSearching(false);
    }
  }, [searchQuery]);

  const handleResultClick = useCallback(async (result: SearchResult) => {
    setSearchResults([]);
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 14);
    }
    await placeMarker(lat, lng);

    const shortName = result.display_name.split(',').slice(0, 3).map((s) => s.trim()).join(', ');
    setSearchQuery(shortName);
    setSelected({ lat, lng, address: shortName });
  }, [placeMarker]);

  const handleConfirm = useCallback(() => {
    if (!selected) return;
    onSelect(selected.lat, selected.lng, selected.address);
    onClose();
    setSelected(null);
    setSearchQuery('');
  }, [selected, onSelect, onClose]);

  const handleClose = useCallback(() => {
    onClose();
    setSelected(null);
    setSearchQuery('');
    setSearchResults([]);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#1f1f1f] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#1f1f1f] flex-shrink-0">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-500" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Choose Location on Map
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 pt-3 pb-2 flex-shrink-0 relative z-10">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search city, area or address…"
                    className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={searching || !searchQuery.trim()}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  Search
                </button>
              </div>

              {/* Search results dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute left-4 right-4 mt-1 rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#0d0d0d] shadow-xl overflow-hidden z-20">
                  {searchResults.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => handleResultClick(r)}
                      className="w-full text-left px-3 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-500/5 border-b border-gray-100 dark:border-[#1f1f1f] last:border-0 transition-colors flex items-start gap-2"
                    >
                      <MapPin className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{r.display_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Map */}
            <div className="flex-1 relative min-h-[360px]">
              <div ref={mapRef} className="absolute inset-0" />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[400] pointer-events-none">
                <div className="bg-white/90 dark:bg-[#111]/90 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-[#1f1f1f] shadow-sm">
                  Click anywhere on the map to drop a pin
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-[#1f1f1f] bg-gray-50/50 dark:bg-[#0d0d0d] flex-shrink-0">
              <div className="flex-1 min-w-0 mr-4">
                {selected ? (
                  <div>
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-px" />
                      <span className="truncate">{selected.address}</span>
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 pl-5">
                      {selected.lat.toFixed(6)}, {selected.lng.toFixed(6)}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No location selected — click the map or search above</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-xs rounded-lg border border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-[#2f2f2f] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selected}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  Use This Location
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
