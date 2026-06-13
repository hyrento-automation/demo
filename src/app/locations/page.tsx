import React from 'react';
import Link from 'next/link';
import { MapPin, Plane, Ship, Building, Phone, Clock, ArrowRight, Car, Navigation } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Our Locations | ${process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'} — 4 Island-Wide Branches`,
  description: `${process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'} operates from 4 strategic branches including SSR International Airport, Grand Baie, Port Louis Harbour, and Flic en Flac. Island-wide delivery available.`,
};

const LOCATIONS = [
  {
    name: 'SSR International Airport',
    type: 'Airport Branch',
    icon: Plane,
    address: 'Arrivals Hall, Plaine Magnien, Mauritius',
    phone: '+230 603 0000',
    whatsapp: '+230 5703 0000',
    hours: '24 / 7 (Pre-booked pickups)',
    desc: 'Our flagship branch located right in the arrivals hall. Experience seamless meet & greet service from our smartly dressed concierge team the moment you land.',
    features: ['Meet & Greet Service', 'Instant Handover', 'All Hours'],
    img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000&auto=format&fit=crop',
    mapUrl: 'https://maps.google.com/?q=SSR+International+Airport+Mauritius',
    featured: true,
  },
  {
    name: 'Grand Baie Office',
    type: 'Luxury Hub',
    icon: Building,
    address: 'Royal Road, Grand Baie, Mauritius',
    phone: '+230 211 1100',
    whatsapp: '+230 5711 1100',
    hours: '08:00 – 18:00 Daily',
    desc: 'Serving the north of the island in the heart of Mauritius\'s premier resort town. Ideal for villa deliveries, hotel handovers, and luxury sedan pickups.',
    features: ['Villa Delivery', 'Hotel Pickup', 'North Coast'],
    img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop',
    mapUrl: 'https://maps.google.com/?q=Grand+Baie+Mauritius',
    featured: false,
  },
  {
    name: 'Port Louis Harbour',
    type: 'Capital City Port',
    icon: Ship,
    address: 'Quay Street, Port Louis, Mauritius',
    phone: '+230 211 2200',
    whatsapp: '+230 5711 2200',
    hours: '09:00 – 17:00 Mon–Sat',
    desc: 'Located in the vibrant capital city at the waterfront. Perfect for cruise passengers, business travellers, and those exploring the bustling city centre.',
    features: ['Cruise Transfers', 'Business Rentals', 'City Centre'],
    img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000&auto=format&fit=crop',
    mapUrl: 'https://maps.google.com/?q=Port+Louis+Mauritius',
    featured: false,
  },
  {
    name: 'Flic en Flac Coastal Office',
    type: 'West Coast Hub',
    icon: MapPin,
    address: 'Coastal Road, Flic en Flac, Mauritius',
    phone: '+230 211 3300',
    whatsapp: '+230 5711 3300',
    hours: '08:00 – 19:00 Daily',
    desc: 'Our west coast hub serving the most beautiful lagoon resorts. Ideal for guests at Heritage, Paradis, and all beachside properties along the sunset coast.',
    features: ['Resort Delivery', 'Beach Pickups', 'West Coast'],
    img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1000&auto=format&fit=crop',
    mapUrl: 'https://maps.google.com/?q=Flic+en+Flac+Mauritius',
    featured: false,
  },
];

