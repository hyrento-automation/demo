"use client"

import React, { useState, useEffect } from 'react'
import CategoryTabs from './CategoryTabs'
import VehicleGrid from './VehicleGrid'
import type { VehicleCardMarket } from './VehicleCard'
import { VehicleCategory } from '../../types/fleet.types'
import { useBrand } from '@/src/components/providers/BrandProvider'
import { FALLBACK_FLEET } from '@/src/data/fallbackFleet'

interface FleetSectionProps {
  eyebrow?: string
  heading?: string
  highlightedHeading?: string
  description?: string
  className?: string
  dark?: boolean
  cardMarket?: VehicleCardMarket
}

const getInitialFleet = () => {
  return FALLBACK_FLEET.map(v => ({
    ...v,
    priceFrom: v.priceDay,
    imageUrl: v.img,
    bags: v.luggage,
  }))
}

export default function FleetSection({
  eyebrow = 'Premium Selection',
  heading = 'Explore Our',
  highlightedHeading = 'Short-Term Rentals',
  description = 'Discover our wide range of vehicles available for short-term rental. Perfect for your travel needs.',
  className = 'bg-offWhite',
  dark = false,
  cardMarket,
}: FleetSectionProps) {
  const brand = useBrand()
  const [activeCategory, setActiveCategory] = useState<VehicleCategory>('All')
  const [vehicles, setVehicles] = useState<any[]>(() => getInitialFleet())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/cars')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((v: any) => ({
             ...v,
             priceFrom: v.priceDay,
             imageUrl: v.img,
             bags: v.luggage
          }))
          const groupedMap = new Map()
          mapped.forEach((v: any) => {
             const key = `${v.make}-${v.model}`.toLowerCase()
             if (!groupedMap.has(key)) groupedMap.set(key, v)
          })
          setVehicles(Array.from(groupedMap.values()))
        }
      })
      .catch(err => {
        console.warn('Live fleet sync deferred; using standard fleet:', err)
      })
  }, [])

  // Map UI-friendly category names to DB enum values
  const CATEGORY_MAP: Record<string, string[]> = {
    'Mini':              ['MINI'],
    'Compact':           ['COMPACT', 'ECONOMY'],
    'Standard':          ['MIDSIZE'],
    'Sedan':             ['MIDSIZE', 'LUXURY'],
    'Mid-SUV':           ['SUV'],
    'SUV':               ['SUV'],
    'Pickup (4x4)':      ['PICKUP'],
    '7-seater':          ['VAN'],
    'Premium 7-seater':  ['VAN', 'LUXURY'],
  }

  const filteredVehicles = activeCategory === 'All'
    ? vehicles
    : vehicles.filter(v => {
        const dbCategories = CATEGORY_MAP[activeCategory] || []
        return dbCategories.includes(v.category)
      })

  const displayedVehicles = filteredVehicles.length > 0 ? filteredVehicles.slice(0, 12) : getInitialFleet().slice(0, 12)

  return (
    <section className={`${className} py-24 px-4 border-t border-gray-100`}>
      <div className="max-w-[1200px] mx-auto">
        {/* Heading */}
        <div className="text-center space-y-4 mb-12">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
          <h2 className={`text-5xl md:text-6xl font-display ${dark ? 'text-white' : 'text-navy'}`}>
            {heading} <span className="italic text-gold">{highlightedHeading}</span>
          </h2>
          <p className={`${dark ? 'text-white/55' : 'text-mid-gray'} font-body max-w-xl mx-auto leading-relaxed`}>
            {description}
          </p>
        </div>

        {/* Tabs */}
        <CategoryTabs 
          activeCategory={activeCategory} 
          onChange={setActiveCategory} 
        />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className={`text-sm font-bold ${dark ? 'text-white/55' : 'text-mid-gray'}`}>
            Showing <span className={dark ? 'text-white' : 'text-navy'}>{displayedVehicles.length}</span> vehicles
          </p>
        </div>

        {/* Grid */}
        <VehicleGrid vehicles={displayedVehicles} market={cardMarket} />
      </div>
    </section>
  )
}
