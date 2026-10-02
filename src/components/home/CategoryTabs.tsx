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
        className={`flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 border whitespace-nowrap shadow-sm active:scale-95 flex-shrink-0 ${
          isActive 
          ? 'bg-navy text-white border-navy shadow-md shadow-navy/20' 
          : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <CarIcon type={cat} />
        {cat}
      </button>
    )
  }

  return (
    <div className="mt-6 mb-8 w-full max-w-5xl mx-auto px-1 sm:px-4">
      {/* Sleek native-app horizontal scrolling pills with hidden scrollbar */}
      <div className="flex sm:flex-wrap items-center sm:justify-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none no-scrollbar px-2">
        {ALL_CATEGORIES.map(renderTab)}
      </div>
    </div>
  )
}
