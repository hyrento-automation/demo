export interface Company {
  id: string
  name: string
  slug: string
  logo?: string
  phone: string
  whatsapp: string
  email: string
  address: string
  city: string
  country: string
  website?: string
  currency?: string
  bookingRefPrefix?: string
  aliases?: string[]
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, '') // remove parenthetical expressions
    .replace(/[^a-z0-9]/g, '') // keep only alphanumeric
    .trim()
}

export const COMPANIES: Company[] = [
  {
    id: 'comp_irf',
    name: 'IRF Car Rental LTD',
    slug: 'irfcarrentalltd',
    phone: '+23054295210',
    whatsapp: '+23054295210',
    email: 'info@irfcarrentalltd.com',
    address: 'Grand Bel Air, Mauritius',
    city: 'Grand Bel Air',
    country: 'Mauritius',
    website: 'https://www.irfcarrentalltd.com/',
    currency: 'MUR',
    bookingRefPrefix: 'IRF',
    aliases: ['irf', 'irfcarrental'],
  },
  {
    id: 'comp_titan',
    name: 'TITAN CAR RENTALS GOA',
    slug: 'titancarrentalsgoa',
    phone: '+917030525563',
    whatsapp: '+917030525563',
    email: 'contact@titancarrentalsgoa.com',
    address: 'Davorlim, Margao, Goa',
    city: 'Margao, Goa',
    country: 'India',
    website: '',
    currency: 'INR',
    bookingRefPrefix: 'TIT',
    aliases: ['titancarrentals', 'titan'],
  },
  {
    id: 'comp_urban',
    name: 'Urban Ride Car Rental Co.',
    slug: 'urbanridecarrentalco',
    phone: '+971501261521',
    whatsapp: '+971501261521',
    email: 'info@urbanride.ae',
    address: 'BUSINESS BAY, TAMANI ARTS BUILDING OFFICE NO. 540',
    city: 'Dubai',
    country: 'United Arab Emirates',
    website: '',
    currency: 'AED',
    bookingRefPrefix: 'URB',
    aliases: ['urbanride', 'urbanridecarrental'],
  },
  {
    id: 'comp_splash',
    name: 'Splash Car Holiday',
    slug: 'splashcarholiday',
    phone: '+23057727994',
    whatsapp: '+23057727994',
    email: 'contact@splashcarholiday.com',
    address: 'Plaine Magnien, Mauritius',
    city: 'Plaine Magnien',
    country: 'Mauritius',
    website: 'http://www.splashcarholiday.com/',
    currency: 'MUR',
    bookingRefPrefix: 'SPL',
    aliases: ['splash', 'splashcar'],
  },
  {
    id: 'comp_panda',
    name: 'Rental Panda',
    slug: 'rentalpanda',
    phone: '+34641161607',
    whatsapp: '+34641161607',
    email: 'hola@rentalpanda.es',
    address: 'Palma de Mallorca, Spain',
    city: 'Palma',
    country: 'Spain',
    website: 'http://www.rentalpanda.es/',
    currency: 'EUR',
    bookingRefPrefix: 'PAN',
    aliases: ['panda'],
  },
  {
    id: 'comp_mallorca_hire',
    name: 'Mallorca Car Hire Company',
    slug: 'mallorcacarhirecompany',
    phone: '+34627294626',
    whatsapp: '+34627294626',
    email: 'info@mallorcacarhirecompany.com',
    address: 'Palma, Spain',
    city: 'Palma',
    country: 'Spain',
    website: 'https://www.mallorcacarhirecompany.com/',
    currency: 'EUR',
    bookingRefPrefix: 'MCH',
    aliases: ['mallorcacarhire'],
  },
  {
    id: 'comp_badsha',
    name: 'Badsha car rental Goa',
    slug: 'badshacarrentalgoa',
    phone: '+918600129608',
    whatsapp: '+918600129608',
    email: 'info@badshacarrental.com',
    address: 'Panaji, Goa',
    city: 'Panaji',
    country: 'India',
    website: 'https://badsha-car-rental.grexa.site/',
    currency: 'INR',
    bookingRefPrefix: 'BAD',
    aliases: ['badshacarrental', 'badsha'],
  },
  {
    id: 'comp_selfdrive_goa',
    name: 'Self Drive Car Rental Goa',
    slug: 'selfdrivecarrentalgoa',
    phone: '+919175887187',
    whatsapp: '+919175887187',
    email: 'info@selfdrivecarrentalgoa.com',
    address: 'Salcete, Davorlim, Goa',
    city: 'Salcete',
    country: 'India',
    website: 'https://selfdrivecarrentalgoa.com/',
    currency: 'INR',
    bookingRefPrefix: 'SDG',
    aliases: ['selfdrivegoa'],
  },
  {
    id: 'comp_mallorca_excursions',
    name: 'Mallorca Rental & Excursions',
    slug: 'mallorcarentalexcursions',
    phone: '+34613600572',
    whatsapp: '+34613600572',
    email: 'info@mallorcarentalexcursions.com',
    address: 'Palma, Spain',
    city: 'Palma',
    country: 'Spain',
    website: 'https://mallorcarentalexcursions.com/',
    currency: 'EUR',
    bookingRefPrefix: 'MRE',
  },
  {
    id: 'comp_greenrent',
    name: 'Greenrent.ch',
    slug: 'greenrentch',
    phone: '+41788605820',
    whatsapp: '+41788605820',
    email: 'info@greenrent.ch',
    address: 'Grand-Saconnex, Switzerland',
    city: 'Grand-Saconnex',
    country: 'Switzerland',
    website: 'http://greenrent.ch/',
    currency: 'CHF',
    bookingRefPrefix: 'GRE',
    aliases: ['greenrent'],
  },
  {
    id: 'comp_cars4you',
    name: '(Cars4you)Margao Self Drive Car Rental',
    slug: 'margaoselfdrivecarrental',
    phone: '+919682933407',
    whatsapp: '+919682933407',
    email: 'info@car4yougoa.in',
    address: 'Margao, Goa',
    city: 'Margao',
    country: 'India',
    website: 'https://car4yougoa.in/',
    currency: 'INR',
    bookingRefPrefix: 'C4Y',
    aliases: ['cars4you', 'cars4yougoa', 'cars4youmargao'],
  },
  {
    id: 'comp_deluxe',
    name: 'Deluxe Car Rental Goa',
    slug: 'deluxecarrentalgoa',
    phone: '+919922657357',
    whatsapp: '+919922657357',
    email: 'info@deluxecarrentalgoa.com',
    address: 'Margao, Goa',
    city: 'Margao',
    country: 'India',
    website: 'https://www.deluxecarrentalgoa.com/',
    currency: 'INR',
    bookingRefPrefix: 'DLX',
    aliases: ['deluxecarrental'],
  },
  {
    id: 'comp_selfdrive_in_goa',
    name: 'Self Drive Car Rental in Goa',
    slug: 'selfdrivecarrentalingoa',
    phone: '+919104912661',
    whatsapp: '+919104912661',
    email: 'info@goaselfdrivecars.in',
    address: 'Sancoale, Dabolim, Goa',
    city: 'Dabolim',
    country: 'India',
    website: 'https://goaselfdrivecars.in/',
    currency: 'INR',
    bookingRefPrefix: 'SDR',
    aliases: ['goaselfdrivecars'],
  },
  {
    id: 'comp_bon_plan',
    name: 'Bon Plan Voyage Car Rental',
    slug: 'bonplanvoyagecarrental',
    phone: '+23057608332',
    whatsapp: '+23057608332',
    email: 'info@sunrisedestination.com',
    address: 'Flic en Flac, Mauritius',
    city: 'Flic en Flac',
    country: 'Mauritius',
    website: 'http://www.sunrisedestination.com/',
    currency: 'MUR',
    bookingRefPrefix: 'BPV',
    aliases: ['bonplanvoyage'],
  },
  {
    id: 'comp_nads',
    name: "Nad's Car Rental",
    slug: 'nadscarrental',
    phone: '+23052538355',
    whatsapp: '+23052538355',
    email: 'info@carhiremru.com',
    address: 'Triolet, Mauritius',
    city: 'Triolet',
    country: 'Mauritius',
    website: 'https://carhiremru.com/',
    currency: 'MUR',
    bookingRefPrefix: 'NAD',
    aliases: ['nads'],
  },
  {
    id: 'comp_pleasure_drive',
    name: 'Pleasure Drive Ltd -Car rental/ Location Voiture Mauritius',
    slug: 'pleasuredriveltd',
    phone: '+23052553669',
    whatsapp: '+23052553669',
    email: 'contact@pleasuredriveltd.com',
    address: 'Forbach road Mapou MU',
    city: 'Mapou',
    country: 'Mauritius',
    website: 'http://www.pleasuredriveltd.com/',
    currency: 'MUR',
    bookingRefPrefix: 'PDL',
    aliases: ['pleasuredrive', 'pleasuredriveltdcarrentallocationvoituremauritius'],
  },
  {
    id: 'comp_ambrose',
    name: 'Ambrose Car Rental',
    slug: 'ambrosecarrental',
    phone: '+23052520195',
    whatsapp: '+23052520195',
    email: 'info@getgoingmauritius.com',
    address: 'Grand Baie, Mauritius',
    city: 'Grand Baie',
    country: 'Mauritius',
    website: 'https://www.getgoingmauritius.com/',
    currency: 'MUR',
    bookingRefPrefix: 'AMB',
    aliases: ['ambrose'],
  },
  {
    id: 'comp_cheapest',
    name: 'Cheapest car rental',
    slug: 'cheapestcarrental',
    phone: '+23059255425',
    whatsapp: '+23059255425',
    email: 'info@rentalmauritius.live',
    address: 'Port Louis, Mauritius',
    city: 'Port Louis',
    country: 'Mauritius',
    website: 'https://rentalmauritius.live/',
    currency: 'MUR',
    bookingRefPrefix: 'CCR',
  },
  {
    id: 'comp_sunset_drive',
    name: 'Sunset Drive ( Mauritius) Car Rental (Flic en Flac)',
    slug: 'sunsetdrivecarrental',
    phone: '+23055008028',
    whatsapp: '+23055008028',
    email: 'sunsetdrive@hyrento.com',
    address: 'Flic en Flac, Mauritius',
    city: 'Flic en Flac',
    country: 'Mauritius',
    website: '',
    currency: 'MUR',
    bookingRefPrefix: 'SSD',
    aliases: ['sunsetdrive'],
  },
  {
    id: 'comp_le_morne',
    name: 'Le Morne Travel Ltd Car Rental Company',
    slug: 'lemornetravelltd',
    phone: '+23058014692',
    whatsapp: '+23058014692',
    email: 'lemornetravel@hyrento.com',
    address: 'Le Morne, Mauritius',
    city: 'Le Morne',
    country: 'Mauritius',
    website: 'https://lemornetravel.wordpress.com/',
    currency: 'MUR',
    bookingRefPrefix: 'LMT',
    aliases: ['lemorne', 'lemornetravelltdcarrentalcompany'],
  },
  {
    id: 'comp_victoria',
    name: 'Victoria Car Rental',
    slug: 'victoriacarrental',
    phone: '+23059206432',
    whatsapp: '+23059206432',
    email: 'victoriacarrental@hyrento.com',
    address: 'Pointe aux Piments, Mauritius',
    city: 'Pointe aux Piments',
    country: 'Mauritius',
    website: 'https://wa.me/c/23059206432',
    currency: 'MUR',
    bookingRefPrefix: 'VIC',
    aliases: ['victoria'],
  },
  {
    id: 'comp_kls',
    name: 'KLS Car Rental',
    slug: 'klscarrental',
    phone: '+23055007555',
    whatsapp: '+23055007555',
    email: 'info@klscarrental.com',
    address: 'Lalmatie, Mauritius',
    city: 'Lalmatie',
    country: 'Mauritius',
    website: 'https://www.klscarrental.com/',
    currency: 'MUR',
    bookingRefPrefix: 'KLS',
    aliases: ['kls'],
  },
  {
    id: 'comp_albion',
    name: 'Albion Car Rental Mauritius',
    slug: 'albioncarrental',
    phone: '+23057595808',
    whatsapp: '+23057595808',
    email: 'albion@hyrento.com',
    address: 'Albion, Mauritius',
    city: 'Albion',
    country: 'Mauritius',
    website: '',
    currency: 'MUR',
    bookingRefPrefix: 'ALB',
    aliases: ['albion', 'albioncarrentalmauritius'],
  },
  {
    id: 'comp_mauhire',
    name: 'MAUHIRE Mauritius Car Rental',
    slug: 'mauhirecarrental',
    phone: '+23057688168',
    whatsapp: '+23057688168',
    email: 'info@mauhire.com',
    address: 'Plaine Magnien, Mauritius',
    city: 'Plaine Magnien',
    country: 'Mauritius',
    website: 'http://mauhire.com/',
    currency: 'MUR',
    bookingRefPrefix: 'MAU',
    aliases: ['mauhire', 'mauhiremauritiuscarrental'],
  },
  {
    id: 'comp_yahweh',
    name: 'YAHWEH CAR RENTAL',
    slug: 'yahwehcarrental',
    phone: '+23057648053',
    whatsapp: '+23057648053',
    email: 'info@yahwehcars.com',
    address: 'Chemin Le Flamant Muguet Road MU',
    city: 'Chemin Le Flamant',
    country: 'Mauritius',
    website: 'http://yahwehcars.com/',
    currency: 'MUR',
    bookingRefPrefix: 'YAH',
    aliases: ['yahweh'],
  },
  // Example company from user prompt
  {
    id: 'comp_yoyo',
    name: 'Yoyo Car Rental',
    slug: 'yoyocarrental',
    phone: '+230123456',
    whatsapp: '+230123456',
    email: 'hello@yoyo.com',
    address: 'Royal Road, Grand Baie, Mauritius',
    city: 'Grand Baie',
    country: 'Mauritius',
    website: 'https://yoyocarrental.hyrento.com',
    currency: 'MUR',
    bookingRefPrefix: 'YOY',
    aliases: ['yoyo'],
  },
]

