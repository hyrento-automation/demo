"use client"

import React, { useState, useEffect } from 'react'
import CategoryTabs from './CategoryTabs'
import VehicleGrid from './VehicleGrid'
import { VehicleCategory } from '../../types/fleet.types'

export default function FleetSection() {
  const [activeCategory, setActiveCategory] = useState<VehicleCategory>('All')
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false)
      setError(true)
    }, 8000)

    fetch('/api/cars')
      .then(res => res.json())
      .then(data => {
        clearTimeout(timeout)
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
        setLoading(false)
      })
      .catch(err => {
        clearTimeout(timeout)
        console.error('Error fetching cars:', err)
        setLoading(false)
        setError(true)
      })

    return () => clearTimeout(timeout)
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

  const displayedVehicles = filteredVehicles.slice(0, 12)

  if (loading) return <div className="py-24 text-center text-navy font-bold animate-pulse">Synchronizing Fleet...</div>

  if (error || vehicles.length === 0) return (
    <section className="py-24 px-4">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto">
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gold">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-2xl font-display font-bold text-navy">We&apos;re having trouble loading our fleet</h3>
        <p className="text-mid-gray leading-relaxed">
          Our vehicles are available — please contact us directly to check availability and make a booking.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:+2302110000" className="h-14 px-8 rounded-2xl bg-navy text-white font-black uppercase tracking-widest text-[13px] flex items-center justify-center gap-3 hover:bg-gold transition-all duration-300">
            📞 Call +230 211 0000
          </a>
          <a href="https://wa.me/2302110000" target="_blank" rel="noopener noreferrer" className="h-14 px-8 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest text-[13px] flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all duration-300">
            💬 WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  )

  return (
    <section className="bg-offWhite py-24 px-4 border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto">
        {/* Heading */}
        <div className="text-center space-y-4 mb-12">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gold">Premium Selection</p>
          <h2 className="text-5xl md:text-6xl font-display text-navy">
            Explore Our <span className="italic text-gold">Short-Term Rentals</span>
          </h2>
          <p className="text-mid-gray font-body max-w-xl mx-auto leading-relaxed">
            Discover our wide range of vehicles available for short-term rental. Perfect for your travel needs.
          </p>
        </div>

        {/* Tabs */}
        <CategoryTabs 
          activeCategory={activeCategory} 
          onChange={setActiveCategory} 
        />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-mid-gray font-bold">
            Showing <span className="text-navy">{displayedVehicles.length}</span> vehicles
          </p>
        </div>

        {/* Grid */}
        <VehicleGrid vehicles={displayedVehicles} />
      </div>
    </section>
  )
}
