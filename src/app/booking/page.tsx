"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBookingStore, BookingVehicle } from '@/src/store/bookingStore'
import BookingLayout from '@/src/components/booking/BookingLayout'
import { getBranchCharges } from '@/src/lib/actions/admin.actions'
import { MapPin, Users, Briefcase, Car, Settings2, Wind, Fuel, Check, ArrowRight, ChevronDown, Pencil, Loader2 } from 'lucide-react'

// Vehicles are now fetched from the database


const CATEGORIES = [
  { name: 'Pickup', iconUrl: '/assets/imgi_10_vehicle_type_1594813606.png', from: 46, seats: 5, bags: 5 },
  { name: 'Mini', iconUrl: '/assets/imgi_4_vehicle_type_1594813619.png', from: 26, seats: 5, bags: 3 },
  { name: 'SUV', iconUrl: '/assets/imgi_9_vehicle_type_1594813641.png', from: 48, seats: 5, bags: 4 },
  { name: '7-seater', iconUrl: '/assets/imgi_11_vehicle_type_1594813657.png', from: 43, seats: 7, bags: 5 },
]

export default function VehicleListPage() {
  const router = useRouter()
  const { setVehicle, setStep, searchParams, setSearchParams, getRentalDays, setLocationCharges } = useBookingStore()
  const [vehicles, setVehicles] = useState<BookingVehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [transFilters, setTransFilters] = useState<string[]>([])
  const [fuelFilters, setFuelFilters] = useState<string[]>([])
  const [seatFilter, setSeatFilter] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [priceMax, setPriceMax] = useState<number>(9999)
  const [mounted, setMounted] = useState(false)
  const days = isNaN(getRentalDays()) ? 1 : getRentalDays()

  useEffect(() => {
    setMounted(true)
    setStep(1)
    setLoading(true)
    setFetchError(false)

    const timeout = setTimeout(() => {
      setLoading(false)
      setFetchError(true)
    }, 8000)

    const params = new URLSearchParams({
      pickupDate: searchParams?.pickupDate || '',
      dropoffDate: searchParams?.dropoffDate || '',
    })
    fetch(`/api/vehicles?${params}`)
      .then(res => res.json())
      .then(data => {
        clearTimeout(timeout)
        setVehicles(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        clearTimeout(timeout)
        console.error('Error fetching vehicles:', err)
        setLoading(false)
        setFetchError(true)
      })

    // Fetch location-based charges for pickup/dropoff locations
    if (searchParams?.pickupLocation && searchParams?.dropoffLocation) {
      getBranchCharges(searchParams.pickupLocation, searchParams.dropoffLocation)
        .then(({ pickupCharge, deliveryCharge }) => {
          setLocationCharges(pickupCharge, deliveryCharge)
        })
        .catch(err => console.error('Failed to fetch branch charges:', err))
    }

    return () => clearTimeout(timeout)
  }, [setStep, searchParams?.pickupDate, searchParams?.dropoffDate, searchParams?.pickupLocation, searchParams?.dropoffLocation, setLocationCharges])


  const toggleTrans = (t: string) => setTransFilters(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])
  const toggleFuel = (f: string) => setFuelFilters(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f])

  const safeVehicles = Array.isArray(vehicles) ? vehicles : [];
  const maxVehiclePrice = safeVehicles.length > 0 ? Math.ceil(Math.max(...safeVehicles.map(v => (v.pricePerDay || 0) * days)) / 100) * 100 : 9999

  const filteredVehicles = safeVehicles.filter(v => {
    if (selectedCategory) {
      const cat = (v.category || '').toLowerCase()
      const sel = selectedCategory.toLowerCase()
      if (sel === '7-seater') {
        if (v.seats < 7) return false
      } else if (!cat.includes(sel)) {
        return false
      }
    }
    if (transFilters.length > 0 && !transFilters.includes(v.transmission)) return false
    if (fuelFilters.length > 0 && !fuelFilters.includes(v.fuelType)) return false
    if (seatFilter === '1-4' && v.seats > 4) return false
    if (seatFilter === '5' && v.seats !== 5) return false
    if (seatFilter === '6+' && v.seats < 6) return false
    if (v.pricePerDay * days > priceMax) return false
    return true
  })

  const handleSelect = (vehicle: BookingVehicle) => {
    setVehicle(vehicle)
    router.push('/booking/options')
  }

  if (!mounted) return null;

  return (
    <BookingLayout showSidebar={false}>
      <div className="flex gap-6">
        {/* Left Sidebar - Search Details & Filters */}
        <div className="hidden lg:block w-[260px] flex-shrink-0 space-y-4">
          {/* Search Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-gray-900">Search Details</h3>
              <Pencil size={14} className="text-gray-400 cursor-pointer hover:text-[#0D9B84]" />
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin size={12} className="text-red-500" />
                  <span className="text-xs font-bold text-[#0D9B84]">Pickup</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{searchParams.pickupLocation}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {new Date(searchParams.pickupDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} - {searchParams.pickupTime}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin size={12} className="text-red-500" />
                  <span className="text-xs font-bold text-red-500">Drop-off</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{searchParams.dropoffLocation}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {new Date(searchParams.dropoffDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} - {searchParams.dropoffTime}
                </p>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-4 rounded-lg overflow-hidden aspect-video bg-gray-100 relative">
              <img
                src={`https://maps.googleapis.com/maps/api/staticmap?center=Mauritius&zoom=9&size=300x150&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}`}
                alt="Map"
                className="w-full h-full object-cover opacity-50"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400&auto=format&fit=crop'
                }}
              />
              <div className="absolute bottom-2 left-2 text-[10px] text-[#0D9B84] underline cursor-pointer">
                View larger map
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
            <h3 className="font-bold text-sm text-gray-900">Filters</h3>

            {/* Price Range */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[#0D9B84] text-xs">€</span>
                <span className="text-xs font-bold text-[#0D9B84]">Price range</span>
              </div>
              <p className="text-[10px] text-gray-400 mb-2">The average car price is €360.00 € (per rental)</p>
              <input 
                type="range" 
                min={0} 
                max={maxVehiclePrice} 
                value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#0D9B84]" 
              />
              <p className="text-xs text-gray-600 mt-1">€ 0 - € {priceMax === 9999 ? maxVehiclePrice.toFixed(2) : priceMax.toFixed(2)}</p>
            </div>

            {/* Car Specification */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Settings2 size={12} className="text-[#0D9B84]" />
                <span className="text-xs font-bold text-[#0D9B84]">Car Specification</span>
              </div>
              {['Automatic', 'Manual'].map(spec => (
                <label key={spec} className="flex items-center gap-2 py-1 cursor-pointer">
                  <input type="checkbox" checked={transFilters.includes(spec)} onChange={() => toggleTrans(spec)} className="rounded border-gray-300 text-[#0D9B84] focus:ring-[#0D9B84]" />
                  <span className="text-xs text-gray-600">{spec}</span>
                </label>
              ))}
            </div>

            {/* Mileage */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Settings2 size={12} className="text-[#0D9B84]" />
                <span className="text-xs font-bold text-[#0D9B84]">Mileage</span>
              </div>
              {['Unlimited', 'Limited'].map(m => (
                <label key={m} className="flex items-center gap-2 py-1 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-[#0D9B84] focus:ring-[#0D9B84]" />
                  <span className="text-xs text-gray-600">{m}</span>
                </label>
              ))}
            </div>

            {/* Fuel Policy */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Fuel size={12} className="text-[#0D9B84]" />
                <span className="text-xs font-bold text-[#0D9B84]">Fuel Type</span>
              </div>
              {['Petrol', 'Diesel', 'Hybrid'].map(fp => (
                <label key={fp} className="flex items-center gap-2 py-1 cursor-pointer">
                  <input type="checkbox" checked={fuelFilters.includes(fp)} onChange={() => toggleFuel(fp)} className="rounded border-gray-300 text-[#0D9B84] focus:ring-[#0D9B84]" />
                  <span className="text-xs text-gray-600">{fp}</span>
                </label>
              ))}
            </div>

            {/* No of Seats */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Users size={12} className="text-[#0D9B84]" />
                <span className="text-xs font-bold text-[#0D9B84]">No of Seats</span>
              </div>
              <div className="flex gap-2">
                {['1-4', '5', '6+'].map(s => (
                  <button 
                    key={s} 
                    onClick={() => setSeatFilter(seatFilter === s ? null : s)}
                    className={`px-4 py-1.5 text-xs border rounded transition-colors ${seatFilter === s ? 'bg-[#0D9B84] text-white border-[#0D9B84]' : 'border-gray-200 hover:bg-[#0D9B84] hover:text-white hover:border-[#0D9B84]'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Results Banner */}
          <div className={`rounded-lg px-5 py-3 mb-5 flex items-center justify-between ${fetchError ? 'bg-amber-500' : 'bg-[#E8534A]'} text-white`}>
            <p className="text-sm">
              {fetchError
                ? 'Unable to load fleet — please call or WhatsApp us to check availability.'
                : <>We have found <strong>{loading ? <Loader2 size={14} className="inline animate-spin" /> : filteredVehicles.length}</strong> different types of car(s) for you</>}
            </p>
            {loading && !fetchError && <Loader2 size={18} className="animate-spin" />}
          </div>

          {/* Error CTA */}
          {fetchError && (
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <a href="tel:+2302110000" className="flex-1 h-12 rounded-lg bg-navy text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-gold transition-colors">
                📞 Call +230 211 0000
              </a>
              <a href="https://wa.me/2302110000" target="_blank" rel="noopener noreferrer" className="flex-1 h-12 rounded-lg bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors">
                💬 WhatsApp Us
              </a>
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-3 mb-5">
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                className={`flex-shrink-0 px-4 py-3 bg-white rounded-xl border transition-all text-center min-w-[130px] ${
                  selectedCategory === cat.name ? 'border-[#0D9B84] bg-[#E1F5EE]' : 'border-gray-200 hover:border-[#0D9B84]/30'
                }`}
              >
                <div className="h-8 mb-2 flex items-center justify-center">
                   <img src={cat.iconUrl} alt={cat.name} className="h-full w-auto object-contain mix-blend-multiply opacity-80" />
                </div>
                <p className="text-xs font-bold text-gray-900">{cat.name}</p>
                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 mt-2">
                  <span className="flex items-center gap-1"><Users size={10} /> {cat.seats}</span>
                  <span className="flex items-center gap-1"><Briefcase size={10} /> {cat.bags}</span>
                </div>
                <p className="text-xs font-bold text-[#0D9B84] mt-1">from € {cat.from}.00</p>
              </button>
            ))}
          </div>

          {/* Currency Selector */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Select Currency</span>
              <select className="border border-gray-200 rounded px-2 py-1 text-xs">
                <option>🇲🇺 MUR</option>
                <option>🇪🇺 EUR</option>
                <option>🇺🇸 USD</option>
                <option>🇬🇧 GBP</option>
              </select>
            </div>
          </div>

          {/* Vehicle Cards */}
          <div className="space-y-4">
            {loading ? (
               <div className="py-20 text-center space-y-4">
                  <Loader2 size={40} className="text-[#0D9B84] animate-spin mx-auto" />
                  <p className="text-gray-500 font-medium">Fetching available fleet from Supabase...</p>
               </div>
            ) : filteredVehicles.length > 0 ? (
              filteredVehicles.map(vehicle => (
                <div key={vehicle.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Main Card */}
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row gap-5">
                      {/* Left: Image */}
                      <div className="md:w-[200px] flex-shrink-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg text-gray-900">{vehicle.name}</h3>
                          <span className="text-xs text-gray-400">or similar ({vehicle.transmission})</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#0D9B84] uppercase tracking-wider">{vehicle.category}</span>
                        {vehicle.available <= 5 && (
                          <p className="text-xs text-[#0D9B84] font-medium mt-0.5">(Only {vehicle.available} left)</p>
                        )}
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          className="w-full h-32 object-cover rounded-lg mt-2"
                        />
                        <div className="flex gap-1.5 mt-2">
                          {[
                            { icon: Users, label: vehicle.seats },
                            { icon: Briefcase, label: vehicle.luggage },
                            { icon: Settings2, label: vehicle.transmission === 'Automatic' ? 'A' : 'M' },
                            { icon: Wind, label: 'AC' },
                            { icon: Fuel, label: vehicle.fuelType.charAt(0) },
                          ].map((spec, i) => (
                            <div key={i} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center" title={String(spec.label)}>
                              <spec.icon size={12} className="text-gray-500" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Center: Details */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <p className="text-xs font-bold text-[#0D9B84]">Pickup location</p>
                          <p className="text-xs text-gray-600">Airport counter/Hotel</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#0D9B84]">Fuel policy</p>
                          <p className="text-xs text-gray-600">Same to Same</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#0D9B84]">Payment Option</p>
                          <p className="text-xs text-gray-600">25% or 100%</p>
                        </div>
                      </div>

                      {/* Right: Price & Features */}
                      <div className="md:w-[220px] flex-shrink-0">
                        {/* No deposit badge */}
                        <div className="flex justify-end mb-3">
                          <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-md">
                            <Check size={12} /> No security deposit needed
                          </span>
                        </div>

                        {/* Price */}
                        <div className="text-right mb-4">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Price for {days} days</p>
                          <p className="text-2xl font-bold text-gray-900">
                            • € {(vehicle.pricePerDay * days).toFixed(2)}
                          </p>
                          <p className="text-[10px] text-gray-400">(VAT Included)</p>
                        </div>

                        {/* Included for free */}
                        <div className="mb-4">
                          <p className="text-xs font-bold text-[#0D9B84] mb-2">Included for free</p>
                          <div className="space-y-1">
                            {vehicle.features.map(f => (
                              <div key={f} className="flex items-center gap-1.5">
                                <Check size={12} className="text-[#0D9B84]" />
                                <span className="text-[11px] text-gray-600">{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* CTA */}
                        <button
                          onClick={() => handleSelect(vehicle)}
                          className="w-full py-2.5 bg-[#0D9B84] text-white rounded-lg font-medium text-sm hover:bg-[#00C4A0] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#0D9B84]/20"
                        >
                          Select This car
                          <ArrowRight size={14} />
                        </button>
                        <button className="w-full py-2 text-xs text-gray-500 hover:text-gray-700 mt-2 text-center border border-gray-200 rounded-lg">
                          Email Quote
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Extend & Save More */}
                  <button
                    onClick={() => setExpandedId(expandedId === vehicle.id ? null : vehicle.id)}
                    className="w-full py-2.5 bg-[#0D9B84] text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#00C4A0] transition-colors"
                  >
                    Extend & Save More
                    <ChevronDown size={16} className={`transition-transform ${expandedId === vehicle.id ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedId === vehicle.id && (
                    <div className="p-5 bg-[#E1F5EE] text-sm text-gray-600">
                      <p>Book for 7+ days and save 10% | 14+ days and save 15% | 30+ days and save 20%</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Car size={48} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-bold">No vehicles found matching your criteria.</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search dates.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </BookingLayout>
  )
}
