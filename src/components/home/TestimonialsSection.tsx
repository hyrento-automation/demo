import React from 'react';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Sophie Laurent',
    location: 'Paris, France',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=200&auto=format&fit=crop&facepad=2',
    car: 'Porsche 718 Boxster',
    rating: 5,
    review: 'Absolutely incredible experience. The Porsche was delivered perfectly to our hotel in Grand Baie, immaculately clean. The team responded to every message within minutes. We\'ll never rent from anyone else in Mauritius.',
    trip: '10 days · Grand Baie',
  },
  {
    name: 'James Whitmore',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop&facepad=2',
    car: 'Range Rover Sport',
    rating: 5,
    review: 'The Range Rover made exploring every corner of this beautiful island effortless. Booking was simple, the car was spotless, and when I had a minor issue, their response was instant. Genuinely premium service.',
    trip: '7 days · Circumnavigation',
  },
  {
    name: 'Ananya Patel',
    location: 'Mumbai, India',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop&facepad=2',
    car: 'Mercedes-Benz S-Class',
    rating: 5,
    review: 'The S-Class made our anniversary holiday truly unforgettable. The concierge team organized everything down to the last detail. You can feel the difference between a regular rental and a true luxury experience.',
    trip: '14 days · Island Honeymoon',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-navy relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[800px] h-[600px] rounded-full bg-navy-light/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gold">Guest Experiences</p>
          <h2 className="text-5xl md:text-6xl font-display text-white">
            Stories from our <span className="italic text-gold">explorers</span>
          </h2>
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={18} className="text-gold" fill="currentColor" />
              ))}
            </div>
            <span className="text-white/60 font-bold text-sm">4.9 · Based on 2,400+ reviews</span>
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="relative group p-8 rounded-[2rem] border border-white/10 hover:border-gold/30 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />

              <div className="relative">
                {/* Quote Icon */}
                <Quote size={40} className="text-gold/20 mb-6" fill="currentColor" />

                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} size={14} className="text-gold" fill="currentColor" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-white/70 text-sm leading-relaxed mb-8 italic">
                  "{t.review}"
                </p>

                {/* Divider */}
                <div className="h-px bg-white/10 mb-6" />

                {/* Reviewer */}
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gold/30">
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{t.name}</p>
                    <p className="text-[10px] text-white/40 font-bold">{t.location}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-[10px] font-black uppercase tracking-wider text-gold">{t.car}</p>
                    <p className="text-[9px] text-white/30 font-bold">{t.trip}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logos */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">As Featured In</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {['TripAdvisor', 'Google', 'The Telegraph', 'Lonely Planet', 'Condé Nast'].map((brand) => (
              <span key={brand} className="text-white/20 font-display font-bold text-lg hover:text-white/50 transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
