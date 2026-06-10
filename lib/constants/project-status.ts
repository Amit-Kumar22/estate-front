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
  current:   'bg-green-500/10 text-green-400 border-green-500/20',
  upcoming:  'bg-blue-500/10  text-blue-400  border-blue-500/20',
  completed: 'bg-gray-500/10  text-gray-400  border-gray-500/20',
};

export const PROJECT_STATUS_DOT_COLORS: Record<ProjectStatus, string> = {
  current:   '#16a34a',
  upcoming:  '#3b82f6',
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
  PROJECT_STATUS_COLORS[status as ProjectStatus] ?? 'bg-gray-500/10 text-gray-400';

export const getStatusDotColor = (status: string): string =>
  PROJECT_STATUS_DOT_COLORS[status as ProjectStatus] ?? '#6b7280';
