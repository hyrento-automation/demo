"use client"

import Link from 'next/link'
import { ArrowRight, Fuel, Gauge, Luggage, Shield, Star, User } from 'lucide-react'
import { Vehicle } from '../../types/fleet.types'
import { cn } from '@/src/lib/utils'

export type VehicleCardMarket = 'spain' | 'europe' | 'usa' | 'uae' | 'south-africa'

interface VehicleCardProps {
  vehicle: Vehicle
  market?: VehicleCardMarket
}

interface CardTheme {
  card: string
  image: string
  overlay: string
  badge: string
  tag: string
  rating: string
  content: string
  make: string
  title: string
  specs: string
  spec: string
  icon: string
  feature: string
  price: string
  priceCaption: string
  priceMode: 'image' | 'content'
  button: string
  buttonLabel: string
}

const CARD_THEMES: Record<'default' | VehicleCardMarket, CardTheme> = {
  default: {
    card: 'rounded-[2rem] border border-gray-100/80 bg-white text-navy shadow-card hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(27,45,79,0.15)]',
    image: 'aspect-[16/10]',
    overlay: 'bg-gradient-to-t from-navy-dark/90 via-navy/40 to-transparent',
    badge: 'rounded-full bg-navy/80 text-white backdrop-blur-md',
    tag: 'rounded-full bg-gold text-white',
    rating: 'rounded-full bg-white/90 text-navy backdrop-blur-md',
    content: 'p-6',
    make: 'text-gold',
    title: 'text-navy',
    specs: 'flex flex-wrap items-center gap-4 border-b border-gray-50 pb-4',
    spec: 'flex items-center gap-1.5 text-navy/50',
    icon: 'text-gold',
    feature: 'rounded-full bg-emerald-50 text-emerald-600',
    price: 'text-white drop-shadow',
    priceCaption: 'text-white/70',
    priceMode: 'image',
    button: 'rounded-xl bg-navy text-white hover:bg-gold hover:shadow-[0_8px_24px_rgba(201,168,76,0.35)]',
    buttonLabel: 'Reserve now',
  },
  spain: {
    card: 'rounded-[2.5rem] border border-[#d84e27]/15 bg-[#fffdf8] text-[#2f211b] shadow-[0_18px_55px_rgba(216,78,39,.12)] hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(216,78,39,.2)]',
    image: 'aspect-[4/3]',
    overlay: 'bg-gradient-to-t from-[#2f211b]/85 via-[#2f211b]/15 to-transparent',
    badge: 'rounded-full bg-[#d84e27] text-white shadow-lg',
    tag: 'rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md',
    rating: 'rounded-full bg-[#fff8ed]/95 text-[#2f211b] shadow-lg',
    content: 'p-7',
    make: 'text-[#d84e27]',
    title: 'font-display text-[#2f211b]',
    specs: 'grid grid-cols-2 gap-2 border-y border-[#d84e27]/10 py-4',
    spec: 'flex items-center gap-2 rounded-xl bg-[#fff1df] px-3 py-2 text-[#705d52]',
    icon: 'text-[#d84e27]',
    feature: 'rounded-full bg-[#d84e27]/10 text-[#b53b1d]',
    price: 'text-white drop-shadow',
    priceCaption: 'text-white/70',
    priceMode: 'image',
    button: 'rounded-full bg-[#d84e27] text-white hover:bg-[#a93618] hover:shadow-[0_10px_28px_rgba(216,78,39,.32)]',
    buttonLabel: 'Reservar coche',
  },
  europe: {
    card: 'rounded-sm border border-[#c9ff74]/25 bg-[#18211d] text-white shadow-[0_22px_60px_rgba(14,21,17,.24)] hover:-translate-y-1 hover:border-[#c9ff74]/60',
    image: 'aspect-[16/11]',
    overlay: 'bg-gradient-to-t from-[#0e1511]/60 via-transparent to-[#0e1511]/20',
    badge: 'rounded-none border border-[#c9ff74]/50 bg-[#0e1511]/90 text-[#c9ff74]',
    tag: 'rounded-none bg-[#c9ff74] text-[#18211d]',
    rating: 'rounded-none border border-white/15 bg-[#0e1511]/85 text-white backdrop-blur-md',
    content: 'p-6',
    make: 'text-[#c9ff74]',
    title: 'text-white',
    specs: 'grid grid-cols-2 gap-px bg-white/10',
    spec: 'flex items-center gap-2 bg-[#18211d] px-3 py-3 text-white/55',
    icon: 'text-[#c9ff74]',
    feature: 'rounded-none border border-[#c9ff74]/25 bg-[#c9ff74]/5 text-[#c9ff74]',
    price: 'text-[#c9ff74]',
    priceCaption: 'text-white/40',
    priceMode: 'content',
    button: 'rounded-none border border-[#c9ff74] bg-[#c9ff74] text-[#18211d] hover:bg-transparent hover:text-[#c9ff74]',
    buttonLabel: 'Plan this drive',
  },
  usa: {
    card: 'rounded-none border-2 border-[#132d4f] bg-white text-[#132d4f] shadow-[9px_9px_0_#d7392f] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[13px_13px_0_#d7392f]',
    image: 'aspect-[16/9]',
    overlay: 'bg-gradient-to-t from-[#132d4f]/75 via-transparent to-transparent',
    badge: 'rounded-none bg-[#154b8b] text-white',
    tag: 'rounded-none bg-[#d7392f] text-white',
    rating: 'rounded-none border-2 border-[#132d4f] bg-white text-[#132d4f]',
    content: 'p-6',
    make: 'text-[#d7392f]',
    title: 'uppercase text-[#132d4f]',
    specs: 'grid grid-cols-2 gap-0 border-2 border-[#132d4f]',
    spec: 'flex items-center gap-2 border-b border-r border-[#132d4f]/20 px-3 py-3 text-[#132d4f]/65',
    icon: 'text-[#d7392f]',
    feature: 'rounded-none border border-[#154b8b]/20 bg-[#eef4fa] text-[#154b8b]',
    price: 'bg-[#d7392f] px-3 py-2 text-white shadow-[4px_4px_0_#132d4f]',
    priceCaption: 'text-white/75',
    priceMode: 'image',
    button: 'rounded-none bg-[#154b8b] text-white hover:bg-[#d7392f]',
    buttonLabel: 'Book this ride',
  },
  uae: {
    card: 'rounded-none border border-[#d7b568]/30 bg-[#101216] text-white shadow-[0_25px_75px_rgba(0,0,0,.42)] hover:-translate-y-1 hover:border-[#d7b568]/70',
    image: 'aspect-[16/12]',
    overlay: 'bg-gradient-to-t from-black/80 via-transparent to-black/25',
    badge: 'rounded-none border border-[#d7b568]/60 bg-black/65 text-[#e8ca83] backdrop-blur-md',
    tag: 'rounded-none bg-[#d7b568] text-black',
    rating: 'rounded-none border border-[#d7b568]/40 bg-black/70 text-[#e8ca83] backdrop-blur-md',
    content: 'p-7',
    make: 'text-[#d7b568]',
    title: 'font-display text-white',
    specs: 'grid grid-cols-4 border-y border-[#d7b568]/15 py-4',
    spec: 'flex flex-col items-center gap-2 text-center text-white/45',
    icon: 'text-[#d7b568]',
    feature: 'rounded-none border-b border-[#d7b568]/35 bg-transparent text-[#d7b568]',
    price: 'text-[#e8ca83]',
    priceCaption: 'text-white/35',
    priceMode: 'content',
    button: 'rounded-none border border-[#d7b568] bg-[#d7b568] text-black hover:bg-transparent hover:text-[#e8ca83]',
    buttonLabel: 'Reserve selection',
  },
  'south-africa': {
    card: 'rounded-[2rem_2rem_.75rem_.75rem] border border-[#173d32]/10 bg-[#fffaf0] text-[#173d32] shadow-[0_18px_55px_rgba(23,61,50,.14)] hover:-translate-y-2 hover:rotate-[.3deg]',
    image: 'aspect-[4/3]',
    overlay: 'bg-gradient-to-t from-[#173d32]/85 via-transparent to-transparent',
    badge: 'rounded-xl bg-[#173d32] text-[#f2b85b]',
    tag: 'rounded-xl bg-[#f2b85b] text-[#173d32]',
    rating: 'rounded-xl bg-[#fffaf0]/95 text-[#173d32] shadow-lg',
    content: 'p-6',
    make: 'text-[#9f5f2d]',
    title: 'text-[#173d32]',
    specs: 'grid grid-cols-2 gap-2',
    spec: 'flex items-center gap-2 rounded-xl bg-[#f4ead8] px-3 py-2 text-[#173d32]/65',
    icon: 'text-[#d99036]',
    feature: 'rounded-lg bg-[#173d32]/10 text-[#173d32]',
    price: 'text-white drop-shadow',
    priceCaption: 'text-white/70',
    priceMode: 'image',
    button: 'rounded-xl bg-[#173d32] text-white hover:bg-[#d99036] hover:text-[#173d32]',
    buttonLabel: 'Choose this ride',
  },
}

