# SKILL: Booking Flow & Payment Logic
## Car Hire Mauritius

This skill explains exactly how to implement the booking flow, from search to payment confirmation.

---

## 🔄 BOOKING FLOW SEQUENCE

```
User Input (dates + location)
    ↓
/api/cars/available (server-side availability check)
    ↓
Search Results Page (real pricing shown)
    ↓
Car Detail → Add-ons selection
    ↓
Checkout Step 1: Driver Details
    ↓
Checkout Step 2: Review & Pay
    ↓
Stripe Payment Intent created (/api/payments/intent)
    ↓
Stripe Checkout (client-side Stripe Elements)
    ↓
Stripe Webhook → /api/webhooks/stripe
    ↓
Booking status → CONFIRMED
    ↓
Email sent (Resend) + SMS (Twilio)
    ↓
Confirmation page with PDF download
```

---

## 📦 ZUSTAND BOOKING STORE

```typescript
// store/bookingStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BookingState {
  // Search params
  pickupLocationId: string | null
  returnLocationId: string | null
  pickupDate: Date | null
  returnDate: Date | null
  
  // Selected car
  selectedCarId: string | null
  selectedCarSlug: string | null
  
  // Add-ons
  selectedAddons: Array<{ id: string; quantity: number }>
  
  // Driver info
  driverDetails: {
    name: string
    email: string
    phone: string
    licenseNumber: string
    age: number
  } | null
  
  // Pricing
  pricingBreakdown: PricingBreakdown | null
  couponCode: string | null
  
  // Actions
  setSearch: (params: Partial<BookingState>) => void
  setSelectedCar: (carId: string, slug: string) => void
  toggleAddon: (addonId: string, quantity: number) => void
  setDriverDetails: (details: BookingState['driverDetails']) => void
  setPricing: (pricing: PricingBreakdown) => void
  setCoupon: (code: string | null) => void
  reset: () => void
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      pickupLocationId: null,
      returnLocationId: null,
      pickupDate: null,
      returnDate: null,
      selectedCarId: null,
      selectedCarSlug: null,
      selectedAddons: [],
      driverDetails: null,
      pricingBreakdown: null,
      couponCode: null,
      
      setSearch: (params) => set((state) => ({ ...state, ...params })),
      setSelectedCar: (carId, slug) => set({ selectedCarId: carId, selectedCarSlug: slug }),
      toggleAddon: (addonId, quantity) => set((state) => {
        const existing = state.selectedAddons.find(a => a.id === addonId)
        if (quantity === 0) {
          return { selectedAddons: state.selectedAddons.filter(a => a.id !== addonId) }
        }
        if (existing) {
          return { selectedAddons: state.selectedAddons.map(a => a.id === addonId ? { ...a, quantity } : a) }
        }
        return { selectedAddons: [...state.selectedAddons, { id: addonId, quantity }] }
      }),
      setDriverDetails: (details) => set({ driverDetails: details }),
      setPricing: (pricing) => set({ pricingBreakdown: pricing }),
      setCoupon: (code) => set({ couponCode: code }),
      reset: () => set({ pickupLocationId: null, returnLocationId: null, pickupDate: null, returnDate: null, selectedCarId: null, selectedCarSlug: null, selectedAddons: [], driverDetails: null, pricingBreakdown: null, couponCode: null }),
    }),
    { name: 'chm-booking', partialize: (s) => ({ pickupLocationId: s.pickupLocationId, returnLocationId: s.returnLocationId, pickupDate: s.pickupDate, returnDate: s.returnDate, selectedCarId: s.selectedCarId, selectedCarSlug: s.selectedCarSlug, selectedAddons: s.selectedAddons }) }
  )
)
```

---

## 💳 STRIPE PAYMENT IMPLEMENTATION

### 1. Create Payment Intent (API Route)
```typescript
// app/api/payments/intent/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { calculatePrice } from '@/lib/pricing'
import { getServerSession } from 'next-auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { carId, pickupDate, returnDate, addonIds, couponCode, paymentType } = body

  // Calculate pricing server-side (never trust client)
  const pricing = await calculatePrice({
    carId,
    pickupDate: new Date(pickupDate),
    returnDate: new Date(returnDate),
    addonIds,
    couponCode,
  })

  // Amount in cents (Stripe uses smallest currency unit)
  // Convert MUR to EUR for Stripe (Stripe doesn't support MUR directly)
  const amountInEurCents = Math.round(pricing.totalEUR * 100)
  
  // If "pay deposit" option, charge deposit only
  const chargeAmount = paymentType === 'deposit'
    ? Math.round((pricing.depositAmount / pricing.eurRate) * 100)
    : amountInEurCents

  const paymentIntent = await stripe.paymentIntents.create({
    amount: chargeAmount,
    currency: 'eur',
    metadata: {
      carId,
      pickupDate,
      returnDate,
      totalMUR: pricing.totalPrice.toString(),
      paymentType: paymentType || 'full',
    },
    automatic_payment_methods: { enabled: true },
  })

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    pricing,
  })
}
```

