"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Car, Info, LayoutDashboard, Mail, MapPin, Menu, Phone, X } from 'lucide-react'
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

      <nav aria-label="Mobile navigation" className="fixed inset-x-0 top-0 z-[100] p-3 lg:hidden">
        <div className="flex h-14 items-center justify-between rounded-2xl border border-white/15 bg-navy/95 px-3 text-white shadow-xl backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-white"><Car size={19} /></span><span><strong className="block text-sm font-black leading-none">Car Hire</strong><small className="mt-1 block text-[9px] font-black uppercase tracking-[.2em] text-gold">{brand.country}</small></span></Link>
          <button type="button" onClick={() => setIsMobileMenuOpen((open) => !open)} aria-expanded={isMobileMenuOpen} aria-controls="mobile-menu" aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20">
            {isMobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>

      <div id="mobile-menu" className={cn('fixed inset-0 z-[99] transition-all duration-500 lg:hidden', isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0')}>
        <button type="button" aria-label="Close menu" className="absolute inset-0 bg-navy-dark/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={cn('absolute right-0 top-0 flex h-full w-[320px] flex-col bg-white shadow-2xl transition-transform duration-500', isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full')}>
          <div className="flex items-center justify-between border-b border-light-gray p-6"><div><span className="text-xl font-display font-bold text-navy">Car Hire</span><p className="text-[10px] font-black uppercase tracking-[.2em] text-gold">{brand.country}</p></div><button type="button" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu" className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy/5 text-navy"><X size={20} /></button></div>
          <div className="flex-1 space-y-2 overflow-y-auto p-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              const Icon = link.icon
              return <Link key={link.href} href={link.href} className={cn('flex items-center gap-4 rounded-2xl p-4 transition-colors', isActive ? 'bg-gold/10 text-gold' : 'text-navy hover:bg-offWhite')}><span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', isActive ? 'bg-gold text-white' : 'bg-navy/5 text-navy')}><Icon size={18} /></span><span><strong className="block text-sm">{link.name}</strong><small className="text-xs text-mid-gray">{link.desc}</small></span></Link>
            })}
            {!!session && <Link href="/admin" className="flex items-center gap-4 rounded-2xl p-4 text-navy hover:bg-offWhite"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy/5"><LayoutDashboard size={18} /></span><span><strong className="block text-sm">Admin</strong><small className="text-xs text-mid-gray">Dashboard &amp; analytics</small></span></Link>}
          </div>
          <div className="space-y-3 border-t border-light-gray p-6"><Link href="/booking" className="flex h-14 w-full items-center justify-center rounded-2xl bg-gold font-black uppercase tracking-widest text-white">Book now</Link><a href={`tel:${brand.phone.replace(/[^0-9+]/g, '')}`} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-navy/5 font-bold text-navy"><Phone size={16} className="text-gold" /> {brand.phone}</a></div>
        </div>
      </div>
    </>
  )
}
