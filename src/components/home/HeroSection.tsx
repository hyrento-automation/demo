"use client"

import React from 'react'
import SearchWidget from './SearchWidget'
import TrustBadges from './TrustBadges'

export default function HeroSection() {
  return (
    <section className="w-full bg-[#E8F8F5] py-20 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto pt-16">
        <h2 className="text-center text-[#1A4D5C] text-3xl md:text-[36px] font-medium tracking-tight mb-8">
          Book online in 60 seconds <span className="mx-2">·</span> Instant Confirmation
        </h2>
        
        <SearchWidget />
        <TrustBadges />
      </div>
    </section>
  )
}
