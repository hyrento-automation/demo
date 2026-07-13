export const SHARED_CONTACT = {
  email: 'hello@hyrento.com',
  phone: '+91 8878933778',
  phoneHref: 'tel:+918878933778',
  whatsapp: '+91 8878933778',
  whatsappHref: 'https://wa.me/918878933778',
} as const

export type LocationIcon = 'plane' | 'building' | 'car' | 'map' | 'ship'

export interface MarketLocation {
  name: string
  type: string
  icon: LocationIcon
  address: string
  hours: string
  desc: string
  features: string[]
  img: string
  mapUrl: string
  featured?: boolean
}

export interface MarketConfig {
  key: 'mauritius' | 'spain' | 'europe' | 'usa' | 'uae' | 'south-africa'
  country: string
  adjective: string
  coverageLabel: string
  deliveryLabel: string
  headquarters: string
  locationSummary: string
  locationsHeroImage: string
  aboutHeroImage: string
  aboutStory: string
  aboutMission: string
  locations: MarketLocation[]
}

const images = {
  airport: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop',
  city: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1200&auto=format&fit=crop',
  coast: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
  resort: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
  road: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
} as const

const location = (
  name: string,
  type: string,
  icon: LocationIcon,
  address: string,
  desc: string,
  features: string[],
  img: string,
  featured = false,
): MarketLocation => ({
  name,
  type,
  icon,
  address,
  hours: featured ? '24 / 7 (Pre-booked pickups)' : '08:00 – 18:00 Daily',
  desc,
  features,
  img,
  mapUrl: `https://maps.google.com/?q=${encodeURIComponent(address)}`,
  featured,
})

