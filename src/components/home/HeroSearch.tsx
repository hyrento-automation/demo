"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const PICKUP_LOCATIONS = [
  'SSR International Airport (MRU)',
  'Port Louis City Centre',
  'Grand Baie Office',
  'Flic en Flac Office',
  'Hotel Delivery (Island-Wide)',
];

export default function HeroSearch() {
  const [isSameLocation, setIsSameLocation] = useState(true);
  const [pickupLoc, setPickupLoc] = useState(0);

  // Get today + 3 days as defaults
  const today = new Date();
  const plus3 = new Date(today);
  plus3.setDate(today.getDate() + 3);
  const plus10 = new Date(today);
  plus10.setDate(today.getDate() + 10);

  const toInput = (d: Date) => d.toISOString().slice(0, 10);

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_24px_80px_rgba(27,45,79,0.25)] border border-white/60 overflow-hidden">

      {/* Tab strip */}
      <div className="flex border-b border-light-gray">
        {['Rent a Car', 'Chauffeur Service', 'Long-Term'].map((tab, i) => (
          <button
            key={tab}
            className={cn(
              "flex-1 py-4 text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300",
              i === 0
                ? "text-gold border-b-2 border-gold bg-gold/5"
                : "text-navy/40 hover:text-navy border-b-2 border-transparent"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-5 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr_auto] gap-3">

          {/* Pick-up Location */}
          <div className="relative group">
            <label className="absolute left-12 top-3 text-[9px] font-black uppercase tracking-[0.2em] text-navy/40 z-10 pointer-events-none">
              Pick-Up Location
            </label>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold z-10 pointer-events-none">
              <MapPin size={20} />
            </div>
            
            <input 
              type="text"
              placeholder="Search via Google Maps API..."
              className="w-full h-[72px] pl-12 pr-4 pt-5 pb-2 bg-offWhite border-2 border-transparent focus:border-[#4285F4] rounded-2xl text-navy font-bold text-sm cursor-text transition-all duration-300 hover:bg-light-gray"
            />
            {/* Simulated Google Logo Watermark */}
            <div className="absolute right-4 bottom-2 opacity-30 pointer-events-none flex items-center gap-1">
              <span className="text-[8px] font-black text-[#4285F4]">G</span>
              <span className="text-[8px] font-black text-[#EA4335]">o</span>
              <span className="text-[8px] font-black text-[#FBBC05]">o</span>
              <span className="text-[8px] font-black text-[#4285F4]">g</span>
              <span className="text-[8px] font-black text-[#34A853]">l</span>
              <span className="text-[8px] font-black text-[#EA4335]">e</span>
            </div>
          </div>

          {/* Pick-Up Date */}
          <div className="relative group">
            <label className="absolute left-12 top-3 text-[9px] font-black uppercase tracking-[0.2em] text-navy/40 z-10 pointer-events-none">
              Pick-Up Date
            </label>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold z-10 pointer-events-none">
              <Calendar size={20} />
            </div>
            <input
              type="date"
              defaultValue={toInput(plus3)}
              className="w-full h-[72px] pl-12 pr-4 pt-5 pb-2 bg-offWhite border-2 border-transparent focus:border-gold/40 rounded-2xl text-navy font-bold text-sm cursor-pointer transition-all duration-300 hover:bg-light-gray"
            />
          </div>

          {/* Return Date */}
          <div className="relative group">
            <label className="absolute left-12 top-3 text-[9px] font-black uppercase tracking-[0.2em] text-navy/40 z-10 pointer-events-none">
              Return Date
            </label>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold z-10 pointer-events-none">
              <Calendar size={20} />
            </div>
            <input
              type="date"
              defaultValue={toInput(plus10)}
              className="w-full h-[72px] pl-12 pr-4 pt-5 pb-2 bg-offWhite border-2 border-transparent focus:border-gold/40 rounded-2xl text-navy font-bold text-sm cursor-pointer transition-all duration-300 hover:bg-light-gray"
            />
          </div>

          {/* Search Button */}
          <Link href="/booking" className="lg:w-auto">
            <button className="w-full lg:w-[76px] xl:w-[200px] h-[72px] rounded-2xl bg-gold hover:bg-gold-dark text-white font-black uppercase tracking-widest text-sm transition-all duration-300 hover:shadow-[0_12px_32px_rgba(201,168,76,0.5)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 group">
              <span className="hidden xl:block">Search Cars</span>
              <ArrowRight size={22} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

        {/* Options Row */}
        <div className="mt-4 pt-4 border-t border-light-gray flex flex-wrap items-center gap-6">
          <label
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            onClick={() => setIsSameLocation(!isSameLocation)}
          >
            <div className={cn(
              "h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all duration-200",
              isSameLocation ? "bg-gold border-gold" : "border-gray-200 group-hover:border-gold"
            )}>
              {isSameLocation && <CheckCircle2 size={12} className="text-white" />}
            </div>
            <span className="text-[11px] font-bold text-navy tracking-wide">Return to same location</span>
          </label>

          <div className="h-3 w-px bg-light-gray hidden sm:block" />

          <span className="text-[11px] font-bold text-navy/50 hidden sm:block">
            Driver Age: <span className="text-navy">21+ years</span>
          </span>

          <div className="h-3 w-px bg-light-gray hidden lg:block" />

          <div className="hidden lg:flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600">
              14 Cars Available Today
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
