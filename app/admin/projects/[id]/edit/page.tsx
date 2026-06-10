'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '@/lib/api';
import { Project } from '@/types';
import { ArrowLeft, Plus, X, Loader2, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';
import { queryKeys } from '@/lib/constants/query-keys';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: 'current', label: 'Current' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
];

interface ConfigRow { type: string; area: string; price: string; }

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: async () => {
      const res = await projectApi.getById(id);
      return res.data.data.project as Project;
    },
    enabled: !!id,
  });

  const [form, setForm] = useState({
    name: '', location: '', status: 'current', price: '', shortDescription: '',
    description: '', possessionDate: '', latitude: '', longitude: '',
    virtualTourUrl: '', metaTitle: '', metaDescription: '',
    featured: false, isActive: true,
  });
  const [highlights, setHighlights] = useState<string[]>(['']);
  const [amenities, setAmenities] = useState<string[]>(['']);
  const [configurations, setConfigurations] = useState<ConfigRow[]>([{ type: '', area: '', price: '' }]);
  const [newHeroImages, setNewHeroImages] = useState<File[]>([]);
  const [newBrochure, setNewBrochure] = useState<File | null>(null);

  useEffect(() => {
    if (!project) return;
    setForm({
      name: project.name,
      location: project.location,
      status: project.status,
      price: project.price,
      shortDescription: project.shortDescription ?? '',
      description: project.description ?? '',
      possessionDate: project.possessionDate ?? '',
      latitude: String(project.latitude ?? ''),
      longitude: String(project.longitude ?? ''),
      virtualTourUrl: project.virtualTourUrl ?? '',
      metaTitle: project.metaTitle ?? '',
      metaDescription: project.metaDescription ?? '',
      featured: project.featured,
      isActive: project.isActive,
    });
    setHighlights(project.highlights?.length ? project.highlights : ['']);
    setAmenities(project.amenities?.length ? project.amenities : ['']);
    setConfigurations(
      project.configuration?.length
        ? project.configuration
        : [{ type: '', area: '', price: '' }]
    );
  }, [project]);

  const updateMutation = useMutation({
    mutationFn: (fd: FormData) => projectApi.update(id, fd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(id) });
      toast.success('Project updated');
      router.push('/admin/projects');
    },
    onError: () => toast.error('Failed to update project'),
  });

  const deleteImageMutation = useMutation({
    mutationFn: ({ imageUrl, type }: { imageUrl: string; type: string }) =>
      projectApi.removeImage(id, imageUrl, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(id) });
      toast.success('Image removed');
    },
    onError: () => toast.error('Failed to remove image'),
  });

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
    newHeroImages.forEach((f) => fd.append('heroImages', f));
    if (newBrochure) fd.append('brochure', newBrochure);
    updateMutation.mutate(fd);
  };

  const addRow = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, blank: T) =>
    setter((prev) => [...prev, blank]);
  const removeRow = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, i: number) =>
    setter((prev) => prev.filter((_, idx) => idx !== i));
  const updateRow = <T extends object>(
    setter: React.Dispatch<React.SetStateAction<T[]>>, i: number, field: keyof T, value: string
  ) => setter((prev) => prev.map((row, idx) => idx === i ? { ...row, [field]: value } : row));

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-4">
        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 rounded-xl skeleton" />)}
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/projects" className="p-2 rounded-lg border border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-[#2f2f2f] transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Project</h2>
          <p className="text-xs text-gray-500">{project?.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <Section title="Basic Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Project Name *">
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Location *">
              <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Status *">
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className={inputCls}>
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="Starting Price *">
              <input value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Possession Date">
              <input value={form.possessionDate} onChange={(e) => setForm((f) => ({ ...f, possessionDate: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Virtual Tour URL">
              <input value={form.virtualTourUrl} onChange={(e) => setForm((f) => ({ ...f, virtualTourUrl: e.target.value }))} className={inputCls} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Field label="Latitude">
              <input type="number" step="any" value={form.latitude} onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Longitude">
              <input type="number" step="any" value={form.longitude} onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))} className={inputCls} />
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
            <textarea value={form.shortDescription} onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))} rows={2} className={`${inputCls} resize-none`} />
          </Field>
          <div className="mt-4">
            <Field label="Full Description">
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} className={`${inputCls} resize-none`} />
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
                  <input value={h} onChange={(e) => setHighlights((prev) => prev.map((v, idx) => idx === i ? e.target.value : v))} className={inputCls} />
                  {highlights.length > 1 && <button type="button" onClick={() => removeRow(setHighlights, i)} className="text-gray-500 hover:text-red-400"><X className="w-3.5 h-3.5" /></button>}
                </div>
              ))}
              <button type="button" onClick={() => addRow(setHighlights, '' as string)} className="text-xs text-green-500 hover:text-green-400 flex items-center gap-1 mt-1"><Plus className="w-3 h-3" /> Add</button>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-2">Amenities</p>
              {amenities.map((a, i) => (
                <div key={i} className="flex gap-1 mb-1.5">
                  <input value={a} onChange={(e) => setAmenities((prev) => prev.map((v, idx) => idx === i ? e.target.value : v))} className={inputCls} />
                  {amenities.length > 1 && <button type="button" onClick={() => removeRow(setAmenities, i)} className="text-gray-500 hover:text-red-400"><X className="w-3.5 h-3.5" /></button>}
                </div>
              ))}
              <button type="button" onClick={() => addRow(setAmenities, '' as string)} className="text-xs text-green-500 hover:text-green-400 flex items-center gap-1 mt-1"><Plus className="w-3 h-3" /> Add</button>
            </div>
          </div>
        </Section>

        {/* Existing Hero Images */}
        {project?.heroImages && project.heroImages.length > 0 && (
          <Section title="Current Hero Images">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {project.heroImages.map((img, i) => (
                <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-200 dark:bg-[#1a1a1a]">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${getImageUrl(img)})` }} />
                  <button
                    type="button"
                    onClick={() => deleteImageMutation.mutate({ imageUrl: img, type: 'heroImages' })}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Upload new media */}
        <Section title="Upload New Media">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-2">Add Hero Images</p>
              <label className="flex flex-col items-center justify-center gap-2 h-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-[#1f1f1f] hover:border-green-500/40 cursor-pointer transition-all">
                <span className="text-xs text-gray-400">
                  {newHeroImages.length ? `${newHeroImages.length} file(s)` : 'Click to upload'}
                </span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => setNewHeroImages(Array.from(e.target.files ?? []))} />
              </label>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2">Replace Brochure (PDF)</p>
              <label className="flex flex-col items-center justify-center gap-2 h-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-[#1f1f1f] hover:border-green-500/40 cursor-pointer transition-all">
                <span className="text-xs text-gray-400">
                  {newBrochure ? newBrochure.name : project?.brochureUrl ? 'Replace existing PDF' : 'Upload PDF'}
                </span>
                <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setNewBrochure(e.target.files?.[0] ?? null)} />
              </label>
            </div>
          </div>
        </Section>

        {/* SEO */}
        <Section title="SEO (Optional)">
          <div className="space-y-3">
            <Field label="Meta Title"><input value={form.metaTitle} onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))} className={inputCls} /></Field>
            <Field label="Meta Description"><textarea value={form.metaDescription} onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))} rows={2} className={`${inputCls} resize-none`} /></Field>
          </div>
        </Section>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-green-600 hover:bg-green-700 text-white transition-all disabled:opacity-60"
          >
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
          </button>
          <Link href="/admin/projects" className="px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-[#1f1f1f] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-[#2f2f2f] transition-all">
            Cancel
          </Link>
        </div>
      </form>
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
