"use client"

import React from 'react'
import { VehicleCategory } from '../../types/fleet.types'

interface CategoryTabsProps {
  activeCategory: VehicleCategory
  onChange: (cat: VehicleCategory) => void
}

const ALL_CATEGORIES: VehicleCategory[] = [
  'All', 'Mini', 'Compact', 'Standard', 'Sedan', 
  'Mid-SUV', 'SUV', 'Pickup (4x4)', '7-seater', 'Premium 7-seater'
]

const ICONS: Record<string, string> = {
  'All': '',
  'Mini': '/assets/imgi_4_vehicle_type_1594813619.png',
  'Compact': '/assets/imgi_5_vehicle_type_1594813683.png',
  'Standard': '/assets/imgi_6_vehicle_type_1594813705.png',
  'Sedan': '/assets/imgi_7_vehicle_type_1594813673.png',
  'Mid-SUV': '/assets/imgi_8_vehicle_type_1665130402.png',
  'SUV': '/assets/imgi_9_vehicle_type_1594813641.png',
  'Pickup (4x4)': '/assets/imgi_10_vehicle_type_1594813606.png',
  '7-seater': '/assets/imgi_11_vehicle_type_1594813657.png',
  'Premium 7-seater': '/assets/imgi_12_vehicle_type_1775742570.png',
}

const CarIcon = ({ type }: { type: VehicleCategory }) => {
  if (type === 'All' || !ICONS[type]) return null
  return (
    <img src={ICONS[type]} alt={type} className="h-4 sm:h-5 w-auto object-contain opacity-80 flex-shrink-0" />
  )
}

export default function CategoryTabs({ activeCategory, onChange }: CategoryTabsProps) {
  const renderTab = (cat: VehicleCategory) => {
    const isActive = activeCategory === cat
    return (
      <button
        key={cat}
        onClick={() => onChange(cat)}
        className={`flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 border whitespace-nowrap shadow-sm ${
          isActive 
          ? 'bg-gold/10 border-gold/30 text-gold shadow-gold/10' 
          : 'bg-white border-gray-100 text-navy hover:bg-offWhite hover:border-gray-200'
        }`}
      >
        <CarIcon type={cat} />
        {cat}
      </button>
    )
  }

  return (
    <div className="mt-8 mb-10 w-full max-w-5xl mx-auto px-2 sm:px-4">
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
        {ALL_CATEGORIES.map(renderTab)}
      </div>
    </div>
  )
}
