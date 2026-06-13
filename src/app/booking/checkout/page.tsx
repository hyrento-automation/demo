"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useBookingStore } from '@/src/store/bookingStore'
import BookingLayout from '@/src/components/booking/BookingLayout'
import StripeCheckoutProvider from '@/src/components/booking/StripeCheckoutProvider'
import PaymentForm from '@/src/components/booking/PaymentForm'
import DemoPaymentForm from '@/src/components/booking/DemoPaymentForm'
import { createPublicBooking } from '@/src/lib/actions/booking.actions'
import { ArrowLeft, ArrowRight, Plus, Check, Zap, Loader2, Upload, FileText, X, ShieldCheck, CreditCard, Car } from 'lucide-react'

export default function DriverDetailsPage() {
  const router = useRouter()
  const {
    selectedVehicle,
    setStep,
    setDriverDetails,
    setPaymentMode,
    paymentMode,
    agreedToTerms,
    setAgreedToTerms,
    promoCode,
    setPromoCode,
    setBookingRef,
    searchParams,
    selectedOptions,
    getTotal
  } = useBookingStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isValidated, setIsValidated] = useState(false)

  const [showAdditionalDriver, setShowAdditionalDriver] = useState(false)
  const [showTravelInfo, setShowTravelInfo] = useState(false)

  const [form, setForm] = useState({
    title: 'Mr.',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ageGroup: '30-69',
    country: '',
  })

  // ID Document upload state
  const [licenceFile, setLicenceFile] = useState<File | null>(null)
  const [licencePreview, setLicencePreview] = useState<string | null>(null)
  const [passportFile, setPassportFile] = useState<File | null>(null)
  const [passportPreview, setPassportPreview] = useState<string | null>(null)

  const licenceInputRef = useRef<HTMLInputElement>(null)
  const passportInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setStep(3)
  }, [setStep])

  useEffect(() => {
    if (!selectedVehicle) {
      router.push('/booking')
    }
  }, [selectedVehicle, router])

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'licence' | 'passport'
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isImage = file.type.startsWith('image/')
    const isPDF = file.type === 'application/pdf'

    if (!isImage && !isPDF) {
      setError('Please upload an image (JPG, PNG) or PDF file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.')
      return
    }

    setError(null)

    if (isImage) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const preview = ev.target?.result as string
        if (type === 'licence') {
          setLicenceFile(file)
          setLicencePreview(preview)
        } else {
          setPassportFile(file)
          setPassportPreview(preview)
        }
      }
      reader.readAsDataURL(file)
    } else {
      // PDF — no image preview, just store file
      if (type === 'licence') {
        setLicenceFile(file)
        setLicencePreview('pdf')
      } else {
        setPassportFile(file)
        setPassportPreview('pdf')
      }
    }
  }

  const removeFile = (type: 'licence' | 'passport') => {
    if (type === 'licence') {
      setLicenceFile(null)
      setLicencePreview(null)
      if (licenceInputRef.current) licenceInputRef.current.value = ''
    } else {
      setPassportFile(null)
      setPassportPreview(null)
      if (passportInputRef.current) passportInputRef.current.value = ''
    }
  }

  const handleValidation = () => {
    // Explicit Validation Check
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Please fill in all required fields (First Name, Last Name, Email, Phone) to proceed.")
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.")
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setError(null)
    setIsValidated(true)
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 100)
  }

  const finalizeBooking = async () => {
    if (!selectedVehicle) return
    setLoading(true)

    try {
      setDriverDetails(form)

      // Build document note for the booking
      const docNotes: string[] = []
      if (licenceFile) docNotes.push(`Driving Licence uploaded: ${licenceFile.name}`)
      if (passportFile) docNotes.push(`Passport uploaded: ${passportFile.name}`)

      const payload = {
        vehicleId: selectedVehicle.id,
        pickupDate: searchParams.pickupDate,
        pickupTime: searchParams.pickupTime,
        dropoffDate: searchParams.dropoffDate,
        dropoffTime: searchParams.dropoffTime,
        pickupLocation: searchParams.pickupLocation,
        dropoffLocation: searchParams.dropoffLocation,
        driver: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          title: form.title
        },
        options: selectedOptions.filter((opt: any) => opt.quantity > 0).map((opt: any) => ({
          id: opt.id,
          quantity: opt.quantity
        })),
        totalPrice: getTotal(),
        paymentMode,
        idDocumentNote: docNotes.length > 0 ? docNotes.join('; ') : undefined,
      }

      const res = await createPublicBooking(payload)

      if (res.success && res.bookingRef) {
        setBookingRef(res.bookingRef)
        setStep(4)
        router.push('/booking/confirmation')
      } else {
        setError(res.error || "Failed to create booking. Please try again.")
        setIsValidated(false)
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
      setIsValidated(false)
    } finally {
      setLoading(false)
    }
  }

  if (!selectedVehicle) return null

  const displayAmount = paymentMode === '25%' ? getTotal() * 0.25 : getTotal()
  
  // Decide whether to show actual Stripe or Demo Fake Gateway securely
  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
  const isDemoMode = !stripeKey || stripeKey.includes('placeholder') || stripeKey.trim() === ''

  return (
    <BookingLayout>
      <div className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-sm font-medium">
             ⚠️ {error}
          </div>
        )}
        {/* Main Driver Details */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">
              Main driver details <span className="text-red-500">*</span>
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Guest notice */}
            <p className="text-sm text-gray-600">
              You are checking out as guest. Have and account?{' '}
              <span className="text-[#0D9B84] font-bold cursor-pointer hover:underline">Sign-in</span>
              {' '}Or, login using social media
            </p>

            {/* Social Buttons */}
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-[#1877F2] text-white rounded-lg text-sm font-medium hover:bg-[#166FE5] transition-colors">
                Log in with Facebook
              </button>
              <button className="px-6 py-2.5 bg-[#E8534A] text-white rounded-lg text-sm font-medium hover:bg-[#D64840] transition-colors">
                Login with Gmail
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {/* Row 1: Title, First Name, Last Name */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-[#0D9B84] mb-1.5 block">Title</label>
                  <select
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:border-[#0D9B84] focus:ring-[#0D9B84]"
                  >
                    <option>Mr.</option>
                    <option>Mrs.</option>
                    <option>Ms.</option>
                    <option>Dr.</option>
                  </select>
                </div>
                <div className="col-span-5">
                  <label className="text-xs font-semibold text-[#0D9B84] mb-1.5 block">First Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    placeholder="Enter your first name"
                    className="w-full h-10 px-4 border border-gray-300 rounded-lg text-sm focus:border-[#0D9B84] focus:ring-[#0D9B84]"
                  />
                </div>
                <div className="col-span-5">
                  <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Last Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    placeholder="Enter surname"
                    className="w-full h-10 px-4 border border-gray-300 rounded-lg text-sm focus:border-[#0D9B84] focus:ring-[#0D9B84]"
                  />
                </div>
              </div>

              {/* Row 2: Email, Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#0D9B84] mb-1.5 block">Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Enter your email address"
                    className="w-full h-10 px-4 border border-gray-300 rounded-lg text-sm focus:border-[#0D9B84] focus:ring-[#0D9B84]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#0D9B84] mb-1.5 block">Phone <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Enter your phone number"
                    className="w-full h-10 px-4 border border-gray-300 rounded-lg text-sm focus:border-[#0D9B84] focus:ring-[#0D9B84]"
                  />
                </div>
              </div>

              {/* Row 3: Age Group, Country */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#0D9B84] mb-1.5 block">Age group</label>
                  <div className="flex items-center gap-6 mt-2">
                    {['18-29', '30-69', '70+'].map(age => (
                      <label key={age} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="ageGroup"
                          value={age}
                          checked={form.ageGroup === age}
                          onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}
                          className="text-[#0D9B84] focus:ring-[#0D9B84]"
                        />
                        <span className="text-sm text-gray-600">{age}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#0D9B84] mb-1.5 block">Country</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    placeholder="Country"
                    className="w-full h-10 px-4 border border-gray-300 rounded-lg text-sm focus:border-[#0D9B84] focus:ring-[#0D9B84]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── ID Document Upload Section ─── */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0D9B84]/10 to-[#0D9B84]/5 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0D9B84] flex items-center justify-center">
                <ShieldCheck size={16} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">
                  Identity Verification <span className="text-xs font-normal text-gray-400 ml-1">(optional)</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Upload your ID to speed up verification at pick-up</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-5">
              {/* Driving Licence Upload */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard size={15} className="text-[#0D9B84]" />
                  <label className="text-sm font-semibold text-gray-800">Driving Licence</label>
                </div>

                {!licencePreview ? (
                  <button
                    type="button"
                    onClick={() => licenceInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-3 text-center hover:border-[#0D9B84] hover:bg-[#0D9B84]/5 transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-[#0D9B84]/10 flex items-center justify-center transition-colors">
                      <Upload size={18} className="text-gray-400 group-hover:text-[#0D9B84] transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 group-hover:text-[#0D9B84] transition-colors">Upload Driving Licence</p>
                      <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or PDF · Max 5MB</p>
                    </div>
                  </button>
                ) : (
                  <div className="relative border-2 border-[#0D9B84]/30 rounded-xl overflow-hidden bg-[#0D9B84]/5">
                    {licencePreview === 'pdf' ? (
                      <div className="p-5 flex items-center gap-3">
                        <FileText size={30} className="text-[#0D9B84] flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{licenceFile?.name}</p>
                          <p className="text-xs text-gray-500">PDF Document</p>
                        </div>
                      </div>
                    ) : (
                      <img src={licencePreview} alt="Driving Licence" className="w-full h-32 object-cover" />
                    )}
                    <div className="px-4 py-2 bg-white/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-[#0D9B84]" />
                        <span className="text-xs font-semibold text-[#0D9B84]">Document ready</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile('licence')}
                        className="p-1 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}

                <input
                  ref={licenceInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'licence')}
                />
              </div>

              {/* Passport Upload */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Car size={15} className="text-[#0D9B84]" />
                  <label className="text-sm font-semibold text-gray-800">Passport</label>
                </div>

                {!passportPreview ? (
                  <button
                    type="button"
                    onClick={() => passportInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-3 text-center hover:border-[#0D9B84] hover:bg-[#0D9B84]/5 transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-[#0D9B84]/10 flex items-center justify-center transition-colors">
                      <Upload size={18} className="text-gray-400 group-hover:text-[#0D9B84] transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 group-hover:text-[#0D9B84] transition-colors">Upload Passport</p>
                      <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or PDF · Max 5MB</p>
                    </div>
                  </button>
                ) : (
                  <div className="relative border-2 border-[#0D9B84]/30 rounded-xl overflow-hidden bg-[#0D9B84]/5">
                    {passportPreview === 'pdf' ? (
                      <div className="p-5 flex items-center gap-3">
                        <FileText size={30} className="text-[#0D9B84] flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{passportFile?.name}</p>
                          <p className="text-xs text-gray-500">PDF Document</p>
                        </div>
                      </div>
                    ) : (
                      <img src={passportPreview} alt="Passport" className="w-full h-32 object-cover" />
                    )}
                    <div className="px-4 py-2 bg-white/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-[#0D9B84]" />
                        <span className="text-xs font-semibold text-[#0D9B84]">Document ready</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile('passport')}
                        className="p-1 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}

                <input
                  ref={passportInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'passport')}
                />
              </div>
            </div>

            {(licenceFile || passportFile) && (
              <div className="mt-4 flex items-center gap-2 text-xs text-[#0D9B84] bg-[#0D9B84]/5 px-4 py-2.5 rounded-lg">
                <ShieldCheck size={14} />
                <span className="font-medium">
                  {[licenceFile && 'Driving Licence', passportFile && 'Passport'].filter(Boolean).join(' & ')} uploaded — your identity will be verified before pick-up.
                </span>
              </div>
            )}
          </div>
        </div>
        {/* ─── End ID Document Upload ─── */}

        {/* Additional Driver */}
        <button
          onClick={() => setShowAdditionalDriver(!showAdditionalDriver)}
          className="w-full bg-white rounded-xl border border-gray-200 px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <span className="font-bold text-sm text-gray-900">Additional Driver (optional)</span>
          <Plus size={18} className={`text-gray-400 transition-transform ${showAdditionalDriver ? 'rotate-45' : ''}`} />
        </button>
        {showAdditionalDriver && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">First Name</label>
                <input type="text" placeholder="First name" className="w-full h-10 px-4 border border-gray-300 rounded-lg text-sm focus:border-[#0D9B84] focus:ring-[#0D9B84]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Last Name</label>
                <input type="text" placeholder="Last name" className="w-full h-10 px-4 border border-gray-300 rounded-lg text-sm focus:border-[#0D9B84] focus:ring-[#0D9B84]" />
              </div>
            </div>
          </div>
        )}

        {/* Travel Info */}
        <button
          onClick={() => setShowTravelInfo(!showTravelInfo)}
          className="w-full bg-white rounded-xl border border-gray-200 px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <span className="font-bold text-sm text-gray-900">Travel Info (optional)</span>
          <Plus size={18} className={`text-gray-400 transition-transform ${showTravelInfo ? 'rotate-45' : ''}`} />
        </button>
        {showTravelInfo && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Flight Number</label>
                <input type="text" placeholder="e.g. MK123" className="w-full h-10 px-4 border border-gray-300 rounded-lg text-sm focus:border-[#0D9B84] focus:ring-[#0D9B84]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Arrival Time</label>
                <input type="time" className="w-full h-10 px-4 border border-gray-300 rounded-lg text-sm focus:border-[#0D9B84] focus:ring-[#0D9B84]" />
              </div>
            </div>
          </div>
        )}

        {/* Payment Mode */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-[#0D9B84]/5 px-6 py-3 border-b border-gray-200">
            <h3 className="font-bold text-sm text-gray-900">
              Choose a mode of payment<span className="text-red-500">*</span>{' '}
              <span className="text-xs font-normal text-gray-400">(we accept debit and credit cards)</span>
            </h3>
          </div>
          <div className="p-6">
            <div className="flex gap-4 mb-6">
              {/* 25% Option */}
              <button
                onClick={() => setPaymentMode('25%')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  paymentMode === '25%'
                    ? 'border-[#0D9B84] bg-[#E1F5EE]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMode === '25%' ? 'border-[#0D9B84]' : 'border-gray-300'
                  }`}>
                    {paymentMode === '25%' && <div className="w-2 h-2 rounded-full bg-[#0D9B84]" />}
                  </div>
                  <span className="font-bold text-sm">Pay 25% Now</span>
                  {paymentMode === '25%' && <Check size={14} className="text-[#0D9B84]" />}
                </div>
                <p className="text-xs text-gray-500 ml-6">Partial Payment</p>
              </button>

              {/* 100% Option */}
              <button
                onClick={() => setPaymentMode('100%')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  paymentMode === '100%'
                    ? 'border-[#0D9B84] bg-[#E1F5EE]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    paymentMode === '100%' ? 'border-[#0D9B84]' : 'border-gray-300'
                  }`}>
                    {paymentMode === '100%' && <div className="w-2 h-2 rounded-full bg-[#0D9B84]" />}
                  </div>
                  <span className="font-bold text-sm">Pay 100% Now</span>
                  {paymentMode === '100%' && <Check size={14} className="text-[#0D9B84]" />}
                </div>
                <p className="text-xs text-gray-500 ml-6">Full Payment</p>
              </button>
            </div>

            {/* Promo Code */}
            <div className="flex gap-3">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter Gift Card or Promo code here"
                className="flex-1 h-10 px-4 border border-gray-300 rounded-lg text-sm focus:border-[#0D9B84] focus:ring-[#0D9B84]"
              />
              <button className="px-6 py-2 bg-[#E8534A] text-white rounded-lg text-sm font-medium hover:bg-[#D64840] transition-colors">
                Apply Code
              </button>
            </div>
          </div>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 rounded border-gray-300 text-[#0D9B84] focus:ring-[#0D9B84]"
          />
          <span className="text-xs text-gray-600 leading-relaxed">
            I agree to the <span className="text-[#0D9B84] underline cursor-pointer">Car Hire Terms and Conditions</span>,{' '}
            <span className="text-[#0D9B84] underline cursor-pointer">Booking Terms and Conditions</span> and{' '}
            <span className="text-[#0D9B84] underline cursor-pointer">Privacy policy</span>.
          </span>
        </label>

        {/* Bottom Navigation & Stripe Form */}
        {!isValidated ? (
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => {
                setStep(2)
                router.push('/booking/options')
              }}
              className="flex items-center gap-2 px-8 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <button
              onClick={handleValidation}
              disabled={!agreedToTerms}
              className={`flex items-center gap-2 px-12 py-3 rounded-lg font-medium transition-colors shadow-lg ${
                agreedToTerms && !loading
                  ? 'bg-[#0D9B84] text-white hover:bg-[#00C4A0] shadow-[#0D9B84]/30'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
              }`}
            >
              <ArrowRight size={16} /> Proceed to Payment
            </button>
          </div>
        ) : (
          <div className="mt-8">
            {isDemoMode ? (
              <DemoPaymentForm amount={displayAmount} onSuccess={finalizeBooking} />
            ) : (
              <StripeCheckoutProvider amount={displayAmount}>
                <PaymentForm amount={displayAmount} onSuccess={finalizeBooking} />
              </StripeCheckoutProvider>
            )}
          </div>
        )}

        {/* Urgency */}
        <div className="flex items-center justify-center gap-2 py-3">
          <Zap size={16} className="text-yellow-500" />
          <p className="text-sm font-bold text-gray-900">
            Limited Availability – Get Instant Confirmation!
          </p>
        </div>
      </div>
    </BookingLayout>
  )
}
