"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { BrandConfig, getBrandConfig } from '@/src/lib/brand'

const BrandContext = createContext<BrandConfig | null>(null)

export function BrandProvider({
  children,
  initialBrand
}: {
  children: React.ReactNode
  initialBrand: BrandConfig
}) {
  const [brand, setBrand] = useState<BrandConfig>(initialBrand)

  useEffect(() => {
    // Re-resolve client-side to ensure hostname detection matches the current window
    const resolved = getBrandConfig(window.location.hostname)
    setBrand(resolved)
  }, [])

  return (
    <BrandContext.Provider value={brand}>
      {children}
    </BrandContext.Provider>
  )
}

export function useBrand() {
  const context = useContext(BrandContext)
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider')
  }
  return context
}
