"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBookingStore } from '@/src/store/bookingStore'
import BookingLayout from '@/src/components/booking/BookingLayout'
import { Check, Download, Home, MapPin, Calendar, Car, Shield, Phone, Mail } from 'lucide-react'
import dynamic from 'next/dynamic'
import ReceiptPDF from '@/src/components/booking/ReceiptPDF'
import { useBrand } from '@/src/components/providers/BrandProvider'

// Dynamically import PDFDownloadLink to prevent SSR issues
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
)

export default function BookingConfirmationPage() {
  const router = useRouter()
  const brand = useBrand()
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
  const currencySymbol = brand?.currency || 'MUR'

  return (
    <BookingLayout showSidebar={false}>
      <div className="max-w-2xl mx-auto py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[#0D9B84] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#0D9B84]/30">
            <Check size={40} className="text-white" strokeWidth={3} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Booking Confirmed!</h1>
          <p className="text-gray-500 text-sm">Thank you for booking with <strong className="text-gray-800">{brand.name}</strong></p>
          <div className="mt-3 inline-block bg-emerald-50 border border-emerald-200 px-5 py-2 rounded-xl">
            <span className="text-xs text-emerald-700 font-medium">Booking Reference</span>
            <p className="text-xl font-black text-emerald-800">{bookingRef || `${brand.bookingRefPrefix || 'HYR'}-2026-CONFIRMED`}</p>
          </div>
        </div>

        {/* Company Header Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            {brand.logo ? (
              <img src={brand.logo} alt={brand.name} className="h-12 w-auto max-w-[140px] object-contain rounded" />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-gold text-white font-black text-lg flex items-center justify-center shadow-md">
                {brand.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-base font-bold text-gray-900">{brand.name}</h2>
              <p className="text-xs text-gray-500">{brand.address || brand.locationSummary}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                <span className="flex items-center gap-1"><Phone size={12} className="text-gold" /> {brand.phone}</span>
                <span className="flex items-center gap-1"><Mail size={12} className="text-gold" /> {brand.email}</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider bg-gold/10 text-gold px-3 py-1 rounded-full">
            Official Invoice
          </span>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
          {/* Vehicle */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#0D9B84]/10 flex items-center justify-center">
                <Car size={20} className="text-[#0D9B84]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Reserved Vehicle</p>
                <p className="font-bold text-gray-900 text-base">{selectedVehicle.name}</p>
                <p className="text-xs text-gray-500">{selectedVehicle.category} · {selectedVehicle.transmission}</p>
              </div>
            </div>
          </div>

          {/* Dates & Locations */}
          <div className="p-6 border-b border-gray-100 grid grid-cols-2 gap-6 bg-gray-50/50">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-700">Pickup</p>
                <p className="text-xs text-gray-700 font-medium mt-0.5">{searchParams.pickupLocation}</p>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <Calendar size={11} />
                  {searchParams.pickupDate ? new Date(searchParams.pickupDate).toLocaleDateString('en-GB') : ''} - {searchParams.pickupTime}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-rose-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-rose-600">Drop-off</p>
                <p className="text-xs text-gray-700 font-medium mt-0.5">{searchParams.dropoffLocation}</p>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <Calendar size={11} />
                  {searchParams.dropoffDate ? new Date(searchParams.dropoffDate).toLocaleDateString('en-GB') : ''} - {searchParams.dropoffTime}
                </p>
              </div>
            </div>
          </div>

          {/* Driver Information */}
          <div className="p-6 border-b border-gray-100">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Driver Details</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400">Driver Name:</span>
                <p className="font-bold text-gray-800 mt-0.5">{driverDetails.title} {driverDetails.firstName} {driverDetails.lastName}</p>
              </div>
              <div>
                <span className="text-gray-400">Email Address:</span>
                <p className="font-bold text-gray-800 mt-0.5">{driverDetails.email}</p>
              </div>
              <div>
                <span className="text-gray-400">Phone Number:</span>
                <p className="font-bold text-gray-800 mt-0.5">{driverDetails.phone}</p>
              </div>
              <div>
                <span className="text-gray-400">Country of Residence:</span>
                <p className="font-bold text-gray-800 mt-0.5">{driverDetails.country}</p>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="p-6 bg-gray-50/70">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Invoice Summary</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Rental ({days} Days @ {currencySymbol} {selectedVehicle.pricePerDay}/day)</span>
                <span>{currencySymbol} {(selectedVehicle.pricePerDay * days).toLocaleString()}</span>
              </div>
              {activeOptions.map(opt => (
                <div key={opt.id} className="flex justify-between text-gray-600">
                  <span>{opt.name} (x{opt.quantity})</span>
                  <span>{currencySymbol} {(opt.pricePerDay * opt.quantity * days).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between pt-3 border-t border-gray-200 text-sm font-black text-gray-900">
                <span>Total Amount</span>
                <span className="text-[#0D9B84] text-base">{currencySymbol} {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <PDFDownloadLink
            document={
              <ReceiptPDF
                bookingRef={bookingRef || `${brand.bookingRefPrefix || 'HYR'}-XXXXXX`}
                driver={driverDetails}
                vehicle={selectedVehicle}
                searchParams={searchParams}
                days={days}
                total={total}
                brand={brand}
              />
            }
            fileName={`${brand.name.replace(/[^a-zA-Z0-9]/g, '_')}_Invoice_${bookingRef || 'CONFIRMED'}.pdf`}
            className="flex-1"
          >
            {/* @ts-ignore */}
            {({ loading }: { loading: boolean }) => (
              <button
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
              >
                <Download size={16} className="text-gold" />
                {loading ? 'Preparing PDF...' : `Download ${brand.name} Invoice PDF`}
              </button>
            )}
          </PDFDownloadLink>

          <button
            onClick={() => {
              reset()
              router.push('/')
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#0D9B84] hover:bg-[#00C4A0] text-white rounded-xl font-bold transition-colors shadow-lg shadow-[#0D9B84]/30"
          >
            <Home size={16} />
            Back to Home
          </button>
        </div>
      </div>
    </BookingLayout>
  )
}
