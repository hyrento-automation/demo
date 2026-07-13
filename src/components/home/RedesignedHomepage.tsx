"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Star, Calendar, MapPin, Gauge, User, Luggage, Fuel, Shield, Car, Clock,
  ArrowRight, Bell, ChevronDown, Search, Compass, CheckCircle2, 
  Menu, X, Phone, ShieldCheck, Heart, Award, HelpCircle, FileText
} from 'lucide-react';
import { useBookingStore } from '@/src/store/bookingStore';
import { cn } from '@/src/lib/utils';
import { useBrand } from '@/src/components/providers/BrandProvider';

// Fallback mockup cars matching the screenshot if API has no cars or is loading
const MOCKUP_CARS = [
  {
    id: "alto",
    make: "Suzuki",
    model: "Alto",
    year: 2024,
    category: "ECONOMY",
    transmission: "Manual",
    seats: 4,
    luggage: 1,
    fuel: "Petrol",
    priceDay: 22,
    img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=400&auto=format&fit=crop",
    rating: 4.9,
    reviews: 24,
    tag: "Most Popular",
    tagColor: "bg-[#00B5A5]"
  },
  {
    id: "spresso",
    make: "Suzuki",
    model: "Spresso",
    year: 2024,
    category: "MINI",
    transmission: "Manual",
    seats: 4,
    luggage: 1,
    fuel: "Petrol",
    priceDay: 26,
    img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=400&auto=format&fit=crop", // Placeholder image or orange compact car
    rating: 4.8,
    reviews: 18,
    tag: "",
    tagColor: ""
  },
  {
    id: "ciaz",
    make: "Suzuki",
    model: "Ciaz",
    year: 2023,
    category: "SEDAN",
    transmission: "Automatic",
    seats: 5,
    luggage: 2,
    fuel: "Petrol",
    priceDay: 40,
    img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=400&auto=format&fit=crop", // Grey sedan
    rating: 4.9,
    reviews: 32,
    tag: "",
    tagColor: ""
  },
  {
    id: "creta",
    make: "Hyundai",
    model: "Creta",
    year: 2023,
    category: "SUV",
    transmission: "Automatic",
    seats: 5,
    luggage: 3,
    fuel: "Petrol",
    priceDay: 55,
    img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=400&auto=format&fit=crop", // White SUV
    rating: 4.9,
    reviews: 45,
    tag: "",
    tagColor: ""
  }
];

const LOCATIONS = [
  'Mauritius SSR Airport (Plaine Magnien)',
  'Grand Baie (Branch Office)',
  'Flic en Flac (Delivery Point)',
  'Le Morne (Delivery Point)',
  'Port Louis (City Centre)'
];

const VEHICLE_TYPES = [
  'Any Vehicle',
  'Economy',
  'Mini',
  'Sedan',
  'SUV',
  'Luxury'
];

