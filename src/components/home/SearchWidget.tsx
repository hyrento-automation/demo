"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation, MapPin, Calendar, Clock, X } from 'lucide-react'
import Script from 'next/script'
import { useBookingStore } from '@/src/store/bookingStore'
import { useGooglePlaces } from '@/src/hooks/useGooglePlaces'

const LOCATIONS = [
  'Sir Seewoosagur Ramgoolam International Airport, Plaine Magnien, Maurice',
  'Port Louis City Centre, Mauritius',
  'Grand Baie, Mauritius',
  'Flic en Flac, Mauritius',
  'Le Morne, Mauritius',
  'Belle Mare, Mauritius',
  'Tamarin, Mauritius',
]

const TIME_OPTIONS = [
  '00:00','00:30','01:00','01:30','02:00','02:30','03:00','03:30',
  '04:00','04:30','05:00','05:30','06:00','06:30','07:00','07:30',
  '08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30',
  '20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30',
]

export default function SearchWidget() {
  const router = useRouter()
  const { setSearchParams, setStep } = useBookingStore()

  const [pickup, setPickup] = useState('Sir Seewoosagur Ramgoolam International Airport, Plaine Magnien, Maurice')
  const [dropoff, setDropoff] = useState('Sir Seewoosagur Ramgoolam International Airport, Plaine Magnien, Maurice')
  const [pickupDate, setPickupDate] = useState('2026-06-15')
  const [pickupTime, setPickupTime] = useState('18:30')
  const [returnDate, setReturnDate] = useState('2026-06-25')
  const [returnTime, setReturnTime] = useState('19:00')
  const [driverAge, setDriverAge] = useState<'18-29' | '30-69' | '70+'>('30-69')
  const [ageValue, setAgeValue] = useState(24)

  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false)
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false)

  const { fetchPredictions, initService } = useGooglePlaces()
  const [pickupPredictions, setPickupPredictions] = useState<{description: string}[]>([])
  const [dropoffPredictions, setDropoffPredictions] = useState<{description: string}[]>([])

  const handlePickupChange = (val: string) => {
    setPickup(val)
    setShowPickupSuggestions(true)
    fetchPredictions(val, setPickupPredictions)
  }

  const handleDropoffChange = (val: string) => {
    setDropoff(val)
    setShowDropoffSuggestions(true)
    fetchPredictions(val, setDropoffPredictions)
  }

  const handleSearch = () => {
    setSearchParams({
      pickupLocation: pickup,
      dropoffLocation: dropoff,
      pickupDate,
      pickupTime,
      dropoffDate: returnDate,
      dropoffTime: returnTime,
    })
    setStep(1)
    router.push('/booking')
  }

  return (
    <>
      <Script 
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        onLoad={initService}
        strategy="lazyOnload"
      />
      <div className="bg-white rounded-2xl shadow-md px-6 sm:px-8 py-7 max-w-[960px] mx-auto">
      {/* Row 1 — Address Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-5">
        {/* Pickup Address */}
        <div className="relative">
          <label className="flex items-center gap-2 mb-2">
            <Navigation size={16} className="text-[#0D9B84]" />
            <span className="font-bold text-sm text-[#1A4D5C]">Pickup address</span>
            <span className="text-xs text-gray-400">(Choose airport or hotel)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={pickup}
              onChange={(e) => handlePickupChange(e.target.value)}
              onFocus={() => setShowPickupSuggestions(true)}
              onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 200)}
              placeholder="Google Maps Autocomplete..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 text-sm font-bold text-gray-800 focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] transition-colors"
            />
            {pickup && (
              <button
                onClick={() => setPickup('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={12} className="text-gray-500" />
              </button>
            )}
            {showPickupSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                {pickupPredictions.length > 0 ? pickupPredictions.map((pred, i) => (
                  <button
                    key={i}
                    onClick={() => { setPickup(pred.description); setShowPickupSuggestions(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#E1F5EE] transition-colors flex items-center gap-2"
                  >
                    <MapPin size={12} className="text-[#0D9B84] flex-shrink-0" />
                    {pred.description}
                  </button>
                )) : LOCATIONS.slice(0, 4).map((loc, i) => (
                  <button
                    key={i}
                    onClick={() => { setPickup(loc); setShowPickupSuggestions(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#E1F5EE] transition-colors flex items-center gap-2"
                  >
                    <MapPin size={12} className="text-[#0D9B84] flex-shrink-0" />
                    {loc}
                  </button>
                ))}
                {/* Google UI Branding */}
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex justify-end">
                   <div className="flex items-center gap-1 opacity-50">
                      <span className="text-[10px] text-gray-500 font-bold">Powered by</span>
                      <span className="text-[10px] font-black text-[#4285F4]">G</span>
                      <span className="text-[10px] font-black text-[#EA4335]">o</span>
                      <span className="text-[10px] font-black text-[#FBBC05]">o</span>
                      <span className="text-[10px] font-black text-[#4285F4]">g</span>
                      <span className="text-[10px] font-black text-[#34A853]">l</span>
                      <span className="text-[10px] font-black text-[#EA4335]">e</span>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Drop-off Address */}
        <div className="relative">
          <label className="flex items-center gap-2 mb-2">
            <MapPin size={16} className="text-[#E8534A]" />
            <span className="font-bold text-sm text-[#1A4D5C]">Drop-off address</span>
            <span className="text-xs text-gray-400">(Choose airport or hotel)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={dropoff}
              onChange={(e) => handleDropoffChange(e.target.value)}
              onFocus={() => setShowDropoffSuggestions(true)}
              onBlur={() => setTimeout(() => setShowDropoffSuggestions(false), 200)}
              placeholder="Google Maps Autocomplete..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 text-sm font-bold text-gray-800 focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] transition-colors"
            />
            {dropoff && (
              <button
                onClick={() => setDropoff('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={12} className="text-gray-500" />
              </button>
            )}
            {showDropoffSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                {dropoffPredictions.length > 0 ? dropoffPredictions.map((pred, i) => (
                  <button
                    key={i}
                    onClick={() => { setDropoff(pred.description); setShowDropoffSuggestions(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#FEE9E7] transition-colors flex items-center gap-2"
                  >
                    <MapPin size={12} className="text-[#E8534A] flex-shrink-0" />
                    {pred.description}
                  </button>
                )) : LOCATIONS.slice(0, 4).map((loc, i) => (
                  <button
                    key={i}
                    onClick={() => { setDropoff(loc); setShowDropoffSuggestions(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#FEE9E7] transition-colors flex items-center gap-2"
                  >
                    <MapPin size={12} className="text-[#E8534A] flex-shrink-0" />
                    {loc}
                  </button>
                ))}
                {/* Google UI Branding */}
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex justify-end">
                   <div className="flex items-center gap-1 opacity-50">
                      <span className="text-[10px] text-gray-500 font-bold">Powered by</span>
                      <span className="text-[10px] font-black text-[#4285F4]">G</span>
                      <span className="text-[10px] font-black text-[#EA4335]">o</span>
                      <span className="text-[10px] font-black text-[#FBBC05]">o</span>
                      <span className="text-[10px] font-black text-[#4285F4]">g</span>
                      <span className="text-[10px] font-black text-[#34A853]">l</span>
                      <span className="text-[10px] font-black text-[#EA4335]">e</span>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2 — Date & Time */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5">
        {/* Pickup Date */}
        <div>
          <label className="flex items-center gap-1.5 mb-2">
            <Calendar size={14} className="text-[#0D9B84]" />
            <span className="font-bold text-sm text-[#1A4D5C]">Pickup Date</span>
          </label>
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:border-[#0D9B84] focus:ring-1 focus:ring-[#0D9B84] transition-colors"
          />
        </div>

        {/* Pickup Time */}
        <div>
          <label className="flex items-center gap-1.5 mb-2">
            <Clock size={14} className="text-[#0D9B84]" />
            <span className="font-bold text-sm text-[#1A4D5C]">Pickup Time</span>
          </label>
          <select
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:border-[#0D9B84] focus:ring-1 focus:ring-[#0D9B84] transition-colors appearance-none bg-white cursor-pointer"
          >
            {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Return Date */}
        <div>
          <label className="flex items-center gap-1.5 mb-2">
            <Calendar size={14} className="text-[#E8534A]" />
            <span className="font-bold text-sm text-[#1A4D5C]">Return Date</span>
          </label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:border-[#E8534A] focus:ring-1 focus:ring-[#E8534A] transition-colors"
          />
        </div>

        {/* Return Time */}
        <div>
          <label className="flex items-center gap-1.5 mb-2">
            <Clock size={14} className="text-[#E8534A]" />
            <span className="font-bold text-sm text-[#1A4D5C]">Return Time</span>
          </label>
          <select
            value={returnTime}
            onChange={(e) => setReturnTime(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:border-[#E8534A] focus:ring-1 focus:ring-[#E8534A] transition-colors appearance-none bg-white cursor-pointer"
          >
            {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Row 3 — Driver age + Age number + Payment logos + CTA */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        {/* Driver Age Radio */}
        <div className="flex items-center gap-4">
          <span className="font-bold text-sm text-[#1A4D5C]">Driver&apos;s age</span>
          <div className="flex items-center gap-4">
            {(['18-29', '30-69', '70+'] as const).map(age => (
              <label key={age} onClick={() => setDriverAge(age)} className="flex items-center gap-1.5 cursor-pointer">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  driverAge === age ? 'border-[#0D9B84]' : 'border-gray-300'
                }`}>
                  {driverAge === age && <div className="w-2 h-2 rounded-full bg-[#0D9B84]" />}
                </div>
                <span className="text-sm text-gray-600">{age}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Age Number Input */}
        <input
          type="number"
          value={ageValue}
          onChange={(e) => setAgeValue(Number(e.target.value))}
          className="w-20 border border-gray-300 rounded-lg px-3 py-3 text-center text-sm font-medium text-gray-800 focus:border-[#0D9B84] focus:ring-1 focus:ring-[#0D9B84] transition-colors"
        />

        {/* Payment Logos */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {/* Visa */}
            <div className="bg-[#1A1F71] text-white text-[9px] font-black px-2.5 py-1.5 rounded italic tracking-wide">
              VISA
            </div>
            {/* Mastercard */}
            <div className="flex items-center -space-x-1.5">
              <div className="w-5 h-5 rounded-full bg-[#EB001B]" />
              <div className="w-5 h-5 rounded-full bg-[#F79E1B] opacity-80" />
            </div>
          </div>
          <span className="text-xs font-bold text-[#0D9B84] uppercase tracking-wide leading-tight">
            Debit &<br />Credit
          </span>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleSearch}
          className="ml-auto w-full md:w-auto px-8 lg:px-10 py-3.5 bg-[#0D9B84] text-white font-medium text-base rounded-xl hover:bg-[#00C4A0] transition-all duration-300 shadow-lg shadow-[#0D9B84]/20 hover:shadow-xl hover:shadow-[#0D9B84]/30 whitespace-nowrap"
        >
          Search My Car Now
        </button>
      </div>
    </div>
    </>
  )
}
