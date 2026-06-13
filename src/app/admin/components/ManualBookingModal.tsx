"use client"

import React, { useState, useEffect } from 'react'
import {
  X, Calendar, User, CreditCard, MapPin, Car, Clock,
  CheckCircle, AlertCircle, Loader2, ArrowRight, Phone, Mail, FileText, Repeat
} from 'lucide-react'
import { createManualBooking, getAvailableCars } from '@/src/lib/actions/admin.actions'

interface ManualBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const LOCATIONS = [
  'SSR International Airport (MRU)',
  'Port Louis City Centre',
  'Grand Baie',
  'Flic en Flac',
  'Le Morne',
  'Tamarin',
  'Mahebourg',
  'Hotel Delivery (Specify in Notes)',
]

const TIME_SLOTS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00',
]

const RENTAL_TYPES = [
  { label: 'Standard', value: 'standard', desc: 'Daily rate applies' },
  { label: 'Long-term', value: 'longterm', desc: 'Weekly/monthly discounts auto-applied' },
  { label: 'Corporate', value: 'corporate', desc: 'Invoice-based, custom pricing' },
]

export default function ManualBookingModal({ isOpen, onClose, onSuccess }: ManualBookingModalProps) {
  const [step, setStep] = useState(1) // 1=Dates&Location, 2=Vehicle, 3=Driver, 4=Payment
  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [carsLoading, setCarsLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const [form, setForm] = useState({
    // Dates & Times
    pickupDate: '',
    pickupTime: '09:00',
    returnDate: '',
    returnTime: '09:00',
    // Locations
    pickupLocation: 'SSR International Airport (MRU)',
    returnLocation: 'SSR International Airport (MRU)',
    oneWay: false,
    // Vehicle
    carId: '',
    rentalType: 'standard',
    // Driver
    driverName: '',
    driverPhone: '',
    driverEmail: '',
    driverLicense: '',
    driverAge: '',
    // Payment
    totalPrice: 0,
    paymentStatus: 'PENDING',
    specialRequests: '',
    internalNotes: '',
    // Auto-calc
    totalDays: 0,
    selectedCarRate: 0,
  })

  const setF = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }))

  // ─── Live availability when dates change ───
  useEffect(() => {
    if (!isOpen || !form.pickupDate || !form.returnDate) {
      setCars([])
      return
    }

    const pickup = new Date(form.pickupDate + 'T' + form.pickupTime)
    const ret = new Date(form.returnDate + 'T' + form.returnTime)
    if (ret <= pickup) return

    const days = Math.ceil((ret.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)) || 1
    setF('totalDays', days)

    setCarsLoading(true)
    getAvailableCars(form.pickupDate, form.returnDate)
      .then(result => {
        setCars(result)
        setF('carId', '')
        setF('totalPrice', 0)
      })
      .catch(() => setCars([]))
      .finally(() => setCarsLoading(false))
  }, [isOpen, form.pickupDate, form.returnDate, form.pickupTime, form.returnTime])

  // ─── Auto-calculate price when car or rental type changes ───
  useEffect(() => {
    const car = cars.find(c => c.id === form.carId)
    if (!car || !form.totalDays) return

    let rate = car.pricePerDay
    if (form.rentalType === 'longterm' && form.totalDays >= 28) {
      rate = (car.pricePerWeek || car.pricePerDay * 6) / 7 * 0.85 // monthly discount
    } else if (form.rentalType === 'longterm' && form.totalDays >= 7) {
      rate = (car.pricePerWeek || car.pricePerDay * 6) / 7 // weekly rate
    }

    setF('totalPrice', Math.round(rate * form.totalDays))
    setF('selectedCarRate', rate)
  }, [form.carId, form.rentalType, form.totalDays, cars])

  const handleSubmit = async () => {
    if (!form.carId) { setStatus({ type: 'error', msg: 'Please select a vehicle.' }); return }
    if (!form.driverName || !form.driverPhone) { setStatus({ type: 'error', msg: 'Driver name and phone are required.' }); return }

    setLoading(true)
    setStatus(null)
    try {
      await createManualBooking({
        carId: form.carId,
        driverName: form.driverName,
        driverPhone: form.driverPhone,
        driverEmail: form.driverEmail,
        driverLicense: form.driverLicense,
        driverAge: form.driverAge ? Number(form.driverAge) : undefined,
        pickupDate: form.pickupDate + 'T' + form.pickupTime + ':00',
        returnDate: form.returnDate + 'T' + form.returnTime + ':00',
        pickupLocation: form.pickupLocation,
        returnLocation: form.oneWay ? form.returnLocation : form.pickupLocation,
        totalPrice: Number(form.totalPrice),
        totalDays: form.totalDays,
        paymentStatus: form.paymentStatus,
        specialRequests: form.specialRequests,
        internalNotes: form.internalNotes + (form.rentalType !== 'standard' ? ' | Rental Type: ' + form.rentalType.toUpperCase() : ''),
      })
      setStatus({ type: 'success', msg: 'Booking created! Booking reference generated.' })
      setTimeout(() => {
        onSuccess()
        onClose()
        resetForm()
      }, 1800)
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || 'Failed to create booking.' })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setStatus(null)
    setCars([])
    setForm({
      pickupDate: '', pickupTime: '09:00', returnDate: '', returnTime: '09:00',
      pickupLocation: 'SSR International Airport (MRU)', returnLocation: 'SSR International Airport (MRU)',
      oneWay: false, carId: '', rentalType: 'standard',
      driverName: '', driverPhone: '', driverEmail: '', driverLicense: '', driverAge: '',
      totalPrice: 0, paymentStatus: 'PENDING', specialRequests: '', internalNotes: '',
      totalDays: 0, selectedCarRate: 0,
    })
  }

  if (!isOpen) return null

  const selectedCar = cars.find(c => c.id === form.carId)
  const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-[#1E293B] focus:border-[#0D9B84] focus:ring-2 focus:ring-[#0D9B84]/10 outline-none transition-all'
  const labelCls = 'text-[10px] uppercase font-black text-gray-400 tracking-widest'

  const STEPS = [
    { n: 1, label: 'Dates & Location', icon: <Calendar size={14} /> },
    { n: 2, label: 'Vehicle', icon: <Car size={14} /> },
    { n: 3, label: 'Driver Info', icon: <User size={14} /> },
    { n: 4, label: 'Payment', icon: <CreditCard size={14} /> },
  ]

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh]">

        {/* Header */}
        <div className="bg-[#1E293B] text-white p-6 flex-shrink-0">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-black tracking-wide">New Booking</h2>
              <p className="text-sm text-white/60">Walk-in · Phone · Corporate · Long-term</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.n}>
                <button
                  onClick={() => step > s.n && setStep(s.n)}
                  className={[
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                    step === s.n ? 'bg-[#0D9B84] text-white' : step > s.n ? 'bg-white/20 text-white cursor-pointer hover:bg-white/30' : 'bg-white/10 text-white/40 cursor-not-allowed'
                  ].join(' ')}
                >
                  {s.icon} <span className="hidden sm:inline">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <ArrowRight size={12} className="text-white/30 flex-shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50">

          {/* ─── STEP 1: Dates & Location ─── */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Dates & Times */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h3 className="font-black text-[#1E293B] text-sm uppercase tracking-wide flex items-center gap-2">
                  <Calendar size={14} className="text-[#0D9B84]" /> Rental Period
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={labelCls}>Pickup Date *</p>
                    <input type="date" required value={form.pickupDate} onChange={e => setF('pickupDate', e.target.value)} min={new Date().toISOString().split('T')[0]} className={inputCls + ' mt-1'} />
                  </div>
                  <div>
                    <p className={labelCls}>Pickup Time</p>
                    <select value={form.pickupTime} onChange={e => setF('pickupTime', e.target.value)} className={inputCls + ' mt-1'}>
                      {TIME_SLOTS.map(t => <option key={t} value={t}>{t} (Mauritius Time)</option>)}
                    </select>
                  </div>
                  <div>
                    <p className={labelCls}>Return Date *</p>
                    <input type="date" required value={form.returnDate} onChange={e => setF('returnDate', e.target.value)} min={form.pickupDate || new Date().toISOString().split('T')[0]} className={inputCls + ' mt-1'} />
                  </div>
                  <div>
                    <p className={labelCls}>Return Time</p>
                    <select value={form.returnTime} onChange={e => setF('returnTime', e.target.value)} className={inputCls + ' mt-1'}>
                      {TIME_SLOTS.map(t => <option key={t} value={t}>{t} (Mauritius Time)</option>)}
                    </select>
                  </div>
                </div>
                {form.totalDays > 0 && (
                  <div className="bg-[#E1F5EE] rounded-xl p-3 text-center">
                    <p className="text-sm font-black text-[#0D9B84]">
                      {form.totalDays} day{form.totalDays !== 1 ? 's' : ''} rental
                      {form.totalDays >= 28 ? ' — Monthly rate applies' : form.totalDays >= 7 ? ' — Weekly rate applies' : ''}
                    </p>
                  </div>
                )}
              </div>

              {/* Locations */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h3 className="font-black text-[#1E293B] text-sm uppercase tracking-wide flex items-center gap-2">
                  <MapPin size={14} className="text-[#0D9B84]" /> Locations
                </h3>
                <div>
                  <p className={labelCls}>Pickup Location</p>
                  <select value={form.pickupLocation} onChange={e => setF('pickupLocation', e.target.value)} className={inputCls + ' mt-1'}>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setF('oneWay', !form.oneWay)}
                    className={['w-12 h-6 rounded-full transition-colors relative flex-shrink-0', form.oneWay ? 'bg-[#0D9B84]' : 'bg-gray-200'].join(' ')}>
                    <div className={['w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow', form.oneWay ? 'translate-x-6' : 'translate-x-0.5'].join(' ')} />
                  </button>
                  <div>
                    <p className="text-sm font-bold text-[#1E293B]">One-Way Rental</p>
                    <p className="text-xs text-gray-400">Return car at a different location</p>
                  </div>
                </div>
                {form.oneWay && (
                  <div>
                    <p className={labelCls}>Return Location (Different Branch)</p>
                    <select value={form.returnLocation} onChange={e => setF('returnLocation', e.target.value)} className={inputCls + ' mt-1'}>
                      {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {/* Rental Type */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
                <h3 className="font-black text-[#1E293B] text-sm uppercase tracking-wide flex items-center gap-2">
                  <Repeat size={14} className="text-[#0D9B84]" /> Rental Type
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {RENTAL_TYPES.map(rt => (
                    <button key={rt.value} type="button" onClick={() => setF('rentalType', rt.value)}
                      className={['p-3 rounded-xl border-2 text-left transition-all', form.rentalType === rt.value ? 'border-[#0D9B84] bg-[#0D9B84]/5' : 'border-gray-100 hover:border-[#0D9B84]/50'].join(' ')}>
                      <p className={'text-xs font-black uppercase tracking-wide ' + (form.rentalType === rt.value ? 'text-[#0D9B84]' : 'text-[#1E293B]')}>{rt.label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{rt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 2: Vehicle ─── */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h3 className="font-black text-[#1E293B] text-sm uppercase tracking-wide flex items-center gap-2">
                  <Car size={14} className="text-[#0D9B84]" />
                  Available Vehicles
                  {carsLoading && <Loader2 size={14} className="animate-spin text-[#0D9B84]" />}
                  {!carsLoading && cars.length > 0 && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full">{cars.length} available</span>}
                </h3>

                {!form.pickupDate || !form.returnDate ? (
                  <p className="text-sm text-gray-400 p-4 border border-dashed border-gray-200 rounded-xl text-center">Select dates in Step 1 to see real-time availabilty</p>
                ) : carsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 size={24} className="animate-spin text-[#0D9B84]" />
                    <span className="ml-2 text-sm font-bold text-gray-500">Checking live availability...</span>
                  </div>
                ) : cars.length === 0 ? (
                  <p className="text-sm text-red-600 font-bold p-4 border border-red-200 bg-red-50 rounded-xl text-center">No vehicles available for selected dates. Try different dates.</p>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {cars.map((car: any) => {
                      const days = form.totalDays || 1
                      let rate = car.pricePerDay
                      if (form.rentalType === 'longterm' && days >= 28) rate = (car.pricePerWeek || car.pricePerDay * 6) / 7 * 0.85
                      else if (form.rentalType === 'longterm' && days >= 7) rate = (car.pricePerWeek || car.pricePerDay * 6) / 7
                      const total = Math.round(rate * days)
                      return (
                        <div key={car.id} onClick={() => setF('carId', car.id)}
                          className={['p-4 border-2 rounded-2xl cursor-pointer transition-all', form.carId === car.id ? 'border-[#0D9B84] bg-[#0D9B84]/5' : 'border-gray-100 hover:border-[#0D9B84]/50'].join(' ')}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-black text-[#1E293B]">{car.make} {car.model}</p>
                              <p className="text-xs text-gray-500">{car.category} · {car.plateNumber || 'No Plate Assigned'}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-[#1E293B]">MUR {total.toLocaleString()}</p>
                              <p className="text-xs text-gray-400">({days} days × MUR {Math.round(rate)})</p>
                            </div>
                          </div>
                          {form.carId === car.id && (
                            <div className="mt-2 flex items-center gap-1 text-emerald-600 text-xs font-black">
                              <CheckCircle size={12} /> Selected
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── STEP 3: Driver ─── */}
          {step === 3 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="font-black text-[#1E293B] text-sm uppercase tracking-wide flex items-center gap-2">
                <User size={14} className="text-[#0D9B84]" /> Driver Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Full Name *</p>
                  <input type="text" required value={form.driverName} onChange={e => setF('driverName', e.target.value)} placeholder="e.g. John Doe" className={inputCls + ' mt-1'} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest flex items-center gap-1"><Phone size={9} /> Phone *</p>
                  <input type="tel" required value={form.driverPhone} onChange={e => setF('driverPhone', e.target.value)} placeholder="+230 5XXX XXXX" className={inputCls + ' mt-1'} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest flex items-center gap-1"><Mail size={9} /> Email</p>
                  <input type="email" value={form.driverEmail} onChange={e => setF('driverEmail', e.target.value)} placeholder="driver@email.com" className={inputCls + ' mt-1'} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">License Number</p>
                  <input type="text" value={form.driverLicense} onChange={e => setF('driverLicense', e.target.value)} placeholder="License ID" className={inputCls + ' mt-1'} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Driver Age</p>
                  <input type="number" value={form.driverAge} onChange={e => setF('driverAge', e.target.value)} min={18} max={90} placeholder="e.g. 35" className={inputCls + ' mt-1'} />
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest flex items-center gap-1"><FileText size={9} /> Special Requests</p>
                  <textarea rows={2} value={form.specialRequests} onChange={e => setF('specialRequests', e.target.value)} placeholder="e.g. Baby seat needed, hotel delivery at 3pm..." className={inputCls + ' mt-1'} />
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 4: Payment ─── */}
          {step === 4 && (
            <div className="space-y-5">
              {/* Booking Summary */}
              <div className="bg-[#1E293B] rounded-2xl p-6 text-white">
                <p className="text-[10px] uppercase font-black tracking-widest text-white/50 mb-3">Booking Summary</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-white/70">Vehicle</span><span className="font-bold">{selectedCar ? selectedCar.make + ' ' + selectedCar.model : '—'}</span></div>
                  <div className="flex justify-between"><span className="text-white/70">Pickup</span><span className="font-bold">{form.pickupDate} {form.pickupTime}</span></div>
                  <div className="flex justify-between"><span className="text-white/70">Return</span><span className="font-bold">{form.returnDate} {form.returnTime}</span></div>
                  <div className="flex justify-between"><span className="text-white/70">Duration</span><span className="font-bold">{form.totalDays} days</span></div>
                  <div className="flex justify-between"><span className="text-white/70">From</span><span className="font-bold text-xs">{form.pickupLocation}</span></div>
                  {form.oneWay && <div className="flex justify-between"><span className="text-white/70">To</span><span className="font-bold text-xs text-[#0D9B84]">{form.returnLocation}</span></div>}
                  <div className="flex justify-between border-t border-white/10 pt-2 mt-2"><span className="font-black">Total</span><span className="font-black text-xl text-[#0D9B84]">MUR {form.totalPrice.toLocaleString()}</span></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h3 className="font-black text-[#1E293B] text-sm uppercase tracking-wide flex items-center gap-2">
                  <CreditCard size={14} className="text-[#0D9B84]" /> Payment Details
                </h3>
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Agreed Total Price (MUR) — Override if needed</p>
                  <input type="number" value={form.totalPrice} onChange={e => setF('totalPrice', Number(e.target.value))} min={0} className={inputCls + ' mt-1'} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Payment Status</p>
                  <select value={form.paymentStatus} onChange={e => setF('paymentStatus', e.target.value)} className={inputCls + ' mt-1'}>
                    <option value="PENDING">Unpaid — Invoice to follow</option>
                    <option value="PARTIALLY_PAID">Deposit Collected</option>
                    <option value="PAID">Fully Paid</option>
                  </select>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Internal Notes</p>
                  <textarea rows={2} value={form.internalNotes} onChange={e => setF('internalNotes', e.target.value)} placeholder="e.g. Cash deposit collected, customer signed waiver #345..." className={inputCls + ' mt-1'} />
                </div>
              </div>

              {status && (
                <div className={['p-4 rounded-2xl flex items-start gap-3 text-sm font-bold border', status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'].join(' ')}>
                  {status.type === 'success' ? <CheckCircle size={18} className="flex-shrink-0" /> : <AlertCircle size={18} className="flex-shrink-0" />}
                  {status.msg}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-5 border-t border-gray-100 bg-white flex justify-between items-center flex-shrink-0">
          <button onClick={() => step > 1 ? setStep(step - 1) : onClose()} className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 transition-colors">
            {step === 1 ? 'Cancel' : '← Back'}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {STEPS.map(s => (
                <div key={s.n} className={['w-2 h-2 rounded-full transition-colors', step >= s.n ? 'bg-[#0D9B84]' : 'bg-gray-200'].join(' ')} />
              ))}
            </div>
            {step < 4 ? (
              <button
                onClick={() => {
                  if (step === 1 && (!form.pickupDate || !form.returnDate)) { setStatus({ type: 'error', msg: 'Pick-up and return dates are required.' }); return }
                  setStatus(null)
                  setStep(step + 1)
                }}
                className="px-6 py-2.5 rounded-xl bg-[#1E293B] text-white font-black uppercase tracking-widest text-xs hover:bg-[#0D9B84] transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-[#0D9B84] text-white font-black uppercase tracking-widest text-xs hover:bg-[#b08e36] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-[#0D9B84]/30"
              >
                {loading ? <><Loader2 size={14} className="animate-spin" /> Creating...</> : <><CheckCircle size={14} /> Confirm Booking</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
