/**
 * Project Status Constants
 * Centralized color & label mappings for project status values.
 */

export type ProjectStatus = 'current' | 'upcoming' | 'completed';

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  current:   'Current',
  upcoming:  'Upcoming',
  completed: 'Completed',
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  current:   'bg-white text-crimson-400 border-crimson-700/20',
  upcoming:  'bg-white text-gold-500 border-gold-500/20',
  completed: 'bg-white text-gray-400 border-gray-600/20',
};

export const PROJECT_STATUS_DOT_COLORS: Record<ProjectStatus, string> = {
  current:   '#c81e3a',
  upcoming:  '#f0b400',
  completed: '#6b7280',
};

export const PROJECT_STATUS_OPTIONS: Array<{ value: ProjectStatus; label: string }> = [
  { value: 'current',   label: 'Current'   },
  { value: 'upcoming',  label: 'Upcoming'  },
  { value: 'completed', label: 'Completed' },
];

export const getStatusLabel = (status: string): string =>
  PROJECT_STATUS_LABELS[status as ProjectStatus] ?? status;

export const getStatusColor = (status: string): string =>
  PROJECT_STATUS_COLORS[status as ProjectStatus] ?? 'bg-white/10 text-black';

export const getStatusDotColor = (status: string): string =>
  PROJECT_STATUS_DOT_COLORS[status as ProjectStatus] ?? '#730707ff';
