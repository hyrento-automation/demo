"use server"

import prisma from "@/src/lib/db"
import { BookingStatus, PaymentStatus, CarStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { sendEmail } from "@/src/lib/email"
import { bookingConfirmationTemplate, adminBookingNotificationTemplate } from "@/src/lib/email-templates"
import { createClient } from '@supabase/supabase-js'

async function getAvailableVehiclesFromSupabase(startDate?: string, endDate?: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return []

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  let unavailableCarIds: string[] = []
  if (startDate && endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
      const { data: bookings } = await supabase
        .from('Booking')
        .select('carId')
        .in('status', ['CONFIRMED', 'ACTIVE', 'PENDING'])
        .lt('pickupDate', end.toISOString())
        .gt('returnDate', start.toISOString())
      unavailableCarIds = Array.from(new Set((bookings || []).map(booking => booking.carId)))
    }
  }

  const { data: cars, error } = await supabase
    .from('Car')
    .select('*')
    .eq('status', 'AVAILABLE')
    .order('pricePerDay', { ascending: true })

  if (error || !cars) {
    if (error) console.error('Supabase vehicle fallback failed:', error.message)
    return []
  }

  const availableCars = cars.filter(car => !unavailableCarIds.includes(car.id))
  const { data: images } = availableCars.length
    ? await supabase
        .from('CarImage')
        .select('carId,url,order')
        .in('carId', availableCars.map(car => car.id))
        .order('order', { ascending: true })
    : { data: [] }

  return availableCars.map(car => ({
    id: car.id,
    name: `${car.make} ${car.model}`,
    image: car.thumbnailUrl || images?.find(image => image.carId === car.id)?.url || 'https://images.unsplash.com/photo-1489824904134-891e080c8f67?q=80&w=400&auto=format&fit=crop',
    category: car.category,
    transmission: car.transmission === 'AUTOMATIC' ? 'Automatic' : 'Manual',
    seats: car.seats,
    luggage: car.luggage,
    fuelType: car.fuelType.charAt(0) + car.fuelType.slice(1).toLowerCase(),
    pricePerDay: car.pricePerDay / 40,
    features: car.features,
    available: 5,
  }))
}

type CreateBookingResult =
  | { success: true; bookingRef: string; id: string }
  | { success: false; error: string }

async function createPublicBookingWithSupabase(data: Parameters<typeof createPublicBooking>[0]): Promise<CreateBookingResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Booking service is not configured')

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const now = new Date().toISOString()
  const start = new Date(`${data.pickupDate}T${data.pickupTime}`)
  const end = new Date(`${data.dropoffDate}T${data.dropoffTime}`)
  const totalDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / 86400000) || 1
  const bookingRef = `${process.env.NEXT_PUBLIC_BOOKING_REF_PREFIX || 'CHM'}-2026-${Math.floor(10000 + Math.random() * 90000)}`

  const { data: existingUser, error: userLookupError } = await supabase
    .from('User')
    .select('id,email,name')
    .eq('email', data.driver.email)
    .maybeSingle()
  if (userLookupError) throw userLookupError

  let user = existingUser
  if (!user) {
    const { data: createdUser, error: userCreateError } = await supabase
      .from('User')
      .insert({
        id: crypto.randomUUID(),
        email: data.driver.email,
        name: `${data.driver.firstName} ${data.driver.lastName}`,
        phone: data.driver.phone,
        role: 'CUSTOMER',
        createdAt: now,
        updatedAt: now,
      })
      .select('id,email,name')
      .single()
    if (userCreateError) throw userCreateError
    user = createdUser
  }

  const { data: car, error: carError } = await supabase
    .from('Car')
    .select('id,make,model,pricePerDay')
    .eq('id', data.vehicleId)
    .single()
  if (carError || !car) throw carError || new Error('Vehicle not found')

  const { data: addons, error: addonError } = await supabase
    .from('Addon')
    .select('id,name,price')
    .eq('isActive', true)
  if (addonError) throw addonError

  const bookingId = crypto.randomUUID()
  const { data: booking, error: bookingError } = await supabase
    .from('Booking')
    .insert({
      id: bookingId,
      bookingRef,
      userId: user.id,
      carId: data.vehicleId,
      pickupDate: start.toISOString(),
      returnDate: end.toISOString(),
      totalDays,
      pickupLocation: data.pickupLocation,
      returnLocation: data.dropoffLocation,
      basePrice: car.pricePerDay * totalDays,
      totalPrice: data.totalPrice * 40,
      currency: 'MUR',
      status: 'CONFIRMED',
      paymentStatus: 'PENDING',
      driverName: `${data.driver.title} ${data.driver.firstName} ${data.driver.lastName}`,
      driverEmail: data.driver.email,
      driverPhone: data.driver.phone,
      specialRequests: data.idDocumentNote || null,
      createdAt: now,
      updatedAt: now,
    })
    .select('id,bookingRef')
    .single()
  if (bookingError || !booking) throw bookingError || new Error('Unable to create booking')

  const bookingAddons = data.options.flatMap(option => {
    const addon = (addons || []).find(item =>
      item.name.toLowerCase().includes(option.id.split('-')[0].toLowerCase()) ||
      (option.id === 'accident-protection' && item.name === 'Full Insurance Cover')
    )
    return addon ? [{
      id: crypto.randomUUID(),
      bookingId,
      addonId: addon.id,
      quantity: option.quantity,
      price: addon.price || 0,
    }] : []
  })
  if (bookingAddons.length) {
    const { error } = await supabase.from('BookingAddon').insert(bookingAddons)
    if (error) throw error
  }

  const { error: paymentError } = await supabase.from('Payment').insert({
    id: crypto.randomUUID(),
    bookingId,
    amount: data.totalPrice * 40 * (data.paymentMode === '25%' ? 0.25 : 1),
    currency: 'MUR',
    provider: 'demo',
    status: 'PENDING',
    type: data.paymentMode === '25%' ? 'deposit' : 'full',
    createdAt: now,
  })
  if (paymentError) throw paymentError

  revalidatePath('/admin/bookings')
  return { success: true, bookingRef: booking.bookingRef, id: booking.id }
}

