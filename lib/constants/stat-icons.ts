import {
  Home, Building2, Users, Star, CheckCircle, TrendingUp, Award,
  Briefcase, Heart, ShieldCheck, MapPin, Clock, type LucideIcon,
} from 'lucide-react';

/** Curated icon set selectable in admin for stat chips (e.g. Family Legacy achievements). */
export const STAT_ICONS: Record<string, LucideIcon> = {
  Home, Building2, Users, Star, CheckCircle, TrendingUp, Award,
  Briefcase, Heart, ShieldCheck, MapPin, Clock,
};

export const STAT_ICON_NAMES = Object.keys(STAT_ICONS);

export const DEFAULT_STAT_ICON = 'Star';

export function resolveStatIcon(name: string | undefined): LucideIcon {
  return (name && STAT_ICONS[name]) || STAT_ICONS[DEFAULT_STAT_ICON];
}
