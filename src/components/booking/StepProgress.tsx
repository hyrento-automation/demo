"use client"

import React from 'react'
import { useBookingStore } from '@/src/store/bookingStore'

const STEPS = [
  { num: 1, label: 'Vehicle List' },
  { num: 2, label: 'Add Options' },
  { num: 3, label: 'Driver Details' },
  { num: 4, label: 'Booking Confirmation' },
]

export default function StepProgress() {
  const { currentStep } = useBookingStore()

  return (
    <div className="w-full">
      <div className="flex w-full">
        {STEPS.map((step, idx) => {
          const isActive = step.num === currentStep
          const isCompleted = step.num < currentStep
          const isLast = idx === STEPS.length - 1

          return (
            <div
              key={step.num}
              className="flex-1 relative"
            >
              <div
                className={`
                  relative h-12 flex items-center justify-center text-sm font-semibold transition-all
                  ${isActive ? 'bg-[#0D9B84] text-white' : isCompleted ? 'bg-[#0D9B84]/10 text-[#0D9B84]' : 'bg-gray-100 text-gray-500'}
                `}
                style={{
                  clipPath: isLast
                    ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 3% 50%)'
                    : idx === 0
                    ? 'polygon(0 0, 97% 0, 100% 50%, 97% 100%, 0 100%)'
                    : 'polygon(0 0, 97% 0, 100% 50%, 97% 100%, 0 100%, 3% 50%)',
                }}
              >
                <span className="relative z-10 text-xs sm:text-sm">
                  {step.num}. {step.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