export default function RedesignedHomepage() {
  const router = useRouter();
  const { setSearchParams, setStep, setVehicle } = useBookingStore();
  const brand = useBrand();
  
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search Widget states (shared across desktop & mobile UI structures)
  const [pickupLoc, setPickupLoc] = useState('Mauritius SSR Airport (Plaine Magnien)');
  const [pickupDate, setPickupDate] = useState('2026-06-15');
  const [returnDate, setReturnDate] = useState('2026-06-25');
  const [vehicleType, setVehicleType] = useState('Any Vehicle');

  // Bottom Navigation Active Tab state (Mobile only)
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    fetch('/api/cars')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // Map DB cars and keep first 4
          const mapped = data.slice(0, 4).map((car: any) => ({
            id: car.id,
            make: car.make,
            model: car.model,
            year: car.year || 2024,
            category: car.category || 'ECONOMY',
            transmission: car.transmission === 'AUTOMATIC' ? 'Automatic' : 'Manual',
            seats: car.seats || 4,
            luggage: car.luggage || 2,
            fuel: car.fuel || 'Petrol',
            priceDay: car.priceDay || 22,
            img: car.img || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=400',
            rating: car.rating || 4.9,
            reviews: car.reviews || 15,
            tag: car.tag || '',
            tagColor: car.tagColor || 'bg-[#00B5A5]'
          }));
          setVehicles(mapped);
        } else {
          setVehicles(MOCKUP_CARS);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching cars:', err);
        setVehicles(MOCKUP_CARS);
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    setSearchParams({
      pickupLocation: pickupLoc,
      dropoffLocation: pickupLoc,
      pickupDate,
      pickupTime: '10:00',
      dropoffDate: returnDate,
      dropoffTime: '10:00',
    });
    setStep(1);
    router.push('/booking');
  };

  const handleQuickBook = (car: any) => {
    setVehicle({
      id: car.id,
      name: `${car.make} ${car.model}`,
      image: car.img,
      category: car.category,
      transmission: car.transmission,
      seats: car.seats,
      luggage: car.luggage,
      fuelType: car.fuel,
      pricePerDay: car.priceDay,
      features: ['Free Cancel', 'Full Insurance', 'GPS'],
      available: 1,
    });
    router.push('/booking');
  };

  return (
    <div className="bg-[#F4F6F9] min-h-screen font-body flex flex-col">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION & NAVBAR SPACE */}
      {/* ========================================================================= */}
      
      {/* Desktop Hero Layout */}
      <section className="relative hidden lg:block bg-[#0D1B2A] pt-36 pb-28 px-8 overflow-hidden min-h-[620px] flex items-center">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2078&auto=format&fit=crop" 
            alt="Mauritius Coastal Scenic Drive" 
            className="w-full h-full object-cover opacity-40 object-bottom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B2A]/90 via-[#0D1B2A]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-12 gap-12 items-center w-full">
          {/* Left Text Column */}
          <div className="col-span-7 space-y-8 text-white">
            <div className="space-y-4">
              <h1 className="text-6xl xl:text-7xl font-display font-black leading-tight tracking-tight">
                Drive Mauritius<br />
                <span className="text-[#00B5A5]">Your Way</span>
              </h1>
              <p className="text-lg text-white/75 max-w-xl font-normal leading-relaxed">
                Premium rental cars from €22/day. Explore the island in comfort and style.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-4">
              <Link
                href="/booking"
                className="h-12 px-6 rounded-full bg-[#00B5A5] hover:bg-[#008C80] text-white font-bold text-[13px] uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-[#00B5A5]/25"
              >
                <span>Book Your Car</span>
                <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowRight size={12} className="text-white" />
                </span>
              </Link>
              <Link
                href="/fleet"
                className="h-12 px-6 rounded-full border border-white/30 hover:border-white hover:bg-white/5 text-white font-bold text-[13px] uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <span>Explore Fleet</span>
                <ArrowRight size={14} className="text-white/80" />
              </Link>
            </div>

            {/* Stats Badges */}
            <div className="flex items-center gap-8 pt-4 border-t border-white/10 w-fit">
              <div className="flex items-center gap-2">
                <Star size={16} className="text-[#FBBC05]" fill="currentColor" />
                <div>
                  <p className="text-sm font-bold leading-none">4.9 Rating</p>
                  <p className="text-[10px] text-white/50">From 2,500+ reviews</p>
                </div>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-[#00B5A5]/20 flex items-center justify-center text-[#00B5A5]">
                  <CheckCircle2 size={12} />
                </div>
                <div>
                  <p className="text-sm font-bold leading-none">5,000+</p>
                  <p className="text-[10px] text-white/50">Happy Customers</p>
                </div>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <Compass size={16} className="text-[#00B5A5]" />
                <div>
                  <p className="text-sm font-bold leading-none">Unlimited</p>
                  <p className="text-[10px] text-white/50">Mileage Included</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Floating Card Column */}
          <div className="col-span-5">
            <div className="bg-white/95 backdrop-blur-md rounded-[2rem] shadow-2xl p-8 border border-white/30 space-y-6">
              <div>
                <h3 className="text-xl font-display font-black text-[#0D1B2A] tracking-tight">
                  Find Your Perfect Car
                </h3>
                <p className="text-xs text-gray-400 mt-1">Book online with instant confirmation</p>
              </div>

              <div className="space-y-4">
                {/* Pickup Location */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <MapPin size={11} className="text-[#00B5A5]" />
                    Pickup Location
                  </label>
                  <div className="relative">
                    <select
                      value={pickupLoc}
                      onChange={(e) => setPickupLoc(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#0D1B2A] appearance-none cursor-pointer focus:border-[#00B5A5]/30 transition-colors"
                    >
                      {LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Pickup Date & Return Date row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <Calendar size={11} className="text-[#00B5A5]" />
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#0D1B2A] focus:border-[#00B5A5]/30 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <Calendar size={11} className="text-[#00B5A5]" />
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#0D1B2A] focus:border-[#00B5A5]/30 transition-colors"
                    />
                  </div>
                </div>

                {/* Vehicle Type */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Car size={11} className="text-[#00B5A5]" />
                    Vehicle Type
                  </label>
                  <div className="relative">
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#0D1B2A] appearance-none cursor-pointer focus:border-[#00B5A5]/30 transition-colors"
                    >
                      {VEHICLE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Find My Car CTA */}
                <button
                  onClick={handleSearch}
                  className="w-full h-12 bg-[#00B5A5] hover:bg-[#008C80] text-white font-bold text-sm uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all mt-6 shadow-md shadow-[#00B5A5]/15"
                >
                  <Search size={16} />
                  <span>Find My Car</span>
                </button>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Hero Layout */}
      <div className="block lg:hidden">
        {/* Full bleed image Hero */}
        <section className="relative bg-[#0D1B2A] pt-28 pb-32 px-6 overflow-hidden flex flex-col justify-end min-h-[380px]">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2078&auto=format&fit=crop" 
              alt="Mauritius Coastal Scenic Drive" 
              className="w-full h-full object-cover opacity-50 object-bottom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-[#0D1B2A]/60 to-transparent" />
          </div>

          <div className="relative z-10 space-y-4 text-white">
            <h1 className="text-4xl font-display font-black leading-tight tracking-tight">
              Drive Mauritius<br />
              Your Way
            </h1>
            <p className="text-sm font-bold text-[#00B5A5] uppercase tracking-widest bg-[#00B5A5]/15 px-3 py-1 rounded-full w-fit">
              Cars from €22/day
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/booking"
                className="h-11 px-5 rounded-full bg-[#00B5A5] hover:bg-[#008C80] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
              >
                <span>Book Now</span>
                <ArrowRight size={12} />
              </Link>
              <Link
                href="/fleet"
                className="h-11 px-5 rounded-full border border-white/30 hover:border-white text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
              >
                <span>Explore Cars</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Mobile Search Card (below and overlapping the hero) */}
        <section className="px-6 -mt-16 relative z-20 mb-8">
          <div className="bg-white rounded-[1.5rem] shadow-xl p-5 border border-gray-100 space-y-4">
            {/* Location */}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <MapPin size={10} className="text-[#00B5A5]" />
                Pickup Location
              </label>
              <div className="relative">
                <select
                  value={pickupLoc}
                  onChange={(e) => setPickupLoc(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#0D1B2A] appearance-none cursor-pointer"
                >
                  {LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Dates Side by Side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                  <Calendar size={10} className="text-[#00B5A5]" />
                  Pickup Date
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-xs font-bold text-[#0D1B2A]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                  <Calendar size={10} className="text-[#00B5A5]" />
                  Return Date
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-xs font-bold text-[#0D1B2A]"
                />
              </div>
            </div>

            {/* Find My Car button */}
            <button
              onClick={handleSearch}
              className="w-full h-11 bg-[#00B5A5] hover:bg-[#008C80] text-white font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#00B5A5]/10"
            >
              <Search size={14} />
              <span>Find My Car</span>
            </button>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 2. FEATURE STRIP / CHIPS */}
      {/* ========================================================================= */}
      
      {/* Desktop Feature Strip */}
      <section className="hidden lg:block max-w-7xl mx-auto px-6 w-full -mt-8 relative z-20 mb-16">
        <div className="bg-white rounded-full shadow-lg border border-gray-100/40 p-4 px-8 grid grid-cols-4 gap-8">
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#00B5A5]/10 flex items-center justify-center text-[#00B5A5]">
              <Compass size={18} />
            </div>
            <div>
              <p className="text-[13px] font-black text-[#0D1B2A] leading-tight">Unlimited Mileage</p>
              <p className="text-[11px] text-gray-400">Drive worry-free</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#00B5A5]/10 flex items-center justify-center text-[#00B5A5]">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-[13px] font-black text-[#0D1B2A] leading-tight">Full Insurance</p>
              <p className="text-[11px] text-gray-400">Comprehensive coverage</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#00B5A5]/10 flex items-center justify-center text-[#00B5A5]">
              <User size={18} />
            </div>
            <div>
              <p className="text-[13px] font-black text-[#0D1B2A] leading-tight">Free Extra Driver</p>
              <p className="text-[11px] text-gray-400">No additional charges</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#00B5A5]/10 flex items-center justify-center text-[#00B5A5]">
              <Phone size={16} />
            </div>
            <div>
              <p className="text-[13px] font-black text-[#0D1B2A] leading-tight">24/7 Support</p>
              <p className="text-[11px] text-gray-400">We&apos;re always here</p>
            </div>
          </div>

        </div>
      </section>

      {/* Mobile Feature Chips Scroll */}
      <section className="block lg:hidden px-6 mb-8 overflow-hidden">
        <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 pr-6">
          {[
            { label: 'Unlimited Mileage', desc: 'Drive worry-free' },
            { label: 'Full Insurance', desc: 'Comprehensive coverage' },
            { label: 'Free Extra Driver', desc: 'No extra charges' },
            { label: '24/7 Support', desc: 'Always available' }
          ].map((feat, idx) => (
            <div key={idx} className="flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 p-3.5 flex items-center gap-2.5 min-w-[200px] relative">
              <div className="absolute top-2 right-2 h-4 w-4 bg-[#00B5A5] rounded-full flex items-center justify-center text-white scale-90">
                <CheckCircle2 size={10} strokeWidth={3} />
              </div>
              <div className="h-8 w-8 rounded-lg bg-[#00B5A5]/10 flex items-center justify-center text-[#00B5A5]">
                {idx === 0 && <Compass size={15} />}
                {idx === 1 && <ShieldCheck size={15} />}
                {idx === 2 && <User size={15} />}
                {idx === 3 && <Phone size={13} />}
              </div>
              <div>
                <p className="text-[12px] font-bold text-[#0D1B2A] leading-none">{feat.label}</p>
                <p className="text-[10px] text-gray-400 mt-1 leading-none">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. POPULAR CARS & EXPLORE PARADISE */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full mb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#00B5A5]">Our most booked vehicles</p>
            <h2 className="text-3xl lg:text-4xl font-display font-black text-[#0D1B2A] tracking-tight mt-1">
              Popular Cars
            </h2>
          </div>
          <Link href="/fleet" className="text-xs font-bold text-[#00B5A5] hover:text-[#008C80] flex items-center gap-1.5 tracking-wider uppercase">
            <span>View all cars</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="h-10 w-10 border-4 border-[#00B5A5] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-gray-400 font-bold mt-4 animate-pulse uppercase tracking-widest">Loading Fleet...</p>
          </div>
        ) : (
          <>
            {/* Desktop Cars Grid + Promo */}
            <div className="hidden lg:grid grid-cols-5 gap-6">
              
              {/* First 4 Car Cards */}
              {vehicles.map((car) => (
                <div key={car.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col relative group overflow-hidden">
                  
                  {/* Car Image container */}
                  <div className="aspect-[16/10] overflow-hidden bg-gray-50 relative">
                    <img 
                      src={car.img} 
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-102 duration-500"
                    />

                    {/* Most Popular Badge */}
                    {car.tag && (
                      <span className="absolute top-3.5 left-3.5 bg-[#00B5A5] text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                        {car.tag}
                      </span>
                    )}

                    {/* Favorite Heart Outline */}
                    <button className="absolute top-3.5 right-3.5 h-7 w-7 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                      <Heart size={14} />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-1 space-y-4">
                    
                    {/* Tags line */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider">
                        {car.transmission}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider">
                        {car.seats} Seats
                      </span>
                      <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider">
                        AC
                      </span>
                    </div>

                    {/* Name */}
                    <div>
                      <h3 className="text-[17px] font-display font-black text-[#0D1B2A] tracking-tight leading-none">
                        {car.make} {car.model}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 leading-none">
                        {car.category}
                      </p>
                    </div>

                    {/* Price and CTA */}
                    <div className="pt-2 flex items-center justify-between border-t border-gray-50 mt-auto">
                      <div>
                        <span className="text-lg font-black text-[#0D1B2A]">€{car.priceDay}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">/day</span>
                      </div>

                      <button
                        onClick={() => handleQuickBook(car)}
                        className="h-9 px-4 rounded-full bg-[#00B5A5] hover:bg-[#008C80] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                      >
                        <span>Quick Book</span>
                        <ArrowRight size={11} />
                      </button>
                    </div>

                  </div>

                </div>
              ))}

              {/* 5th Column - Explore Paradise Promo */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden relative group">
                {/* Image Section */}
                <div className="aspect-[16/10] overflow-hidden bg-gray-50 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=400&auto=format&fit=crop" 
                    alt="Mauritius Tropical Lagoon" 
                    className="w-full h-full object-cover transition-transform group-hover:scale-102 duration-500"
                  />
                  <div className="absolute inset-0 bg-[#00B5A5]/10" />
                </div>
                
                {/* Text Content */}
                <div className="p-5 flex flex-col flex-1 space-y-3 justify-between">
                  <div className="space-y-2">
                    <h3 className="text-[16px] font-display font-black text-[#0D1B2A] tracking-tight leading-tight">
                      Explore Paradise
                    </h3>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Drive to the island&apos;s most beautiful beaches, lagoons and hidden gems.
                    </p>

                    {/* Bullet List */}
                    <ul className="text-[10px] text-[#0D1B2A]/80 font-bold space-y-1 pt-1.5">
                      {['Le Morne', 'Grand Baie', 'Chamarel', 'Black River Gorges'].map((item) => (
                        <li key={item} className="flex items-center gap-1.5">
                          <CheckCircle2 size={11} className="text-[#00B5A5] flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href="/locations"
                    className="h-9 w-full rounded-full bg-[#00B5A5]/10 hover:bg-[#00B5A5] text-[#00B5A5] hover:text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
                  >
                    <span>Discover Mauritius</span>
                    <ArrowRight size={11} />
                  </Link>
                </div>
              </div>

            </div>

            {/* Mobile Horizontal Scroll Grid */}
            <div className="block lg:hidden">
              <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4 snap-x pr-6">
                {vehicles.map((car) => (
                  <div key={car.id} className="flex-shrink-0 w-[240px] snap-start bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
                    
                    {/* Image */}
                    <div className="aspect-[16/10] overflow-hidden bg-gray-50 relative">
                      <img 
                        src={car.img} 
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full object-cover"
                      />
                      {car.tag && (
                        <span className="absolute top-2.5 left-2.5 bg-[#00B5A5] text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                          {car.tag}
                        </span>
                      )}
                      
                      {/* Heart Favorite badge */}
                      <button className="absolute top-2.5 right-2.5 h-6.5 w-6.5 rounded-full bg-white/80 flex items-center justify-center text-gray-400 scale-90">
                        <Heart size={12} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1 space-y-3.5">
                      
                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-[8px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase">
                          {car.transmission}
                        </span>
                        <span className="text-[8px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase">
                          {car.seats} Seats
                        </span>
                        <span className="text-[8px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase">
                          AC
                        </span>
                      </div>

                      {/* Name */}
                      <div>
                        <h3 className="text-[15px] font-display font-black text-[#0D1B2A] tracking-tight leading-none">
                          {car.make} {car.model}
                        </h3>
                        <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 leading-none">
                          {car.category}
                        </p>
                      </div>

                      {/* Price / CTA */}
                      <div className="pt-2 flex items-center justify-between border-t border-gray-50 mt-auto">
                        <div>
                          <span className="text-md font-black text-[#0D1B2A]">€{car.priceDay}</span>
                          <span className="text-[9px] text-gray-400 font-bold uppercase">/day</span>
                        </div>

                        <button
                          onClick={() => handleQuickBook(car)}
                          className="h-8 px-3 rounded-full bg-[#00B5A5] hover:bg-[#008C80] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5 transition-all animate-pulse"
                        >
                          <span>Quick Book</span>
                          <ArrowRight size={10} />
                        </button>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 4. WHY CHOOSE US */}
      {/* ========================================================================= */}
      <section className="bg-white py-16 border-t border-b border-gray-100 w-full mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-12">
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#00B5A5]">Our Commitment</p>
            <h2 className="text-3xl lg:text-4xl font-display font-black text-[#0D1B2A] tracking-tight">
              Why Choose {brand.name}
            </h2>
          </div>

          {/* Desktop Features Row (6 items) */}
          <div className="hidden lg:grid grid-cols-6 gap-8">
            {[
              { icon: Clock, title: '24/7 Pickup', desc: 'Round the clock service' },
              { icon: MapPin, title: 'Islandwide Delivery', desc: 'We bring the car to you' },
              { icon: Shield, title: 'Roadside Assistance', desc: 'Help whenever you need' },
              { icon: User, title: 'No Young Driver Fee', desc: 'No extra charges' },
              { icon: Heart, title: 'Free Baby Seat', desc: 'Safe travels for families' },
              { icon: CheckCircle2, title: 'Multiple Drop-Off Points', desc: 'Flexible returns islandwide' }
            ].map((item, idx) => (
              <div key={idx} className="text-center space-y-3 group">
                <div className="h-12 w-12 rounded-full bg-[#00B5A5]/10 group-hover:bg-[#00B5A5] text-[#00B5A5] group-hover:text-white flex items-center justify-center mx-auto transition-all duration-300">
                  <item.icon size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[13px] font-black text-[#0D1B2A] leading-tight group-hover:text-[#00B5A5] transition-colors">{item.title}</h4>
                  <p className="text-[10px] text-gray-400 leading-normal max-w-[130px] mx-auto">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile 2-Row Features Grid (6 items) */}
          <div className="grid lg:hidden grid-cols-3 gap-y-8 gap-x-4">
            {[
              { icon: Clock, title: '24/7 Pickup', desc: 'Round the clock' },
              { icon: MapPin, title: 'Islandwide Delivery', desc: 'We bring to you' },
              { icon: Shield, title: 'Roadside Assist', desc: 'Help on demand' },
              { icon: User, title: 'No Young Fee', desc: 'No extra charges' },
              { icon: Heart, title: 'Free Baby Seat', desc: 'Family safe' },
              { icon: CheckCircle2, title: 'Drop-Off Points', desc: 'Flexible returns' }
            ].map((item, idx) => (
              <div key={idx} className="text-center space-y-2.5">
                <div className="h-10 w-10 rounded-full bg-[#00B5A5]/10 text-[#00B5A5] flex items-center justify-center mx-auto scale-95">
                  <item.icon size={16} />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-[11px] font-bold text-[#0D1B2A] leading-tight">{item.title}</h4>
                  <p className="text-[9px] text-gray-400 leading-none">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. EXPLORE PARADISE BANNER (Mobile-only version of Column 5) */}
      {/* ========================================================================= */}
      <section className="block lg:hidden px-6 mb-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="relative aspect-[21/9] bg-gray-100 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop" 
              alt="Explore Mauritius Lagoon"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#00B5A5]/15" />
          </div>

          <div className="p-5 space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-[17px] font-display font-black text-[#0D1B2A] leading-tight">Explore Paradise</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Drive to the island&apos;s most beautiful beaches, lagoons and hidden gems.
              </p>
            </div>
            
            <Link
              href="/locations"
              className="h-10 w-full rounded-full bg-[#00B5A5]/10 text-[#00B5A5] font-bold text-xs flex items-center justify-center gap-1"
            >
              <span>Discover Mauritius</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CUSTOMER REVIEWS */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full mb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#00B5A5]">Feedback</p>
            <h2 className="text-3xl lg:text-4xl font-display font-black text-[#0D1B2A] tracking-tight mt-1">
              What Our Customers Say
            </h2>
          </div>
          <Link href="#reviews" className="text-xs font-bold text-[#00B5A5] hover:text-[#008C80] flex items-center gap-1.5 tracking-wider uppercase">
            <span>View all reviews</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Reviews 3 Columns side-by-side (responsive layout grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'David M.', country: 'France', text: 'Excellent service and clean cars. The team made our trip unforgettable!', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100' },
            { name: 'Sarah L.', country: 'UK', text: 'Best car rental experience in Mauritius. Highly recommended!', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100' },
            { name: 'John P.', country: 'Australia', text: 'Great prices, friendly staff and smooth delivery.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100' }
          ].map((review, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              
              {/* Star line */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="text-[#FBBC05]" fill="currentColor" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-[13px] text-gray-500 italic leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Reviewer Details */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                <div className="h-9 w-9 rounded-full overflow-hidden border border-[#00B5A5]/20">
                  <img src={review.img} alt={review.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="text-[12px] font-black text-[#0D1B2A] leading-none">{review.name}</h4>
                  <p className="text-[9px] text-gray-400 mt-1 leading-none">{review.country}</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. MOBILE-ONLY PROMO BANNER */}
      {/* ========================================================================= */}
      <section className="block lg:hidden px-6 mb-24">
        <div className="bg-[#0D1B2A] rounded-2xl p-5 border border-white/5 relative overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00B5A5]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-1 z-10 max-w-[65%]">
            <h3 className="text-[15px] font-display font-black text-white leading-tight">
              Best Rates On The Island
            </h3>
            <p className="text-[10px] text-white/50 leading-tight">
              Book today and enjoy premium service.
            </p>
          </div>

          <Link
            href="/booking"
            className="h-9 px-4 rounded-full bg-[#00B5A5] hover:bg-[#008C80] text-white font-bold text-[10px] uppercase tracking-wider flex items-center justify-center transition-all z-10 shadow-md shadow-[#00B5A5]/15 whitespace-nowrap"
          >
            Reserve Now
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. MOBILE BOTTOM TAB NAVIGATION BAR */}
      {/* ========================================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-[99] lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-xl py-2 px-6 flex items-center justify-between">
        
        <Link 
          href="/" 
          onClick={() => setActiveTab('home')}
          className="flex flex-col items-center gap-1 flex-1 cursor-pointer"
        >
          <div className={cn("h-7 w-7 rounded-xl flex items-center justify-center transition-all", activeTab === 'home' ? "text-[#00B5A5] scale-110" : "text-gray-400")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className={cn("text-[9px] font-bold tracking-wider", activeTab === 'home' ? "text-[#00B5A5]" : "text-gray-400")}>Home</span>
          {activeTab === 'home' && <div className="h-1 w-1 bg-[#00B5A5] rounded-full" />}
        </Link>

        <Link 
          href="/fleet" 
          onClick={() => setActiveTab('cars')}
          className="flex flex-col items-center gap-1 flex-1 cursor-pointer"
        >
          <div className={cn("h-7 w-7 rounded-xl flex items-center justify-center transition-all", activeTab === 'cars' ? "text-[#00B5A5] scale-110" : "text-gray-400")}>
            <Car size={20} />
          </div>
          <span className={cn("text-[9px] font-bold tracking-wider", activeTab === 'cars' ? "text-gray-400" : "text-gray-400")}>Cars</span>
        </Link>

        <Link 
          href="/manage/dashboard" 
          onClick={() => setActiveTab('bookings')}
          className="flex flex-col items-center gap-1 flex-1 cursor-pointer"
        >
          <div className={cn("h-7 w-7 rounded-xl flex items-center justify-center transition-all", activeTab === 'bookings' ? "text-[#00B5A5] scale-110" : "text-gray-400")}>
            <Calendar size={20} />
          </div>
          <span className={cn("text-[9px] font-bold tracking-wider", activeTab === 'bookings' ? "text-gray-400" : "text-gray-400")}>Bookings</span>
        </Link>

        <Link 
          href="/contact" 
          onClick={() => setActiveTab('support')}
          className="flex flex-col items-center gap-1 flex-1 cursor-pointer"
        >
          <div className={cn("h-7 w-7 rounded-xl flex items-center justify-center transition-all", activeTab === 'support' ? "text-[#00B5A5] scale-110" : "text-gray-400")}>
            <HelpCircle size={20} />
          </div>
          <span className={cn("text-[9px] font-bold tracking-wider", activeTab === 'support' ? "text-gray-400" : "text-gray-400")}>Support</span>
        </Link>

        <Link 
          href="/admin" 
          onClick={() => setActiveTab('profile')}
          className="flex flex-col items-center gap-1 flex-1 cursor-pointer"
        >
          <div className={cn("h-7 w-7 rounded-xl flex items-center justify-center transition-all", activeTab === 'profile' ? "text-[#00B5A5] scale-110" : "text-gray-400")}>
            <User size={20} />
          </div>
          <span className={cn("text-[9px] font-bold tracking-wider", activeTab === 'profile' ? "text-gray-400" : "text-gray-400")}>Profile</span>
        </Link>

      </nav>

    </div>
  );
}
