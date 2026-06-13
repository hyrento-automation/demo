import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface BookingVehicle {
  id: string
  name: string
  image: string
  category: string
  transmission: string
  seats: number
  luggage: number
  fuelType: string
  pricePerDay: number
  features: string[]
  available: number
}

export interface BookingOption {
  id: string
  name: string
  description: string
  pricePerDay: number
  priceType: 'per_day' | 'per_unit'
  maxCharge?: number
  quantity: number
}

export interface DriverDetails {
  title: string
  firstName: string
  lastName: string
  email: string
  phone: string
  ageGroup: string
  country: string
}

export interface BookingSearchParams {
  pickupLocation: string
  dropoffLocation: string
  pickupDate: string
  pickupTime: string
  dropoffDate: string
  dropoffTime: string
}

interface BookingState {
  currentStep: number
  searchParams: BookingSearchParams
  selectedVehicle: BookingVehicle | null
  selectedOptions: BookingOption[]
  driverDetails: DriverDetails | null
  additionalDriver: DriverDetails | null
  paymentMode: '25%' | '100%'
  promoCode: string
  agreedToTerms: boolean
  bookingRef: string | null
  pickupCharge: number
  deliveryCharge: number

  // Actions
  setStep: (step: number) => void
  setSearchParams: (params: BookingSearchParams) => void
  setVehicle: (vehicle: BookingVehicle) => void
  updateOption: (optionId: string, quantity: number) => void
  setDriverDetails: (details: DriverDetails) => void
  setAdditionalDriver: (details: DriverDetails | null) => void
  setPaymentMode: (mode: '25%' | '100%') => void
  setPromoCode: (code: string) => void
  setAgreedToTerms: (agreed: boolean) => void
  setBookingRef: (ref: string | null) => void
  setLocationCharges: (pickup: number, delivery: number) => void
  getRentalDays: () => number
  getRentalFee: () => number
  getOptionsTotal: () => number
  getTotal: () => number
  reset: () => void
}

const defaultSearchParams: BookingSearchParams = {
  pickupLocation: 'SSR International Airport, Plaine Magnien, Mauritius',
  dropoffLocation: 'SSR International Airport, Plaine Magnien, Mauritius',
  pickupDate: '2026-06-15',
  pickupTime: '18:30',
  dropoffDate: '2026-06-25',
  dropoffTime: '19:00',
}

const defaultOptions: BookingOption[] = [
  {
    id: 'accident-protection',
    name: 'Accident Protection – Full Coverage',
    description: 'Reduce your liability to zero. Fully refundable if no damage. Maximum charge: 150 euros. Recommended for peace of mind.',
    pricePerDay: 10,
    priceType: 'per_day',
    maxCharge: 150,
    quantity: 0,
  },
  {
    id: 'baby-seat',
    name: 'Baby Seat',
    description: '€5.00/day: we rent Baby seat suitable for baby 0-13 Kg. Maximum amount chargeable will be 30 euros. Meets EU Safety Standards.',
    pricePerDay: 5,
    priceType: 'per_day',
    maxCharge: 30,
    quantity: 0,
  },
  {
    id: 'booster-seat',
    name: 'Booster Seat',
    description: 'Booster Seat on rent for €5.00/day.(7-12 years old). Maximum amount chargeable will be 30 euros. Designed for comfort and safety.',
    pricePerDay: 5,
    priceType: 'per_day',
    maxCharge: 30,
    quantity: 0,
  },
  {
    id: 'child-seat',
    name: 'Child Seat',
    description: '€5.00/day: we rent child seat suitable for child 9-18 Kg. Maximum amount chargeable will be 30 euros. Secure and comfortable for young passengers.',
    pricePerDay: 5,
    priceType: 'per_day',
    maxCharge: 30,
    quantity: 0,
  },
  {
    id: 'sim-card',
    name: 'SIM Card',
    description: '€30.00/unit: Enjoy our Emtel Sim Card 5G Data into your Mobile Phone and get Internet Package including (Unlimited Internet valid for 30 days, unlimited SMS, Rs 200 Airtime calls).',
    pricePerDay: 30,
    priceType: 'per_unit',
    quantity: 0,
  },
]

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
  currentStep: 1,
  searchParams: defaultSearchParams,
  selectedVehicle: null,
  selectedOptions: defaultOptions,
  driverDetails: null,
  additionalDriver: null,
  paymentMode: '25%',
  promoCode: '',
  agreedToTerms: false,
  bookingRef: null,
  pickupCharge: 0,
  deliveryCharge: 0,

  setStep: (step) => set({ currentStep: step }),
  setSearchParams: (params) => set({ searchParams: params }),
  setVehicle: (vehicle) => set({ selectedVehicle: vehicle, currentStep: 2 }),
  
  updateOption: (optionId, quantity) => set((state) => ({
    selectedOptions: state.selectedOptions.map(opt =>
      opt.id === optionId ? { ...opt, quantity: Math.max(0, quantity) } : opt
    ),
  })),

  setDriverDetails: (details) => set({ driverDetails: details }),
  setAdditionalDriver: (details) => set({ additionalDriver: details }),
  setPaymentMode: (mode) => set({ paymentMode: mode }),
  setPromoCode: (code) => set({ promoCode: code }),
  setAgreedToTerms: (agreed) => set({ agreedToTerms: agreed }),
  setBookingRef: (ref) => set({ bookingRef: ref }),
  setLocationCharges: (pickup, delivery) => set({ pickupCharge: pickup, deliveryCharge: delivery }),

  getRentalDays: () => {
    const { searchParams } = get()
    const pickup = new Date(searchParams.pickupDate)
    const dropoff = new Date(searchParams.dropoffDate)
    const diff = Math.ceil((dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(1, diff)
  },

  getRentalFee: () => {
    const { selectedVehicle } = get()
    if (!selectedVehicle) return 0
    return selectedVehicle.pricePerDay * get().getRentalDays()
  },

  getOptionsTotal: () => {
    const { selectedOptions } = get()
    const days = get().getRentalDays()
    return selectedOptions.reduce((total, opt) => {
      if (opt.quantity === 0) return total
      if (opt.priceType === 'per_unit') {
        return total + opt.pricePerDay * opt.quantity
      }
      const rawCost = opt.pricePerDay * days * opt.quantity
      return total + (opt.maxCharge ? Math.min(rawCost, opt.maxCharge * opt.quantity) : rawCost)
    }, 0)
  },

  getTotal: () => {
    const { pickupCharge, deliveryCharge } = get()
    return get().getRentalFee() + get().getOptionsTotal() + pickupCharge + deliveryCharge
  },

  reset: () => set({
    currentStep: 1,
    selectedVehicle: null,
    selectedOptions: defaultOptions,
    driverDetails: null,
    additionalDriver: null,
    paymentMode: '25%',
    promoCode: '',
    agreedToTerms: false,
    bookingRef: null,
    pickupCharge: 0,
    deliveryCharge: 0,
  }),
    }),
    {
      name: 'car-hire-booking',
      partialize: (state) => ({
        searchParams: state.searchParams,
        selectedVehicle: state.selectedVehicle,
        selectedOptions: state.selectedOptions,
        driverDetails: state.driverDetails,
        currentStep: state.currentStep,
        pickupCharge: state.pickupCharge,
        deliveryCharge: state.deliveryCharge,
      }),
    }
  )
)
