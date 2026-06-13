"use client"

import React from 'react'
import { VehicleCategory } from '../../types/fleet.types'

interface CategoryTabsProps {
  activeCategory: VehicleCategory
  onChange: (cat: VehicleCategory) => void
}

const CATEGORIES_ROW_1: VehicleCategory[] = ['All', 'Mini', 'Compact', 'Standard', 'Sedan', 'Mid-SUV']
const CATEGORIES_ROW_2: VehicleCategory[] = ['SUV', 'Pickup (4x4)', '7-seater', 'Premium 7-seater']

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
    <img src={ICONS[type]} alt={type} className="h-5 w-auto object-contain opacity-80" />
  )
}

export default function CategoryTabs({ activeCategory, onChange }: CategoryTabsProps) {
  const renderTab = (cat: VehicleCategory) => {
    const isActive = activeCategory === cat
    return (
      <button
        key={cat}
        onClick={() => onChange(cat)}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 border ${
          isActive 
          ? 'bg-gold/10 border-gold/20 text-gold' 
          : 'bg-white border-transparent text-navy shadow-sm hover:bg-offWhite'
        }`}
      >
        <CarIcon type={cat} />
        {cat}
      </button>
    )
  }

  return (
    <div className="mt-10 mb-12 flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-3">
        {CATEGORIES_ROW_1.map(renderTab)}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {CATEGORIES_ROW_2.map(renderTab)}
      </div>
    </div>
  )
}
