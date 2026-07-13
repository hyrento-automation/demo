import { getMarketConfig, SHARED_CONTACT } from '@/src/lib/market'

export interface BrandConfig {
  name: string
  country: string
  adjective: string
  coverageLabel: string
  deliveryLabel: string
  headquarters: string
  locationSummary: string
  phone: string
  whatsapp: string
  emergencyPhone: string
  email: string
  bookingRefPrefix: string
  theme: {
    primary: string
    primaryLight: string
    primaryDark: string
    accent: string
    accentLight: string
    accentDark: string
  }
}

type ThemeConfig = BrandConfig['theme']

const DEFAULT_THEME: ThemeConfig = {
  primary: '#0D1B2A',
  primaryLight: '#1B263B',
  primaryDark: '#0A1118',
  accent: '#00B5A5',
  accentLight: '#33C4B7',
  accentDark: '#008C80',
}

const MARKET_THEMES: Record<string, ThemeConfig> = {
  Mauritius: DEFAULT_THEME,
  Spain: {
    primary: '#2F211B', primaryLight: '#5A4034', primaryDark: '#1D1410',
    accent: '#D84E27', accentLight: '#FF7A4F', accentDark: '#A93618',
  },
  Europe: {
    primary: '#18211D', primaryLight: '#30463B', primaryDark: '#0E1511',
    accent: '#8DBB3E', accentLight: '#C9FF74', accentDark: '#668B28',
  },
  USA: {
    primary: '#132D4F', primaryLight: '#1F4F82', primaryDark: '#0A1C33',
    accent: '#D7392F', accentLight: '#F06B63', accentDark: '#A8231C',
  },
  UAE: {
    primary: '#121418', primaryLight: '#292D34', primaryDark: '#080A0D',
    accent: '#C39A45', accentLight: '#E8CA83', accentDark: '#8E6B28',
  },
  'South Africa': {
    primary: '#173D32', primaryLight: '#2B5C4E', primaryDark: '#0C271F',
    accent: '#D99036', accentLight: '#F2B85B', accentDark: '#9F5F2D',
  },
}

export const BRAND_PRESETS: Record<string, BrandConfig> = {
  default: {
    name: 'Car Hire Mauritius',
    country: 'Mauritius',
    adjective: 'Mauritian',
    coverageLabel: 'Island Coverage',
    deliveryLabel: 'island-wide',
    headquarters: 'Port Louis, Mauritius',
    locationSummary: 'SSR Airport, Grand Baie, Flic en Flac, and Mapou',
    phone: SHARED_CONTACT.phone,
    whatsapp: SHARED_CONTACT.whatsapp,
    emergencyPhone: SHARED_CONTACT.phone,
    email: SHARED_CONTACT.email,
    bookingRefPrefix: 'HYR',
    theme: DEFAULT_THEME,
  },
}

export function getBrandConfig(hostname?: string | null): BrandConfig {
  // 1. Check NEXT_PUBLIC_BRAND_THEME env var override first
  const envTheme = process.env.NEXT_PUBLIC_BRAND_THEME
  if (envTheme && BRAND_PRESETS[envTheme]) {
    return BRAND_PRESETS[envTheme]
  }

  // 2. Client-side fallback to window.location.hostname
  let activeHost = hostname
  if (!activeHost && typeof window !== 'undefined') {
    activeHost = window.location.hostname
  }

  const market = getMarketConfig(activeHost)

  // Contact details intentionally stay shared across every country demo.
  return {
    name: `Car Hire ${market.country}`,
    country: market.country,
    adjective: market.adjective,
    coverageLabel: market.coverageLabel,
    deliveryLabel: market.deliveryLabel,
    headquarters: market.headquarters,
    locationSummary: market.locationSummary,
    phone: SHARED_CONTACT.phone,
    whatsapp: SHARED_CONTACT.whatsapp,
    emergencyPhone: SHARED_CONTACT.phone,
    email: SHARED_CONTACT.email,
    bookingRefPrefix: process.env.NEXT_PUBLIC_BOOKING_REF_PREFIX || BRAND_PRESETS.default.bookingRefPrefix,
    theme: MARKET_THEMES[market.country] || DEFAULT_THEME,
  }
}
