import React from 'react';
import Link from 'next/link';
import { User, Luggage, Gauge, Star, ArrowRight, Fuel, Shield } from 'lucide-react';

const FEATURED_CARS = [
  {
    id: 'porsche-718',
    make: 'Porsche',
    model: '718 Boxster GTS',
    year: 2024,
    priceDay: 15000,
    category: 'SPORTS',
    tag: 'Most Wanted',
    tagColor: 'bg-red-500',
    img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop',
    seats: 2, luggage: 1, trans: 'PDK Auto', fuel: 'Petrol', rating: 4.9, reviews: 38,
  },
  {
    id: 'mercedes-s',
    make: 'Mercedes-Benz',
    model: 'S-Class AMG',
    year: 2024,
    priceDay: 18000,
    category: 'LUXURY',
    tag: 'Top Rated',
    tagColor: 'bg-gold',
    img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop',
    seats: 4, luggage: 3, trans: 'Auto', fuel: 'Hybrid', rating: 5.0, reviews: 64,
  },
  {
    id: 'range-rover',
    make: 'Range Rover',
    model: 'Sport HSE',
    year: 2024,
    priceDay: 12000,
    category: 'SUV',
    tag: 'Island Favourite',
    tagColor: 'bg-emerald-600',
    img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=2070&auto=format&fit=crop',
    seats: 5, luggage: 4, trans: 'Auto', fuel: 'Diesel', rating: 4.8, reviews: 91,
  },
];

interface CarCardProps {
  car: typeof FEATURED_CARS[0];
}

function CarCard({ car }: CarCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-100/80 shadow-card hover:shadow-[0_32px_80px_rgba(27,45,79,0.18)] transition-all duration-700 hover:-translate-y-3 flex flex-col">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden flex-shrink-0">
        {/* Category Badge */}
        <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
          <span className="bg-navy/80 backdrop-blur-md text-white text-[9px] font-black tracking-[0.25em] px-3 py-1.5 rounded-full uppercase">
            {car.category}
          </span>
          {car.tag && (
            <span className={`${car.tagColor} text-white text-[9px] font-black tracking-[0.15em] px-3 py-1.5 rounded-full uppercase`}>
              {car.tag}
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button className="absolute top-5 right-5 z-20 h-9 w-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-navy/30 hover:text-red-500 transition-all duration-300 hover:scale-110 shadow-lg">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <img
          src={car.img}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />

        {/* Price overlay at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
          <div>
            <p className="text-3xl font-display font-black text-white leading-none drop-shadow-lg">
              MUR {car.priceDay.toLocaleString()}
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/70 mt-1">per day</p>
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5">
            <Star size={12} className="text-gold" fill="currentColor" />
            <span className="text-white text-[11px] font-black">{car.rating}</span>
            <span className="text-white/60 text-[10px]">({car.reviews})</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-7 flex flex-col flex-1">
        <div className="mb-5">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gold mb-1.5">{car.make} · {car.year}</p>
          <h3 className="text-2xl font-display font-bold text-navy leading-tight">{car.model}</h3>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-4 gap-3 mb-6 py-5 border-y border-gray-50">
          {[
            { icon: User, label: `${car.seats} Seats` },
            { icon: Luggage, label: `${car.luggage} Bags` },
            { icon: Gauge, label: car.trans },
            { icon: Fuel, label: car.fuel },
          ].map((spec, i) => (
            <div key={i} className="flex flex-col items-center gap-2 text-center">
              <div className="h-8 w-8 rounded-xl bg-offWhite flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-500">
                <spec.icon size={16} className="text-navy/30 group-hover:text-gold transition-colors duration-500" />
              </div>
              <span className="text-[9px] font-black text-navy/40 uppercase tracking-wider leading-tight">{spec.label}</span>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {['Free Cancellation', 'Full Insurance', 'GPS Included'].map((f) => (
            <span key={f} className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Shield size={9} />
              {f}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/booking?car=${car.id}`}
          className="mt-auto group/btn w-full h-14 rounded-2xl bg-navy hover:bg-gold flex items-center justify-center gap-3 text-white font-black uppercase tracking-widest text-xs transition-all duration-400 hover:shadow-[0_8px_24px_rgba(201,168,76,0.4)] hover:-translate-y-0.5"
        >
          Reserve This Car
          <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

export default function FeaturedCars() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
      {FEATURED_CARS.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
