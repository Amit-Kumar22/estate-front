'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { projectApi } from '@/lib/api';
import { ArrowLeft, Plus, X, Loader2, Save, Upload, LocateFixed, Map } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const LocationPickerModal = dynamic(
  () => import('@/components/admin/LocationPickerModal'),
  { ssr: false }
);

const STATUS_OPTIONS = [
  { value: 'current', label: 'Current' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
];

interface ConfigRow { type: string; area: string; price: string; }

export default function CreateProjectPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: '', location: '', status: 'current', price: '', shortDescription: '',
    description: '', possessionDate: '', latitude: '', longitude: '',
    virtualTourUrl: '', metaTitle: '', metaDescription: '',
    featured: false, isActive: true,
  });
  const [highlights, setHighlights] = useState<string[]>(['']);
  const [amenities, setAmenities] = useState<string[]>(['']);
  const [configurations, setConfigurations] = useState<ConfigRow[]>([{ type: '', area: '', price: '' }]);
  const [heroImages, setHeroImages] = useState<File[]>([]);
  const [brochure, setBrochure] = useState<File | null>(null);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const createMutation = useMutation({
    mutationFn: (fd: FormData) => projectApi.create(fd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast.success('Project created successfully');
      router.push('/admin/projects');
    },
    onError: () => toast.error('Failed to create project'),
  });

  const applyLocation = useCallback((lat: number, lng: number, address: string) => {
    setForm((f) => ({
      ...f,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
      location: f.location || address,
    }));
  }, []);

  const handleGetCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const addr = data.address || {};
          const suburb = addr.suburb || addr.neighbourhood || addr.road || '';
          const city = addr.city || addr.town || addr.village || addr.county || '';
          const state = addr.state || '';
          const parts = [suburb, city, state].filter(Boolean);
          const address = [...new Set(parts)].join(', ') || data.display_name;
          applyLocation(lat, lng, address);
          toast.success('Location filled from GPS');
        } catch {
          applyLocation(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          toast.success('Coordinates filled from GPS');
        } finally {
          setGettingLocation(false);
        }
      },
      (err) => {
        setGettingLocation(false);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error('Location access denied. Please allow location in browser settings.');
        } else {
          toast.error('Could not get your location. Please try again.');
        }
      },
      { timeout: 10000 }
    );
  }, [applyLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.location || !form.price) {
      toast.error('Name, location and price are required');
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    fd.append('highlights', JSON.stringify(highlights.filter(Boolean)));
    fd.append('amenities', JSON.stringify(amenities.filter(Boolean)));
    fd.append('configuration', JSON.stringify(configurations.filter((c) => c.type)));
    heroImages.forEach((f) => fd.append('heroImages', f));
    if (brochure) fd.append('brochure', brochure);

    createMutation.mutate(fd);
  };

  const addRow = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, blank: T) =>
    setter((prev) => [...prev, blank]);

  const removeRow = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, i: number) =>
    setter((prev) => prev.filter((_, idx) => idx !== i));

  const updateRow = <T extends object>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    i: number,
    field: keyof T,
    value: string
  ) => setter((prev) => prev.map((row, idx) => idx === i ? { ...row, [field]: value } : row));

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/projects" className="p-2 rounded-lg border border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-[#2f2f2f] transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create New Project</h2>
          <p className="text-xs text-gray-500">Fill in the project details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <Section title="Basic Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Project Name *">
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. The Grand Residences" className={inputCls} />
            </Field>
            <Field label="Location *">
              <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="e.g. Bandra, Mumbai" className={inputCls} />
            </Field>
            <Field label="Status *">
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className={inputCls}>
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="Starting Price *">
              <input value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="e.g. ₹1.5 Cr onwards" className={inputCls} />
            </Field>
            <Field label="Possession Date">
              <input value={form.possessionDate} onChange={(e) => setForm((f) => ({ ...f, possessionDate: e.target.value }))} placeholder="e.g. Dec 2026" className={inputCls} />
            </Field>
            <Field label="Virtual Tour URL">
              <input value={form.virtualTourUrl} onChange={(e) => setForm((f) => ({ ...f, virtualTourUrl: e.target.value }))} placeholder="https://..." className={inputCls} />
            </Field>
          </div>
          {/* Location buttons */}
          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={gettingLocation}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/5 hover:bg-blue-100 dark:hover:bg-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {gettingLocation ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LocateFixed className="w-3.5 h-3.5" />
              )}
              {gettingLocation ? 'Getting location…' : 'Get Current Location'}
            </button>
            <button
              type="button"
              onClick={() => setLocationPickerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/5 hover:bg-green-100 dark:hover:bg-green-500/10 transition-all"
            >
              <Map className="w-3.5 h-3.5" />
              Choose Location on Map
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <Field label="Latitude">
              <input type="number" step="any" value={form.latitude} onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))} placeholder="e.g. 19.0760" className={inputCls} />
            </Field>
            <Field label="Longitude">
              <input type="number" step="any" value={form.longitude} onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))} placeholder="e.g. 72.8777" className={inputCls} />
            </Field>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="accent-green-500" />
              Featured project
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="accent-green-500" />
              Active (visible on site)
            </label>
          </div>
        </Section>

        {/* Descriptions */}
        <Section title="Descriptions">
          <Field label="Short Description">
            <textarea value={form.shortDescription} onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))} rows={2} placeholder="Brief summary shown on cards…" className={`${inputCls} resize-none`} />
          </Field>
          <div className="mt-4">
            <Field label="Full Description">
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} placeholder="Detailed project description…" className={`${inputCls} resize-none`} />
            </Field>
          </div>
        </Section>

        {/* Configurations */}
        <Section title="Unit Configurations">
          <div className="space-y-2">
            {configurations.map((row, i) => (
              <div key={i} className="grid grid-cols-3 gap-2">
                <input value={row.type} onChange={(e) => updateRow(setConfigurations, i, 'type', e.target.value)} placeholder="e.g. 2 BHK" className={inputCls} />
                <input value={row.area} onChange={(e) => updateRow(setConfigurations, i, 'area', e.target.value)} placeholder="e.g. 950 sq ft" className={inputCls} />
                <div className="flex gap-1">
                  <input value={row.price} onChange={(e) => updateRow(setConfigurations, i, 'price', e.target.value)} placeholder="Price" className={inputCls} />
                  {configurations.length > 1 && (
                    <button type="button" onClick={() => removeRow(setConfigurations, i)} className="p-2 text-gray-500 hover:text-red-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addRow(setConfigurations, { type: '', area: '', price: '' })} className="mt-2 text-xs text-green-500 hover:text-green-400 flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add configuration
          </button>
        </Section>

        {/* Highlights & Amenities */}
        <Section title="Highlights &amp; Amenities">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-400 font-medium mb-2">Highlights</p>
              {highlights.map((h, i) => (
                <div key={i} className="flex gap-1 mb-1.5">
                  <input value={h} onChange={(e) => setHighlights((prev) => prev.map((v, idx) => idx === i ? e.target.value : v))} placeholder={`Highlight ${i + 1}`} className={inputCls} />
                  {highlights.length > 1 && <button type="button" onClick={() => removeRow(setHighlights, i)} className="text-gray-500 hover:text-red-400"><X className="w-3.5 h-3.5" /></button>}
                </div>
              ))}
              <button type="button" onClick={() => addRow(setHighlights, '' as string)} className="text-xs text-green-500 hover:text-green-400 flex items-center gap-1 mt-1"><Plus className="w-3 h-3" /> Add</button>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-2">Amenities</p>
              {amenities.map((a, i) => (
                <div key={i} className="flex gap-1 mb-1.5">
                  <input value={a} onChange={(e) => setAmenities((prev) => prev.map((v, idx) => idx === i ? e.target.value : v))} placeholder={`e.g. Swimming Pool`} className={inputCls} />
                  {amenities.length > 1 && <button type="button" onClick={() => removeRow(setAmenities, i)} className="text-gray-500 hover:text-red-400"><X className="w-3.5 h-3.5" /></button>}
                </div>
              ))}
              <button type="button" onClick={() => addRow(setAmenities, '' as string)} className="text-xs text-green-500 hover:text-green-400 flex items-center gap-1 mt-1"><Plus className="w-3 h-3" /> Add</button>
            </div>
          </div>
        </Section>

        {/* Media */}
        <Section title="Media">
          <div className="space-y-4">
            {/* Hero Images */}
            <div>
              <p className="text-xs text-gray-400 font-medium mb-2">
                Hero Images
                <span className="ml-1 text-gray-300 dark:text-gray-600">(first 2 shown to all visitors, rest gated)</span>
              </p>
              <label className="flex flex-col items-center justify-center gap-2 h-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-[#1f1f1f] hover:border-green-500/40 cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">
                  {heroImages.length ? `+ Add more images (${heroImages.length} selected)` : 'Click to select images'}
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const incoming = Array.from(e.target.files ?? []);
                    setHeroImages((prev) => [...prev, ...incoming]);
                    // reset so same files can be re-added if needed
                    e.target.value = '';
                  }}
                />
              </label>

              {/* Preview grid */}
              {heroImages.length > 0 && (
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {heroImages.map((file, i) => {
                    const url = URL.createObjectURL(file);
                    return (
                      <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-[#1a1a1a]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`preview-${i}`} className="w-full h-full object-cover" onLoad={() => URL.revokeObjectURL(url)} />
                        {i === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] bg-green-600/80 text-white py-0.5">Cover</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setHeroImages((prev) => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white transition-opacity"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Brochure */}
            <div>
              <p className="text-xs text-gray-400 font-medium mb-2">Brochure (PDF)</p>
              <label className="flex flex-col items-center justify-center gap-2 h-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-[#1f1f1f] hover:border-green-500/40 cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">
                  {brochure ? brochure.name : 'Click to upload PDF'}
                </span>
                <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setBrochure(e.target.files?.[0] ?? null)} />
              </label>
            </div>
          </div>
        </Section>

        {/* SEO */}
        <Section title="SEO (Optional)">
          <div className="space-y-3">
            <Field label="Meta Title"><input value={form.metaTitle} onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))} placeholder="Custom page title for search engines" className={inputCls} /></Field>
            <Field label="Meta Description"><textarea value={form.metaDescription} onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))} rows={2} placeholder="150-160 character description" className={`${inputCls} resize-none`} /></Field>
          </div>
        </Section>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-green-600 hover:bg-green-700 text-white transition-all disabled:opacity-60"
          >
            {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {createMutation.isPending ? 'Creating…' : 'Create Project'}
          </button>
          <Link href="/admin/projects" className="px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-[#2f2f2f] transition-all">
            Cancel
          </Link>
        </div>
      </form>
      <LocationPickerModal
        isOpen={locationPickerOpen}
        onClose={() => setLocationPickerOpen(false)}
        onSelect={(lat, lng, address) => {
          applyLocation(lat, lng, address);
          setLocationPickerOpen(false);
        }}
      />
    </div>
  );
}

const inputCls = 'w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#1f1f1f] p-5 shadow-sm dark:shadow-none">
      <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
