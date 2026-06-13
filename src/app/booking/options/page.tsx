"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBookingStore } from '@/src/store/bookingStore'
import BookingLayout from '@/src/components/booking/BookingLayout'
import { ArrowLeft, ArrowRight, X, Info, Check, ShieldCheck, Baby, Armchair, Smartphone } from 'lucide-react'

const OPTION_ICONS: Record<string, React.ReactNode> = {
  'accident-protection': <ShieldCheck size={48} className="text-red-400" />,
  'baby-seat': <Baby size={48} className="text-pink-400" />,
  'booster-seat': <Armchair size={48} className="text-pink-500" />,
  'child-seat': <Baby size={48} className="text-blue-400" />,
  'sim-card': <Smartphone size={48} className="text-blue-500" />,
}

export default function AddOptionsPage() {
  const router = useRouter()
  const { selectedVehicle, selectedOptions, updateOption, setStep, getRentalDays } = useBookingStore()
  const [showTooltip, setShowTooltip] = useState(true)
  const days = getRentalDays()

  useEffect(() => {
    setStep(2)
  }, [setStep])

  useEffect(() => {
    if (!selectedVehicle) {
      router.push('/booking')
    }
  }, [selectedVehicle, router])

  if (!selectedVehicle) return null

  return (
    <BookingLayout>
      {/* Top Banner */}
      <div className="bg-[#E1F5EE] rounded-xl p-5 mb-6 border-l-4 border-[#0D9B84]">
        <p className="font-bold text-gray-900 text-sm">
          Travel Together, Drive Together – It&apos;s Free!
        </p>
        <p className="text-gray-600 text-xs mt-1">
          Add an extra driver at no cost in the next step.
        </p>
      </div>

      {/* Add Extra Options */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">Add Extra Options (Optional)</h2>
        </div>

        <div className="divide-y divide-gray-100 relative">
          {/* Tooltip for Accident Protection */}
          {showTooltip && (
            <div className="absolute top-2 left-4 right-4 sm:left-1/3 sm:right-auto z-20 bg-[#0D9B84] text-white rounded-lg p-4 shadow-xl sm:max-w-[280px] animate-fade-in">
              <div className="flex items-start justify-between mb-2">
                <p className="font-bold text-sm">Recommended for you!</p>
                <button
                  onClick={() => setShowTooltip(false)}
                  className="hover:bg-white/20 rounded p-0.5 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                Reduce your liability to zero for complete peace of mind. Most of our customers choose
                this option for a worry-free rental.
              </p>
              <div className="absolute -bottom-2 left-8 w-4 h-4 bg-[#0D9B84] rotate-45" />
            </div>
          )}

          {selectedOptions.map((option) => {
            const isAccident = option.id === 'accident-protection'

            return (
              <div
                key={option.id}
                className={`p-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row gap-4 transition-all ${
                  option.quantity > 0 ? 'bg-[#0D9B84]/5 border-l-4 border-[#0D9B84]' : ''
                } ${isAccident && showTooltip ? 'border-2 border-[#0D9B84] border-dashed' : ''}`}
              >
                {/* Description and Icon */}
                <div className="flex justify-between items-start gap-4 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <h3 className="font-bold text-sm text-gray-900">{option.name}</h3>
                      {isAccident && (
                        <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                          Most chosen
                        </span>
                      )}
                      {isAccident && (
                        <Info size={14} className="text-[#0D9B84] cursor-help shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed sm:pr-4">
                      {option.description}
                    </p>
                  </div>

                  <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                    {OPTION_ICONS[option.id] || <ShieldCheck size={48} className="text-gray-300" />}
                  </div>
                </div>

                {/* Price and Counter */}
                <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100">
                  <div className="flex-shrink-0 text-left sm:text-right sm:mr-4">
                    <p className="font-bold text-sm">€ {option.pricePerDay.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-500">
                      {option.priceType === 'per_day' ? 'per day' : 'per unit'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => updateOption(option.id, option.quantity + 1)}
                      className="w-8 h-8 border border-gray-300 rounded text-lg font-medium flex items-center justify-center hover:bg-[#0D9B84] hover:text-white hover:border-[#0D9B84] transition-colors"
                    >
                      +
                    </button>
                    <div className="w-10 h-8 border border-gray-300 rounded flex items-center justify-center text-sm font-medium">
                      {option.quantity}
                    </div>
                    <button
                      onClick={() => updateOption(option.id, option.quantity - 1)}
                      className="w-8 h-8 border border-gray-300 rounded text-lg font-medium flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    {option.quantity > 0 && (
                      <Check size={18} className="text-[#0D9B84] ml-1" />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => {
            setStep(1)
            router.push('/booking')
          }}
          className="flex items-center gap-2 px-8 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          onClick={() => {
            setStep(3)
            router.push('/booking/checkout')
          }}
          className="flex items-center gap-2 px-12 py-3 bg-[#0D9B84] text-white rounded-lg font-medium hover:bg-[#00C4A0] transition-colors shadow-lg shadow-[#0D9B84]/30"
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </BookingLayout>
  )
}
