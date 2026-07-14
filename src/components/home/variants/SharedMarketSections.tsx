import Link from 'next/link'
import { ArrowRight, BadgeCheck, Clock3, Headphones, MapPin, Quote, ShieldCheck, Star } from 'lucide-react'
import FleetSection from '@/src/components/home/FleetSection'

type Market = 'spain' | 'europe' | 'usa' | 'uae' | 'south-africa'

interface MarketSectionConfig {
  eyebrow: string
  fleetHeading: string
  fleetHighlight: string
  fleetDescription: string
  journeyTitle: string
  journeyDescription: string
  routes: Array<{ name: string; detail: string; image: string }>
  promiseTitle: string
  promiseDescription: string
  benefits: Array<{ title: string; detail: string }>
  quote: string
  guest: string
  trip: string
  ctaTitle: string
  ctaText: string
  ctaImage: string
}

const CONFIGS: Record<Market, MarketSectionConfig> = {
  spain: {
    eyebrow: 'The Spanish collection', fleetHeading: 'Made for', fleetHighlight: 'Mediterranean miles',
    fleetDescription: 'City-friendly compacts, refined grand tourers, and SUVs ready for Spain’s coast and countryside.',
    journeyTitle: 'Three moods. One unforgettable road trip.', journeyDescription: 'Build a journey around culture, coast, and the freedom to stop wherever the light looks best.',
    routes: [
      { name: 'Barcelona', detail: 'Architecture, late dinners, and the road north to Costa Brava.', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1000&auto=format&fit=crop' },
      { name: 'Andalusia', detail: 'White villages, mountain bends, and sun-soaked plazas.', image: 'https://images.unsplash.com/photo-1509840841025-9088ba78a826?q=80&w=1000&auto=format&fit=crop' },
      { name: 'Valencia', detail: 'Modern design, orange groves, and easy coastal drives.', image: 'https://images.unsplash.com/photo-1593355783503-6c4c26a16c28?q=80&w=1000&auto=format&fit=crop' },
    ],
    promiseTitle: 'Warm service, zero travel friction.', promiseDescription: 'A distinctly Spanish welcome backed by the same reliable fleet and booking operation.',
    benefits: [
      { title: 'Airport welcome', detail: 'Meet-and-greet at major Spanish airports.' }, { title: 'Transparent rates', detail: 'Clear pricing with no surprise desk fees.' },
      { title: 'Coast delivery', detail: 'Hotels, villas, and resorts across key regions.' }, { title: 'Always supported', detail: 'Help whenever the road trip needs it.' },
    ],
    quote: 'The entire trip felt beautifully simple—from the Barcelona handover to our last night on the coast.', guest: 'Elena & Marco', trip: 'Barcelona to Costa Brava',
    ctaTitle: 'Spain is better with the keys in your hand.', ctaText: 'Choose a car, set your dates, and follow the sun.', ctaImage: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=2000&auto=format&fit=crop',
  },
  europe: {
    eyebrow: 'The continental collection', fleetHeading: 'Engineered for', fleetHighlight: 'grand touring',
    fleetDescription: 'Premium mobility for alpine passes, historic capitals, and seamless cross-border adventures.',
    journeyTitle: 'A continent designed to be driven.', journeyDescription: 'One polished experience connecting mountain roads, cultural capitals, and lakeside escapes.',
    routes: [
      { name: 'The Alps', detail: 'Precision, elevation, and unforgettable switchbacks.', image: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?q=80&w=1000&auto=format&fit=crop' },
      { name: 'Northern Italy', detail: 'Milan style followed by the quiet roads of Lake Como.', image: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?q=80&w=1000&auto=format&fit=crop' },
      { name: 'French Riviera', detail: 'Coastal elegance from Nice to Saint-Tropez.', image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?q=80&w=1000&auto=format&fit=crop' },
    ],
    promiseTitle: 'One standard across every border.', promiseDescription: 'Multilingual support and a consistent premium experience wherever the itinerary leads.',
    benefits: [
      { title: 'Multi-city ready', detail: 'Flexible pickup and return planning.' }, { title: 'Touring protection', detail: 'Cover designed for longer European drives.' },
      { title: 'Route expertise', detail: 'Local guidance for cities and mountain passes.' }, { title: 'Concierge support', detail: 'A responsive team throughout your journey.' },
    ],
    quote: 'It felt less like a rental and more like a perfectly planned European grand tour.', guest: 'Amelia Carter', trip: 'Zürich to Lake Como',
    ctaTitle: 'Your European grand tour starts here.', ctaText: 'Select the car that belongs in the next chapter.', ctaImage: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=2000&auto=format&fit=crop',
  },
  usa: {
    eyebrow: 'Built for the open road', fleetHeading: 'Pick the car.', fleetHighlight: 'Own the route.',
    fleetDescription: 'From city compacts and convertibles to full-size SUVs ready for big American distances.',
    journeyTitle: 'Big roads deserve a bold plan.', journeyDescription: 'Chase the Pacific, cross the desert, or arrive downtown with a car that matches the scale of the trip.',
    routes: [
      { name: 'Pacific Coast', detail: 'Ocean views, cliff roads, and classic California stops.', image: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?q=80&w=1000&auto=format&fit=crop' },
      { name: 'Desert West', detail: 'Wide horizons from Las Vegas toward the national parks.', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop' },
      { name: 'Miami Coast', detail: 'Bright city energy and easy Florida cruising.', image: 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?q=80&w=1000&auto=format&fit=crop' },
    ],
    promiseTitle: 'Fast, clear, and ready to roll.', promiseDescription: 'A straightforward American rental experience with real support behind every mile.',
    benefits: [
      { title: 'Quick pickup', detail: 'Simple airport and city handovers.' }, { title: 'Road-trip range', detail: 'Vehicles selected for real American distances.' },
      { title: 'No hidden extras', detail: 'Know the price before you drive.' }, { title: '24/7 backup', detail: 'Road support whenever you need it.' },
    ],
    quote: 'The Mustang was ready when we landed, and the Pacific Coast drive was everything we imagined.', guest: 'Jordan Blake', trip: 'Los Angeles to San Francisco',
    ctaTitle: 'The road is calling. Go answer it.', ctaText: 'Choose your ride and start the next great American trip.', ctaImage: 'https://images.unsplash.com/photo-1465447142348-e9952c393450?q=80&w=2000&auto=format&fit=crop',
  },
  uae: {
    eyebrow: 'The signature collection', fleetHeading: 'Curated without', fleetHighlight: 'compromise',
    fleetDescription: 'Immaculate luxury, performance, and executive vehicles selected for Dubai and the wider UAE.',
    journeyTitle: 'Every arrival should feel exceptional.', journeyDescription: 'From skyline evenings to desert mornings, every detail is designed around privacy, polish, and time.',
    routes: [
      { name: 'Downtown Dubai', detail: 'Iconic arrivals, five-star hotels, and effortless city movement.', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop' },
      { name: 'Desert Escape', detail: 'Golden horizons beyond the city.', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1000&auto=format&fit=crop' },
      { name: 'Abu Dhabi', detail: 'Capital elegance from the Corniche to Yas Island.', image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?q=80&w=1000&auto=format&fit=crop' },
    ],
    promiseTitle: 'Luxury measured in details.', promiseDescription: 'Discreet service, immaculate presentation, and responsive support at every stage.',
    benefits: [
      { title: 'Private delivery', detail: 'Airport, hotel, residence, or office.' }, { title: 'Immaculate fleet', detail: 'Prepared to a five-star standard.' },
      { title: 'Priority service', detail: 'Rapid handovers built around your schedule.' }, { title: '24/7 concierge', detail: 'Personal assistance day and night.' },
    ],
    quote: 'The car, delivery, and service were flawless. It matched Dubai’s standard perfectly.', guest: 'Omar Al Nuaimi', trip: 'Dubai to Abu Dhabi',
    ctaTitle: 'Make the entrance unforgettable.', ctaText: 'Reserve from the UAE signature collection today.', ctaImage: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2000&auto=format&fit=crop',
  },
  'south-africa': {
    eyebrow: 'Adventure-ready fleet', fleetHeading: 'City polish.', fleetHighlight: 'Open-country confidence.',
    fleetDescription: 'Comfortable city cars, capable SUVs, and premium vehicles ready for coast, winelands, and safari country.',
    journeyTitle: 'Let the landscape set the pace.', journeyDescription: 'Move from mountain to ocean to open country with the freedom to pause whenever South Africa surprises you.',
    routes: [
      { name: 'Cape Peninsula', detail: 'Chapman’s Peak, ocean cliffs, and Table Mountain views.', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=1000&auto=format&fit=crop' },
      { name: 'Garden Route', detail: 'Forest, lagoons, and long coastal curves.', image: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?q=80&w=1000&auto=format&fit=crop' },
      { name: 'Cape Winelands', detail: 'Historic estates and mountain-framed roads.', image: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?q=80&w=1000&auto=format&fit=crop' },
    ],
    promiseTitle: 'Local knowledge for bigger adventures.', promiseDescription: 'Practical route insight, dependable vehicles, and a team that understands the road ahead.',
    benefits: [
      { title: 'Adventure options', detail: 'SUVs and vehicles suited to longer routes.' }, { title: 'Local guidance', detail: 'Advice for coast, winelands, and beyond.' },
      { title: 'Flexible delivery', detail: 'Airport, city, lodge, and hotel handovers.' }, { title: 'Journey support', detail: 'A responsive team throughout the trip.' },
    ],
    quote: 'Cape Town to the Winelands was seamless. The team’s route tips made the whole journey better.', guest: 'Thandi Mokoena', trip: 'Cape Town & Stellenbosch',
    ctaTitle: 'There is always more road to explore.', ctaText: 'Choose a capable car and go beyond the expected.', ctaImage: 'https://images.unsplash.com/photo-1489493585363-d69421e0edd3?q=80&w=2000&auto=format&fit=crop',
  },
}

const LAYOUTS: Record<Market, { page: string; surface: string; cards: string; card: string; promise: string; cta: string }> = {
  spain: { page: 'bg-[#fff8ed]', surface: 'bg-[#fff1df]', cards: 'md:grid-cols-3', card: 'rounded-[2.25rem] bg-white shadow-xl shadow-[#d84e27]/10', promise: 'bg-[#2f211b] text-white', cta: 'rounded-[3rem]' },
  europe: { page: 'bg-[#f2f3ef]', surface: 'bg-[#e5e9e3]', cards: 'md:grid-cols-[1.2fr_.8fr_1fr]', card: 'rounded-md bg-[#18211d] text-white', promise: 'bg-[#18211d] text-white', cta: 'rounded-md' },
  usa: { page: 'bg-[#f4f0e8]', surface: 'bg-white', cards: 'md:grid-cols-3', card: 'rounded-none border-2 border-[#132d4f] bg-white shadow-[8px_8px_0_var(--gold)]', promise: 'bg-[#132d4f] text-white border-y-[10px] border-gold', cta: 'rounded-none border-[8px] border-white/20' },
  uae: { page: 'bg-[#080a0d]', surface: 'bg-[#0f1115] text-white', cards: 'md:grid-cols-3', card: 'rounded-none border border-[#d7b568]/25 bg-[#15171b] text-white', promise: 'bg-black text-white border-y border-[#d7b568]/25', cta: 'rounded-none border border-[#d7b568]/40' },
  'south-africa': { page: 'bg-[#f4ead8]', surface: 'bg-[#ead8bb]', cards: 'md:grid-cols-[.9fr_1.2fr_.9fr]', card: 'rounded-[2rem] bg-[#fffaf0] shadow-lg', promise: 'bg-[#173d32] text-white', cta: 'rounded-[3rem]' },
}

const benefitIcons = [ShieldCheck, MapPin, Clock3, Headphones]

export function SharedMarketSections({ market }: { market: Market }) {
  const config = CONFIGS[market]
  const layout = LAYOUTS[market]
  const isDark = market === 'uae'

  return (
    <div className={layout.page}>
      <FleetSection
        eyebrow={config.eyebrow}
        heading={config.fleetHeading}
        highlightedHeading={config.fleetHighlight}
        description={config.fleetDescription}
        className={isDark ? 'bg-[#0f1115]' : layout.page}
        dark={isDark}
        cardMarket={market}
      />

      <section className={`${layout.surface} px-6 py-24`}>
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
            <p className="text-xs font-black uppercase tracking-[.3em] text-gold">Routes worth remembering</p>
            <div>
              <h2 className={`text-5xl font-black leading-[.95] tracking-tight md:text-7xl ${isDark ? 'text-white' : 'text-navy'}`}>{config.journeyTitle}</h2>
              <p className={`mt-6 max-w-2xl text-lg leading-8 ${isDark ? 'text-white/55' : 'text-mid-gray'}`}>{config.journeyDescription}</p>
            </div>
          </div>
          <div className={`mt-14 grid gap-6 ${layout.cards}`}>
            {config.routes.map((route, index) => (
              <article key={route.name} className={`group overflow-hidden ${layout.card} ${index === 1 && market === 'south-africa' ? 'md:-translate-y-8' : ''}`}>
                <div className="relative h-72 overflow-hidden">
                  <img src={route.image} alt={route.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-5 left-5 text-xs font-black uppercase tracking-[.25em] text-white/75">0{index + 1}</span>
                </div>
                <div className="p-7"><h3 className={`text-2xl font-black ${isDark || market === 'europe' ? 'text-white' : 'text-navy'}`}>{route.name}</h3><p className={`mt-3 text-sm leading-6 ${isDark || market === 'europe' ? 'text-white/55' : 'text-mid-gray'}`}>{route.detail}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${layout.promise} px-6 py-24`}>
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div><p className="text-xs font-black uppercase tracking-[.3em] text-gold">The Hyrento promise</p><h2 className="mt-5 text-5xl font-black leading-tight text-white md:text-6xl">{config.promiseTitle}</h2><p className="mt-6 max-w-lg text-lg leading-8 text-white/60">{config.promiseDescription}</p></div>
            <div className="grid gap-px overflow-hidden rounded-[2rem] bg-white/10 sm:grid-cols-2">
              {config.benefits.map((benefit, index) => {
                const Icon = benefitIcons[index]
                return <div key={benefit.title} className="bg-white/[.045] p-8"><Icon className="text-gold" size={26} /><h3 className="mt-8 text-xl font-black text-white">{benefit.title}</h3><p className="mt-2 text-sm leading-6 text-white/55">{benefit.detail}</p></div>
              })}
            </div>
          </div>
        </div>
      </section>

      <section className={`${layout.surface} px-6 py-24`}>
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div className="flex items-center gap-5"><div className="flex gap-1">{[1,2,3,4,5].map(star => <Star key={star} size={18} fill="currentColor" className="text-gold" />)}</div><span className={`text-sm font-bold ${isDark ? 'text-white/60' : 'text-navy/60'}`}>4.9 average guest rating</span></div>
          <blockquote><Quote size={46} className="text-gold/40" /><p className={`mt-5 text-3xl font-black leading-snug md:text-5xl ${isDark ? 'text-white' : 'text-navy'}`}>“{config.quote}”</p><p className="mt-7 text-sm font-black uppercase tracking-[.2em] text-gold">{config.guest} · {config.trip}</p></blockquote>
        </div>
      </section>

      <section className={`${layout.page} px-6 pb-24`}>
        <div className={`relative mx-auto min-h-[520px] max-w-7xl overflow-hidden ${layout.cta}`}>
          <img src={config.ctaImage} alt={config.ctaTitle} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy/70 to-transparent" />
          <div className="relative flex min-h-[520px] max-w-3xl flex-col justify-center p-8 text-white md:p-16">
            <BadgeCheck className="text-gold" size={34} /><h2 className="mt-7 text-5xl font-black leading-[.95] md:text-7xl">{config.ctaTitle}</h2><p className="mt-6 text-lg text-white/65">{config.ctaText}</p>
            <Link href="/booking" className="mt-9 inline-flex h-16 w-fit items-center gap-4 bg-gold px-9 text-sm font-black uppercase tracking-[.16em] text-white">Book your car <ArrowRight size={19} /></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
