"use client"

import React from 'react'
import { useBookingStore } from '@/src/store/bookingStore'
import { Check } from 'lucide-react'

const STEPS = [
  { num: 1, label: 'Vehicle List' },
  { num: 2, label: 'Add Options' },
  { num: 3, label: 'Driver Details' },
  { num: 4, label: 'Confirmation' },
]

export default function StepProgress() {
  const { currentStep } = useBookingStore()
  const activeStep = STEPS.find(s => s.num === currentStep) || STEPS[0]

  return (
    <div className="w-full">
      {/* Mobile Step Header (clean app-like progress bar, no cramped wrapping) */}
      <div className="md:hidden bg-white rounded-2xl p-3.5 shadow-sm border border-gray-200/80 mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0D9B84] text-[10px] font-black text-white">
              {currentStep}
            </span>
            <span className="text-xs font-bold text-gray-900">
              {activeStep.label}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-gray-500">
            Step {currentStep} of {STEPS.length}
          </span>
        </div>
        {/* Progress segment bars */}
        <div className="grid grid-cols-4 gap-1.5">
          {STEPS.map((step) => {
            const isCompleted = step.num < currentStep
            const isActive = step.num === currentStep
            return (
              <div
                key={step.num}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-[#0D9B84]'
                    : isCompleted
                    ? 'bg-[#0D9B84]/50'
                    : 'bg-gray-200'
                }`}
              />
            )
          })}
        </div>
      </div>

      {/* Desktop Step Ribbon */}
      <div className="hidden md:flex w-full">
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
                  relative h-12 flex items-center justify-center text-sm font-semibold transition-all px-2
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
                <span className="relative z-10 flex items-center gap-1.5 text-xs lg:text-sm font-bold">
                  {isCompleted ? (
                    <Check size={14} className="stroke-[3]" />
                  ) : (
                    <span>{step.num}.</span>
                  )}
                  {step.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
