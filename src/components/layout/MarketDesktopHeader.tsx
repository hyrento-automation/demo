"use client"

import Link from 'next/link'
import { Car, Compass, Crown, DollarSign, Flag, Globe, Mountain, Phone, Sun } from 'lucide-react'
import type { BrandConfig } from '@/src/lib/brand'
import { cn } from '@/src/lib/utils'

export interface HeaderLink {
  name: string
  href: string
}

type Currency = 'MUR' | 'USD' | 'EUR' | 'GBP'

interface MarketDesktopHeaderProps {
  brand: BrandConfig
  pathname: string
  links: HeaderLink[]
  currency: Currency
  setCurrency: (currency: Currency) => void
  isScrolled: boolean
}

function CurrencySelect({ currency, setCurrency, dark = false, squared = false }: { currency: Currency; setCurrency: (currency: Currency) => void; dark?: boolean; squared?: boolean }) {
  return (
    <label className={cn('hidden items-center gap-1 px-3 py-2 md:flex', squared ? 'rounded-none border' : 'rounded-full', dark ? 'border-white/15 bg-white/5 text-white' : 'border-navy/10 bg-navy/5 text-navy')}>
      <DollarSign size={13} />
      <span className="sr-only">Currency</span>
      <select value={currency} onChange={(event) => setCurrency(event.target.value as Currency)} className="cursor-pointer appearance-none bg-transparent text-[10px] font-black outline-none">
        <option value="MUR" className="text-navy">MUR</option>
        <option value="USD" className="text-navy">USD</option>
        <option value="EUR" className="text-navy">EUR</option>
        <option value="GBP" className="text-navy">GBP</option>
      </select>
    </label>
  )
}

function LanguageBadge({ dark = false, squared = false }: { dark?: boolean; squared?: boolean }) {
  return <span className={cn('hidden items-center gap-1 px-3 py-2 text-[10px] font-black md:flex', squared ? 'rounded-none border' : 'rounded-full', dark ? 'border-white/15 bg-white/5 text-white' : 'border-navy/10 bg-navy/5 text-navy')}><Globe size={13} /> EN</span>
}

function HeaderLinks({ links, pathname, className, activeClassName, divider = false }: { links: HeaderLink[]; pathname: string; className: string; activeClassName: string; divider?: boolean }) {
  return (
    <div className="flex items-center">
      {links.map((link, index) => (
        <div key={link.href} className="flex items-center">
          {divider && index > 0 && <span className="text-gold/50">/</span>}
          <Link href={link.href} className={cn(className, pathname === link.href && activeClassName)}>{link.name}</Link>
        </div>
      ))}
    </div>
  )
}

function PhoneLink({ brand, dark = false, compact = false }: { brand: BrandConfig; dark?: boolean; compact?: boolean }) {
  return (
    <a href={`tel:${brand.phone.replace(/[^0-9+]/g, '')}`} className={cn('hidden items-center gap-2 font-bold xl:flex', compact ? 'text-[11px]' : 'text-[13px]', dark ? 'text-white/70 hover:text-white' : 'text-navy/70 hover:text-gold')}>
      <Phone size={14} className="text-gold" /> {brand.phone}
    </a>
  )
}

