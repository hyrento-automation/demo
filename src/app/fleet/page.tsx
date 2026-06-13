"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Luggage, Gauge, Star, ArrowRight, Fuel, Shield, SlidersHorizontal, Search, X, CheckCircle2 } from 'lucide-react';

import { getPublicCars } from '@/src/lib/actions/car.actions';

const CATEGORIES = ['All', 'Luxury', 'Sports', 'SUV', 'Economy', 'Van', 'Mini', 'Pickup'];
const TRANSMISSIONS = ['All', 'Automatic', 'Manual'];

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedTrans, setSelectedTrans] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getPublicCars().then(data => {
      setVehicles(data);
      setLoading(false);
    });
  }, []);

  const filtered = vehicles
    .filter(car => selectedCat === 'All' || car.category === selectedCat.toUpperCase())
    .filter(car => selectedTrans === 'All' || car.transmission === selectedTrans.toUpperCase())
    .filter(car => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return car.make.toLowerCase().includes(q) || car.model.toLowerCase().includes(q) || car.category.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceDay - b.priceDay;
      if (sortBy === 'price-desc') return b.priceDay - a.priceDay;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="pt-28 pb-24 min-h-screen">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-navy py-24 mb-12">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gold mb-4">Our Elite Fleet</p>
          <h1 className="text-6xl md:text-8xl font-display text-white mb-6">
            Choose Your <span className="italic text-gold">Ride</span>
          </h1>
          <p className="text-white/60 max-w-xl mx-auto font-body text-lg">
            From agile city compacts to commanding luxury SUVs. Every vehicle meticulously maintained and fully insured.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Search & Controls Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search make, model, or category..."
              className="w-full h-14 pl-12 pr-4 bg-white border border-gray-100 rounded-2xl text-navy font-bold text-sm shadow-sm focus:border-gold/40 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="h-14 px-6 bg-white border border-gray-100 rounded-2xl text-navy font-bold text-sm shadow-sm focus:border-gold/40 appearance-none cursor-pointer min-w-[200px]"
          >
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`lg:hidden h-14 px-6 rounded-2xl border font-bold text-sm flex items-center gap-2 transition-all ${showFilters ? 'bg-gold text-white border-gold' : 'bg-white border-gray-100 text-navy shadow-sm'}`}
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filter */}
          <aside className={`flex-shrink-0 w-72 space-y-8 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            
            {/* Category Filter */}
            <div className="bg-white rounded-[1.5rem] border border-gray-100 p-6 shadow-sm space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-navy/40">Vehicle Category</h4>
              <div className="space-y-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    className={`w-full flex items-center justify-between py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                      selectedCat === cat
                        ? 'bg-gold/10 text-gold border border-gold/20'
                        : 'text-navy hover:bg-offWhite border border-transparent'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCat === cat && <CheckCircle2 size={16} className="text-gold" />}
                    <span className="text-[10px] font-black text-navy/30">
                      {cat === 'All' ? vehicles.length : vehicles.filter(c => c.category === cat.toUpperCase()).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Transmission Filter */}
            <div className="bg-white rounded-[1.5rem] border border-gray-100 p-6 shadow-sm space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-navy/40">Transmission</h4>
              <div className="space-y-2">
                {TRANSMISSIONS.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTrans(t)}
                    className={`w-full flex items-center justify-between py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                      selectedTrans === t
                        ? 'bg-gold/10 text-gold border border-gold/20'
                        : 'text-navy hover:bg-offWhite border border-transparent'
                    }`}
                  >
                    {t}
                    {selectedTrans === t && <CheckCircle2 size={16} className="text-gold" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Promo Card */}
            <div className="relative rounded-[1.5rem] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop"
                alt="Special offer"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy/70 to-transparent" />
              <div className="absolute bottom-0 p-6 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">Exclusive Offer</p>
                <p className="text-white font-display text-xl font-bold">7+ Days = 15% Off</p>
                <Link
                  href="/booking"
                  className="inline-flex h-10 px-5 rounded-xl bg-gold text-white text-[11px] font-black uppercase tracking-widest items-center gap-2 transition-all hover:bg-gold-dark"
                >
                  Book Now <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </aside>

          {/* Cars Grid */}
          <div className="flex-1">
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-mid-gray font-bold">
                Showing <span className="text-navy">{filtered.length}</span> vehicles
                {selectedCat !== 'All' && <span className="text-gold"> in {selectedCat}</span>}
              </p>
              {(selectedCat !== 'All' || selectedTrans !== 'All' || searchQuery) && (
                <button
                  onClick={() => { setSelectedCat('All'); setSelectedTrans('All'); setSearchQuery(''); }}
                  className="text-[11px] font-black uppercase tracking-widest text-gold hover:text-gold-dark flex items-center gap-1 transition-colors"
                >
                  <X size={12} /> Clear Filters
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24 space-y-4">
                <div className="h-20 w-20 rounded-full bg-navy/5 flex items-center justify-center mx-auto">
                  <Search size={32} className="text-navy/20" />
                </div>
                <h3 className="text-2xl font-display text-navy">No vehicles found</h3>
                <p className="text-mid-gray">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filtered.map(car => (
                  <div key={car.id} className="group overflow-hidden rounded-[2rem] bg-white border border-gray-100/80 shadow-card hover:shadow-[0_20px_60px_rgba(27,45,79,0.15)] transition-all duration-500 hover:-translate-y-1.5 flex flex-col">
                    
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={car.img}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="bg-navy/80 backdrop-blur-md text-white text-[9px] font-black tracking-[0.2em] px-3 py-1.5 rounded-full uppercase">
                          {car.category}
                        </span>
                        {car.tag && (
                          <span className={`${car.tagColor} text-white text-[9px] font-black tracking-[0.15em] px-3 py-1.5 rounded-full uppercase`}>
                            {car.tag}
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-full px-3 py-1.5">
                        <Star size={11} className="text-gold" fill="currentColor" />
                        <span className="text-navy text-[11px] font-black">{car.rating}</span>
                      </div>

                      {/* Price on image */}
                      <div className="absolute bottom-4 left-4">
                        <p className="text-2xl font-display font-black text-white drop-shadow">
                          MUR {car.priceDay.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-white/70 font-black uppercase tracking-wider">/day</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-1">{car.make} · {car.year}</p>
                      <h3 className="text-xl font-display font-bold text-navy mb-4">{car.model}</h3>

                      {/* Specs */}
                      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-50">
                        {[
                          { icon: User, label: `${car.seats} Seats` },
                          { icon: Luggage, label: `${car.luggage} Bags` },
                          { icon: Gauge, label: car.transmission },
                          { icon: Fuel, label: car.fuel },
                        ].map((s, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <s.icon size={14} className="text-gold" />
                            <span className="text-[10px] font-bold text-navy/50 uppercase tracking-wide">{s.label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {['Free Cancel', 'Full Insurance', 'GPS'].map(f => (
                          <span key={f} className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Shield size={8} />{f}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <Link
                        href={`/booking?car=${car.id}`}
                        className="mt-auto group/btn w-full h-12 rounded-xl bg-navy hover:bg-gold flex items-center justify-center gap-2 text-white font-black uppercase tracking-widest text-[11px] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(201,168,76,0.35)]"
                      >
                        Reserve Now
                        <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
