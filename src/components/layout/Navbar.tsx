"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Phone, Menu, X, ChevronDown, Car, MapPin, Info, Mail, LayoutDashboard, Globe, DollarSign } from 'lucide-react';
import { useCurrencyStore } from '@/src/store/useCurrencyStore';
import { useTransition } from 'react';
import { cn } from '@/src/lib/utils';

const navLinks = [
  { name: 'Fleet', href: '/fleet', icon: Car, desc: 'Browse our elite cars' },
  { name: 'Locations', href: '/locations', icon: MapPin, desc: '4 island-wide branches' },
  { name: 'About', href: '/about', icon: Info, desc: 'Our island story' },
  { name: 'Contact', href: '/contact', icon: Mail, desc: 'Get in touch' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
  const { currency, setCurrency } = useCurrencyStore();

  const changeLocale = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const segments = pathname.split('/');
    segments[1] = newLocale;
    startTransition(() => {
      router.replace(segments.join('/') || '/');
    });
  };

  const currentLocale = pathname.split('/')[1] || 'en';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Pages with dark text from the start (non-hero pages)
  const isTransparentPage = pathname === '/';

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-[0_2px_20px_rgba(27,45,79,0.1)] py-3"
          : isTransparentPage
            ? "bg-transparent py-5"
            : "bg-white/95 backdrop-blur-xl shadow-[0_2px_20px_rgba(27,45,79,0.08)] py-4"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative h-10 w-10 rounded-xl bg-gold flex items-center justify-center shadow-[0_4px_12px_rgba(201,168,76,0.4)] group-hover:shadow-[0_8px_24px_rgba(201,168,76,0.5)] transition-all duration-300">
              <Car size={20} className="text-white" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <span className={cn(
                "text-[17px] font-display font-bold tracking-tight transition-colors duration-300 leading-none block",
                isScrolled || !isTransparentPage ? "text-navy" : "text-white"
              )}>
                {process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative px-5 py-2 text-[13px] font-bold tracking-[0.08em] uppercase transition-all duration-300 rounded-lg group",
                    isScrolled || !isTransparentPage
                      ? isActive ? "text-gold" : "text-navy hover:text-gold"
                      : isActive ? "text-gold" : "text-white/90 hover:text-white"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold" />
                  )}
                  <span className={cn(
                    "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gold rounded-full transition-all duration-300 w-0 group-hover:w-4",
                    isActive && "w-0"
                  )} />
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${process.env.NEXT_PUBLIC_BRAND_PHONE || '+2302110000'}`}
              className={cn(
                "hidden xl:flex items-center gap-2 text-[13px] font-bold transition-all duration-300",
                isScrolled || !isTransparentPage ? "text-navy hover:text-gold" : "text-white/80 hover:text-white"
              )}
            >
              <span className="h-7 w-7 rounded-full bg-gold/10 flex items-center justify-center">
                <Phone size={13} className="text-gold" />
              </span>
              <span>{process.env.NEXT_PUBLIC_BRAND_PHONE || '+230 211 0000'}</span>
            </a>

            {/* Currency Switcher */}
            <div className={cn(
              "hidden md:flex items-center gap-1 rounded-full px-2 py-1 transition-all duration-300",
              isScrolled || !isTransparentPage ? "bg-navy/5" : "bg-white/10"
            )}>
              <DollarSign size={14} className={isScrolled || !isTransparentPage ? "text-navy" : "text-white"} />
              <select 
                className={cn(
                  "bg-transparent text-[11px] font-bold outline-none cursor-pointer appearance-none",
                  isScrolled || !isTransparentPage ? "text-navy" : "text-white"
                )}
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
              >
                <option value="MUR" className="text-navy">MUR</option>
                <option value="USD" className="text-navy">USD</option>
                <option value="EUR" className="text-navy">EUR</option>
                <option value="GBP" className="text-navy">GBP</option>
              </select>
            </div>

            {/* Language Switcher — EN only until FR translations are implemented */}
            <div className={cn(
              "hidden lg:flex items-center gap-1 rounded-full px-2 py-1 transition-all duration-300 mr-2",
              isScrolled || !isTransparentPage ? "bg-navy/5" : "bg-white/10"
            )}>
              <Globe size={14} className={isScrolled || !isTransparentPage ? "text-navy" : "text-white"} />
              <select 
                className={cn(
                  "bg-transparent text-[11px] font-bold outline-none cursor-pointer appearance-none",
                  isScrolled || !isTransparentPage ? "text-navy" : "text-white"
                )}
                value="en"
                disabled
              >
                <option value="en" className="text-navy">EN</option>
              </select>
            </div>

            <Link
              href="/booking"
              className="hidden sm:flex h-10 px-6 rounded-xl bg-gold hover:bg-gold-dark text-white text-[13px] font-black uppercase tracking-widest items-center justify-center transition-all duration-300 hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(201,168,76,0.35)] hover:shadow-[0_8px_24px_rgba(201,168,76,0.45)]"
            >
              Book Now
            </Link>

            {/* Mobile Toggle */}
            <button
              className={cn(
                "lg:hidden h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300",
                isScrolled || !isTransparentPage
                  ? "bg-navy/5 text-navy hover:bg-navy/10"
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed top-0 left-0 right-0 bottom-0 z-[99] transition-all duration-500 lg:hidden",
        isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-navy-dark/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Panel */}
        <div className={cn(
          "absolute top-0 right-0 h-full w-[320px] bg-white shadow-2xl transition-transform duration-500 flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="flex items-center justify-between p-6 border-b border-light-gray">
            <span className="text-xl font-display font-bold text-navy">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="h-9 w-9 rounded-xl bg-navy/5 flex items-center justify-center text-navy hover:bg-navy/10 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl transition-all duration-200",
                    isActive ? "bg-gold/10 text-gold" : "hover:bg-offWhite text-navy"
                  )}
                >
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center",
                    isActive ? "bg-gold text-white" : "bg-navy/5 text-navy"
                  )}>
                    <link.icon size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{link.name}</p>
                    <p className="text-xs text-mid-gray">{link.desc}</p>
                  </div>
                </Link>
              );
            })}
            {!!session && (
              <Link
                href="/admin"
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-offWhite text-navy transition-all duration-200"
              >
                <div className="h-10 w-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy">
                  <LayoutDashboard size={18} />
                </div>
                <div>
                  <p className="font-bold text-sm">Admin</p>
                  <p className="text-xs text-mid-gray">Dashboard & analytics</p>
                </div>
              </Link>
            )}
          </div>

          <div className="p-6 border-t border-light-gray space-y-3">
            <Link
              href="/booking"
              className="w-full h-14 rounded-2xl bg-gold text-white font-black uppercase tracking-widest flex items-center justify-center shadow-[0_4px_16px_rgba(201,168,76,0.35)] transition-all hover:bg-gold-dark"
            >
              Book Now
            </Link>
            <a
              href={`tel:${process.env.NEXT_PUBLIC_BRAND_PHONE || '+2302110000'}`}
              className="w-full h-12 rounded-2xl bg-navy/5 text-navy font-bold flex items-center justify-center gap-2 transition-all hover:bg-navy/10"
            >
              <Phone size={16} className="text-gold" />
              {process.env.NEXT_PUBLIC_BRAND_PHONE || '+230 211 0000'}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
