"use server"

import prisma from "@/src/lib/db"
import { BookingStatus, PaymentStatus, CarStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { sendEmail } from "@/src/lib/email"
import { bookingConfirmationTemplate, adminBookingNotificationTemplate } from "@/src/lib/email-templates"

/**
 * Checks how many units of a specific car group are free for the given date range,
 * and returns the id of the first free unit (for assignment at booking time).
 * Called by /api/vehicles/assign when a user clicks "Select This Car".
 */
export async function assignAndCheckAvailability(
  make: string,
  model: string,
  year: number,
  branchId: string | null,
  startDate: string,
  endDate: string
): Promise<{ available: number; carId: string | null }> {
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Find all AVAILABLE cars in this group that have no overlapping active booking
    const freeCars = await prisma.car.findMany({
      where: {
        make,
        model,
        year,
        branchId: branchId ?? undefined,
        status: 'AVAILABLE',
        bookings: {
          none: {
            status: { in: [BookingStatus.CONFIRMED, BookingStatus.ACTIVE, BookingStatus.PENDING] },
            pickupDate: { lt: end },
            returnDate: { gt: start },
          },
        },
      },
      select: { id: true },
      orderBy: { createdAt: 'asc' }, // deterministic assignment order
    })

    return {
      available: freeCars.length,
      carId: freeCars[0]?.id ?? null,
    }
  } catch (error) {
    console.error('assignAndCheckAvailability error:', error)
    return { available: 0, carId: null }
  }
}

/**
 * Fetches available vehicles for the public booking flow based on dates.
 * Groups identical cars (same make/model/year/branch) into a single result,
 * showing real available count and a representative car id for display.
 */
export async function getAvailableVehicles(startDate?: string, endDate?: string) {
  const queryId = Math.random().toString(36).substring(7)
  console.log(`[getAvailableVehicles - ${queryId}] Fetching grouped vehicles. Dates: ${startDate} to ${endDate}`)
  console.time(`[getAvailableVehicles - ${queryId}] Query Execution`)
  try {
    const start = startDate ? new Date(startDate) : null
    const end = endDate ? new Date(endDate) : null
    const datesValid = start && end && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())

    // Fetch all AVAILABLE cars with their bookings (for overlap check) and branch info
    const cars = await prisma.car.findMany({
      where: { status: 'AVAILABLE' },
      include: {
        images: true,
        branch: { select: { id: true, name: true } },
        bookings: datesValid
          ? {
              where: {
                status: { in: [BookingStatus.CONFIRMED, BookingStatus.ACTIVE, BookingStatus.PENDING] },
                pickupDate: { lt: end! },
                returnDate: { gt: start! },
              },
              select: { id: true },
            }
          : false,
      },
      orderBy: { pricePerDay: 'asc' },
    })

    console.timeEnd(`[getAvailableVehicles - ${queryId}] Query Execution`)
    console.log(`[getAvailableVehicles - ${queryId}] Found ${cars.length} raw AVAILABLE cars — grouping...`)

    // Group by make|model|year|branchId
    const groups = new Map<string, typeof cars>()
    for (const car of cars) {
      const key = `${car.make}|${car.model}|${car.year}|${car.branchId ?? 'none'}`
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(car)
    }

    const results = []
    for (const [groupKey, groupCars] of Array.from(groups.entries())) {
      // Free cars = those with no overlapping booking in the date range
      const freeCars = datesValid
        ? groupCars.filter((c: any) => c.bookings?.length === 0)
        : groupCars

      const representative = freeCars[0] ?? groupCars[0]

      results.push({
        // Group identity (used by assign endpoint)
        groupKey,
        make: representative.make,
        model: representative.model,
        year: representative.year,
        branchId: representative.branchId ?? null,
        branchName: representative.branch?.name ?? null,

        // Display fields (from representative car)
        id: representative.id, // representative id for display/fallback
        name: `${representative.make} ${representative.model}`,
        image: representative.thumbnailUrl || representative.images?.[0]?.url || 'https://images.unsplash.com/photo-1489824904134-891e080c8f67?q=80&w=400&auto=format&fit=crop',
        category: representative.category,
        transmission: representative.transmission === 'AUTOMATIC' ? 'Automatic' : 'Manual',
        seats: representative.seats,
        luggage: representative.luggage,
        fuelType: representative.fuelType.charAt(0) + representative.fuelType.slice(1).toLowerCase(),
        pricePerDay: representative.pricePerDay / 40, // 1:40 MUR→display ratio
        features: representative.features,

        // Availability
        totalUnits: groupCars.length,
        available: freeCars.length,
      })
    }

    // Sort: most available first, then by price
    results.sort((a, b) => b.available - a.available || a.pricePerDay - b.pricePerDay)

    console.log(`[getAvailableVehicles - ${queryId}] Returning ${results.length} grouped results.`)
    return results
  } catch (error) {
    console.error('Failed to fetch vehicles:', error)
    return []
  }
}