const COMPANY_MAP = new Map<string, Company>()
for (const comp of COMPANIES) {
  COMPANY_MAP.set(comp.slug.toLowerCase(), comp)
  if (comp.aliases) {
    for (const alias of comp.aliases) {
      COMPANY_MAP.set(alias.toLowerCase(), comp)
    }
  }
}

export function getCompanyBySlug(slug: string): Company | null {
  if (!slug) return null
  const clean = slug.toLowerCase().replace(/[^a-z0-9]/g, '')
  return COMPANY_MAP.get(clean) || null
}

export function extractSubdomain(host?: string | null): string | null {
  if (!host) return null
  const cleanHost = host.split(':')[0].toLowerCase()

  // Ignore standard base hostnames
  if (
    cleanHost === 'localhost' ||
    cleanHost === '127.0.0.1' ||
    cleanHost === 'hyrento.com' ||
    cleanHost === 'www.hyrento.com' ||
    cleanHost === 'demo.hyrento.com' ||
    cleanHost === 'hyrento.vercel.app' ||
    cleanHost === 'demo-hyrento.vercel.app' ||
    cleanHost.endsWith('.vercel.app')
  ) {
    return null
  }

  // Handle *.hyrento.com
  if (cleanHost.endsWith('.hyrento.com')) {
    const parts = cleanHost.replace('.hyrento.com', '').split('.')
    return parts[parts.length - 1] || null
  }

  // Generic first subdomain component
  const parts = cleanHost.split('.')
  if (parts.length > 2) {
    return parts[0]
  }

  return null
}

export function getCompanyByHost(host?: string | null): Company | null {
  const sub = extractSubdomain(host)
  if (!sub) return null
  return getCompanyBySlug(sub)
}
