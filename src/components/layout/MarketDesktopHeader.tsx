"use client"

import Link from 'next/link'
import { Car, Compass, Crown, DollarSign, Flag, Globe, Mail, Mountain, Phone, Sun, MessageSquare } from 'lucide-react'
import type { BrandConfig } from '@/src/lib/brand'
import { cn } from '@/src/lib/utils'

export interface HeaderLink {
  name: string
  href: string
}

type Currency = 'MUR' | 'USD' | 'EUR' | 'GBP' | 'INR' | 'AED' | 'CHF'

interface MarketDesktopHeaderProps {
  brand: BrandConfig
  pathname: string
  links: HeaderLink[]
  currency: string
  setCurrency: (currency: any) => void
  isScrolled: boolean
}

function CurrencySelect({ currency, setCurrency, dark = false }: { currency: string; setCurrency: (currency: any) => void; dark?: boolean }) {
  return (
    <label className={cn('hidden items-center gap-1 px-1 py-2 md:flex', dark ? 'text-white' : 'text-navy')}>
      <DollarSign size={13} />
      <span className="sr-only">Currency</span>
      <select
        value={currency}
        onChange={(event) => setCurrency(event.target.value as Currency)}
        className="cursor-pointer appearance-none border-0 bg-transparent p-0 text-[10px] font-black shadow-none outline-none ring-0 focus:border-0 focus:ring-0"
        style={{ border: 0, background: 'transparent', boxShadow: 'none' }}
      >
        <option value="USD" className="text-navy">USD ($)</option>
        <option value="EUR" className="text-navy">EUR (€)</option>
        <option value="GBP" className="text-navy">GBP (£)</option>
        <option value="INR" className="text-navy">INR (₹)</option>
        <option value="AED" className="text-navy">AED</option>
        <option value="MUR" className="text-navy">MUR (Rs)</option>
        <option value="CHF" className="text-navy">CHF</option>
      </select>
    </label>
  )
}

function LanguageBadge({ dark = false }: { dark?: boolean }) {
  return <span className={cn('hidden items-center gap-1 px-1 py-2 text-[10px] font-black md:flex', dark ? 'text-white' : 'text-navy')}><Globe size={13} /> EN</span>
}

function HeaderLinks({ links, pathname, className, activeClassName, divider = false }: { links: HeaderLink[]; pathname: string; className: string; activeClassName: string; divider?: boolean }) {
  return (
    <div className="flex items-center">
      {links.map((link, index) => (
        <div key={link.href} className="flex items-center">
          {divider && index > 0 && <span className="text-gold/50 mx-1">/</span>}
          <Link href={link.href} className={cn(className, pathname === link.href && activeClassName)}>{link.name}</Link>
        </div>
      ))}
    </div>
  )
}

function PhoneLink({ brand, dark = false, compact = false }: { brand: BrandConfig; dark?: boolean; compact?: boolean }) {
  return (
    <a href={`tel:${(brand?.phone || '').replace(/[^0-9+]/g, '')}`} className={cn('hidden items-center gap-2 font-bold xl:flex', compact ? 'text-[11px]' : 'text-[13px]', dark ? 'text-white/80 hover:text-white' : 'text-navy/80 hover:text-gold')}>
      <Phone size={14} className="text-gold" /> {brand.phone}
    </a>
  )
}

export function MarketDesktopHeader({ brand, pathname, links, currency, setCurrency, isScrolled }: MarketDesktopHeaderProps) {
  // If this is a specific company brand (from CSV or subdomain), display the company branded header
  if (brand.slug) {
    return (
      <nav aria-label="Primary navigation" className="fixed inset-x-0 top-0 z-[100] hidden lg:block bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.06)] py-3.5 transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3 max-w-[340px]">
            {brand.logo ? (
              <img src={brand.logo} alt={brand.name} className="h-10 w-auto max-w-[150px] object-contain rounded" />
            ) : (
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gold text-white font-black text-base shadow-md">
                {brand.name.slice(0, 2).toUpperCase()}
              </span>
            )}
            <div className="truncate">
              <strong className="block font-display text-lg leading-tight truncate text-[#0D1B2A]">
                {brand.name}
              </strong>
              <small className="block text-[10px] font-black uppercase tracking-[.18em] text-gold truncate">
                {brand.city ? `${brand.city}, ${brand.country}` : brand.country}
              </small>
            </div>
          </Link>

          <HeaderLinks
            links={links}
            pathname={pathname}
            className="rounded-lg px-4 py-2 text-xs font-black uppercase tracking-[.1em] text-[#1B263B] hover:text-gold transition-colors"
            activeClassName="text-gold font-bold bg-gold/5"
          />

          <div className="flex items-center gap-3">
            <PhoneLink brand={brand} dark={false} />
            {brand.whatsapp && (
              <a
                href={`https://wa.me/${brand.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-sm"
              >
                <MessageSquare size={13} className="text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            )}
            <CurrencySelect currency={currency} setCurrency={setCurrency} dark={false} />
            <LanguageBadge dark={false} />
            <Link href="/booking" className="rounded-xl bg-gold px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-md hover:bg-gold-dark transition-all">
              Book now
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  // Fallback preset market headers (demo1..demo5)
  if (brand.country === 'Spain') {
    return (
      <nav aria-label="Primary navigation" className={cn('fixed inset-x-0 z-[100] hidden px-5 transition-all duration-500 lg:block', isScrolled ? 'top-2' : 'top-5')}>
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between rounded-full border border-[#d84e27]/15 bg-[#fff8ed]/95 px-5 shadow-[0_14px_40px_rgba(47,33,27,.12)] backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3 text-[#2f211b]"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d84e27] text-white"><Sun size={21} /></span><span><strong className="block font-display text-lg leading-none">{brand.name}</strong><small className="mt-1 block text-[10px] font-black uppercase tracking-[.24em] text-[#d84e27]">España</small></span></Link>
          <div className="rounded-full bg-white px-2 shadow-sm"><HeaderLinks links={links} pathname={pathname} className="rounded-full px-4 py-3 text-xs font-black uppercase tracking-[.12em] text-[#705d52] hover:text-[#d84e27]" activeClassName="bg-[#fff1df] text-[#d84e27]" /></div>
          <div className="flex items-center gap-2"><CurrencySelect currency={currency} setCurrency={setCurrency} /><PhoneLink brand={brand} compact /><Link href="/booking" className="rounded-full bg-[#d84e27] px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-[#a93618]">Reservar</Link></div>
        </div>
      </nav>
    )
  }

  return (
    <nav aria-label="Primary navigation" className="fixed inset-x-0 top-0 z-[100] hidden transition-all duration-500 lg:block bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.06)] py-3.5">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-white"><Car size={20} /></span><span><strong className="block font-display text-[17px] leading-none text-[#0D1B2A]">{brand.name}</strong><small className="block text-[10px] font-black uppercase tracking-[.2em] text-gold">{brand.country}</small></span></Link>
        <HeaderLinks links={links} pathname={pathname} className="rounded-lg px-5 py-2 text-xs font-black uppercase tracking-[.1em] text-[#1B263B] hover:text-gold" activeClassName="text-gold" />
        <div className="flex items-center gap-3"><PhoneLink brand={brand} dark={false} /><CurrencySelect currency={currency} setCurrency={setCurrency} dark={false} /><LanguageBadge dark={false} /><Link href="/booking" className="rounded-xl bg-gold px-6 py-3 text-xs font-black uppercase tracking-widest text-white">Book now</Link></div>
      </div>
    </nav>
  )
}