export default function LocationsPage() {
  return (
    <div className="pt-20 pb-24">

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy py-28">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop"
            alt="Mauritius island aerial"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 dot-pattern opacity-30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center space-y-6">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gold">Where to Find Us</p>
          <h1 className="text-6xl md:text-8xl font-display text-white">
            Island <span className="italic text-gold">Coverage</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
            4 strategic branches + complimentary island-wide concierge delivery. Wherever you are in Mauritius, we'll bring the car to you.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-6 pt-8">
            {[
              { val: '4', label: 'Branch Locations' },
              { val: '2h', label: 'Max Delivery Time' },
              { val: '24/7', label: 'Airport Branch' },
              { val: 'Free', label: 'Island Delivery' },
            ].map((s, i) => (
              <div key={i} className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md text-center">
                <p className="text-3xl font-display font-black text-gold">{s.val}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATIONS GRID */}
      <section className="max-w-7xl mx-auto px-6 py-24 space-y-8">
        {LOCATIONS.map((loc, i) => (
          <div
            key={i}
            className={`group grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-card hover:shadow-[0_24px_80px_rgba(27,45,79,0.12)] transition-all duration-700 ${loc.featured ? 'ring-2 ring-gold/30' : ''}`}
          >
            {/* Image */}
            <div className={`relative aspect-[4/3] lg:aspect-auto overflow-hidden ${i % 2 !== 0 ? 'lg:order-2' : ''}`}>
              <img
                src={loc.img}
                alt={loc.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-navy/60 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-transparent" />
              {loc.featured && (
                <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-gold text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                  Primary Branch
                </div>
              )}
            </div>

            {/* Content */}
            <div className={`p-10 lg:p-14 bg-white flex flex-col justify-center ${i % 2 !== 0 ? 'lg:order-1' : ''}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-14 w-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500">
                  <loc.icon size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gold">{loc.type}</p>
                  <h2 className="text-2xl font-display font-bold text-navy">{loc.name}</h2>
                </div>
              </div>

              <p className="text-mid-gray leading-relaxed mb-8">{loc.desc}</p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-8">
                {loc.features.map((f) => (
                  <span key={f} className="px-3 py-1.5 rounded-full bg-offWhite text-navy font-bold text-[11px] uppercase tracking-wider border border-light-gray">
                    {f}
                  </span>
                ))}
              </div>

              {/* Contact details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 pt-6 border-t border-light-gray">
                <div className="flex items-start gap-3">
                  <Navigation size={16} className="text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-navy/40 mb-0.5">Address</p>
                    <p className="text-sm font-bold text-navy">{loc.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-navy/40 mb-0.5">Phone</p>
                    <a href={`tel:${loc.phone.replace(/\s+/g, '')}`} className="text-sm font-bold text-navy hover:text-gold transition-colors">{loc.phone}</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-navy/40 mb-0.5">Opening Hours</p>
                    <p className="text-sm font-bold text-navy">{loc.hours}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Car size={16} className="text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-navy/40 mb-0.5">WhatsApp</p>
                    <a href={`https://wa.me/${loc.whatsapp.replace(/\s+/g,'')}`} className="text-sm font-bold text-navy hover:text-gold transition-colors">{loc.whatsapp}</a>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/booking"
                  className="group/btn h-12 px-6 rounded-xl bg-navy hover:bg-gold text-white font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(201,168,76,0.35)]"
                >
                  Book from Here <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <a
                  href={loc.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-6 rounded-xl border border-gray-200 text-navy font-bold text-sm flex items-center justify-center gap-2 hover:border-gold hover:text-gold transition-all duration-300"
                >
                  <MapPin size={14} />
                  View Map
                </a>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* MAP PLACEHOLDER */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="relative h-[500px] rounded-[3rem] overflow-hidden bg-navy shadow-luxury">
          <img
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2070&auto=format&fit=crop"
            alt="Mauritius island map"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="h-20 w-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto">
                <MapPin size={40} className="text-gold animate-bounce" />
              </div>
              <h3 className="text-4xl font-display text-white">Interactive Island Map</h3>
              <p className="text-white/50 max-w-md">
                Add your Google Maps API key to activate real-time branch locations, route planning, and live traffic updates across Mauritius.
              </p>
              <div className="flex items-center justify-center gap-4">
                {LOCATIONS.map((loc, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                    <div className="h-2 w-2 rounded-full bg-gold" />
                    <span className="text-white text-[11px] font-bold">{loc.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