export function MarketDesktopHeader({ brand, pathname, links, currency, setCurrency, isScrolled }: MarketDesktopHeaderProps) {
  if (brand.country === 'Spain') {
    return (
      <nav aria-label="Primary navigation" className={cn('fixed inset-x-0 z-[100] hidden px-5 transition-all duration-500 lg:block', isScrolled ? 'top-2' : 'top-5')}>
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between rounded-full border border-[#d84e27]/15 bg-[#fff8ed]/95 px-5 shadow-[0_14px_40px_rgba(47,33,27,.12)] backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3 text-[#2f211b]"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d84e27] text-white"><Sun size={21} /></span><span><strong className="block font-display text-lg leading-none">Car Hire</strong><small className="mt-1 block text-[10px] font-black uppercase tracking-[.24em] text-[#d84e27]">España</small></span></Link>
          <div className="rounded-full bg-white px-2 shadow-sm"><HeaderLinks links={links} pathname={pathname} className="rounded-full px-4 py-3 text-xs font-black uppercase tracking-[.12em] text-[#705d52] hover:text-[#d84e27]" activeClassName="bg-[#fff1df] text-[#d84e27]" /></div>
          <div className="flex items-center gap-2"><CurrencySelect currency={currency} setCurrency={setCurrency} /><PhoneLink brand={brand} compact /><Link href="/booking" className="rounded-full bg-[#d84e27] px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-[#a93618]">Reservar</Link></div>
        </div>
      </nav>
    )
  }

  if (brand.country === 'Europe') {
    return (
      <nav aria-label="Primary navigation" className="fixed inset-x-0 top-0 z-[100] hidden bg-[#18211d] text-white shadow-xl lg:block">
        <div className="border-b border-white/10 bg-[#0e1511]">
          <div className="mx-auto flex h-7 max-w-7xl items-center justify-between px-6 text-[9px] font-black uppercase tracking-[.25em] text-white/45"><span className="flex items-center gap-2 text-[#c9ff74]"><Mountain size={12} /> Grand Tour Europe</span><span>One booking · endless borders</span></div>
        </div>
        <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center border border-[#c9ff74]/40 text-[#c9ff74]"><Car size={20} /></span><span><strong className="block text-base uppercase tracking-[.16em]">Car Hire</strong><small className="block text-[9px] font-bold uppercase tracking-[.28em] text-white/45">Europe</small></span></Link>
          <HeaderLinks links={links} pathname={pathname} className="border-b border-transparent px-5 py-2 text-[11px] font-black uppercase tracking-[.18em] text-white/60 hover:text-white" activeClassName="border-[#c9ff74] text-[#c9ff74]" />
          <div className="flex items-center gap-3"><PhoneLink brand={brand} dark compact /><CurrencySelect currency={currency} setCurrency={setCurrency} dark squared /><Link href="/booking" className="border border-[#c9ff74] px-5 py-3 text-[10px] font-black uppercase tracking-[.18em] text-[#c9ff74] hover:bg-[#c9ff74] hover:text-[#18211d]">Plan the drive</Link></div>
        </div>
      </nav>
    )
  }

  if (brand.country === 'USA') {
    return (
      <nav aria-label="Primary navigation" className="fixed inset-x-0 top-0 z-[100] hidden border-t-[6px] border-[#d7392f] bg-white shadow-[0_8px_30px_rgba(19,45,79,.12)] lg:block">
        <div className="mx-auto flex h-[78px] max-w-[1500px] items-center px-7">
          <Link href="/" className="flex min-w-[245px] items-center gap-3 text-[#132d4f]"><span className="flex h-11 w-11 items-center justify-center bg-[#154b8b] text-white"><Flag size={21} /></span><span><strong className="block text-lg font-black uppercase leading-none">Car Hire</strong><small className="mt-1 block text-[10px] font-black uppercase tracking-[.25em] text-[#d7392f]">United States</small></span></Link>
          <div className="flex flex-1 justify-center"><HeaderLinks divider links={links} pathname={pathname} className="px-5 py-2 text-xs font-black uppercase tracking-[.14em] text-[#526174] hover:text-[#154b8b]" activeClassName="text-[#d7392f]" /></div>
          <div className="flex min-w-[370px] items-center justify-end gap-3"><PhoneLink brand={brand} compact /><CurrencySelect currency={currency} setCurrency={setCurrency} squared /><LanguageBadge squared /><Link href="/booking" className="bg-[#154b8b] px-6 py-3 text-xs font-black uppercase tracking-[.14em] text-white shadow-[5px_5px_0_#d7392f] hover:-translate-y-0.5">Book &amp; go</Link></div>
        </div>
      </nav>
    )
  }

  if (brand.country === 'UAE') {
    return (
      <nav aria-label="Primary navigation" className={cn('fixed inset-x-0 top-0 z-[100] hidden border-b border-[#d7b568]/25 bg-[#080a0d]/95 text-white backdrop-blur-xl transition-all lg:block', isScrolled ? 'shadow-[0_12px_40px_rgba(0,0,0,.5)]' : '')}>
        <div className="mx-auto grid h-[88px] max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center px-8">
          <HeaderLinks links={links} pathname={pathname} className="px-4 py-3 text-[10px] font-black uppercase tracking-[.22em] text-white/50 hover:text-[#e8ca83]" activeClassName="text-[#e8ca83]" />
          <Link href="/" className="flex flex-col items-center px-10 text-center"><Crown size={20} className="mb-1 text-[#d7b568]" /><strong className="font-display text-lg uppercase tracking-[.18em]">Car Hire</strong><small className="text-[9px] font-black uppercase tracking-[.42em] text-[#d7b568]">UAE</small></Link>
          <div className="flex items-center justify-end gap-3"><PhoneLink brand={brand} dark compact /><CurrencySelect currency={currency} setCurrency={setCurrency} dark squared /><LanguageBadge dark squared /><Link href="/booking" className="border border-[#d7b568] bg-[#d7b568] px-6 py-3 text-[10px] font-black uppercase tracking-[.2em] text-black hover:bg-transparent hover:text-[#e8ca83]">Reserve</Link></div>
        </div>
      </nav>
    )
  }

  if (brand.country === 'South Africa') {
    return (
      <nav aria-label="Primary navigation" className={cn('fixed inset-x-0 z-[100] hidden px-6 transition-all duration-500 lg:block', isScrolled ? 'top-2' : 'top-5')}>
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between rounded-[1.4rem] border border-white/10 bg-[#173d32]/96 px-5 text-white shadow-[0_16px_45px_rgba(12,39,31,.28)] backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f2b85b] text-[#173d32]"><Compass size={22} /></span><span><strong className="block text-lg font-black uppercase leading-none">Car Hire</strong><small className="mt-1 block text-[9px] font-black uppercase tracking-[.25em] text-[#f2b85b]">South Africa</small></span></Link>
          <HeaderLinks links={links} pathname={pathname} className="rounded-lg px-5 py-3 text-[11px] font-black uppercase tracking-[.15em] text-white/60 hover:bg-white/5 hover:text-white" activeClassName="bg-white/10 text-[#f2b85b]" />
          <div className="flex items-center gap-3"><PhoneLink brand={brand} dark compact /><CurrencySelect currency={currency} setCurrency={setCurrency} dark /><Link href="/booking" className="rounded-xl bg-[#f2b85b] px-6 py-3 text-[10px] font-black uppercase tracking-[.18em] text-[#173d32] hover:bg-white">Choose a ride</Link></div>
        </div>
      </nav>
    )
  }

  return (
    <nav aria-label="Primary navigation" className={cn('fixed inset-x-0 top-0 z-[100] hidden transition-all duration-500 lg:block', isScrolled ? 'bg-white/95 py-3 shadow-lg backdrop-blur-xl' : 'bg-transparent py-5')}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-white"><Car size={20} /></span><span><strong className={cn('block font-display text-[17px] leading-none', isScrolled ? 'text-navy' : 'text-white')}>Car Hire</strong><small className="block text-[10px] font-black uppercase tracking-[.2em] text-gold">Mauritius</small></span></Link>
        <HeaderLinks links={links} pathname={pathname} className={cn('rounded-lg px-5 py-2 text-xs font-black uppercase tracking-[.1em]', isScrolled ? 'text-navy hover:text-gold' : 'text-white/80 hover:text-white')} activeClassName="text-gold" />
        <div className="flex items-center gap-3"><PhoneLink brand={brand} dark={!isScrolled} /><CurrencySelect currency={currency} setCurrency={setCurrency} dark={!isScrolled} /><LanguageBadge dark={!isScrolled} /><Link href="/booking" className="rounded-xl bg-gold px-6 py-3 text-xs font-black uppercase tracking-widest text-white">Book now</Link></div>
      </div>
    </nav>
  )
}
