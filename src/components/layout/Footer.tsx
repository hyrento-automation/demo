import React from 'react';
import Link from 'next/link';
import { Car, Phone, Mail, MapPin, ArrowUpRight, Shield, Star } from 'lucide-react';

const footerLinks = {
  fleet: [
    { name: 'Luxury Sedans', href: '/fleet' },
    { name: 'Sports Cars', href: '/fleet' },
    { name: 'Luxury SUVs', href: '/fleet' },
    { name: 'Compact Cars', href: '/fleet' },
    { name: 'Economy Class', href: '/fleet' },
    { name: 'Premium Vans', href: '/fleet' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Locations', href: '/locations' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Cookie Policy', href: '/privacy#cookies' },
    { name: 'Rental Agreement', href: '/rental-agreement' },
  ],
};

const awards = ['Best Luxury Rental 2023', 'Island Excellence Award', 'Top Rated Service'];

export default function Footer() {
  return (
    <footer className="bg-navy-dark relative overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] rounded-full bg-gold/[0.02] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-navy-light/30 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* CTA Banner */}
        <div className="py-16 border-b border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gold mb-3">Ready to Explore Mauritius?</p>
              <h3 className="text-4xl md:text-5xl font-display text-white leading-tight">
                Your perfect ride <span className="italic text-gold">awaits.</span>
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/booking"
                className="group h-14 px-8 rounded-2xl bg-gold hover:bg-gold-dark text-white font-black uppercase tracking-widest flex items-center gap-3 transition-all duration-300 shadow-[0_8px_24px_rgba(201,168,76,0.4)] hover:shadow-[0_12px_32px_rgba(201,168,76,0.5)] hover:-translate-y-0.5"
              >
                Book Your Car
                <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <a
                href={`tel:${process.env.NEXT_PUBLIC_BRAND_PHONE || '+2302110000'}`}
                className="h-14 px-8 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold flex items-center gap-3 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <Phone size={18} className="text-gold" />
                {process.env.NEXT_PUBLIC_BRAND_PHONE || '+230 211 0000'}
              </a>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-12 w-12 rounded-2xl bg-gold flex items-center justify-center shadow-[0_4px_16px_rgba(201,168,76,0.4)]">
                <Car size={24} className="text-white" />
              </div>
              <div>
                <p className="text-xl font-display font-bold text-white leading-none">{process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'}</p>
              </div>
            </Link>

            <p className="text-sm text-white/50 leading-relaxed max-w-sm">
              Mauritius's most trusted luxury car rental service since 2010. 
              Experience the island in the finest machines, delivered wherever you need them.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              {[
                { icon: Phone, text: process.env.NEXT_PUBLIC_BRAND_PHONE || '+230 211 0000', href: `tel:${process.env.NEXT_PUBLIC_BRAND_PHONE || '+2302110000'}` },
                { icon: Mail, text: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@carhiremauritius.com', href: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@carhiremauritius.com'}` },
                { icon: MapPin, text: 'SSR Airport, Plaine Magnien, Mauritius', href: '/locations' },
              ].map(({ icon: Icon, text, href }) => (
                <a key={text} href={href} className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors group">
                  <Icon size={16} className="text-gold flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{text}</span>
                </a>
              ))}
            </div>

            {/* Social links — add real URLs when social profiles are created */}
          </div>

          {/* Fleet Links */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30">Fleet</h4>
            <ul className="space-y-3">
              {footerLinks.fleet.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-gold transition-colors hover:translate-x-0.5 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-gold transition-colors hover:translate-x-0.5 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 pt-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-gold transition-colors hover:translate-x-0.5 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Awards Column */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30">Recognition</h4>
            <div className="space-y-4">
              {awards.map((award, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <Star size={16} className="text-gold flex-shrink-0" fill="currentColor" />
                  <span className="text-xs text-white/60 leading-tight">{award}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-gold/10 border border-gold/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={14} className="text-gold" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gold">Fully Insured</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">All vehicles comprehensively insured & GPS-tracked for your safety.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-white/20">Designed for excellence in island travel</span>
            <div className="h-1 w-1 rounded-full bg-gold" />
            <span className="text-xs text-gold">Since 2010</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
