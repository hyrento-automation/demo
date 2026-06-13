import { NextRequest, NextResponse } from 'next/server'
import db from '@/src/lib/db'
import { revalidatePath } from 'next/cache'
import { BookingStatus, PaymentStatus } from '@prisma/client'

// POST /api/admin/calendar/booking — Create a booking from the calendar
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const pickup = new Date(data.pickupDate)
    const ret = new Date(data.returnDate)
    if (isNaN(pickup.getTime()) || isNaN(ret.getTime())) {
      return NextResponse.json({ error: 'Invalid date values' }, { status: 400 })
    }
    if (ret <= pickup) {
      return NextResponse.json({ error: 'Return date must be after pickup date' }, { status: 400 })
    }
    if (!data.carId) {
      return NextResponse.json({ error: 'A vehicle is required' }, { status: 400 })
    }

    const diffTime = Math.abs(ret.getTime() - pickup.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1

    // Check for overlapping booking
    const overlap = await db.booking.findFirst({
      where: {
        carId: data.carId,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.ACTIVE] },
        pickupDate: { lt: ret },
        returnDate: { gt: pickup },
      },
      select: { id: true, bookingRef: true },
    })
    if (overlap) {
      return NextResponse.json(
        { error: `This vehicle already has an overlapping booking (${overlap.bookingRef}).` },
        { status: 409 }
      )
    }

    const car = await db.car.findUnique({
      where: { id: data.carId },
      select: { pricePerDay: true },
    })
    const totalPrice = data.totalPrice ?? (car ? car.pricePerDay * diffDays : 0)

    const booking = await db.booking.create({
      data: {
        bookingRef: `CAL-${Date.now().toString().slice(-7)}`,
        carId: data.carId,
        pickupDate: pickup,
        returnDate: ret,
        totalDays: diffDays,
        pickupLocation: data.pickupLocation || 'Admin Portal',
        returnLocation: data.returnLocation || data.pickupLocation || 'Admin Portal',
        basePrice: totalPrice,
        totalPrice,
        status: (data.status as BookingStatus) || BookingStatus.CONFIRMED,
        paymentStatus: (data.paymentStatus as PaymentStatus) || PaymentStatus.PENDING,
        driverName: data.driverName || null,
        driverPhone: data.driverPhone || null,
        driverEmail: data.driverEmail || null,
        internalNotes: data.internalNotes || null,
        currency: 'MUR',
      },
    })

    // Log the action
    await db.auditLog.create({
      data: {
        action: 'calendar_booking_created',
        entity: 'Booking',
        entityId: booking.id,
        newData: {
          bookingRef: booking.bookingRef,
          carId: booking.carId,
          pickupDate: booking.pickupDate,
          returnDate: booking.returnDate,
          totalPrice: booking.totalPrice,
        },
      },
    })

    revalidatePath('/admin')
    revalidatePath('/admin/calendar')
    revalidatePath('/admin/bookings')

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error: any) {
    console.error('[Calendar Booking POST Error]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH /api/admin/calendar/booking — Update a booking from the calendar
export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json()
    if (!data.id) return NextResponse.json({ error: 'Booking ID required' }, { status: 400 })

    const existing = await db.booking.findUnique({ where: { id: data.id } })
    if (!existing) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

    const pickup = data.pickupDate ? new Date(data.pickupDate) : existing.pickupDate
    const ret = data.returnDate ? new Date(data.returnDate) : existing.returnDate
    const diffDays = Math.ceil(Math.abs(ret.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)) || 1

    // If car changed, check overlap
    if (data.carId && data.carId !== existing.carId) {
      const overlap = await db.booking.findFirst({
        where: {
          carId: data.carId,
          id: { not: data.id },
          status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.ACTIVE] },
          pickupDate: { lt: ret },
          returnDate: { gt: pickup },
        },
      })
      if (overlap) {
        return NextResponse.json({ error: `Car has a conflicting booking (${overlap.bookingRef}).` }, { status: 409 })
      }
    }

    const updated = await db.booking.update({
      where: { id: data.id },
      data: {
        pickupDate: pickup,
        returnDate: ret,
        totalDays: diffDays,
        carId: data.carId || existing.carId,
        status: (data.status as BookingStatus) || existing.status,
        paymentStatus: (data.paymentStatus as PaymentStatus) || existing.paymentStatus,
        driverName: data.driverName ?? existing.driverName,
        driverPhone: data.driverPhone ?? existing.driverPhone,
        totalPrice: data.totalPrice ?? existing.totalPrice,
        internalNotes: data.internalNotes ?? existing.internalNotes,
      },
    })

    await db.auditLog.create({
      data: {
        action: 'calendar_booking_updated',
        entity: 'Booking',
        entityId: data.id,
        oldData: { pickupDate: existing.pickupDate, returnDate: existing.returnDate, status: existing.status },
        newData: { pickupDate: pickup, returnDate: ret, status: updated.status },
      },
    })

    revalidatePath('/admin/calendar')
    revalidatePath('/admin/bookings')

    return NextResponse.json({ booking: updated })
  } catch (error: any) {
    console.error('[Calendar Booking PATCH Error]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/admin/calendar/booking?id=xxx — Cancel a booking from the calendar
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Booking ID required' }, { status: 400 })

    const booking = await db.booking.findUnique({ where: { id } })
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    if (booking.status === 'CANCELLED') {
      return NextResponse.json({ error: 'Booking is already cancelled' }, { status: 400 })
    }

    const cancelled = await db.booking.update({
      where: { id },
      data: {
        status: BookingStatus.CANCELLED,
        internalNotes: `CANCELLED via Calendar Admin on ${new Date().toISOString()}`,
      },
    })

    // Also set the car back to available
    await db.car.update({
      where: { id: booking.carId },
      data: { status: 'AVAILABLE' },
    })

    await db.auditLog.create({
      data: {
        action: 'calendar_booking_cancelled',
        entity: 'Booking',
        entityId: id,
        oldData: { status: booking.status },
        newData: { status: 'CANCELLED' },
      },
    })

    revalidatePath('/admin/calendar')
    revalidatePath('/admin/bookings')
    revalidatePath('/admin')

    return NextResponse.json({ booking: cancelled })
  } catch (error: any) {
    console.error('[Calendar Booking DELETE Error]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
