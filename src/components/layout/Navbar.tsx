"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Car, Info, LayoutDashboard, Mail, MapPin, Menu, Phone, X, MessageSquare } from 'lucide-react'
import { useCurrencyStore } from '@/src/store/useCurrencyStore'
import { cn } from '@/src/lib/utils'
import { useBrand } from '@/src/components/providers/BrandProvider'
import { MarketDesktopHeader, type HeaderLink } from '@/src/components/layout/MarketDesktopHeader'

const navLinks = [
  { name: 'Fleet', href: '/fleet', icon: Car, desc: 'Browse our vehicle collection' },
  { name: 'Locations', href: '/locations', icon: MapPin, desc: 'Explore pickup locations' },
  { name: 'About', href: '/about', icon: Info, desc: 'Meet our local team' },
  { name: 'Contact', href: '/contact', icon: Mail, desc: 'Get in touch' },
]

const desktopLinks: HeaderLink[] = navLinks.map(({ name, href }) => ({ name, href }))

export default function Navbar() {
  const brand = useBrand()
  const pathname = usePathname()
  const { data: session } = useSession()
  const { currency, setCurrency } = useCurrencyStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const useSolidHeader = isScrolled || (pathname !== '/' && pathname !== '/en')

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => setIsMobileMenuOpen(false), [pathname])

  return (
    <>
      <MarketDesktopHeader brand={brand} pathname={pathname} links={desktopLinks} currency={currency} setCurrency={setCurrency} isScrolled={useSolidHeader} />

      {/* Mobile Header */}
      <nav aria-label="Mobile navigation" className="fixed inset-x-0 top-0 z-[100] p-2.5 sm:p-3 lg:hidden">
        <div className="flex h-16 items-center justify-between rounded-2xl border border-gray-200/90 bg-white/95 px-3 text-[#0D1B2A] shadow-xl backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
            {brand.logo ? (
              <img src={brand.logo} alt={brand.name} className="h-8 sm:h-9 w-auto max-w-[100px] sm:max-w-[120px] object-contain rounded flex-shrink-0" />
            ) : (
              <span className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gold text-white font-black text-xs sm:text-sm">
                {brand.name.slice(0, 2).toUpperCase()}
              </span>
            )}
            <span className="truncate min-w-0">
              <strong className="block text-xs sm:text-sm font-black leading-tight truncate text-[#0D1B2A]">{brand.name}</strong>
              <small className="mt-0.5 block text-[8px] sm:text-[9px] font-black uppercase tracking-[.15em] text-gold truncate">
                {brand.city ? `${brand.city}, ${brand.country}` : brand.country}
              </small>
            </span>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <Link href="/booking" className="rounded-xl bg-gold px-3 sm:px-3.5 py-2 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white shadow-md">
              Book
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-[#0D1B2A] hover:bg-gray-100 flex-shrink-0"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div id="mobile-menu" className={cn('fixed inset-0 z-[99] transition-all duration-500 lg:hidden', isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0')}>
        <button type="button" aria-label="Close menu" className="absolute inset-0 bg-navy-dark/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={cn('absolute right-0 top-0 flex h-full w-[300px] sm:w-[320px] max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-500', isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full')}>
          <div className="flex items-center justify-between border-b border-light-gray p-5 sm:p-6">
            <div className="max-w-[190px] min-w-0">
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} className="h-7 sm:h-8 w-auto max-w-[140px] object-contain mb-1" />
              ) : null}
              <span className="text-base sm:text-lg font-display font-bold text-navy truncate block">{brand.name}</span>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[.15em] text-gold truncate">
                {brand.city ? `${brand.city}, ${brand.country}` : brand.country}
              </p>
            </div>
            <button type="button" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu" className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-navy/5 text-navy">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn('flex items-center gap-4 rounded-2xl p-4 transition-colors', isActive ? 'bg-gold/10 text-gold' : 'text-navy hover:bg-offWhite')}
                >
                  <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', isActive ? 'bg-gold text-white' : 'bg-navy/5 text-navy')}>
                    <Icon size={18} />
                  </span>
                  <span>
                    <strong className="block text-sm">{link.name}</strong>
                    <small className="text-xs text-mid-gray">{link.desc}</small>
                  </span>
                </Link>
              )
            })}
            {!!session && (
              <Link href="/admin" className="flex items-center gap-4 rounded-2xl p-4 text-navy hover:bg-offWhite">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy/5">
                  <LayoutDashboard size={18} />
                </span>
                <span>
                  <strong className="block text-sm">Admin</strong>
                  <small className="text-xs text-mid-gray">Dashboard &amp; analytics</small>
                </span>
              </Link>
            )}
          </div>
          <div className="space-y-3 border-t border-light-gray p-5 sm:p-6">
            {/* Currency Selector inside Mobile Drawer */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Currency</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-black text-navy shadow-sm outline-none cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="AED">AED</option>
                <option value="MUR">MUR (Rs)</option>
                <option value="CHF">CHF</option>
              </select>
            </div>

            <Link href="/booking" className="flex h-12 sm:h-14 w-full items-center justify-center rounded-2xl bg-gold font-black uppercase tracking-widest text-white shadow-lg text-sm sm:text-base">
              Book now
            </Link>
            <a href={`tel:${(brand?.phone || '').replace(/[^0-9+]/g, '')}`} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-navy/5 font-bold text-navy text-sm">
              <Phone size={16} className="text-gold" /> {brand.phone}
            </a>
            {brand.whatsapp && (
              <a
                href={`https://wa.me/${(brand.whatsapp || '').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-50 text-emerald-700 font-bold text-sm border border-emerald-100"
              >
                <MessageSquare size={16} className="text-emerald-600" /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
