"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ChevronDown, ArrowRight, Menu, X, Car, User, Settings, LogOut, Check } from 'lucide-react';
import { useCurrencyStore } from '@/src/store/useCurrencyStore';
import { cn } from '@/src/lib/utils';
import { useBrand } from '@/src/components/providers/BrandProvider';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Cars', href: '/fleet' },
  { name: 'Locations', href: '/locations' },
  { name: 'Mauritius Guide', href: '#guide' },
  { name: 'Offers', href: '#offers' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrencyStore();
  const brand = useBrand();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isTransparentPage = pathname === '/';

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300",
        isScrolled
          ? "bg-[#0D1B2A]/95 backdrop-blur-md shadow-lg py-3"
          : isTransparentPage
            ? "bg-transparent py-5"
            : "bg-[#0D1B2A] py-4"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Logo Left */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            {/* Teal Wave Logo SVG */}
            <svg width="34" height="22" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#00B5A5] transition-transform group-hover:scale-105 duration-300">
              <path d="M10,25 Q30,5 50,25 T90,25" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
              <path d="M10,42 Q30,22 50,42 T90,42" stroke="currentColor" strokeWidth="12" strokeLinecap="round" opacity="0.6" />
            </svg>
            <div className="flex flex-col">
              <span className="text-[19px] font-display font-black tracking-tight text-white leading-none">
                {brand.name}
              </span>
              {brand.name.toLowerCase().includes('mauritius') ? (
                <span className="text-[9px] font-bold text-[#00B5A5] uppercase tracking-[0.25em] mt-0.5 leading-none">
                  MAURITIUS
                </span>
              ) : (
                <span className="text-[9px] font-bold text-[#00B5A5] uppercase tracking-[0.25em] mt-0.5 leading-none">
                  PREMIUM RENTALS
                </span>
              )}
            </div>
          </Link>

          {/* Nav Links Center (Desktop) */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === '/' && pathname === '/en');
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-[13px] font-bold uppercase tracking-[0.05em] transition-all duration-300 rounded-lg group",
                    isActive ? "text-[#00B5A5]" : "text-white/80 hover:text-white"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#00B5A5] rounded-full" />
                  )}
                  <span className={cn(
                    "absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#00B5A5] rounded-full transition-all duration-300 w-0 group-hover:w-4",
                    isActive && "w-0"
                  )} />
                </Link>
              );
            })}
          </div>

          {/* Right Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Currency Selector */}
            <div className="relative">
              <button 
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center gap-1 text-[12px] font-bold text-white/85 hover:text-white border border-white/20 rounded-full px-3 py-1.5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
              >
                <span>{currency}</span>
                <ChevronDown size={12} className="opacity-60" />
              </button>
              
              {isCurrencyDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-[#0D1B2A] border border-white/10 rounded-xl shadow-xl py-2 w-28 z-50 animate-fadeIn">
                  {['MUR', 'EUR', 'USD', 'GBP'].map((cur) => (
                    <button
                      key={cur}
                      onClick={() => {
                        setCurrency(cur as any);
                        setIsCurrencyDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-white hover:bg-[#00B5A5]/20 hover:text-[#00B5A5] flex items-center justify-between"
                    >
                      <span>{cur}</span>
                      {currency === cur && <Check size={12} className="text-[#00B5A5]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 border border-white/20 rounded-full px-3 py-1.5 bg-white/5 text-[12px] font-bold text-white/85">
              <span className="text-[14px]">🇬🇧</span>
              <span>EN</span>
              <ChevronDown size={11} className="opacity-60" />
            </div>

            {/* Bell Icon */}
            <div className="relative p-2 rounded-full hover:bg-white/10 text-white transition-all cursor-pointer">
              <Bell size={19} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00B5A5] border border-[#0D1B2A]" />
            </div>

            {/* Avatar Profile */}
            <div className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-[#00B5A5]/60 hover:border-[#00B5A5] transition-all cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
                alt="Profile avatar"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Book Now Button */}
            <Link
              href="/booking"
              className="h-10 px-5 rounded-full bg-[#00B5A5] hover:bg-[#008C80] text-white text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md shadow-[#00B5A5]/20 hover:-translate-y-0.5"
            >
              <span>Book Now</span>
              <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight size={11} className="text-white" />
              </span>
            </Link>

          </div>

          {/* Right Actions (Mobile - Only show Bell + Avatar + Toggle) */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Bell Icon */}
            <div className="relative p-2 text-white hover:bg-white/5 rounded-full cursor-pointer">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00B5A5] border border-[#0D1B2A]" />
            </div>

            {/* Avatar Profile */}
            <div className="h-9 w-9 rounded-full overflow-hidden border border-white/20 cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
                alt="Profile avatar"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:bg-white/5 rounded-xl transition-all"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <div className={cn(
        "fixed inset-0 z-[99] transition-all duration-500 lg:hidden",
        isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#0D1B2A]/90 backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Panel */}
        <div className={cn(
          "absolute top-0 right-0 h-full w-[280px] bg-[#0D1B2A] border-l border-white/10 shadow-2xl transition-transform duration-500 flex flex-col p-6 space-y-6 justify-between",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-display font-black text-white">Navigation</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "py-3 px-4 rounded-xl font-bold text-sm tracking-wide transition-all",
                      isActive ? "bg-[#00B5A5]/10 text-[#00B5A5]" : "text-white/80 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            {/* Currency Selector */}
            <div className="flex items-center justify-between py-2 border-t border-b border-white/10">
              <span className="text-xs text-white/50 font-bold">Currency</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-[#00B5A5] outline-none cursor-pointer"
              >
                <option value="MUR" className="bg-[#0D1B2A] text-white">MUR</option>
                <option value="EUR" className="bg-[#0D1B2A] text-white">EUR</option>
                <option value="USD" className="bg-[#0D1B2A] text-white">USD</option>
                <option value="GBP" className="bg-[#0D1B2A] text-white">GBP</option>
              </select>
            </div>

            <Link
              href="/booking"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full h-12 rounded-full bg-[#00B5A5] text-white font-bold uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#00B5A5]/25"
            >
              <span>Book Now</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