export default function VehicleCard({ vehicle, market }: VehicleCardProps) {
  const parts = vehicle.name ? vehicle.name.split(' ') : ['Make', 'Model']
  const make = vehicle.make || parts[0]
  const model = vehicle.model || parts.slice(1).join(' ')
  const year = vehicle.year || new Date().getFullYear()
  const fuel = vehicle.fuel || 'Petrol'
  const rating = vehicle.rating || 4.8
  const tag = vehicle.tag || ''
  const theme = CARD_THEMES[market || 'default']

  const price = (
    <div className={cn(theme.price, theme.priceMode === 'content' && 'text-right')}>
      <p className="text-2xl font-display font-black leading-none">MUR {vehicle.priceFrom.toLocaleString()}</p>
      <p className={cn('mt-1 text-[9px] font-black uppercase tracking-[.18em]', theme.priceCaption)}>per day</p>
    </div>
  )

  return (
    <article className={cn('group flex h-full flex-col overflow-hidden text-left transition-all duration-500', theme.card)}>
      <div className={cn('relative overflow-hidden', theme.image)}>
        <img
          src={vehicle.imageUrl}
          alt={`${make} ${model}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className={cn('absolute inset-0', theme.overlay)} />

        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className={cn('px-3 py-1.5 text-[9px] font-black uppercase tracking-[.2em]', theme.badge)}>{vehicle.category}</span>
          {tag && <span className={cn('px-3 py-1.5 text-[9px] font-black uppercase tracking-[.15em]', theme.tag)}>{tag}</span>}
        </div>

        <div className={cn('absolute right-4 top-4 flex items-center gap-1.5 px-3 py-1.5', theme.rating)}>
          <Star size={11} className="text-gold" fill="currentColor" />
          <span className="text-[11px] font-black">{rating}</span>
        </div>

        {theme.priceMode === 'image' && <div className="absolute bottom-4 left-4">{price}</div>}
      </div>

      <div className={cn('flex flex-1 flex-col', theme.content)}>
        <div className={cn('mb-5', theme.priceMode === 'content' && 'flex items-start justify-between gap-4')}>
          <div>
            <p className={cn('mb-1 text-[10px] font-black uppercase tracking-[.22em]', theme.make)}>{make} · {year}</p>
            <h3 className={cn('text-xl font-black leading-tight', theme.title)}>{model}</h3>
          </div>
          {theme.priceMode === 'content' && price}
        </div>

        <div className={cn('mb-5', theme.specs)}>
          {[
            { icon: User, label: `${vehicle.seats} Seats` },
            { icon: Luggage, label: `${vehicle.bags} Bags` },
            { icon: Gauge, label: vehicle.transmission },
            { icon: Fuel, label: fuel },
          ].map((spec) => (
            <div key={spec.label} className={cn('text-[9px] font-bold uppercase tracking-wide', theme.spec)}>
              <spec.icon size={14} className={theme.icon} />
              <span>{spec.label}</span>
            </div>
          ))}
        </div>

        <div className="mb-5 mt-auto flex flex-wrap gap-1.5">
          {['Free cancel', 'Full insurance', 'GPS'].map((feature) => (
            <span key={feature} className={cn('flex items-center gap-1 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider', theme.feature)}>
              <Shield size={8} />{feature}
            </span>
          ))}
        </div>

        <Link
          href="/booking"
          className={cn('group/btn mt-3 flex h-12 w-full items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[.16em] transition-all duration-300', theme.button)}
        >
          {theme.buttonLabel}
          <ArrowRight size={15} className="transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}
