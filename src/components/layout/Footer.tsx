"use client"

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Shield, Heart } from 'lucide-react';
import { useBrand } from '@/src/components/providers/BrandProvider';

export default function Footer() {
  const brand = useBrand();

  return (
    <footer className="bg-[#0D1B2A] text-white pt-16 pb-8 border-t border-white/5 relative overflow-hidden">
      
      {/* Wave pattern background effect */}
      <div className="absolute top-0 right-0 w-[400px] h-[300px] rounded-full bg-[#00B5A5]/[0.02] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-[#00B5A5]/[0.01] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-white/5">
          
          {/* Logo & Brand Info Column */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <svg width="28" height="18" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#00B5A5]">
                <path d="M10,25 Q30,5 50,25 T90,25" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
                <path d="M10,42 Q30,22 50,42 T90,42" stroke="currentColor" strokeWidth="12" strokeLinecap="round" opacity="0.6" />
              </svg>
              <div className="flex flex-col">
                <span className="text-md font-display font-black tracking-tight text-white leading-none">
                  {brand.name}
                </span>
                {brand.name.toLowerCase().includes('mauritius') ? (
                  <span className="text-[8px] font-bold text-[#00B5A5] uppercase tracking-[0.2em] mt-0.5 leading-none">
                    MAURITIUS
                  </span>
                ) : (
                  <span className="text-[8px] font-bold text-[#00B5A5] uppercase tracking-[0.2em] mt-0.5 leading-none">
                    PREMIUM
                  </span>
                )}
              </div>
            </Link>

            <p className="text-[13px] text-white/55 leading-relaxed">
              Premium car rental service. Drive your way. Explore paradise with {brand.name}.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3.5">
              <a href="#" className="h-8 w-8 rounded-full bg-white/5 hover:bg-[#00B5A5]/10 hover:text-[#00B5A5] text-white/70 flex items-center justify-center transition-all">
                <Facebook size={15} />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-white/5 hover:bg-[#00B5A5]/10 hover:text-[#00B5A5] text-white/70 flex items-center justify-center transition-all">
                <Instagram size={15} />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-white/5 hover:bg-[#00B5A5]/10 hover:text-[#00B5A5] text-white/70 flex items-center justify-center transition-all">
                <Twitter size={15} />
              </a>
            </div>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#00B5A5]">Company</h4>
            <ul className="space-y-2.5">
              {['About Us', 'Careers', 'Blog', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link href={item === 'About Us' ? '/about' : item === 'Contact Us' ? '/contact' : '#'} className="text-[13px] text-white/55 hover:text-[#00B5A5] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Fleet Column */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#00B5A5]">Fleet</h4>
            <ul className="space-y-2.5">
              {['All Cars', 'SUVs', 'Economy', 'Luxury'].map((item) => (
                <li key={item}>
                  <Link href="/fleet" className="text-[13px] text-white/55 hover:text-[#00B5A5] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations Column */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#00B5A5]">Locations</h4>
            <ul className="space-y-2.5">
              {['Mauritius Airport', 'Grand Baie', 'Flic en Flac', 'All Locations'].map((item) => (
                <li key={item}>
                  <Link href="/locations" className="text-[13px] text-white/55 hover:text-[#00B5A5] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#00B5A5]">Support</h4>
            <ul className="space-y-2.5">
              {['Help Center', 'FAQs', 'Terms & Conditions', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link href={item === 'Terms & Conditions' ? '/terms' : item === 'Privacy Policy' ? '/privacy' : '#'} className="text-[13px] text-white/55 hover:text-[#00B5A5] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Payments & Copyright */}
        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Copyright text */}
          <p className="text-[11px] text-white/35 font-bold uppercase tracking-wider">
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>

          {/* Secure Payments & Cards */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">We Accept</span>
              
              {/* Payment Badge Strip */}
              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                
                {/* Visa Icon */}
                <div className="text-[9px] font-black text-[#1A1F71] bg-white px-1.5 py-0.5 rounded italic leading-none select-none">
                  VISA
                </div>

                {/* Mastercard Circles */}
                <div className="flex items-center -space-x-1">
                  <div className="w-3 h-3 rounded-full bg-[#EB001B]" />
                  <div className="w-3 h-3 rounded-full bg-[#F79E1B] opacity-85" />
                </div>

                {/* Amex Icon */}
                <div className="text-[8px] font-black text-white bg-[#007cc3] px-1 rounded leading-none select-none">
                  AMEX
                </div>

                {/* Apple Pay */}
                <div className="text-[8px] font-black text-white bg-black border border-white/25 px-1 py-0.5 rounded leading-none select-none">
                   Pay
                </div>

                {/* Google Pay */}
                <div className="text-[8px] font-black text-white leading-none select-none flex items-center">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                  <span className="text-white/60 ml-0.5">Pay</span>
                </div>

              </div>
            </div>

            {/* Secure Payments Seal */}
            <div className="flex items-center gap-2 text-white/55">
              <Shield size={14} className="text-[#00B5A5]" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-black uppercase tracking-wider text-white">Secure Payments</span>
                <span className="text-[9px] text-white/40 leading-none">Your booking is safe and secure</span>
              </div>
            </div>
          </div>

          {/* Made with love in Mauritius */}
          <div className="flex items-center gap-1.5 text-[11px] text-white/35 font-bold uppercase tracking-wider">
            <span>Made with</span>
            <Heart size={10} className="text-[#00B5A5]" fill="currentColor" />
            <span>in Mauritius</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
