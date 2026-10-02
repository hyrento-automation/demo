"use client"

import React from 'react';
import { ShieldCheck, Clock, MapPin, BadgeCheck, Headphones, Zap, Star, Award } from 'lucide-react';
import { useBrand } from '@/src/components/providers/BrandProvider';
import type { BrandConfig } from '@/src/lib/brand';

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Free Cancellation',
    desc: 'Total flexibility. Cancel up to 24h before pickup with a full refund — no questions asked.',
    stat: '100%',
    statLabel: 'Refund Guarantee',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    icon: Clock,
    title: '24/7 Island Support',
    desc: 'Our dedicated concierge team is active round-the-clock for any assistance you need.',
    stat: '24/7',
    statLabel: 'Always Available',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    icon: MapPin,
    title: 'Island-Wide Delivery',
    desc: 'Complimentary delivery to SSR Airport, Port Louis, Grand Baie or any major resort.',
    stat: '4',
    statLabel: 'Pickup Branches',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
  {
    icon: BadgeCheck,
    title: 'Best Price Guarantee',
    desc: 'Direct island pricing with no hidden surcharges, broker fees, or surprise extras.',
    stat: '0',
    statLabel: 'Hidden Fees',
    color: 'text-gold',
    bg: 'bg-gold/10',
  },
];

interface WhyChooseUsProps {
  brand?: BrandConfig;
}

export default function WhyChooseUs({ brand: propBrand }: WhyChooseUsProps = {}) {
  let contextBrand: BrandConfig | null = null;
  try {
    contextBrand = useBrand();
  } catch {
    // Graceful fallback if rendered outside provider
  }
  const brand = propBrand || contextBrand || { country: 'Global', city: '' };
  const locationText = brand.country === 'Global' ? 'worldwide' : (brand.city || brand.country);

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gold">Why Choose Us</p>
        <h2 className="text-5xl md:text-6xl font-display">
          The <span className="italic text-gold">gold standard</span><br />in car rental
        </h2>
        <p className="text-mid-gray max-w-xl mx-auto font-body leading-relaxed">
          For over 14 years, we&apos;ve set the benchmark for premium car rental and customer satisfaction in {locationText}. Here&apos;s what makes us different.
        </p>
      </div>

      {/* 4 Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div
              key={i}
              className="group p-8 rounded-[2rem] bg-white border border-gray-100 hover:border-gold/30 hover:shadow-[0_20px_60px_rgba(27,45,79,0.08)] transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className={`h-14 w-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={26} className={feature.color} />
                </div>
                <h3 className="text-xl font-display font-bold text-navy mb-3">{feature.title}</h3>
                <p className="text-mid-gray text-xs leading-relaxed">{feature.desc}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50 flex items-baseline justify-between">
                <span className="text-3xl font-display font-black text-navy">{feature.stat}</span>
                <span className="text-[10px] font-bold text-mid-gray uppercase tracking-wider">{feature.statLabel}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
