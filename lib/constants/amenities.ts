/**
 * Amenity Constants
 * Icon + label pairs for all supported amenity types.
 * Components render amenity lists from this map — never hardcoded.
 */
import {
  Waves, Dumbbell, Building2, Shield, Trees, Car, Zap,
  Coffee, Users, Baby, CircleDot, ShoppingBag, Wifi, Film,
  Heart, BookOpen, Bike, Flower2, SunMedium, Leaf,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AmenityMeta {
  label: string;
  icon: LucideIcon;
}

/**
 * Normalized amenity key → icon/label.
 * Keys are lowercase slugs; matching is case-insensitive substring search.
 */
export const AMENITY_MAP: Record<string, AmenityMeta> = {
  'swimming pool':     { label: 'Swimming Pool',     icon: Waves      },
  'pool':              { label: 'Swimming Pool',     icon: Waves      },
  'gymnasium':         { label: 'Gymnasium',         icon: Dumbbell   },
  'gym':               { label: 'Gymnasium',         icon: Dumbbell   },
  'club house':        { label: 'Club House',        icon: Building2  },
  'clubhouse':         { label: 'Club House',        icon: Building2  },
  'security':          { label: '24/7 Security',     icon: Shield     },
  'garden':            { label: 'Landscaped Garden', icon: Trees      },
  'landscaped garden': { label: 'Landscaped Garden', icon: Trees      },
  'parking':           { label: 'Parking',           icon: Car        },
  'power backup':      { label: 'Power Backup',      icon: Zap        },
  'cafeteria':         { label: 'Cafeteria',         icon: Coffee     },
  'community hall':    { label: 'Community Hall',    icon: Users      },
  'kids play area':    { label: "Kids' Play Area",   icon: Baby       },
  'play area':         { label: "Kids' Play Area",   icon: Baby       },
  'tennis court':      { label: 'Tennis Court',      icon: CircleDot  },
  'retail shops':      { label: 'Retail Shops',      icon: ShoppingBag },
  'high speed wifi':   { label: 'High Speed Wi-Fi',  icon: Wifi       },
  'wifi':              { label: 'High Speed Wi-Fi',  icon: Wifi       },
  'home theatre':      { label: 'Home Theatre',      icon: Film       },
  'spa':               { label: 'Spa',               icon: Heart      },
  'library':           { label: 'Library',           icon: BookOpen   },
  'cycling track':     { label: 'Cycling Track',     icon: Bike       },
  'jogging track':     { label: 'Jogging Track',     icon: Bike       },
  'amphitheatre':      { label: 'Amphitheatre',      icon: SunMedium  },
  'co-working space':  { label: 'Co-working Space',  icon: Building2  },
  'organic garden':    { label: 'Organic Garden',    icon: Leaf       },
  'rooftop':           { label: 'Rooftop Garden',    icon: Flower2    },
};

export const DEFAULT_AMENITY_ICON = Shield;

/**
 * Resolves an amenity string to its icon + label.
 * Falls back to the original string as label and a default icon.
 */
export function resolveAmenity(amenity: string): AmenityMeta {
  const key = amenity.toLowerCase().trim();
  // Exact match
  if (AMENITY_MAP[key]) return AMENITY_MAP[key];
  // Substring match
  for (const [k, v] of Object.entries(AMENITY_MAP)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return { label: amenity, icon: DEFAULT_AMENITY_ICON };
}
