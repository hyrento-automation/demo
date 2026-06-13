"use client"

import React from 'react'
import StepProgress from '@/src/components/booking/StepProgress'
import PriceSidebar from '@/src/components/booking/PriceSidebar'
import { useBookingStore } from '@/src/store/bookingStore'

interface BookingLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
}

export default function BookingLayout({ children, showSidebar = true }: BookingLayoutProps) {
  const { currentStep } = useBookingStore()

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-20">
      {/* Step Progress */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <StepProgress />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className={`flex gap-6 ${showSidebar ? '' : 'justify-center'}`}>
          {/* Main Content Area */}
          <div className={showSidebar ? 'flex-1 min-w-0' : 'w-full max-w-4xl'}>
            {children}
          </div>

          {/* Right Sidebar */}
          {showSidebar && currentStep >= 2 && (
            <div className="hidden lg:block w-[320px] flex-shrink-0">
              <PriceSidebar />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
