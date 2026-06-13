import React from 'react';
import Link from 'next/link';
import HeroSection from '@/src/components/home/HeroSection';
import FleetSection from '@/src/components/home/FleetSection';
import WhyChooseUs from '@/src/components/home/WhyChooseUs';
import TestimonialsSection from '@/src/components/home/TestimonialsSection';
import StatsSection from '@/src/components/home/StatsSection';
import BrandMarquee from '@/src/components/home/BrandMarquee';
import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export const metadata = {
  title: `${process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'} | Luxury Car Rental — Island Wide Delivery`,
  description: 'Discover Mauritius in style with our premium car rental service. 20+ elite vehicles, 24/7 support, and free island-wide delivery. Book your dream car today.',
};

export default async function HomePage() {
  const t = await getTranslations('Index');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    name: process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius',
    image: 'https://images.unsplash.com/photo-1506012733851-4043ce625295?q=80&w=1200',
    description: 'Mauritius\'s most trusted luxury car rental service since 2010.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://carehireos.shop',
    telephone: process.env.NEXT_PUBLIC_BRAND_PHONE || '+23052528340',
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'SSR International Airport',
      addressLocality: 'Plaine Magnien',
      addressRegion: 'Grand Port',
      postalCode: '51520',
      addressCountry: 'MU'
    }
  };

  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroSection />
      <BrandMarquee />
      <StatsSection />
      <FleetSection />

      <section className="py-24 max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-16 space-y-4">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gold">Effortless Experience</p>
          <h2 className="text-5xl md:text-6xl font-display">
            Book in <span className="italic text-gold">3 easy steps</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="absolute top-16 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent hidden md:block" />

          {[
            {
              step: '01',
              title: 'Choose Your Car',
              desc: 'Browse our curated fleet of 20+ luxury vehicles and select the one that matches your style and needs.',
              img: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=600&auto=format&fit=crop',
            },
            {
              step: '02',
              title: 'Set Your Details',
              desc: 'Enter your pickup location, dates, and add-ons like GPS, insurance upgrades, or child seats.',
              img: 'https://images.unsplash.com/photo-1551522435-a13afa10f103?q=80&w=600&auto=format&fit=crop',
            },
            {
              step: '03',
              title: 'We Deliver to You',
              desc: 'Our team delivers your car to your hotel, airport, or any location island-wide. Drive away and explore.',
              img: 'https://images.unsplash.com/photo-1506012733851-4043ce625295?q=80&w=600&auto=format&fit=crop',
            },
          ].map((step, i) => (
            <div key={i} className="group text-center space-y-6">
              <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden">
                <img
                  src={step.img}
                  alt={step.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-navy/30 group-hover:bg-navy/10 transition-all duration-500" />
                <div className="absolute top-6 left-6 h-12 w-12 rounded-2xl bg-gold flex items-center justify-center text-white font-black text-lg shadow-[0_4px_16px_rgba(201,168,76,0.5)]">
                  {step.step}
                </div>
              </div>
              <h3 className="text-2xl font-display font-bold text-navy">{step.title}</h3>
              <p className="text-mid-gray text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/booking"
            className="group inline-flex h-14 px-10 rounded-2xl bg-navy hover:bg-gold text-white font-black uppercase tracking-widest text-[13px] items-center gap-3 transition-all duration-400 shadow-hover hover:shadow-[0_16px_48px_rgba(201,168,76,0.4)] hover:-translate-y-0.5"
          >
            Start Your Booking
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <section className="py-24 bg-offWhite">
        <div className="max-w-7xl mx-auto px-6">
          <WhyChooseUs />
        </div>
      </section>

      <TestimonialsSection />

      <section className="py-24 max-w-7xl mx-auto px-6 w-full">
        <div className="relative rounded-[3rem] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=2070&auto=format&fit=crop"
            alt="Mauritius coastal road drive"
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/90 via-navy/70 to-transparent" />

          <div className="absolute inset-0 flex items-center px-12 md:px-20">
            <div className="max-w-xl space-y-6">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gold">Special Offer</p>
              <h2 className="text-5xl md:text-6xl font-display text-white leading-tight">
                7 Days, <span className="italic text-gold">15% Off</span>
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Book any luxury vehicle for 7 or more days and unlock exclusive long-stay pricing. All categories included.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/booking"
                  className="h-14 px-8 rounded-2xl bg-gold hover:bg-gold-dark text-white font-black uppercase tracking-widest text-[12px] flex items-center gap-2 transition-all duration-300 hover:-translate-y-0.5 shadow-[0_8px_24px_rgba(201,168,76,0.5)]"
                >
                  Book Now
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
