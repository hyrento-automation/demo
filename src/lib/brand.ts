import { getMarketConfig, SHARED_CONTACT } from '@/src/lib/market'
import { getCompanyByHost, getCompanyBySlug, extractSubdomain, Company } from '@/src/data/companies'

export interface BrandConfig {
  name: string
  slug?: string
  logo?: string
  currency?: string
  country: string
  adjective: string
  coverageLabel: string
  deliveryLabel: string
  headquarters: string
  locationSummary: string
  address?: string
  city?: string
  phone: string
  whatsapp: string
  emergencyPhone: string
  email: string
  bookingRefPrefix: string
  website?: string
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
  'United Arab Emirates': {
    primary: '#121418', primaryLight: '#292D34', primaryDark: '#080A0D',
    accent: '#C39A45', accentLight: '#E8CA83', accentDark: '#8E6B28',
  },
  'South Africa': {
    primary: '#173D32', primaryLight: '#2B5C4E', primaryDark: '#0C271F',
    accent: '#D99036', accentLight: '#F2B85B', accentDark: '#9F5F2D',
  },
  India: {
    primary: '#1A2C38', primaryLight: '#2B4354', primaryDark: '#0E1920',
    accent: '#F59E0B', accentLight: '#FBBF24', accentDark: '#D97706',
  },
  Switzerland: {
    primary: '#20262E', primaryLight: '#333D4A', primaryDark: '#14181E',
    accent: '#EF4444', accentLight: '#F87171', accentDark: '#DC2626',
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

function getAdjective(country: string): string {
  switch (country.toLowerCase()) {
    case 'spain': return 'Spanish'
    case 'india': return 'Indian'
    case 'united arab emirates':
    case 'uae': return 'Emirati'
    case 'switzerland': return 'Swiss'
    case 'south africa': return 'South African'
    case 'usa':
    case 'united states': return 'American'
    default: return 'Mauritian'
  }
}

export function getCountryCurrency(country?: string): string {
  if (!country) return 'USD'
  const c = country.toLowerCase()
  if (c.includes('india')) return 'INR'
  if (c.includes('spain')) return 'EUR'
  if (c.includes('emirates') || c.includes('uae') || c.includes('dubai')) return 'AED'
  if (c.includes('switzerland')) return 'CHF'
  if (c.includes('mauritius')) return 'MUR'
  if (c.includes('uk') || c.includes('britain')) return 'GBP'
  return 'USD'
}

export function getBrandConfig(hostname?: string | null): BrandConfig {
  // 1. Check NEXT_PUBLIC_BRAND_THEME env var override first
  const envTheme = process.env.NEXT_PUBLIC_BRAND_THEME
  if (envTheme && BRAND_PRESETS[envTheme]) {
    return BRAND_PRESETS[envTheme]
  }

  // 2. Client-side fallback to window.location.hostname
  let activeHost = hostname
  let queryDemo: string | null = null

  if (typeof window !== 'undefined') {
    if (!activeHost) {
      activeHost = window.location.hostname
    }
    const params = new URLSearchParams(window.location.search)
    queryDemo = params.get('demo') || params.get('brand') || params.get('company')
  }

  // 3. Check for specific company match (by query param first, then by subdomain)
  let company: Company | null = null
  if (queryDemo) {
    company = getCompanyBySlug(queryDemo)
  }
  if (!company && activeHost) {
    company = getCompanyByHost(activeHost)
  }

  if (company) {
    const theme = MARKET_THEMES[company.country] || DEFAULT_THEME
    const adjective = getAdjective(company.country)
    const locSummary = company.address || `${company.city || ''}, ${company.country}`.trim()
    const hq = company.city ? `${company.city}, ${company.country}` : company.address || company.country

    return {
      name: company.name,
      slug: company.slug,
      logo: company.logo,
      country: company.country,
      adjective,
      coverageLabel: `${company.city || company.country} Coverage`,
      deliveryLabel: company.city ? `in and around ${company.city}` : `across ${company.country}`,
      headquarters: hq,
      locationSummary: locSummary,
      address: company.address,
      city: company.city,
      phone: company.phone,
      whatsapp: company.whatsapp || company.phone,
      emergencyPhone: company.phone,
      email: company.email,
      bookingRefPrefix: company.bookingRefPrefix || company.slug.slice(0, 3).toUpperCase(),
      currency: company.currency || getCountryCurrency(company.country),
      website: company.website,
      theme,
    }
  }

  // 4. Fallback to country markets (demo1..demo5) or default
  const market = getMarketConfig(activeHost)

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
    currency: getCountryCurrency(market.country),
    theme: MARKET_THEMES[market.country] || DEFAULT_THEME,
  }
}
