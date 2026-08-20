'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { settingsApi } from '@/lib/api';
import { getImageUrl, getErrorMessage } from '@/lib/utils';
import appConfig from '@/config/app.config';
import {
  Settings, Loader2, Save, Globe, Phone, Mail, MapPin,
  Building2, MessageSquare, Image, BarChart2, Film, AlignLeft,
  Upload, X, Plus, Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { STAT_ICONS, STAT_ICON_NAMES, DEFAULT_STAT_ICON } from '@/lib/constants/stat-icons';
import type { FamilyLegacyStat } from '@/types';

type SettingsMap = Record<string, unknown>;

interface SettingField {
  key: string;
  label: string;
  icon: React.ElementType;
  type?: string;
  placeholder?: string;
  section: string;
}

interface MediaListField {
  key: string;
  formField: string;
  label: string;
  icon: React.ElementType;
  accept: string;
  maxSizeBytes: number;
  maxSizeLabel: string;
  section: string;
}

/** Hero fields that hold multiple uploaded files, rendered as a carousel on the frontend */
const MEDIA_LIST_FIELDS: MediaListField[] = [
  {
    section: 'Hero', key: 'heroVideoUrls', formField: 'heroVideos',
    label: 'Background Videos', icon: Film,
    accept: appConfig.upload.acceptedVideos, maxSizeBytes: appConfig.upload.maxVideoSizeBytes,
    maxSizeLabel: `${appConfig.upload.maxVideoSizeMB}MB`,
  },
  {
    section: 'Hero', key: 'heroBackgroundImages', formField: 'heroImages',
    label: 'Background Images', icon: Image,
    accept: appConfig.upload.acceptedImages, maxSizeBytes: appConfig.upload.maxImageSizeBytes,
    maxSizeLabel: `${appConfig.upload.maxImageSizeMB}MB`,
  },
];

const SETTING_FIELDS: SettingField[] = [
  // ── Company info ──────────────────────────────────────────────────────────
  { section: 'Company',    key: 'companyName',    label: 'Company Name',    icon: Building2,    placeholder: 'Your company name' },
  { section: 'Company',    key: 'companyTagline', label: 'Tagline',         icon: AlignLeft,    placeholder: 'e.g. Building Dreams, Creating Homes' },
  { section: 'Company',    key: 'companyPhone',   label: 'Phone',           icon: Phone,        type: 'tel',   placeholder: '+91 98765 43210' },
  { section: 'Company',    key: 'companyEmail',   label: 'Email',           icon: Mail,         type: 'email', placeholder: 'info@yourcompany.com' },
  { section: 'Company',    key: 'companyAddress', label: 'Address',         icon: MapPin,       placeholder: 'City, State, India' },
  // ── WhatsApp ──────────────────────────────────────────────────────────────
  { section: 'WhatsApp',   key: 'whatsappNumber',  label: 'WhatsApp Number', icon: MessageSquare, type: 'tel', placeholder: '919876543210' },
  { section: 'WhatsApp',   key: 'whatsappMessage', label: 'Default Message', icon: MessageSquare,             placeholder: 'Hello, I am interested in your projects.' },
  // ── Hero section ──────────────────────────────────────────────────────────
  { section: 'Hero',       key: 'heroHeadline',        label: 'Headline',           icon: AlignLeft, placeholder: 'e.g. Luxury Living Redefined' },
  { section: 'Hero',       key: 'heroSubheadline',     label: 'Subheadline',        icon: AlignLeft, placeholder: 'A short compelling description' },
  // ── Hero stats ────────────────────────────────────────────────────────────
  { section: 'Hero Stats', key: 'heroStat1Value', label: 'Stat 1 Value', icon: BarChart2, placeholder: 'e.g. 50+' },
  { section: 'Hero Stats', key: 'heroStat1Label', label: 'Stat 1 Label', icon: BarChart2, placeholder: 'e.g. Projects Delivered' },
  { section: 'Hero Stats', key: 'heroStat2Value', label: 'Stat 2 Value', icon: BarChart2, placeholder: 'e.g. 5000+' },
  { section: 'Hero Stats', key: 'heroStat2Label', label: 'Stat 2 Label', icon: BarChart2, placeholder: 'e.g. Happy Families' },
  { section: 'Hero Stats', key: 'heroStat3Value', label: 'Stat 3 Value', icon: BarChart2, placeholder: 'e.g. 15+' },
  { section: 'Hero Stats', key: 'heroStat3Label', label: 'Stat 3 Label', icon: BarChart2, placeholder: 'e.g. Years of Excellence' },
  // ── Social links ──────────────────────────────────────────────────────────
  { section: 'Social',     key: 'facebook',  label: 'Facebook URL',   icon: Globe, placeholder: 'https://facebook.com/...' },
  { section: 'Social',     key: 'instagram', label: 'Instagram URL',  icon: Globe, placeholder: 'https://instagram.com/...' },
  { section: 'Social',     key: 'linkedin',  label: 'LinkedIn URL',   icon: Globe, placeholder: 'https://linkedin.com/...' },
  { section: 'Social',     key: 'twitter',   label: 'Twitter/X URL', icon: Globe, placeholder: 'https://twitter.com/...' },
  { section: 'Social',     key: 'youtube',   label: 'YouTube URL',   icon: Globe, placeholder: 'https://youtube.com/...' },
];

const SECTIONS = Array.from(new Set(SETTING_FIELDS.map((f) => f.section)));

export default function AdminSettingsPage() {
  const [values, setValues] = useState<SettingsMap>({});
  // Files picked but not yet uploaded, keyed by MediaListField.key
  const [pendingFiles, setPendingFiles] = useState<Record<string, File[]>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await settingsApi.get();
      return res.data.data.settings as SettingsMap;
    },
  });

  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const formData = new FormData();

      Object.entries(values).forEach(([key, val]) => {
        if (val !== null && typeof val === 'object') {
          // Arrays (heroVideoUrls, heroBackgroundImages) and nested objects
          // (socialLinks) can't go into FormData as-is — the backend JSON-parses them back.
          formData.append(key, JSON.stringify(val));
        } else {
          formData.append(key, (val as string) ?? '');
        }
      });

      MEDIA_LIST_FIELDS.forEach(({ formField, key }) => {
        (pendingFiles[key] ?? []).forEach((file) => formData.append(formField, file));
      });

      return settingsApi.update(formData);
    },
    onSuccess: (res) => {
      toast.success('Settings saved');
      setValues(res.data.data.settings as SettingsMap);
      setPendingFiles({});
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to save settings')),
  });

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const getList = (key: string): string[] => {
    const value = values[key];
    return Array.isArray(value) ? value : [];
  };

  const removeExistingMedia = (key: string, index: number) => {
    setValues((prev) => ({ ...prev, [key]: getList(key).filter((_, i) => i !== index) }));
  };

  const addPendingFiles = (field: MediaListField, fileList: FileList | null) => {
    if (!fileList?.length) return;

    const files = Array.from(fileList);
    const tooLarge = files.find((f) => f.size > field.maxSizeBytes);
    if (tooLarge) {
      toast.error(`"${tooLarge.name}" exceeds the ${field.maxSizeLabel} limit`);
      return;
    }

    setPendingFiles((prev) => ({ ...prev, [field.key]: [...(prev[field.key] ?? []), ...files] }));
  };

  const removePendingFile = (key: string, index: number) => {
    setPendingFiles((prev) => ({ ...prev, [key]: (prev[key] ?? []).filter((_, i) => i !== index) }));
  };

  const getStats = (): FamilyLegacyStat[] => {
    const value = values['familyLegacyStats'];
    return Array.isArray(value) ? (value as FamilyLegacyStat[]) : [];
  };

  const withStats = (
    prev: SettingsMap,
    transform: (stats: FamilyLegacyStat[]) => FamilyLegacyStat[]
  ): SettingsMap => {
    const stats = Array.isArray(prev['familyLegacyStats']) ? (prev['familyLegacyStats'] as FamilyLegacyStat[]) : [];
    return { ...prev, familyLegacyStats: transform(stats) };
  };

  const updateStat = (index: number, patch: Partial<FamilyLegacyStat>) => {
    setValues((prev) => withStats(prev, (stats) => stats.map((s, i) => (i === index ? { ...s, ...patch } : s))));
  };

  const addStat = () => {
    setValues((prev) => withStats(prev, (stats) => [
      ...stats,
      { value: 0, suffix: '', label: '', icon: DEFAULT_STAT_ICON },
    ]));
  };

  const removeStat = (index: number) => {
    setValues((prev) => withStats(prev, (stats) => stats.filter((_, i) => i !== index)));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Site Settings</h2>
          <p className="text-xs text-gray-500">Manage company details, contact info and social links.</p>
        </div>
        <button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending || isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-green-600 hover:bg-green-700 text-white transition-all disabled:opacity-60"
        >
          {saveMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </div>

      {/* Settings form — grouped by section */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl skeleton" />
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {SECTIONS.map((section) => (
            <div key={section} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden shadow-sm dark:shadow-none">
              <div className="px-4 py-2.5 border-b border-gray-200 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[#151515]">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{section}</h4>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-[#1a1a1a]">
                {SETTING_FIELDS.filter((f) => f.section === section).map(({ key, label, icon: Icon, type = 'text', placeholder }) => (
                  <div key={key} className="flex items-center gap-4 px-4 py-3.5">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                        {label}
                      </label>
                      <input
                        type={type}
                        value={(values[key] as string) ?? ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Media upload fields — hero carousel videos/images */}
              {MEDIA_LIST_FIELDS.filter((f) => f.section === section).length > 0 && (
                <div className="divide-y divide-gray-100 dark:divide-[#1a1a1a] border-t border-gray-100 dark:border-[#1a1a1a]">
                  {MEDIA_LIST_FIELDS.filter((f) => f.section === section).map((field) => {
                    const { key, label, icon: Icon, accept } = field;
                    const existing = getList(key);
                    const pending = pendingFiles[key] ?? [];
                    const isVideo = field.formField === 'heroVideos';

                    return (
                      <div key={key} className="px-4 py-3.5">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                            <Icon className="w-3.5 h-3.5 text-gray-400" />
                          </div>
                          <label className="flex-1 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                            {label}
                          </label>
                          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors cursor-pointer">
                            <Upload className="w-3.5 h-3.5" />
                            Upload
                            <input
                              type="file"
                              multiple
                              accept={accept}
                              onChange={(e) => {
                                addPendingFiles(field, e.target.files);
                                e.target.value = '';
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {existing.length === 0 && pending.length === 0 && (
                          <p className="text-xs text-gray-400 pl-12">No files uploaded yet.</p>
                        )}

                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pl-12">
                          {existing.map((url, index) => (
                            <div key={`existing-${index}`} className="relative group aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#222]">
                              {isVideo ? (
                                <video src={getImageUrl(url)} muted className="w-full h-full object-cover" />
                              ) : (
                                <div
                                  className="w-full h-full bg-cover bg-center"
                                  style={{ backgroundImage: `url(${getImageUrl(url)})` }}
                                />
                              )}
                              <button
                                type="button"
                                onClick={() => removeExistingMedia(key, index)}
                                aria-label={`Remove ${label} entry`}
                                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          {pending.map((file, index) => (
                            <div key={`pending-${index}`} className="relative group aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-[#1a1a1a] border border-dashed border-green-400">
                              {isVideo ? (
                                <video src={URL.createObjectURL(file)} muted className="w-full h-full object-cover" />
                              ) : (
                                <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                              )}
                              <span className="absolute bottom-0 inset-x-0 px-1 py-0.5 bg-black/60 text-white text-[9px] truncate">
                                {file.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => removePendingFile(key, index)}
                                aria-label={`Remove pending ${label} file`}
                                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Family Legacy stats — achievement counters on the homepage Family Legacy section */}
          <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-[#1f1f1f] overflow-hidden shadow-sm dark:shadow-none">
            <div className="px-4 py-2.5 border-b border-gray-200 dark:border-[#1f1f1f] bg-gray-50 dark:bg-[#151515] flex items-center justify-between">
              <div>
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Family Legacy Stats</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">Achievement counters shown on the homepage Family Legacy section.</p>
              </div>
              <button
                type="button"
                onClick={addStat}
                className="flex items-center gap-1 text-[11px] font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors flex-shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Add Stat
              </button>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-[#1a1a1a]">
              {getStats().length === 0 && (
                <p className="text-xs text-gray-400 px-4 py-3.5">
                  No stats configured — the homepage will show its default values until you add some here.
                </p>
              )}
              {getStats().map((stat, index) => {
                const StatIcon = STAT_ICONS[stat.icon] ?? STAT_ICONS[DEFAULT_STAT_ICON];
                return (
                  <div key={index} className="flex flex-wrap items-center gap-3 px-4 py-3.5">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                      <StatIcon className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={stat.value}
                      onChange={(e) => updateStat(index, { value: Number(e.target.value) })}
                      placeholder="Value"
                      aria-label="Stat value"
                      className="w-20 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none border border-gray-200 dark:border-[#2a2a2a] rounded-lg px-2 py-1.5"
                    />
                    <input
                      type="text"
                      value={stat.suffix}
                      onChange={(e) => updateStat(index, { suffix: e.target.value })}
                      placeholder="Suffix"
                      aria-label="Stat suffix"
                      className="w-16 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none border border-gray-200 dark:border-[#2a2a2a] rounded-lg px-2 py-1.5"
                    />
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateStat(index, { label: e.target.value })}
                      placeholder="Label (e.g. Homes Delivered)"
                      aria-label="Stat label"
                      className="flex-1 min-w-[140px] bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none border border-gray-200 dark:border-[#2a2a2a] rounded-lg px-2 py-1.5"
                    />
                    <select
                      value={stat.icon}
                      onChange={(e) => updateStat(index, { icon: e.target.value })}
                      aria-label="Stat icon"
                      className="bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none border border-gray-200 dark:border-[#2a2a2a] rounded-lg px-2 py-1.5"
                    >
                      {STAT_ICON_NAMES.map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeStat(index)}
                      aria-label="Remove stat"
                      className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Danger zone */}
      <div className="bg-white dark:bg-[#111] rounded-2xl border border-red-200 dark:border-red-500/10 p-5 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-bold text-red-400">Maintenance Mode</h3>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Enable maintenance mode to temporarily take the site offline while you make updates.
        </p>
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={values['maintenanceMode'] === 'true'}
              onChange={(e) => handleChange('maintenanceMode', String(e.target.checked))}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 dark:bg-[#1f1f1f] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500" />
          </label>
          <span className="text-xs text-gray-400">
            {values['maintenanceMode'] === 'true' ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>
    </div>
  );
}