export const MARKET_CONFIGS: Record<MarketConfig['key'], MarketConfig> = {
  mauritius: {
    key: 'mauritius',
    country: 'Mauritius',
    adjective: 'Mauritian',
    coverageLabel: 'Island Coverage',
    deliveryLabel: 'island-wide',
    headquarters: 'Port Louis, Mauritius',
    locationSummary: 'SSR Airport, Grand Baie, Flic en Flac, and Mapou',
    locationsHeroImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070&auto=format&fit=crop',
    aboutHeroImage: 'https://images.unsplash.com/photo-1544735048-35756ea33235?q=80&w=2070&auto=format&fit=crop',
    aboutStory: 'Born from a love of Mauritius and a passion for exceptional service, we have been elevating island travel since 2010.',
    aboutMission: 'We pair local island knowledge with an international standard of service, from airport arrival to the final coastal drive.',
    locations: [
      location('SSR Airport', 'Airport Branch', 'plane', 'SSR International Airport, Plaine Magnien, Mauritius', 'Seamless meet-and-greet service from the moment you land.', ['Meet & Greet', 'Instant Handover', 'All Hours'], images.airport, true),
      location('Grand Baie', 'North Coast Hub', 'building', 'Grand Baie, Mauritius', 'Hotel, villa, and resort delivery throughout the north coast.', ['Villa Delivery', 'Hotel Pickup', 'North Coast'], images.resort),
      location('Flic en Flac', 'West Coast Hub', 'ship', 'Flic en Flac, Mauritius', 'Easy handovers for guests staying along the west coast.', ['Resort Delivery', 'Beach Pickup', 'West Coast'], images.coast),
      location('Mapou', 'Central Branch', 'car', 'Mapou, Mauritius', 'A convenient central point for collections and returns.', ['Central Location', 'Fast Handover', 'Easy Access'], images.road),
    ],
  },
  spain: {
    key: 'spain',
    country: 'Spain',
    adjective: 'Spanish',
    coverageLabel: 'Spain Coverage',
    deliveryLabel: 'across Spain',
    headquarters: 'Madrid, Spain',
    locationSummary: 'Madrid, Barcelona, Málaga, and Valencia',
    locationsHeroImage: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2070&auto=format&fit=crop',
    aboutHeroImage: 'https://images.unsplash.com/photo-1509840841025-9088ba78a826?q=80&w=2070&auto=format&fit=crop',
    aboutStory: 'Inspired by Spain’s open roads, historic cities, and Mediterranean coast, we make every journey feel effortless.',
    aboutMission: 'Our team combines warm Spanish hospitality with premium vehicles and dependable airport-to-hotel delivery.',
    locations: [
      location('Madrid Airport', 'Airport Branch', 'plane', 'Adolfo Suárez Madrid–Barajas Airport, Madrid, Spain', 'Fast airport handovers for arrivals in the capital.', ['Meet & Greet', 'Flight Tracking', 'All Hours'], images.airport, true),
      location('Barcelona', 'City Hub', 'building', 'Barcelona, Catalonia, Spain', 'Convenient delivery across central Barcelona and the coast.', ['Hotel Delivery', 'City Pickup', 'Costa Brava'], images.city),
      location('Málaga', 'Costa del Sol Hub', 'ship', 'Málaga, Andalusia, Spain', 'Premium cars delivered throughout Málaga and the Costa del Sol.', ['Resort Delivery', 'Airport Pickup', 'Coastal Routes'], images.coast),
      location('Valencia', 'East Coast Hub', 'car', 'Valencia, Spain', 'Flexible collection and delivery for city and beach stays.', ['City Delivery', 'Beach Hotels', 'Flexible Returns'], images.road),
    ],
  },
  europe: {
    key: 'europe',
    country: 'Europe',
    adjective: 'European',
    coverageLabel: 'European Coverage',
    deliveryLabel: 'across Europe',
    headquarters: 'Paris, France',
    locationSummary: 'Paris, Milan, Zürich, and Vienna',
    locationsHeroImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2070&auto=format&fit=crop',
    aboutHeroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070&auto=format&fit=crop',
    aboutStory: 'Created for travellers who want one premium rental experience across Europe’s most memorable cities and roads.',
    aboutMission: 'We connect major European destinations with consistent service, multilingual support, and a carefully selected fleet.',
    locations: [
      location('Paris', 'France Hub', 'plane', 'Paris Charles de Gaulle Airport, France', 'Airport delivery and city handovers throughout greater Paris.', ['Flight Tracking', 'City Delivery', 'All Hours'], images.airport, true),
      location('Milan', 'Italy Hub', 'building', 'Milan, Lombardy, Italy', 'A gateway to Milan, Lake Como, and northern Italy.', ['Hotel Delivery', 'Lake Routes', 'City Pickup'], images.city),
      location('Zürich', 'Switzerland Hub', 'car', 'Zürich Airport, Switzerland', 'Premium vehicles for Alpine and cross-border journeys.', ['Airport Pickup', 'Alpine Ready', 'Cross-border'], images.road),
      location('Vienna', 'Austria Hub', 'map', 'Vienna, Austria', 'Flexible city pickup with delivery throughout the Vienna region.', ['City Delivery', 'Hotel Pickup', 'Flexible Returns'], images.resort),
    ],
  },
  usa: {
    key: 'usa',
    country: 'USA',
    adjective: 'American',
    coverageLabel: 'USA Coverage',
    deliveryLabel: 'across the USA',
    headquarters: 'Los Angeles, California',
    locationSummary: 'Los Angeles, Miami, New York, and Las Vegas',
    locationsHeroImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070&auto=format&fit=crop',
    aboutHeroImage: 'https://images.unsplash.com/photo-1465447142348-e9952c393450?q=80&w=2070&auto=format&fit=crop',
    aboutStory: 'Built for iconic American road trips, city escapes, and coast-to-coast journeys with a premium car ready on arrival.',
    aboutMission: 'We bring straightforward service, transparent pricing, and dependable delivery to major destinations across the USA.',
    locations: [
      location('Los Angeles', 'West Coast Hub', 'plane', 'Los Angeles International Airport, California, USA', 'Airport delivery for Los Angeles and Southern California.', ['Flight Tracking', 'Hotel Delivery', 'All Hours'], images.airport, true),
      location('Miami', 'Florida Hub', 'ship', 'Miami International Airport, Florida, USA', 'Convertibles, SUVs, and premium cars for Miami and the Keys.', ['Airport Pickup', 'Beach Hotels', 'Florida Routes'], images.coast),
      location('New York', 'East Coast Hub', 'building', 'Manhattan, New York, USA', 'Door-to-door delivery throughout New York City.', ['Doorstep Delivery', 'City Pickup', 'Flexible Returns'], images.city),
      location('Las Vegas', 'Desert Hub', 'car', 'Las Vegas, Nevada, USA', 'Performance and luxury rentals for Nevada road trips.', ['Resort Delivery', 'Road Trips', 'Premium Fleet'], images.road),
    ],
  },
  uae: {
    key: 'uae',
    country: 'UAE',
    adjective: 'Emirati',
    coverageLabel: 'UAE Coverage',
    deliveryLabel: 'across the UAE',
    headquarters: 'Dubai, UAE',
    locationSummary: 'Dubai Airport, Downtown Dubai, Abu Dhabi, and Sharjah',
    locationsHeroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop',
    aboutHeroImage: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2070&auto=format&fit=crop',
    aboutStory: 'Designed around the UAE’s energy and ambition, our service makes premium mobility effortless from touchdown to desert drive.',
    aboutMission: 'We deliver exceptional vehicles, discreet support, and fast handovers to airports, hotels, residences, and business districts.',
    locations: [
      location('Dubai Airport', 'Airport Branch', 'plane', 'Dubai International Airport, Dubai, UAE', 'Discreet meet-and-greet with rapid vehicle handover.', ['Meet & Greet', 'Flight Tracking', 'All Hours'], images.airport, true),
      location('Downtown Dubai', 'City Hub', 'building', 'Downtown Dubai, UAE', 'Hotel and residence delivery across central Dubai.', ['Hotel Delivery', 'Residence Pickup', 'Business District'], images.city),
      location('Abu Dhabi', 'Capital Hub', 'car', 'Abu Dhabi, UAE', 'Premium delivery for the capital and Yas Island.', ['Airport Pickup', 'Yas Island', 'Flexible Returns'], images.road),
      location('Sharjah', 'Northern Hub', 'map', 'Sharjah, UAE', 'Convenient delivery across Sharjah and the northern emirates.', ['Doorstep Delivery', 'City Pickup', 'Northern Emirates'], images.resort),
    ],
  },
  'south-africa': {
    key: 'south-africa',
    country: 'South Africa',
    adjective: 'South African',
    coverageLabel: 'South Africa Coverage',
    deliveryLabel: 'across South Africa',
    headquarters: 'Cape Town, South Africa',
    locationSummary: 'Cape Town, Johannesburg, Durban, and Stellenbosch',
    locationsHeroImage: 'https://images.unsplash.com/photo-1484318571209-661cf29a69c3?q=80&w=2070&auto=format&fit=crop',
    aboutHeroImage: 'https://images.unsplash.com/photo-1489493585363-d69421e0edd3?q=80&w=2070&auto=format&fit=crop',
    aboutStory: 'Inspired by South Africa’s dramatic coastlines, winelands, and wide-open roads, we help travellers explore with confidence.',
    aboutMission: 'Our local team pairs nationwide reach with attentive service, dependable vehicles, and delivery where your journey begins.',
    locations: [
      location('Cape Town Airport', 'Airport Branch', 'plane', 'Cape Town International Airport, South Africa', 'Airport meet-and-greet for Cape Town and the peninsula.', ['Meet & Greet', 'Flight Tracking', 'All Hours'], images.airport, true),
      location('Johannesburg', 'Gauteng Hub', 'building', 'O.R. Tambo International Airport, Johannesburg, South Africa', 'Premium vehicles for Johannesburg, Pretoria, and beyond.', ['Airport Pickup', 'City Delivery', 'Gauteng Routes'], images.city),
      location('Durban', 'KwaZulu-Natal Hub', 'ship', 'Durban, KwaZulu-Natal, South Africa', 'Coastal delivery for Durban and surrounding resorts.', ['Beach Hotels', 'Airport Pickup', 'Coastal Routes'], images.coast),
      location('Stellenbosch', 'Winelands Hub', 'car', 'Stellenbosch, Western Cape, South Africa', 'Flexible handovers throughout the Cape Winelands.', ['Hotel Delivery', 'Winelands', 'Flexible Returns'], images.road),
    ],
  },
}

export function resolveMarketKey(hostname?: string | null): MarketConfig['key'] {
  const host = (hostname || '').split(':')[0].toLowerCase()
  if (host.includes('demo1.hyrento.com') || host === 'demo1') return 'spain'
  if (host.includes('demo2.hyrento.com') || host === 'demo2') return 'europe'
  if (host.includes('demo3.hyrento.com') || host === 'demo3') return 'usa'
  if (host.includes('demo4.hyrento.com') || host === 'demo4') return 'uae'
  if (host.includes('demo5.hyrento.com') || host === 'demo5') return 'south-africa'
  return 'mauritius'
}

export function getMarketConfig(hostname?: string | null): MarketConfig {
  return MARKET_CONFIGS[resolveMarketKey(hostname)]
}