### 2. Stripe Webhook Handler
```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { sendBookingConfirmationEmail } from '@/lib/emails'
import { generateBookingRef } from '@/lib/pricing'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    const { carId, pickupDate, returnDate, totalMUR, paymentType } = pi.metadata

    // Create booking in DB
    const booking = await prisma.booking.create({
      data: {
        bookingRef: generateBookingRef(),
        carId,
        pickupDate: new Date(pickupDate),
        returnDate: new Date(returnDate),
        totalDays: Math.ceil((new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / 86400000),
        pickupLocation: 'SSR International Airport', // from session/metadata
        returnLocation: 'SSR International Airport',
        totalPrice: parseFloat(totalMUR),
        currency: 'MUR',
        status: 'CONFIRMED',
        paymentStatus: paymentType === 'deposit' ? 'PARTIALLY_PAID' : 'PAID',
        payments: {
          create: {
            amount: pi.amount / 100,
            currency: 'eur',
            provider: 'stripe',
            providerTxId: pi.id,
            status: 'PAID',
            type: paymentType || 'full',
          }
        }
      },
      include: { car: true }
    })

    // Increment coupon usage if applicable
    // Send confirmation email
    await sendBookingConfirmationEmail(booking)
  }

  return NextResponse.json({ received: true })
}
```

---

## 📊 AVAILABILITY API

```typescript
// app/api/cars/available/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const pickupDate = new Date(searchParams.get('from')!)
  const returnDate = new Date(searchParams.get('to')!)
  const category = searchParams.get('category')
  const transmission = searchParams.get('transmission')

  // Get all booked car IDs for this date range
  const bookedCarIds = await prisma.booking.findMany({
    where: {
      status: { notIn: ['CANCELLED', 'REFUNDED'] },
      AND: [
        { pickupDate: { lt: returnDate } },
        { returnDate: { gt: pickupDate } },
      ]
    },
    select: { carId: true }
  }).then(b => b.map(b => b.carId))

  // Get available cars
  const cars = await prisma.car.findMany({
    where: {
      id: { notIn: bookedCarIds },
      status: 'AVAILABLE',
      ...(category && { category: category as any }),
      ...(transmission && { transmission: transmission as any }),
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      reviews: { select: { rating: true } },
    }
  })

  return NextResponse.json(cars)
}
```

---

## 🧾 PDF INVOICE GENERATION

```typescript
// lib/generateInvoice.ts
import { renderToBuffer } from '@react-pdf/renderer'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

export async function generateInvoicePDF(booking: BookingWithDetails): Promise<Buffer> {
  const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10 },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1B2D4F' },
    gold: { color: '#C9A84C' },
    table: { marginTop: 20 },
    row: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#eee', paddingVertical: 8 },
    cell: { flex: 1 },
    total: { fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginTop: 20 },
  })

  const InvoiceDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Car Hire Mauritius</Text>
            <Text style={{ color: '#666', marginTop: 4 }}>carh iremauritius.com</Text>
          </View>
          <View>
            <Text style={[styles.gold, { fontSize: 14, fontWeight: 'bold' }]}>INVOICE</Text>
            <Text>Ref: {booking.bookingRef}</Text>
            <Text>Date: {new Date().toLocaleDateString()}</Text>
          </View>
        </View>
        
        {/* Customer details, car details, line items, totals */}
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.cell}>Vehicle</Text>
            <Text style={styles.cell}>{booking.car.make} {booking.car.model}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Rental Period</Text>
            <Text style={styles.cell}>{booking.totalDays} days</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Total (incl. 15% VAT)</Text>
            <Text style={[styles.cell, { fontWeight: 'bold' }]}>MUR {booking.totalPrice.toLocaleString()}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )

  return await renderToBuffer(<InvoiceDocument />)
}
```

---

## ✅ VALIDATION SCHEMAS (Zod)

```typescript
// lib/validations.ts
import { z } from 'zod'

export const SearchSchema = z.object({
  pickupLocationId: z.string().min(1, 'Please select a pickup location'),
  returnLocationId: z.string().min(1, 'Please select a return location'),
  pickupDate: z.date().min(new Date(), 'Pickup date must be in the future'),
  returnDate: z.date(),
}).refine(data => data.returnDate > data.pickupDate, {
  message: 'Return date must be after pickup date',
  path: ['returnDate'],
})

export const CheckoutSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(8, 'Phone number required'),
  licenseNumber: z.string().min(5, 'License number required'),
  age: z.number().min(21, 'Minimum age is 21').max(80, 'Maximum age is 80'),
  termsAccepted: z.boolean().refine(v => v === true, 'You must accept the terms'),
})
```