/**
 * Fetches available vehicles for the public booking flow based on dates.
 */
export async function getAvailableVehicles(startDate?: string, endDate?: string) {
  const queryId = Math.random().toString(36).substring(7)
  console.log(`[getAvailableVehicles - ${queryId}] Fetching vehicles. Dates: ${startDate} to ${endDate}`)
  console.time(`[getAvailableVehicles - ${queryId}] Query Execution`)
  try {
    const start = startDate ? new Date(startDate) : null
    const end = endDate ? new Date(endDate) : null

    const overlappingWindow =
      start && end && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())
        ? {
            bookings: {
              none: {
                status: { in: [BookingStatus.CONFIRMED, BookingStatus.ACTIVE, BookingStatus.PENDING] },
                pickupDate: { lt: end },
                returnDate: { gt: start },
              },
            },
          }
        : {}

    const cars = await prisma.car.findMany({
      where: {
        status: "AVAILABLE",
        ...overlappingWindow
      },
      include: {
        images: true
      },
      orderBy: {
        pricePerDay: 'asc'
      }
    })

    console.timeEnd(`[getAvailableVehicles - ${queryId}] Query Execution`)
    console.log(`[getAvailableVehicles - ${queryId}] Found ${cars.length} available vehicles.`)

    return cars.map(car => ({
      id: car.id,
      name: `${car.make} ${car.model}`,
      image: car.thumbnailUrl || car.images?.[0]?.url || 'https://images.unsplash.com/photo-1489824904134-891e080c8f67?q=80&w=400&auto=format&fit=crop',
      category: car.category,
      transmission: car.transmission === 'AUTOMATIC' ? 'Automatic' : 'Manual',
      seats: car.seats,
      luggage: car.luggage,
      fuelType: car.fuelType.charAt(0) + car.fuelType.slice(1).toLowerCase(),
      pricePerDay: car.pricePerDay / 40, // Conversion applied for UI (assuming 1:40 ratio)
      features: car.features,
      available: 5, // Placeholder for fleet count per model
    }))
  } catch (error) {
    console.error("Failed to fetch vehicles:", error)
    return getAvailableVehiclesFromSupabase(startDate, endDate)
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
}): Promise<CreateBookingResult> {
  try {
    // 1. Generate Booking Reference
    const num = Math.floor(10000 + Math.random() * 90000)
    const bookingRef = `${process.env.NEXT_PUBLIC_BOOKING_REF_PREFIX || 'CHM'}-2026-${num}`

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
      to: process.env.ADMIN_NOTIFICATION_EMAIL || 'shouryasaad6@gmail.com',
      subject: `New Booking! ${booking.bookingRef}`,
      html: adminEmailHtml,
    });

    return { success: true, bookingRef: booking.bookingRef, id: booking.id }
  } catch (error: any) {
    console.error("Booking Creation Error:", error)
    try {
      return await createPublicBookingWithSupabase(data)
    } catch (fallbackError) {
      console.error('Supabase booking fallback error:', fallbackError)
      return { success: false, error: 'We could not complete your booking. Please try again or contact our team.' }
    }
  }
}
