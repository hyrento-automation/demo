import React from 'react';

// Marquee strips: Brand logos / partners
const BRAND_NAMES = [
  'Porsche', 'Mercedes-Benz', 'BMW', 'Range Rover', 'Audi',
  'Ferrari', 'Lamborghini', 'Maserati', 'Bentley', 'Rolls-Royce',
  'Porsche', 'Mercedes-Benz', 'BMW', 'Range Rover', 'Audi',
  'Ferrari', 'Lamborghini', 'Maserati', 'Bentley', 'Rolls-Royce',
];

export default function BrandMarquee() {
  return (
    <section className="py-16 bg-white border-y border-light-gray overflow-hidden">
      <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-navy/30 mb-10">
        Our Elite Fleet Brands
      </p>
      <div className="relative">
        {/* Fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="marquee-track">
          {BRAND_NAMES.map((brand, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl border border-gray-100 bg-offWhite hover:border-gold hover:bg-gold/5 transition-all duration-300 cursor-default flex-shrink-0 group"
            >
              <div className="h-2 w-2 rounded-full bg-gold opacity-50 group-hover:opacity-100 transition-opacity" />
              <span className="text-navy/40 font-display font-bold text-lg group-hover:text-navy transition-colors whitespace-nowrap">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
