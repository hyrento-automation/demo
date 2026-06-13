import React from 'react';
import { ShieldCheck, Clock, MapPin, BadgeCheck, Headphones, Zap, Star, Award } from 'lucide-react';

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

export default function WhyChooseUs() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gold">Why Choose Us</p>
        <h2 className="text-5xl md:text-6xl font-display">
          The <span className="italic text-gold">island standard</span><br />in car rental
        </h2>
        <p className="text-mid-gray max-w-xl mx-auto font-body leading-relaxed">
          For 14+ years, we've set the benchmark for luxury car rental in Mauritius. Here's what makes us different.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((f, i) => (
          <div
            key={i}
            className="group relative p-8 rounded-[2rem] bg-white border border-gray-100 hover:border-gold/30 hover:shadow-[0_20px_60px_rgba(27,45,79,0.1)] transition-all duration-500 hover:-translate-y-2 overflow-hidden"
          >
            {/* Background glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Icon */}
            <div className={`relative h-14 w-14 rounded-2xl ${f.bg} flex items-center justify-center ${f.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <f.icon size={26} />
            </div>

            {/* Stat */}
            <div className="mb-4">
              <p className={`text-4xl font-display font-black ${f.color} leading-none`}>{f.stat}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/30 mt-1">{f.statLabel}</p>
            </div>

            <h4 className="text-lg font-bold text-navy mb-2">{f.title}</h4>
            <p className="text-sm text-mid-gray leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Trust Bar */}
      <div className="flex flex-wrap items-center justify-center gap-8 py-8 border-y border-light-gray">
        {[
          { icon: Star, text: '4.9/5 Rating on Google', val: '2,400+ Reviews' },
          { icon: Award, text: 'Best Luxury Car Rental 2023', val: 'Tropical Travel Awards' },
          { icon: Headphones, text: 'Avg Response Time', val: '< 8 Minutes' },
          { icon: Zap, text: 'Instant Booking', val: 'No Waiting Required' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 group">
            <div className="h-12 w-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-300">
              <item.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-navy/40">{item.text}</p>
              <p className="text-sm font-bold text-navy">{item.val}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
