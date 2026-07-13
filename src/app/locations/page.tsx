import Link from 'next/link'
import { headers } from 'next/headers'
import { ArrowRight, Building, Car, Clock, MapPin, Navigation, Phone, Plane, Ship } from 'lucide-react'
import type { Metadata } from 'next'
import { getMarketConfig, SHARED_CONTACT, type LocationIcon } from '@/src/lib/market'

const icons = { plane: Plane, building: Building, car: Car, map: MapPin, ship: Ship } satisfies Record<LocationIcon, typeof MapPin>

export function generateMetadata(): Metadata {
  const market = getMarketConfig(headers().get('host'))
  return {
    title: `Car Hire Locations in ${market.country}`,
    description: `Premium car pickup and delivery in ${market.locationSummary}. Explore every Car Hire ${market.country} location.`,
  }
}

export default function LocationsPage() {
  const market = getMarketConfig(headers().get('host'))

  return (
    <div className="pb-24 pt-20">
      <section className="relative overflow-hidden bg-navy py-28">
        <img src={market.locationsHeroImage} alt={`${market.country} destination`} className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/90 via-navy/65 to-navy/30" />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <p className="text-[11px] font-black uppercase tracking-[.3em] text-gold">Where to find us</p>
          <h1 className="mt-5 text-6xl font-display text-white md:text-8xl">{market.coverageLabel.split(' ')[0]} <span className="italic text-gold">Coverage</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/65">{market.locations.length} key locations with concierge delivery {market.deliveryLabel}. Wherever the journey begins, we bring the car to you.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {[{ val: String(market.locations.length), label: 'Key Locations' }, { val: '2h', label: 'Target Delivery' }, { val: '24/7', label: 'Airport Support' }, { val: 'Direct', label: 'Local Assistance' }].map(stat => (
              <div key={stat.label} className="min-w-36 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 backdrop-blur"><p className="text-3xl font-black text-gold">{stat.val}</p><p className="mt-1 text-[10px] font-black uppercase tracking-[.18em] text-white/40">{stat.label}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-6 py-24">
        {market.locations.map((place, index) => {
          const Icon = icons[place.icon]
          return (
            <article key={place.name} className={`group grid overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-card transition-all duration-500 hover:shadow-luxury lg:grid-cols-2 ${place.featured ? 'ring-2 ring-gold/25' : ''}`}>
              <div className={`relative min-h-80 overflow-hidden ${index % 2 ? 'lg:order-2' : ''}`}>
                <img src={place.img} alt={place.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/45 to-transparent" />
                {place.featured && <span className="absolute left-6 top-6 rounded-full bg-gold px-4 py-2 text-[10px] font-black uppercase tracking-[.2em] text-white">Primary Location</span>}
              </div>
              <div className={`flex flex-col justify-center p-9 lg:p-14 ${index % 2 ? 'lg:order-1' : ''}`}>
                <div className="flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold"><Icon size={27} /></span><div><p className="text-[10px] font-black uppercase tracking-[.24em] text-gold">{place.type}</p><h2 className="text-3xl font-black text-navy">{place.name}</h2></div></div>
                <p className="mt-7 leading-7 text-mid-gray">{place.desc}</p>
                <div className="mt-6 flex flex-wrap gap-2">{place.features.map(feature => <span key={feature} className="rounded-full bg-offWhite px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-navy">{feature}</span>)}</div>
                <div className="mt-8 grid gap-5 border-t border-light-gray pt-7 sm:grid-cols-2">
                  <div className="flex gap-3"><Navigation size={17} className="mt-1 shrink-0 text-gold" /><div><p className="text-[9px] font-black uppercase tracking-widest text-navy/40">Address</p><p className="mt-1 text-sm font-bold text-navy">{place.address}</p></div></div>
                  <div className="flex gap-3"><Clock size={17} className="mt-1 shrink-0 text-gold" /><div><p className="text-[9px] font-black uppercase tracking-widest text-navy/40">Opening Hours</p><p className="mt-1 text-sm font-bold text-navy">{place.hours}</p></div></div>
                  <div className="flex gap-3"><Phone size={17} className="mt-1 shrink-0 text-gold" /><div><p className="text-[9px] font-black uppercase tracking-widest text-navy/40">Phone</p><a href={SHARED_CONTACT.phoneHref} className="mt-1 block text-sm font-bold text-navy hover:text-gold">{SHARED_CONTACT.phone}</a></div></div>
                  <div className="flex gap-3"><Car size={17} className="mt-1 shrink-0 text-gold" /><div><p className="text-[9px] font-black uppercase tracking-widest text-navy/40">WhatsApp</p><a href={SHARED_CONTACT.whatsappHref} target="_blank" rel="noreferrer" className="mt-1 block text-sm font-bold text-navy hover:text-gold">{SHARED_CONTACT.whatsapp}</a></div></div>
                </div>
                <div className="mt-8 flex flex-wrap gap-3"><Link href="/booking" className="inline-flex h-12 items-center gap-2 rounded-xl bg-navy px-6 text-[11px] font-black uppercase tracking-widest text-white hover:bg-gold">Book from here <ArrowRight size={14} /></Link><a href={place.mapUrl} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-xl border border-gray-200 px-6 text-sm font-bold text-navy hover:border-gold hover:text-gold"><MapPin size={14} /> View map</a></div>
              </div>
            </article>
          )
        })}
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <div className="rounded-[3rem] bg-navy p-10 text-center text-white md:p-16"><MapPin size={42} className="mx-auto text-gold" /><h2 className="mt-5 text-4xl font-display">Delivery throughout {market.country}</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-white/55">Tell us where you are staying and our team will arrange the most convenient handover from {market.locationSummary}.</p><a href={SHARED_CONTACT.whatsappHref} target="_blank" rel="noreferrer" className="mt-8 inline-flex h-14 items-center rounded-xl bg-gold px-8 text-xs font-black uppercase tracking-widest text-white">Plan on WhatsApp</a></div>
      </section>
    </div>
  )
}
