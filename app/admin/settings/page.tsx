'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { settingsApi } from '@/lib/api';
import {
  Settings, Loader2, Save, Globe, Phone, Mail, MapPin,
  Building2, MessageSquare, Image, BarChart2, Film, AlignLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';

type SettingsMap = Record<string, string>;

interface SettingField {
  key: string;
  label: string;
  icon: React.ElementType;
  type?: string;
  placeholder?: string;
  section: string;
}

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
  { section: 'Hero',       key: 'heroVideoUrl',        label: 'Background Video URL', icon: Film,    placeholder: 'https://... (mp4)' },
  { section: 'Hero',       key: 'heroBackgroundImage', label: 'Background Image URL', icon: Image,   placeholder: 'https://... (jpg/png)' },
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
    mutationFn: () => settingsApi.update(values),
    onSuccess: () => toast.success('Settings saved'),
    onError: () => toast.error('Failed to save settings'),
  });

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
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
                        value={values[key] ?? ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
