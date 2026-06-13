"use client"

import React from 'react'
import { Vehicle } from '../../types/fleet.types'
import { User, Luggage, Gauge, Star, ArrowRight, Fuel, Shield } from 'lucide-react';
import Link from 'next/link';

interface VehicleCardProps {
  vehicle: Vehicle
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  // Parse make/model mapping if strictly using old Vehicle type
  const parts = vehicle.name ? vehicle.name.split(' ') : ['Make', 'Model'];
  const make = vehicle.make || parts[0];
  const model = vehicle.model || parts.slice(1).join(' ');
  const year = vehicle.year || new Date().getFullYear();
  const fuel = vehicle.fuel || 'Petrol';
  const rating = vehicle.rating || 4.8;
  const tag = vehicle.tag || '';
  const tagColor = vehicle.tagColor || 'bg-red-500';

  return (
    <div className="group overflow-hidden rounded-[2rem] bg-white border border-gray-100/80 shadow-card hover:shadow-[0_20px_60px_rgba(27,45,79,0.15)] transition-all duration-500 hover:-translate-y-1.5 flex flex-col h-full text-left text-navy">
      
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={vehicle.imageUrl}
          alt={`${make} ${model}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy/40 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="bg-navy/80 backdrop-blur-md text-white text-[9px] font-black tracking-[0.2em] px-3 py-1.5 rounded-full uppercase">
            {vehicle.category}
          </span>
          {tag && (
            <span className={`${tagColor} text-white text-[9px] font-black tracking-[0.15em] px-3 py-1.5 rounded-full uppercase`}>
              {tag}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-full px-3 py-1.5">
          <Star size={11} className="text-gold" fill="currentColor" />
          <span className="text-navy text-[11px] font-black">{rating}</span>
        </div>

        {/* Price on image */}
        <div className="absolute bottom-4 left-4">
          <p className="text-2xl font-display font-black text-white drop-shadow">
            MUR {vehicle.priceFrom.toLocaleString()}
          </p>
          <p className="text-[10px] text-white/70 font-black uppercase tracking-wider">/day</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-1">{make} · {year}</p>
        <h3 className="text-xl font-display font-bold text-navy mb-4">{model}</h3>

        {/* Specs */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-50 flex-wrap">
          {[
            { icon: User, label: `${vehicle.seats} Seats` },
            { icon: Luggage, label: `${vehicle.bags} Bags` },
            { icon: Gauge, label: vehicle.transmission },
            { icon: Fuel, label: fuel },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <s.icon size={14} className="text-gold" />
              <span className="text-[10px] font-bold text-navy/50 uppercase tracking-wide">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
          {['Free Cancel', 'Full Insurance', 'GPS'].map(f => (
            <span key={f} className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Shield size={8} />{f}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/booking`}
          className="mt-4 group/btn w-full h-12 rounded-xl bg-navy hover:bg-gold flex items-center justify-center gap-2 text-white font-black uppercase tracking-widest text-[11px] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(201,168,76,0.35)]"
        >
          Reserve Now
          <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
