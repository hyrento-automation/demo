"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBookingStore } from '@/src/store/bookingStore'
import BookingLayout from '@/src/components/booking/BookingLayout'
import { Check, Download, Home, MapPin, Calendar, Car, Shield } from 'lucide-react'
import dynamic from 'next/dynamic'
import ReceiptPDF from '@/src/components/booking/ReceiptPDF'

// Dynamically import PDFDownloadLink to prevent SSR issues
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
)

// Reference generation is now handled on the server

export default function BookingConfirmationPage() {
  const router = useRouter()
  const {
    selectedVehicle,
    selectedOptions,
    driverDetails,
    searchParams,
    paymentMode,
    bookingRef,
    setStep,
    getRentalDays,
    getTotal,
    reset,
  } = useBookingStore()

  // Use the reference from the store

  useEffect(() => {
    setStep(4)
  }, [setStep])

  useEffect(() => {
    if (!selectedVehicle || !driverDetails) {
      router.push('/booking')
    }
  }, [selectedVehicle, driverDetails, router])

  if (!selectedVehicle || !driverDetails) return null

  const days = getRentalDays()
  const total = getTotal()
  const activeOptions = selectedOptions.filter(opt => opt.quantity > 0)

  return (
    <BookingLayout showSidebar={false}>
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[#0D9B84] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#0D9B84]/30">
            <Check size={40} className="text-white" strokeWidth={3} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500">Your booking reference number is</p>
          <p className="text-2xl font-bold text-[#0D9B84] mt-1">{bookingRef || 'CHM-2026-XXXXX'}</p>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          {/* Vehicle */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#0D9B84]/10 flex items-center justify-center">
                <Car size={18} className="text-[#0D9B84]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Vehicle</p>
                <p className="font-bold text-gray-900">{selectedVehicle.name}</p>
              </div>
            </div>
          </div>

          {/* Dates & Locations */}
          <div className="p-6 border-b border-gray-100 grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-red-500 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#0D9B84]">Pickup</p>
                <p className="text-xs text-gray-600 mt-0.5">{searchParams.pickupLocation}</p>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <Calendar size={10} />
                  {new Date(searchParams.pickupDate).toLocaleDateString('en-GB')} - {searchParams.pickupTime}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-red-500 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-500">Drop-off</p>
                <p className="text-xs text-gray-600 mt-0.5">{searchParams.dropoffLocation}</p>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <Calendar size={10} />
                  {new Date(searchParams.dropoffDate).toLocaleDateString('en-GB')} - {searchParams.dropoffTime}
                </p>
              </div>
            </div>
          </div>

          {/* Driver */}
          <div className="p-6 border-b border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Driver</p>
            <p className="font-bold text-gray-900">
              {driverDetails.title} {driverDetails.firstName} {driverDetails.lastName}
            </p>
            <p className="text-xs text-gray-500 mt-1">{driverDetails.email} • {driverDetails.phone}</p>
          </div>

          {/* Extras */}
          {activeOptions.length > 0 && (
            <div className="p-6 border-b border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Selected Extras</p>
              <div className="space-y-1">
                {activeOptions.map(opt => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <Shield size={12} className="text-[#0D9B84]" />
                    <span className="text-sm text-gray-700">{opt.name} × {opt.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Rental ({days} days)</span>
              <span className="font-medium">€ {(selectedVehicle.pricePerDay * days).toFixed(2)}</span>
            </div>
            {activeOptions.map(opt => (
              <div key={opt.id} className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">{opt.name.split('–')[0].trim()} × {opt.quantity}</span>
                <span className="font-medium">
                  € {(opt.priceType === 'per_unit'
                    ? opt.pricePerDay * opt.quantity
                    : Math.min(opt.pricePerDay * days * opt.quantity, (opt.maxCharge || Infinity) * opt.quantity)
                  ).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-[#0D9B84]">€ {total.toFixed(2)}</span>
            </div>
            {paymentMode === '25%' && (
              <div className="mt-3 text-xs text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>Paid online (25%)</span>
                  <span className="font-medium text-gray-700">€ {(total * 0.25).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Balance due on delivery (75%)</span>
                  <span className="font-medium text-gray-700">€ {(total * 0.75).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <PDFDownloadLink
            document={
              <ReceiptPDF
                bookingRef={bookingRef || 'CHM-XXXXXX'}
                driver={driverDetails}
                vehicle={selectedVehicle}
                searchParams={searchParams}
                days={days}
                total={total}
              />
            }
            fileName={`CarHire_Receipt_${bookingRef || 'CHM'}.pdf`}
            className="flex-1"
          >
            {/* @ts-ignore */}
            {({ loading }: { loading: boolean }) => (
              <button
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Download size={16} />
                {loading ? 'Preparing PDF...' : 'Download Confirmation PDF'}
              </button>
            )}
          </PDFDownloadLink>

          <button
            onClick={() => {
              reset()
              router.push('/')
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0D9B84] text-white rounded-lg font-medium hover:bg-[#00C4A0] transition-colors shadow-lg shadow-[#0D9B84]/30"
          >
            <Home size={16} />
            Back to Home
          </button>
        </div>
      </div>
    </BookingLayout>
  )
}
