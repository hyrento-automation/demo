import React from 'react';
import Link from 'next/link';
import { Award, Shield, Users, Trophy, ArrowRight, Play, Target, Heart, Globe } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `About Us | ${process.env.NEXT_PUBLIC_BRAND_NAME || 'Pleasure Drive Ltd'} — Island's Premier Car Rental`,
  description: `Founded in 2010, ${process.env.NEXT_PUBLIC_BRAND_NAME || 'Pleasure Drive Ltd'} is the island's most trusted luxury car rental service. Learn our story, values, and commitment to excellence.`,
};

const VALUES = [
  {
    icon: Shield,
    title: 'Absolute Trust',
    desc: 'Zero hidden fees. Comprehensive insurance coverage. 2024 safety standards. Your peace of mind is our priority.',
    color: 'text-blue-500', bg: 'bg-blue-50',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    desc: 'A meticulously maintained fleet of the most prestigious automotive brands. Every car cleaned and inspected before every rental.',
    color: 'text-gold', bg: 'bg-gold/10',
  },
  {
    icon: Heart,
    title: 'Island Hospitality',
    desc: 'Born in Mauritius. Our local concierge team treats every traveller like a guest in our own home — 24/7.',
    color: 'text-red-500', bg: 'bg-red-50',
  },
  {
    icon: Globe,
    title: 'Global Standard',
    desc: 'International-grade service with deep local expertise. We speak your language—in every way that matters.',
    color: 'text-purple-500', bg: 'bg-purple-50',
  },
];