/**
 * Creates a new booking from the public checkout flow.
 */
export async function createPublicBooking(data: {
  vehicleId: string
  pickupDate: string
  pickupTime: string
  dropoffDate: string
  dropoffTime: string
  pickupLocation: string
  dropoffLocation: string
  driver: {
    firstName: string
    lastName: string
    email: string
    phone: string
    title: string
  }
  options: Array<{ id: string; quantity: number }>
  totalPrice: number
  paymentMode: string
  idDocumentNote?: string
}) {
  try {
    // 1. Generate Booking Reference
    const num = Math.floor(10000 + Math.random() * 90000)
    const bookingRef = `${process.env.NEXT_PUBLIC_BOOKING_REF_PREFIX || 'PDL'}-2026-${num}`

    // 2. Determine rental days
    const start = new Date(`${data.pickupDate}T${data.pickupTime}`)
    const end = new Date(`${data.dropoffDate}T${data.dropoffTime}`)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1

    // 3. Find or Create User (Customer)
    let user = await prisma.user.findUnique({
      where: { email: data.driver.email }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: data.driver.email,
          name: `${data.driver.firstName} ${data.driver.lastName}`,
          phone: data.driver.phone,
          role: 'CUSTOMER'
        }
      })
    }

    // 4. Find Car and fetch real Addon records
    const car = await prisma.car.findUnique({ where: { id: data.vehicleId } })
    if (!car) throw new Error("Vehicle not found")

    const dbAddons = await prisma.addon.findMany({
      where: { isActive: true }
    })

    // 5. Create the Booking
    const booking = await prisma.booking.create({
      data: {
        bookingRef,
        userId: user.id,
        carId: data.vehicleId,
        pickupDate: start,
        returnDate: end,
        totalDays,
        pickupLocation: data.pickupLocation,
        returnLocation: data.dropoffLocation,
        basePrice: car.pricePerDay * totalDays,
        totalPrice: data.totalPrice * 40,
        currency: "MUR",
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PENDING,
        driverName: `${data.driver.title} ${data.driver.firstName} ${data.driver.lastName}`,
        driverEmail: data.driver.email,
        driverPhone: data.driver.phone,
        specialRequests: data.idDocumentNote || null,
        addons: {
          create: data.options
            .map(opt => {
              const dbAddon = dbAddons.find(a => 
                a.name.toLowerCase().includes(opt.id.split('-')[0].toLowerCase()) ||
                (opt.id === 'accident-protection' && a.name === 'Full Insurance Cover')
              )
              if (!dbAddon) {
                console.warn(`Addon not found in database for ID: ${opt.id}`)
                return null
              }
              return {
                addonId: dbAddon.id,
                quantity: opt.quantity,
                price: dbAddon.price || 0
              }
            })
            .filter((item): item is { addonId: string; quantity: number; price: number } => item !== null)
        }
      }
    })

    // 6. Record initial payment intent
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: data.paymentMode === '25%' ? (data.totalPrice * 40 * 0.25) : (data.totalPrice * 40),
        provider: 'stripe',
        status: PaymentStatus.PENDING,
        type: data.paymentMode === '25%' ? 'deposit' : 'full',
      }
    })

    revalidatePath('/admin/bookings')
    
    // Send Booking Confirmation Email Instantly
    if (user.email) {
      const emailHtml = bookingConfirmationTemplate(
        user.name || 'Customer',
        booking.bookingRef,
        `${car.make} ${car.model}`,
        start.toLocaleString(),
        end.toLocaleString()
      );
      
      await sendEmail({
        to: user.email,
        subject: `Booking Confirmed: ${booking.bookingRef}`,
        html: emailHtml,
      });
    }

    // Send Admin Notification Email
    const adminEmailHtml = adminBookingNotificationTemplate(
      booking.bookingRef,
      `${data.driver.title} ${data.driver.firstName} ${data.driver.lastName}`,
      data.driver.email,
      data.driver.phone,
      `${car.make} ${car.model}`,
      start.toLocaleString(),
      end.toLocaleString(),
      data.totalPrice * 40
    );

    await sendEmail({
      to: process.env.ADMIN_NOTIFICATION_EMAIL || 'pleasuredriveltd@gmail.com',
      subject: `New Booking! ${booking.bookingRef}`,
      html: adminEmailHtml,
    });

    return { success: true, bookingRef: booking.bookingRef, id: booking.id }
  } catch (error: any) {
    console.error("Booking Creation Error:", error)
    return { success: false, error: error.message }
  }
}
