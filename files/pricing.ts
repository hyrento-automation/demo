// lib/pricing.ts
// Car Hire Mauritius — Dynamic Pricing Engine
// ⚠️  SERVER-SIDE ONLY — never import this in client components

import { prisma } from './prisma'
import { CarCategory } from '@prisma/client'

export interface PricingInput {
  carId: string
  pickupDate: Date
  returnDate: Date
  addonIds?: Array<{ id: string; quantity: number }>
  couponCode?: string
}

export interface PricingBreakdown {
  basePricePerDay: number     // MUR
  totalDays: number
  baseTotal: number
  appliedRules: Array<{ name: string; multiplier: number }>
  effectiveMultiplier: number
  priceAfterRules: number
  addonsTotal: number
  addonItems: Array<{ name: string; price: number; quantity: number; days: number }>
  subtotal: number
  couponDiscount: number
  couponCode?: string
  taxRate: number             // 15% VAT in Mauritius
  taxAmount: number
  depositAmount: number
  totalPrice: number
  currency: 'MUR'
  eurRate: number             // live EUR rate (1 EUR ≈ 47 MUR)
  totalEUR: number
}

const TAX_RATE = 0.15          // 15% VAT
const EUR_RATE = 47            // 1 EUR ≈ 47 MUR (update via cron from API)

export async function calculatePrice(input: PricingInput): Promise<PricingBreakdown> {
  const { carId, pickupDate, returnDate, addonIds = [], couponCode } = input

  // 1. Fetch car base price
  const car = await prisma.car.findUniqueOrThrow({
    where: { id: carId },
    select: { pricePerDay: true, pricePerWeek: true, priceDeposit: true, category: true }
  })

  // 2. Calculate total days
  const msPerDay = 1000 * 60 * 60 * 24
  const totalDays = Math.max(1, Math.ceil((returnDate.getTime() - pickupDate.getTime()) / msPerDay))

  // 3. Base rate — use weekly rate if >= 7 days
  let basePricePerDay = car.pricePerDay
  if (totalDays >= 7) {
    basePricePerDay = car.pricePerWeek / 7
  }
  const baseTotal = basePricePerDay * totalDays

  // 4. Fetch all active pricing rules
  const allRules = await prisma.pricingRule.findMany({
    where: { isActive: true },
    orderBy: { priority: 'desc' }
  })

  // 5. Find applicable rules
  const appliedRules: Array<{ name: string; multiplier: number }> = []

  for (const rule of allRules) {
    let applies = false

    if (rule.type === 'seasonal' && rule.startDate && rule.endDate) {
      // Check if any booking day falls in the seasonal window
      const overlap = pickupDate <= rule.endDate && returnDate >= rule.startDate
      if (overlap) applies = true
    }

    if (rule.type === 'duration' && rule.minDays !== null) {
      const withinMin = totalDays >= (rule.minDays ?? 0)
      const withinMax = rule.maxDays ? totalDays <= rule.maxDays : true
      if (withinMin && withinMax) applies = true
    }

    if (rule.type === 'category' && rule.category) {
      if (rule.category === car.category) applies = true
    }

    if (applies) {
      appliedRules.push({ name: rule.name, multiplier: rule.multiplier })
    }
  }

  // 6. Calculate effective multiplier
  // Take highest-priority upward rule + all downward rules stack multiplicatively
  let effectiveMultiplier = 1.0
  const surgeRules = appliedRules.filter(r => r.multiplier > 1)
  const discountRules = appliedRules.filter(r => r.multiplier < 1)

  if (surgeRules.length > 0) {
    // Take only the highest surge (don't double-surge)
    const maxSurge = Math.max(...surgeRules.map(r => r.multiplier))
    effectiveMultiplier *= maxSurge
  }

  for (const rule of discountRules) {
    // Stack discounts multiplicatively
    effectiveMultiplier *= rule.multiplier
  }

  const priceAfterRules = Math.round(baseTotal * effectiveMultiplier)

  // 7. Calculate add-ons
  const addonItems: PricingBreakdown['addonItems'] = []
  let addonsTotal = 0

  if (addonIds.length > 0) {
    const addons = await prisma.addon.findMany({
      where: { id: { in: addonIds.map(a => a.id) }, isActive: true }
    })

    for (const addon of addons) {
      const item = addonIds.find(a => a.id === addon.id)
      const qty = item?.quantity ?? 1
      const days = addon.priceType === 'per_day' ? totalDays : 1
      const linePrice = addon.price * qty * days
      addonItems.push({ name: addon.name, price: addon.price, quantity: qty, days })
      addonsTotal += linePrice
    }
  }

  const subtotal = priceAfterRules + addonsTotal

  // 8. Apply coupon
  let couponDiscount = 0
  let validCouponCode: string | undefined

  if (couponCode) {
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: couponCode.toUpperCase(),
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
        OR: [{ maxUses: null }, { usedCount: { lt: prisma.coupon.fields.maxUses } }],
      }
    })

    if (coupon) {
      const meetsMinimum = !coupon.minBookingVal || subtotal >= coupon.minBookingVal
      if (meetsMinimum) {
        if (coupon.type === 'percentage') {
          couponDiscount = Math.round(subtotal * (coupon.value / 100))
        } else {
          couponDiscount = Math.min(coupon.value, subtotal)
        }
        validCouponCode = coupon.code
      }
    }
  }

  const afterDiscount = subtotal - couponDiscount

  // 9. Tax (15% VAT Mauritius)
  const taxAmount = Math.round(afterDiscount * TAX_RATE)
  const totalPrice = afterDiscount + taxAmount

  return {
    basePricePerDay: Math.round(basePricePerDay),
    totalDays,
    baseTotal: Math.round(baseTotal),
    appliedRules,
    effectiveMultiplier,
    priceAfterRules,
    addonsTotal: Math.round(addonsTotal),
    addonItems,
    subtotal: Math.round(subtotal),
    couponDiscount: Math.round(couponDiscount),
    couponCode: validCouponCode,
    taxRate: TAX_RATE,
    taxAmount,
    depositAmount: Math.round(car.priceDeposit),
    totalPrice: Math.round(totalPrice),
    currency: 'MUR',
    eurRate: EUR_RATE,
    totalEUR: Math.round(totalPrice / EUR_RATE),
  }
}

// ─── Availability check ──────────────────────────────────────────────────────

export async function checkAvailability(
  carId: string,
  pickupDate: Date,
  returnDate: Date,
  excludeBookingId?: string
): Promise<boolean> {
  const conflicting = await prisma.booking.count({
    where: {
      carId,
      status: { notIn: ['CANCELLED', 'REFUNDED'] },
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      AND: [
        { pickupDate: { lt: returnDate } },
        { returnDate: { gt: pickupDate } },
      ]
    }
  })
  return conflicting === 0
}

// ─── Booking ref generator ───────────────────────────────────────────────────

export function generateBookingRef(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(10000 + Math.random() * 90000)
  return `CHM-${year}-${random}`
}