const TEAM = [
  { name: 'Alexandre Bonhomme', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop' },
  { name: 'Priya Ramdhani', role: 'Head of Operations', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop' },
  { name: 'Tom Séverin', role: 'Fleet Manager', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop' },
];

const TIMELINE = [
  { year: '2010', event: 'Founded with just 3 cars in Port Louis' },
  { year: '2014', event: 'Expanded to first luxury fleet of 10 vehicles' },
  { year: '2017', event: 'Opened 4 island-wide branches including SSR Airport' },
  { year: '2020', event: 'Launched 24/7 concierge and GPS tracking platform' },
  { year: '2023', event: 'Voted Best Luxury Car Rental by Tropical Travel Awards' },
  { year: '2024', event: 'Full slate of 2024 model year vehicles introduced' },
];

export default function AboutPage() {
  return (
    <div className="pt-20 pb-24">

      {/* HERO SECTION */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1544735048-35756ea33235?q=80&w=2070&auto=format&fit=crop"
            alt="Mauritius luxury travel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy-dark/80 to-navy/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-32">
          <div className="max-w-2xl space-y-8">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gold">Our Story</p>
            <h1 className="text-6xl md:text-8xl font-display text-white leading-[0.95]">
              Elevating<br />
              <span className="italic text-gold">Every Journey</span><br />
              in Mauritius
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              Born from a love of our island and a passion for exceptional service, {process.env.NEXT_PUBLIC_BRAND_NAME || 'Pleasure Drive Ltd'} has been redefining what it means to travel in Mauritius since 2010.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/fleet"
                className="h-14 px-8 rounded-2xl bg-gold hover:bg-gold-dark text-white font-black uppercase tracking-widest text-[12px] flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 shadow-[0_8px_24px_rgba(201,168,76,0.5)]"
              >
                View Our Fleet <ArrowRight size={16} />
              </Link>
              <button className="h-14 px-8 rounded-2xl border border-white/20 text-white font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
                <Play size={16} className="text-gold" fill="currentColor" />
                Our Story
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-navy border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: '14+', label: 'Years of Excellence' },
            { val: '25k+', label: 'Happy Explorers' },
            { val: '20+', label: 'Elite Vehicles' },
            { val: '4.9★', label: 'Average Rating' },
          ].map((s, i) => (
            <div key={i} className="space-y-2">
              <p className="text-5xl font-display font-black text-gold">{s.val}</p>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image collage */}
          <div className="relative h-[600px]">
            <div className="absolute top-0 left-0 w-[65%] h-[70%] rounded-[2.5rem] overflow-hidden shadow-luxury">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop"
                alt="Porsche sports car"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-[55%] h-[55%] rounded-[2.5rem] overflow-hidden shadow-luxury border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1506012733851-4043ce625295?q=80&w=800&auto=format&fit=crop"
                alt="Mauritius coastal drive"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* floating badge */}
            <div className="absolute top-[45%] right-[5%] bg-white rounded-[1.5rem] p-5 shadow-luxury transform -translate-y-1/2 z-10">
              <Trophy size={28} className="text-gold mb-1" />
              <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">Award</p>
              <p className="text-sm font-bold text-navy leading-tight">Best Rental<br />2023</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gold">Our Mission</p>
              <h2 className="text-5xl font-display leading-tight">
                More than a rental.<br />
                <span className="italic text-gold">A complete experience.</span>
              </h2>
            </div>
            <p className="text-lg text-mid-gray leading-relaxed">
              Founded in 2010, {process.env.NEXT_PUBLIC_BRAND_NAME || 'Pleasure Drive Ltd'} was born from a simple vision: to provide a car rental service that truly matches the unparalleled beauty and hospitality of our island.
            </p>
            <p className="text-mid-gray leading-relaxed">
              We don't just hand over keys — we craft memories. From the moment you land at SSR Airport to your final sunset drive along the Grand Baie coast, our elite fleet and dedicated team are your island companions.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              {[
                { icon: Target, text: 'Island-wide delivery within 2 hours' },
                { icon: Shield, text: 'All vehicles fully insured & tracked' },
                { icon: Users, text: 'Multilingual concierge team' },
                { icon: Award, text: 'Premium 2023–2024 model fleet' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-xl bg-gold/10 flex items-center justify-center text-gold flex-shrink-0 mt-0.5">
                    <item.icon size={16} />
                  </div>
                  <p className="text-sm font-bold text-navy leading-tight">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="py-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gold mb-4">What We Stand For</p>
            <h2 className="text-5xl md:text-6xl font-display text-white">
              Our Core <span className="italic text-gold">Principles</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((val, i) => (
              <div
                key={i}
                className="group p-8 rounded-[2rem] border border-white/10 hover:border-gold/30 transition-all duration-500 hover:-translate-y-2"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <div className={`h-14 w-14 rounded-2xl ${val.bg} flex items-center justify-center ${val.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <val.icon size={26} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{val.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gold mb-4">Our Journey</p>
          <h2 className="text-5xl font-display">14 years of <span className="italic text-gold">island excellence</span></h2>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/50 via-gold/20 to-transparent hidden md:block" />
          <div className="space-y-12">
            {TIMELINE.map((item, i) => (
              <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
                <div className="flex-1 md:text-right text-left">
                  {i % 2 === 0 ? (
                    <>
                      <p className="text-4xl font-display font-black text-gold">{item.year}</p>
                      <p className="text-navy font-bold mt-2">{item.event}</p>
                    </>
                  ) : <div />}
                </div>
                <div className="z-10 h-4 w-4 rounded-full bg-gold ring-4 ring-gold/20 ring-offset-2 flex-shrink-0 hidden md:block" />
                <div className="flex-1">
                  {i % 2 !== 0 ? (
                    <>
                      <p className="text-4xl font-display font-black text-gold">{item.year}</p>
                      <p className="text-navy font-bold mt-2">{item.event}</p>
                    </>
                  ) : <div />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-24 bg-offWhite">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gold mb-4">The People</p>
            <h2 className="text-5xl font-display">Meet our <span className="italic text-gold">team</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {TEAM.map((member, i) => (
              <div key={i} className="group text-center">
                <div className="relative mx-auto mb-6 w-48 h-48 rounded-[2rem] overflow-hidden ring-2 ring-transparent group-hover:ring-gold transition-all duration-500 shadow-lg">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h3 className="font-display text-xl font-bold text-navy">{member.name}</h3>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gold mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AWARD SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="relative rounded-[3rem] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=2070&auto=format&fit=crop"
            alt="Mauritius luxury drive"
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-navy/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center space-y-6 max-w-xl px-6">
              <Trophy size={64} className="text-gold mx-auto" />
              <h2 className="text-4xl md:text-5xl font-display text-white">
                Voted Best Luxury Car Rental <span className="italic text-gold">in Mauritius 2023</span>
              </h2>
              <p className="text-white/60 leading-relaxed">
                Awarded by the Tropical Travel Awards Committee for sustained excellence in customer service and fleet quality.
              </p>
              <Link
                href="/booking"
                className="inline-flex h-14 px-8 rounded-2xl bg-gold hover:bg-gold-dark text-white font-black uppercase tracking-widest text-[12px] items-center gap-2 transition-all hover:-translate-y-0.5 shadow-[0_8px_24px_rgba(201,168,76,0.5)]"
              >
                Experience It Yourself <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
