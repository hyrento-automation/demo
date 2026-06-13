import React from 'react';
import Link from 'next/link';
import { ArrowRight, Car } from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Luxury',
    desc: 'Mercedes, BMW, Audi',
    count: 8,
    img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format&fit=crop',
    fromPrice: 8500,
  },
  {
    name: 'Sports',
    desc: 'Porsche, Ferrari, Lamborghini',
    count: 4,
    img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
    fromPrice: 15000,
  },
  {
    name: 'SUV',
    desc: 'Range Rover, Porsche Cayenne',
    count: 5,
    img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=800&auto=format&fit=crop',
    fromPrice: 10000,
  },
  {
    name: 'Economy',
    desc: 'Toyota, Honda, Kia',
    count: 6,
    img: 'https://images.unsplash.com/photo-1489824904134-891e080c8f67?q=80&w=800&auto=format&fit=crop',
    fromPrice: 2500,
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-offWhite">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="space-y-3">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gold">Browse By Category</p>
            <h2 className="text-5xl font-display">
              Find your <span className="italic text-gold">perfect match</span>
            </h2>
          </div>
          <Link
            href="/fleet"
            className="flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-navy hover:text-gold transition-colors group"
          >
            View All Cars
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={i}
              href={`/fleet?category=${cat.name.toLowerCase()}`}
              className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden cursor-pointer"
            >
              {/* Image */}
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy/50 to-transparent transition-opacity duration-300" />

              {/* Content */}
              <div className="absolute inset-0 p-7 flex flex-col justify-end">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Car size={14} className="text-gold" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">{cat.count} vehicles</span>
                  </div>
                  <h3 className="text-3xl font-display font-bold text-white mb-1">{cat.name}</h3>
                  <p className="text-white/50 text-xs mb-4">{cat.desc}</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/40">From</p>
                      <p className="text-xl font-display font-bold text-gold">MUR {cat.fromPrice.toLocaleString()}</p>
                      <p className="text-[9px] text-white/40 font-bold">/day</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gold/20 group-hover:bg-gold flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
