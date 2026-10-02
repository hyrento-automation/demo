"use client"

import React from 'react'
import SearchWidget from './SearchWidget'
import TrustBadges from './TrustBadges'

export default function HeroSection() {
  return (
    <section className="w-full bg-[#E8F8F5] pt-12 pb-14 sm:py-20 px-3.5 sm:px-6">
      <div className="max-w-[1200px] mx-auto pt-6 sm:pt-16">
        <div className="text-center mb-6 sm:mb-8 space-y-1.5">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-[#0D9B84] text-[11px] sm:text-xs font-black tracking-wider uppercase">
            ⚡ Instant Confirmation · 0 Deposit Options
          </span>
          <h1 className="text-[#1A4D5C] text-2xl sm:text-3xl md:text-[36px] font-bold tracking-tight">
            Book online in 60 seconds
          </h1>
        </div>
        
        <SearchWidget />
        <TrustBadges />
      </div>
    </section>
  )
}
