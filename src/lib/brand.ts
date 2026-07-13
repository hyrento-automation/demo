export interface BrandConfig {
  name: string
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

export const BRAND_PRESETS: Record<string, BrandConfig> = {
  default: {
    name: 'Hyrento Premium',
    phone: '+230 5255 3669',
    whatsapp: '+230 5255 3669',
    emergencyPhone: '+230 5255 3669',
    email: 'booking@hyrento.com',
    bookingRefPrefix: 'HYR',
    theme: {
      primary: '#0D1B2A',      // Dark navy blue
      primaryLight: '#1B263B',
      primaryDark: '#0A1118',
      accent: '#00B5A5',       // Gold/teal accent
      accentLight: '#33C4B7',
      accentDark: '#008C80',
    }
  },
  demo1: {
    name: 'Island Wheels Mauritius',
    phone: '+230 5999 1111',
    whatsapp: '+230 5999 1111',
    emergencyPhone: '+230 5999 2222',
    email: 'hello@islandwheels.com',
    bookingRefPrefix: 'ISL',
    theme: {
      primary: '#0B2545',      // Ocean dark blue
      primaryLight: '#134074',
      primaryDark: '#081C36',
      accent: '#E65C00',       // Sunset orange accent
      accentLight: '#FF7518',
      accentDark: '#B34700',
    }
  },
  demo2: {
    name: 'CityDrive Prestige',
    phone: '+230 5777 3333',
    whatsapp: '+230 5777 3333',
    emergencyPhone: '+230 5777 4444',
    email: 'info@citydrive.com',
    bookingRefPrefix: 'CTY',
    theme: {
      primary: '#1A0E2E',      // Royal purple/violet
      primaryLight: '#2C1B4D',
      primaryDark: '#0F081C',
      accent: '#D4AF37',       // Luxury gold
      accentLight: '#F3E5AB',
      accentDark: '#AA7C11',
    }
  }
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

  // 3. Resolve preset depending on hostname match
  if (activeHost) {
    if (activeHost.includes('demo1.hyrento.com') || activeHost.includes('demo1')) {
      return BRAND_PRESETS.demo1
    }
    if (activeHost.includes('demo2.hyrento.com') || activeHost.includes('demo2') || activeHost.includes('ldemo2')) {
      return BRAND_PRESETS.demo2
    }
  }

  // 4. Default dynamic brand using other branding environment variables (if any) or fallback to default preset
  return {
    name: process.env.NEXT_PUBLIC_BRAND_NAME || BRAND_PRESETS.default.name,
    phone: process.env.NEXT_PUBLIC_BRAND_PHONE || BRAND_PRESETS.default.phone,
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_PHONE || BRAND_PRESETS.default.whatsapp,
    emergencyPhone: process.env.NEXT_PUBLIC_EMERGENCY_PHONE || BRAND_PRESETS.default.emergencyPhone,
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || BRAND_PRESETS.default.email,
    bookingRefPrefix: process.env.NEXT_PUBLIC_BOOKING_REF_PREFIX || BRAND_PRESETS.default.bookingRefPrefix,
    theme: {
      primary: process.env.NEXT_PUBLIC_THEME_PRIMARY || BRAND_PRESETS.default.theme.primary,
      primaryLight: process.env.NEXT_PUBLIC_THEME_PRIMARY_LIGHT || BRAND_PRESETS.default.theme.primaryLight,
      primaryDark: process.env.NEXT_PUBLIC_THEME_PRIMARY_DARK || BRAND_PRESETS.default.theme.primaryDark,
      accent: process.env.NEXT_PUBLIC_THEME_ACCENT || BRAND_PRESETS.default.theme.accent,
      accentLight: process.env.NEXT_PUBLIC_THEME_ACCENT_LIGHT || BRAND_PRESETS.default.theme.accentLight,
      accentDark: process.env.NEXT_PUBLIC_THEME_ACCENT_DARK || BRAND_PRESETS.default.theme.accentDark,
    }
  }
}
