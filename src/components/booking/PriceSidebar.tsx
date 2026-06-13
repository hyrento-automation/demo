"use client"

import React from 'react'
import { useBookingStore } from '@/src/store/bookingStore'
import { MapPin, Check, Truck, Navigation } from 'lucide-react'

export default function PriceSidebar() {
  const {
    selectedVehicle,
    selectedOptions,
    searchParams,
    getRentalDays,
    getRentalFee,
    getTotal,
    paymentMode,
    pickupCharge,
    deliveryCharge,
  } = useBookingStore()

  const days = getRentalDays()
  const rentalFee = getRentalFee()
  const total = getTotal()
  const activeOptions = selectedOptions.filter(opt => opt.quantity > 0)
  const hasAccidentProtection = selectedOptions.find(
    opt => opt.id === 'accident-protection' && opt.quantity > 0
  )

  const formatDate = (date: string, time: string) => {
    const d = new Date(date)
    return `${d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} - ${time}`
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
      <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
        Booking Summary
      </h3>

      {/* Vehicle */}
      {selectedVehicle && (
        <div className="text-center mb-5">
          <img
            src={selectedVehicle.image}
            alt={selectedVehicle.name}
            className="w-40 h-24 object-contain mx-auto mb-2"
          />
          <p className="font-bold text-gray-900">{selectedVehicle.name}</p>
        </div>
      )}

      {/* Pickup */}
      <div className="mb-4">
        <div className="flex items-start gap-2 mb-1">
          <MapPin size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm text-gray-900">Pickup</p>
            <p className="text-xs text-gray-600 leading-relaxed">{searchParams.pickupLocation}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {formatDate(searchParams.pickupDate, searchParams.pickupTime)}
            </p>
          </div>
        </div>
      </div>

      {/* Drop-off */}
      <div className="mb-5 pb-4 border-b border-gray-200">
        <div className="flex items-start gap-2 mb-1">
          <MapPin size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm text-gray-900">Drop-off</p>
            <p className="text-xs text-gray-600 leading-relaxed">{searchParams.dropoffLocation}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {formatDate(searchParams.dropoffDate, searchParams.dropoffTime)}
            </p>
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <h4 className="font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">Price Summary</h4>
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Rental Days</span>
          <span className="font-medium">{days}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Rental Fee</span>
          <span className="font-medium">€ {rentalFee.toFixed(2)}</span>
        </div>

        {/* Pickup Charge */}
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1 text-gray-600">
            <Navigation size={12} className="text-[#0D9B84]" />
            Pickup Fee
          </span>
          {pickupCharge > 0 ? (
            <span className="font-medium text-[#0D9B84]">€ {pickupCharge.toFixed(2)}</span>
          ) : (
            <span className="font-medium text-emerald-600 text-xs font-semibold">Free</span>
          )}
        </div>

        {/* Delivery Charge */}
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1 text-gray-600">
            <Truck size={12} className="text-[#0D9B84]" />
            Delivery Fee
          </span>
          {deliveryCharge > 0 ? (
            <span className="font-medium text-[#0D9B84]">€ {deliveryCharge.toFixed(2)}</span>
          ) : (
            <span className="font-medium text-emerald-600 text-xs font-semibold">Free</span>
          )}
        </div>

        {activeOptions.map(opt => (
          <div key={opt.id} className="flex justify-between">
            <span className="text-gray-600">{opt.name.split('–')[0].trim()} X {opt.quantity}</span>
            <span className="font-medium">
              € {(opt.priceType === 'per_unit'
                ? opt.pricePerDay * opt.quantity
                : Math.min(opt.pricePerDay * days * opt.quantity, (opt.maxCharge || Infinity) * opt.quantity)
              ).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center py-3 border-t-2 border-gray-900 mb-4">
        <span className="font-bold text-gray-900">Total amount</span>
        <span className="font-bold text-lg">€ {total.toFixed(2)}</span>
      </div>

      {/* Payment breakdown */}
      {paymentMode === '25%' && (
        <div className="text-xs text-gray-500 mb-4 space-y-1">
          <p>You will pay 25 % online and the remaining amount on delivery.</p>
          <div className="flex justify-between mt-2">
            <span>To pay online (25 %)</span>
            <span className="font-medium text-gray-700">€ {(total * 0.25).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Balance (75 %)</span>
            <span className="font-medium text-gray-700">€ {(total * 0.75).toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Accident Protection Card */}
      {hasAccidentProtection && (
        <div className="mt-4">
          <div className="bg-[#0D9B84] text-white rounded-t-lg px-4 py-2">
            <p className="font-bold italic text-sm">You are fully covered</p>
          </div>
          <div className="bg-[#E1F5EE] rounded-b-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-xs text-gray-700 leading-relaxed">
                  Accident Protection – Full Coverage (Refundable amount. Not included in rental charges. 
                  Payable separately at delivery by cash or debit card).
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold">€</p>
                <p className="text-lg font-bold">100.00</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 italic mt-2">&quot;Drive with peace of mind&quot;</p>
          </div>
        </div>
      )}
    </div>
  )
}
