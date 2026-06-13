import React from 'react';

const STATS = [
  { value: '14+', label: 'Years of Excellence', desc: 'Serving the island since 2010' },
  { value: '25k+', label: 'Happy Explorers', desc: 'Guests from 80+ countries' },
  { value: '20+', label: 'Elite Vehicles', desc: '2023–2024 model year fleet' },
  { value: '4.9', label: 'Star Rating', desc: 'Based on 2,400+ reviews' },
];

export default function StatsSection() {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="group relative p-8 md:p-10 rounded-[2rem] bg-white border border-gray-100 hover:border-gold/30 hover:shadow-[0_20px_60px_rgba(27,45,79,0.1)] transition-all duration-500 hover:-translate-y-1 text-center overflow-hidden"
            >
              {/* Subtle background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <p className="text-5xl md:text-6xl font-display font-black text-gold leading-none mb-3 relative">
                {stat.value}
              </p>
              <p className="text-sm font-bold text-navy mb-1 relative">{stat.label}</p>
              <p className="text-[11px] text-mid-gray relative">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
