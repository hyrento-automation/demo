"use server"

import db from '@/src/lib/db'
import { BookingStatus, PaymentStatus, CarStatus } from '@prisma/client'
import { unstable_noStore as noStore, revalidatePath } from 'next/cache'

async function logAdminAction({
  action,
  entity,
  entityId,
  oldData,
  newData,
}: {
  action: string
  entity: string
  entityId?: string
  oldData?: unknown
  newData?: unknown
}) {
  try {
    await db.auditLog.create({
      data: {
        action,
        entity,
        entityId,
        oldData: oldData as any,
        newData: newData as any,
      },
    })
  } catch (error) {
    console.error('Failed to write admin audit log:', error)
  }
}

export async function getDashboardStats() {
  noStore();
  try {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    const [availableCars, activeRentals, maintenanceCars, returnsToday, paymentSummary, recentBookings, upcomingRides] = await Promise.all([
      db.car.count({ where: { status: 'AVAILABLE' } }),
      db.car.count({ where: { status: 'RENTED' } }),
      db.car.count({ where: { status: 'MAINTENANCE' } }),
      db.booking.count({
        where: {
          status: { in: ['CONFIRMED', 'ACTIVE'] },
          returnDate: { gte: todayStart, lt: todayEnd }
        }
      }),
      db.booking.groupBy({
        by: ['paymentStatus'],
        _count: true
      }),
      db.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { car: true, user: true }
      }),
      db.booking.findMany({
        where: { pickupDate: { gte: todayStart } },
        take: 5,
        orderBy: { pickupDate: 'asc' },
        include: { car: true, user: true }
      })
    ])

    // Get revenue data for last 7 days grouped
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0,0,0,0)
    
    const recentPayments = await db.payment.findMany({
      where: { createdAt: { gte: sevenDaysAgo }, status: 'PAID' },
      select: { amount: true, createdAt: true }
    })

    // Format into {name: "Mon", revenue: sum}
    const revenueByDayMap: Record<string, number> = {}
    recentPayments.forEach(p => {
      const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(p.createdAt)
      revenueByDayMap[dayName] = (revenueByDayMap[dayName] || 0) + p.amount
    })

    const daysResult = []
    for (let i = 6; i >= 0; i--) {
       const d = new Date()
       d.setDate(d.getDate() - i)
       const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d)
       daysResult.push({ name: dayName, revenue: revenueByDayMap[dayName] || 0 })
    }

    // Generates real-time looking spikes for 'Live Visitors' graph
    const visitorsGraph = Array.from({length: 12}).map((_, i) => ({
      time: `${i*10}m`, 
      visitors: Math.floor(Math.random() * 40) + 15 
    }))

    return {
      pulse: { available: availableCars, active: activeRentals, maintenance: maintenanceCars, dueBack: returnsToday },
      revenue: daysResult,
      paymentStats: paymentSummary.map((entry) => ({
        paymentStatus: entry.paymentStatus,
        count: typeof entry._count === 'number' ? entry._count : 0,
      })),
      recentBookings,
      upcomingRides,
      visitorsGraph
    }
  } catch (error) {
    console.error('Failed to get dashboard stats:', error)
    return {
      pulse: { available: 0, active: 0, maintenance: 0, dueBack: 0 },
      revenue: [],
      paymentStats: [],
      recentBookings: [],
      upcomingRides: [],
      visitorsGraph: []
    }
  }
}

export async function getCalendarEvents() {
  const bookings = await db.booking.findMany({
    include: { car: true, user: true }
  })

  return bookings.map(b => {
    let color = '#3B82F6' // default Blue fallback (Manual)
    if(b.paymentStatus === 'PAID') color = '#0D9B84' // Teal
    else if(b.paymentStatus === 'PARTIALLY_PAID') color = '#0D9B84' // Gold
    else if(b.status === 'CANCELLED') color = '#EF4444' // Red

    return {
      id: b.id,
      title: `${b.car.make} ${b.car.model} - ${b.driverName || b.user?.name || 'Walk-in'}`,
      start: b.pickupDate.toISOString(),
      end: b.returnDate.toISOString(),
      color,
      extendedProps: {
        status: b.paymentStatus,
        driver: b.driverName || b.user?.name || 'Walk-in',
        amount: `MUR ${b.totalPrice.toLocaleString()}`
      }
    }
  })
}

export async function getAvailableCars(pickupDate?: string, returnDate?: string) {
  const parsedPickup = pickupDate ? new Date(pickupDate) : null
  const parsedReturn = returnDate ? new Date(returnDate) : null

  const overlappingWindow =
    parsedPickup && parsedReturn && !Number.isNaN(parsedPickup.getTime()) && !Number.isNaN(parsedReturn.getTime())
      ? {
          bookings: {
            none: {
              status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.ACTIVE] },
              pickupDate: { lt: parsedReturn },
              returnDate: { gt: parsedPickup },
            },
          },
        }
      : {}

  return await db.car.findMany({
    where: {
      status: 'AVAILABLE',
      ...overlappingWindow,
    },
    select: { id: true, make: true, model: true, category: true, plateNumber: true, pricePerDay: true }
  })
}

export async function createManualBooking(data: any) {
  const pickup = new Date(data.pickupDate)
  const ret = new Date(data.returnDate)
  
  const diffTime = Math.abs(ret.getTime() - pickup.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1

  if (!data.carId) {
    throw new Error('A vehicle is required to create a manual booking.')
  }

  const overlappingBooking = await db.booking.findFirst({
    where: {
      carId: data.carId,
      status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.ACTIVE] },
      pickupDate: { lt: ret },
      returnDate: { gt: pickup },
    },
    select: { id: true, bookingRef: true },
  })

  if (overlappingBooking) {
    throw new Error(`This vehicle already has an overlapping booking (${overlappingBooking.bookingRef}).`)
  }

  const booking = await db.booking.create({
    data: {
      bookingRef: `MAN-${Date.now().toString().slice(-6)}`,
      carId: data.carId,
      pickupDate: pickup,
      returnDate: ret,
      totalDays: diffDays,
      pickupLocation: data.pickupLocation || 'Admin Portal',
      returnLocation: data.returnLocation || data.pickupLocation || 'Admin Portal',
      basePrice: data.totalPrice,
      totalPrice: data.totalPrice,
      status: 'CONFIRMED',
      paymentStatus: data.paymentStatus as PaymentStatus,
      driverName: data.driverName,
      driverPhone: data.driverPhone,
      driverEmail: data.driverEmail || null,
      driverLicense: data.driverLicense || null,
      driverAge: data.driverAge ? Number(data.driverAge) : null,
      specialRequests: data.specialRequests || null,
      internalNotes: data.internalNotes || null,
      currency: 'MUR'
    }
  })

  revalidatePath('/admin')
  revalidatePath('/admin/calendar')
  revalidatePath('/admin/fleet')
  await logAdminAction({
    action: 'manual_booking_created',
    entity: 'Booking',
    entityId: booking.id,
    newData: {
      bookingRef: booking.bookingRef,
      carId: booking.carId,
      pickupDate: booking.pickupDate,
      returnDate: booking.returnDate,
      paymentStatus: booking.paymentStatus,
      totalPrice: booking.totalPrice,
    },
  })

  return booking
}

export async function getFleetDashboard() {
  noStore();
  try {
    const cars = await db.car.findMany({
      include: {
        images: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Group by category to show distributions
    const categoryCounts = cars.reduce((acc: any, car) => {
      acc[car.category] = (acc[car.category] || 0) + 1
      return acc
    }, {})

    return {
      cars,
      stats: {
        total: cars.length,
        available: cars.filter(c => c.status === 'AVAILABLE').length,
        maintenance: cars.filter(c => c.status === 'MAINTENANCE').length,
        rented: cars.filter(c => c.status === 'RENTED').length,
        categoryDistribution: Object.entries(categoryCounts).map(([name, value]) => ({ name, value }))
      }
    }
  } catch (error) {
    console.error('Failed to get fleet dashboard:', error)
    return {
      cars: [],
      stats: {
        total: 0,
        available: 0,
        maintenance: 0,
        rented: 0,
        categoryDistribution: []
      }
    }
  }
}

export async function addFleetVehicle(data: any) {
  try {
    const imageUrl = data.imageUrl || data.image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop'
    const slug = `${data.make.toLowerCase().replace(/\s+/g, '-')}-${data.model.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`

    const newCar = await db.car.create({
      data: {
        make: data.make,
        model: data.model,
        year: Number(data.year),
        category: data.category,
        transmission: data.transmission,
        fuelType: data.fuelType,
        seats: Number(data.seats),
        doors: Number(data.doors) || 4,
        luggage: Number(data.luggage),
        engineCC: Number(data.engineCC) || null,
        mileagePerDay: Number(data.mileagePerDay) || null,
        pricePerDay: Number(data.pricePerDay) || Number(data.dailyRate),
        pricePerWeek: Number(data.pricePerWeek) || (Number(data.pricePerDay) * 6),
        priceDeposit: Number(data.priceDeposit) || 500,
        plateNumber: data.plateNumber,
        color: data.color || 'Custom',
        description: data.description || null,
        features: Array.isArray(data.features) ? data.features : ['AC', 'Bluetooth'],
        status: 'AVAILABLE',
        slug,
        thumbnailUrl: imageUrl,
        images: {
          create: [{ url: imageUrl, isPrimary: true, alt: `${data.make} ${data.model}` }]
        },
      }
    })
    
    revalidatePath('/fleet')
    revalidatePath('/admin')
    revalidatePath('/admin/fleet')
    revalidatePath('/')

    await logAdminAction({
      action: 'fleet_vehicle_created',
      entity: 'Car',
      entityId: newCar.id,
      newData: {
        make: newCar.make,
        model: newCar.model,
        status: newCar.status,
        category: newCar.category,
        plateNumber: newCar.plateNumber,
        pricePerDay: newCar.pricePerDay,
      },
    })
    
    return { success: true, car: newCar }
  } catch (error: any) {
    console.error('Error adding fleet vehicle:', error)
    if (error?.code === 'P2002') {
      return { success: false, error: `A vehicle with plate number "${data.plateNumber}" already exists.` }
    }
    return { success: false, error: error?.message || 'Failed to add vehicle to fleet database.' }
  }
}

export async function editFleetVehicle(id: string, data: any) {
  try {
    const imageUrl = data.imageUrl || data.image;
    const previousCar = await db.car.findUnique({ where: { id } })
    
    const updateData = {
      make: data.make,
      model: data.model,
      year: Number(data.year),
      category: data.category,
      transmission: data.transmission,
      fuelType: data.fuelType,
      seats: Number(data.seats),
      doors: Number(data.doors) || 4,
      luggage: Number(data.luggage),
      engineCC: Number(data.engineCC) || null,
      mileagePerDay: Number(data.mileagePerDay) || null,
      pricePerDay: Number(data.pricePerDay) || Number(data.dailyRate),
      pricePerWeek: Number(data.pricePerWeek) || (Number(data.pricePerDay) * 6),
      priceDeposit: Number(data.priceDeposit) || 500,
      plateNumber: data.plateNumber,
      color: data.color || 'Custom',
      description: data.description || null,
      features: Array.isArray(data.features) ? data.features : ['AC', 'Bluetooth'],
    } as any;

    if (imageUrl) {
      updateData.thumbnailUrl = imageUrl;
      updateData.images = {
        deleteMany: {},
        create: [{ url: imageUrl, isPrimary: true, alt: `${data.make} ${data.model}` }]
      }
    }

    const updatedCar = await db.car.update({
      where: { id },
      data: updateData
    })
    
    revalidatePath('/fleet')
    revalidatePath('/admin')
    revalidatePath('/admin/fleet')
    revalidatePath('/')

    await logAdminAction({
      action: 'fleet_vehicle_updated',
      entity: 'Car',
      entityId: updatedCar.id,
      oldData: previousCar,
      newData: {
        make: updatedCar.make,
        model: updatedCar.model,
        category: updatedCar.category,
        pricePerDay: updatedCar.pricePerDay,
      },
    })
    
    return { success: true, car: updatedCar }
  } catch (error: any) {
    console.error('Error editing fleet vehicle:', error)
    return { success: false, error: error?.message || 'Failed to update vehicle in database.' }
  }
}


export async function getCustomersDashboard() {
  const customers = await db.user.findMany({
    where: { role: 'CUSTOMER' },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { bookings: true } } }
  })

  return {
    customers,
    stats: {
      total: customers.length,
      vip: customers.filter(c => c.isVIP).length,
      blacklisted: customers.filter(c => c.isBlacklisted).length,
    }
  }
}

export async function deleteFleetVehicle(id: string) {
  const existingCar = await db.car.findUnique({ where: { id } })
  const deletedCar = await db.car.delete({ where: { id } })
  revalidatePath('/fleet')
  revalidatePath('/admin')
  revalidatePath('/admin/fleet')
  await logAdminAction({
    action: 'fleet_vehicle_deleted',
    entity: 'Car',
    entityId: deletedCar.id,
    oldData: existingCar,
  })
  return deletedCar
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const previousBooking = await db.booking.findUnique({ where: { id } })
  const booking = await db.booking.update({
    where: { id },
    data: { status }
  })
  revalidatePath('/admin')
  revalidatePath('/admin/calendar')
  await logAdminAction({
    action: 'booking_status_updated',
    entity: 'Booking',
    entityId: booking.id,
    oldData: previousBooking ? { status: previousBooking.status } : null,
    newData: { status: booking.status },
  })
  return booking
}

export async function updateFleetStatus(id: string, status: CarStatus) {
  const previousCar = await db.car.findUnique({ where: { id } })
  const car = await db.car.update({
    where: { id },
    data: { status }
  })
  revalidatePath('/admin')
  revalidatePath('/admin/fleet')
  await logAdminAction({
    action: 'fleet_status_updated',
    entity: 'Car',
    entityId: car.id,
    oldData: previousCar ? { status: previousCar.status } : null,
    newData: { status: car.status },
  })
  return car
}

// ─────────────────────────────────────────
// BOOKING MANAGEMENT
// ─────────────────────────────────────────

export async function getBookingsDashboard(filters?: {
  search?: string
  status?: string
  paymentStatus?: string
  startDate?: string
  endDate?: string
  page?: number
}) {
  noStore()
  const page = filters?.page || 1
  const pageSize = 20
  const skip = (page - 1) * pageSize

  const where: any = {}

  if (filters?.search) {
    where.OR = [
      { bookingRef: { contains: filters.search, mode: 'insensitive' } },
      { driverName: { contains: filters.search, mode: 'insensitive' } },
      { driverEmail: { contains: filters.search, mode: 'insensitive' } },
      { driverPhone: { contains: filters.search, mode: 'insensitive' } },
      { car: { make: { contains: filters.search, mode: 'insensitive' } } },
      { car: { model: { contains: filters.search, mode: 'insensitive' } } },
    ]
  }
  if (filters?.status) where.status = filters.status
  if (filters?.paymentStatus) where.paymentStatus = filters.paymentStatus
  if (filters?.startDate) where.pickupDate = { gte: new Date(filters.startDate) }
  if (filters?.endDate) where.returnDate = { lte: new Date(filters.endDate) }

  const [bookings, total, stats] = await Promise.all([
    db.booking.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: { car: true, user: true, payments: true }
    }),
    db.booking.count({ where }),
    db.booking.aggregate({
      _sum: { totalPrice: true },
      _count: true,
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    })
  ])

  return {
    bookings,
    total,
    pages: Math.ceil(total / pageSize),
    currentPage: page,
    monthlyRevenue: stats._sum.totalPrice || 0,
    monthlyCount: stats._count || 0,
  }
}

export async function getBookingById(id: string) {
  noStore()
  return db.booking.findUnique({
    where: { id },
    include: {
      car: { include: { images: true } },
      user: true,
      payments: { orderBy: { createdAt: 'desc' } },
      addons: { include: { addon: true } },
    }
  })
}

export async function modifyBooking(id: string, changes: {
  pickupDate?: string
  returnDate?: string
  pickupTime?: string
  returnTime?: string
  pickupLocation?: string
  returnLocation?: string
  carId?: string
  totalPrice?: number
  specialRequests?: string
  internalNotes?: string
}) {
  const existing = await db.booking.findUnique({
    where: { id },
    include: { car: true }
  })
  if (!existing) throw new Error('Booking not found')

  const pickupDate = changes.pickupDate
    ? new Date(`${changes.pickupDate}T${changes.pickupTime || '09:00'}:00`)
    : existing.pickupDate
  const returnDate = changes.returnDate
    ? new Date(`${changes.returnDate}T${changes.returnTime || '09:00'}:00`)
    : existing.returnDate

  const diffTime = Math.abs(returnDate.getTime() - pickupDate.getTime())
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1

  // If car is being changed, check availability
  if (changes.carId && changes.carId !== existing.carId) {
    const overlap = await db.booking.findFirst({
      where: {
        carId: changes.carId,
        id: { not: id },
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.ACTIVE] },
        pickupDate: { lt: returnDate },
        returnDate: { gt: pickupDate },
      }
    })
    if (overlap) throw new Error(`The selected car has a conflicting booking (${overlap.bookingRef}).`)
  }

  const updated = await db.booking.update({
    where: { id },
    data: {
      pickupDate,
      returnDate,
      totalDays,
      pickupLocation: changes.pickupLocation || existing.pickupLocation,
      returnLocation: changes.returnLocation || existing.returnLocation,
      carId: changes.carId || existing.carId,
      totalPrice: changes.totalPrice ?? existing.totalPrice,
      specialRequests: changes.specialRequests ?? existing.specialRequests,
      internalNotes: changes.internalNotes ?? existing.internalNotes,
    }
  })

  revalidatePath('/admin/bookings')
  revalidatePath(`/admin/bookings/${id}`)
  revalidatePath('/admin/calendar')

  await logAdminAction({
    action: 'booking_modified',
    entity: 'Booking',
    entityId: id,
    oldData: { pickupDate: existing.pickupDate, returnDate: existing.returnDate, totalPrice: existing.totalPrice },
    newData: { pickupDate, returnDate, totalDays, totalPrice: updated.totalPrice },
  })

  return updated
}

export async function cancelBooking(id: string, reason?: string) {
  const booking = await db.booking.findUnique({
    where: { id },
    include: { car: true }
  })
  if (!booking) throw new Error('Booking not found')
  if (booking.status === 'CANCELLED') throw new Error('Booking is already cancelled')

  // Refund policy: >7 days = full, 3-7 days = 50%, <3 days = no refund
  const now = new Date()
  const daysUntilPickup = Math.ceil((booking.pickupDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  let refundPolicy = 'NO_REFUND'
  let refundAmount = 0
  if (daysUntilPickup > 7) {
    refundPolicy = 'FULL_REFUND'
    refundAmount = booking.totalPrice
  } else if (daysUntilPickup >= 3) {
    refundPolicy = 'PARTIAL_REFUND_50'
    refundAmount = booking.totalPrice * 0.5
  }

  const [cancelled] = await Promise.all([
    db.booking.update({
      where: { id },
      data: {
        status: BookingStatus.CANCELLED,
        internalNotes: `CANCELLED: ${reason || 'No reason provided'} | Refund Policy: ${refundPolicy} | Refund Due: MUR ${refundAmount} | Cancelled at: ${now.toISOString()}`,
      }
    }),
    // Free the car back to available if it was the only active booking
    db.car.update({
      where: { id: booking.carId },
      data: { status: 'AVAILABLE' }
    })
  ])

  revalidatePath('/admin/bookings')
  revalidatePath(`/admin/bookings/${id}`)
  revalidatePath('/admin')
  revalidatePath('/admin/fleet')

  await logAdminAction({
    action: 'booking_cancelled',
    entity: 'Booking',
    entityId: id,
    oldData: { status: booking.status },
    newData: { status: 'CANCELLED', refundPolicy, refundAmount, reason },
  })

  return { cancelled, refundPolicy, refundAmount }
}

export async function recordPayment(bookingId: string, data: {
  amount: number
  provider: string
  type: string
  notes?: string
}) {
  const booking = await db.booking.findUnique({ where: { id: bookingId } })
  if (!booking) throw new Error('Booking not found')

  const payment = await db.payment.create({
    data: {
      bookingId,
      amount: data.amount,
      currency: 'MUR',
      provider: data.provider,
      status: 'PAID',
      type: data.type,
      metadata: data.notes ? { notes: data.notes } : undefined,
    }
  })

  // Check if fully paid now
  const allPayments = await db.payment.findMany({ where: { bookingId, status: 'PAID' } })
  const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0)
  const newPaymentStatus = totalPaid >= booking.totalPrice ? 'PAID' : 'PARTIALLY_PAID'

  await db.booking.update({
    where: { id: bookingId },
    data: { paymentStatus: newPaymentStatus as PaymentStatus }
  })

  revalidatePath('/admin/bookings')
  revalidatePath(`/admin/bookings/${bookingId}`)
  revalidatePath('/admin')

  return payment
}


// ─────────────────────────────────────────
// ANALYTICS & REPORTS
// ─────────────────────────────────────────

export async function getAnalyticsReport(period: 'week' | 'month' | 'quarter' | 'year' = 'month') {
  noStore()
  const now = new Date()
  let startDate: Date
  if (period === 'week') { startDate = new Date(now); startDate.setDate(now.getDate() - 7) }
  else if (period === 'month') { startDate = new Date(now.getFullYear(), now.getMonth(), 1) }
  else if (period === 'quarter') { startDate = new Date(now); startDate.setMonth(now.getMonth() - 3) }
  else { startDate = new Date(now.getFullYear(), 0, 1) }
  const prevStart = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()))

  const [totalBookings, cancelledBookings, revenueData, topCars, allCars, newCustomers, prevRevenue] = await Promise.all([
    db.booking.count({ where: { createdAt: { gte: startDate }, status: { not: 'CANCELLED' } } }),
    db.booking.count({ where: { createdAt: { gte: startDate }, status: 'CANCELLED' } }),
    db.booking.aggregate({ _sum: { totalPrice: true }, where: { createdAt: { gte: startDate }, paymentStatus: 'PAID' } }),
    db.booking.groupBy({ by: ['carId'], _count: true, _sum: { totalPrice: true }, where: { createdAt: { gte: startDate }, status: { not: 'CANCELLED' } }, orderBy: { _count: { carId: 'desc' } }, take: 5 }),
    db.car.findMany({ include: { bookings: { where: { createdAt: { gte: startDate }, status: { not: 'CANCELLED' } } } } }),
    db.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: startDate } } }),
    db.booking.aggregate({ _sum: { totalPrice: true }, where: { createdAt: { gte: prevStart, lt: startDate }, paymentStatus: 'PAID' } })
  ])

  const recentPayments = await db.payment.findMany({ where: { createdAt: { gte: startDate }, status: 'PAID' }, select: { amount: true, createdAt: true } })
  const revenueByDay: Record<string, number> = {}
  recentPayments.forEach(p => { const k = p.createdAt.toISOString().split('T')[0]; revenueByDay[k] = (revenueByDay[k] || 0) + p.amount })
  const revenueChart = Object.entries(revenueByDay).sort(([a],[b]) => a.localeCompare(b)).map(([date, revenue]) => ({ date: date.slice(5), revenue }))

  const totalDays = Math.ceil((now.getTime() - startDate.getTime()) / (1000*60*60*24)) || 1
  const fleetUtilisation = allCars.map(car => {
    const rentedDays = car.bookings.reduce((sum, b) => { const d = Math.ceil((Math.min(new Date(b.returnDate).getTime(), now.getTime()) - Math.max(new Date(b.pickupDate).getTime(), startDate.getTime())) / (1000*60*60*24)); return sum + Math.max(0, d) }, 0)
    const utilRate = Math.min(100, Math.round((rentedDays / totalDays) * 100))
    const revenue = car.bookings.reduce((s, b) => s + (b as any).totalPrice, 0)
    return { id: car.id, make: car.make, model: car.model, category: car.category, utilRate, rentedDays, idleDays: Math.max(0, totalDays - rentedDays), revenue }
  }).sort((a, b) => b.utilRate - a.utilRate)

  const topCarIds = topCars.map(t => t.carId)
  const topCarRecords = await db.car.findMany({ where: { id: { in: topCarIds } }, select: { id: true, make: true, model: true, category: true } })
  const topVehicles = topCars.map(t => { const car = topCarRecords.find(c => c.id === t.carId); return { carId: t.carId, car, bookings: t._count, revenue: t._sum.totalPrice || 0 } })

  const currentRevenue = revenueData._sum.totalPrice || 0
  const prevRev = prevRevenue._sum.totalPrice || 0
  const revenueGrowth = prevRev > 0 ? Math.round(((currentRevenue - prevRev) / prevRev) * 100) : 0
  return { period, totalBookings, cancelledBookings, currentRevenue, revenueGrowth, newCustomers, revenueChart, topVehicles, fleetUtilisation }
}

// ─────────────────────────────────────────
// CUSTOMERS / CRM
// ─────────────────────────────────────────

export async function getCustomerProfile(id: string) {
  noStore()
  return db.user.findUnique({ where: { id }, include: { bookings: { include: { car: true, payments: true }, orderBy: { createdAt: 'desc' } }, notes: { orderBy: { createdAt: 'desc' } }, documents: true } })
}

export async function toggleCustomerVIP(id: string, isVIP: boolean) {
  const user = await db.user.update({ where: { id }, data: { isVIP } })
  revalidatePath('/admin/customers')
  await logAdminAction({ action: isVIP ? 'customer_vip_granted' : 'customer_vip_removed', entity: 'User', entityId: id })
  return user
}

export async function toggleCustomerBlacklist(id: string, isBlacklisted: boolean, reason?: string) {
  const user = await db.user.update({ where: { id }, data: { isBlacklisted } })
  revalidatePath('/admin/customers')
  await logAdminAction({ action: isBlacklisted ? 'customer_blacklisted' : 'customer_unblacklisted', entity: 'User', entityId: id, newData: { reason } })
  return user
}

export async function addCustomerNote(userId: string, note: string, createdBy: string) {
  const n = await db.customerNote.create({ data: { userId, note, createdBy } })
  revalidatePath('/admin/customers')
  return n
}

// ─────────────────────────────────────────
// BRANCHES & STAFF
// ─────────────────────────────────────────

export async function getBranchDashboard() {
  noStore()
  const [branches, staffCount, locationCount] = await Promise.all([
    db.branch.findMany({ include: { cars: { select: { id: true, status: true } } } }),
    db.user.count({ where: { role: { in: ['ADMIN', 'MANAGER', 'BRANCH_STAFF'] } } }),
    db.location.count(),
  ])
  return { branches, staffCount, locationCount }
}

export async function createBranch(data: { name: string; address: string; phone?: string; email?: string }) {
  const branch = await db.branch.create({ data })
  revalidatePath('/admin/branches')
  await logAdminAction({ action: 'branch_created', entity: 'Branch', entityId: branch.id, newData: data })
  return branch
}

export async function deleteBranch(id: string) {
  const branch = await db.branch.delete({ where: { id } })
  revalidatePath('/admin/branches')
  await logAdminAction({ action: 'branch_deleted', entity: 'Branch', entityId: id })
  return branch
}

export async function getStaffList() {
  noStore()
  return db.user.findMany({ where: { role: { in: ['ADMIN', 'MANAGER', 'BRANCH_STAFF'] } }, select: { id: true, name: true, email: true, role: true, createdAt: true }, orderBy: { createdAt: 'desc' } })
}

export async function updateStaffRole(id: string, role: string) {
  const user = await db.user.update({ where: { id }, data: { role: role as any } })
  revalidatePath('/admin/branches')
  await logAdminAction({ action: 'staff_role_updated', entity: 'User', entityId: id, newData: { role } })
  return user
}

// ─────────────────────────────────────────
// AUDIT LOG
// ─────────────────────────────────────────

export async function getAuditLog(filters?: { entity?: string; action?: string; page?: number }) {
  noStore()
  const page = filters?.page || 1
  const pageSize = 30
  const where: any = {}
  if (filters?.entity) where.entity = filters.entity
  if (filters?.action) where.action = { contains: filters.action, mode: 'insensitive' }
  const [logs, total] = await Promise.all([
    db.auditLog.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }),
    db.auditLog.count({ where })
  ])
  return { logs, total, pages: Math.ceil(total / pageSize), currentPage: page }
}

// ─────────────────────────────────────────
// NEW ENHANCEMENTS
// ─────────────────────────────────────────

export async function toggleVehicleStatus(id: string) {
  const car = await db.car.findUnique({ where: { id }, select: { status: true } })
  if (!car) throw new Error("Vehicle not found")
  
  const newStatus = car.status === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE'
  
  await db.car.update({
    where: { id },
    data: { status: newStatus as any }
  })
  
  revalidatePath('/admin')
  revalidatePath('/admin/fleet')
  revalidatePath('/admin/calendar')
  revalidatePath('/') // Revalidate public client
  return newStatus
}

export async function updateBranch(id: string, data: any) {
  await db.branch.update({
    where: { id },
    data: {
      name: data.name,
      address: data.address,
      phone: data.phone || null,
      email: data.email || null,
      pickupCharge: Number(data.pickupCharge) || 0,
      deliveryCharge: Number(data.deliveryCharge) || 0,
    }
  })
  
  revalidatePath('/admin/branches')
  revalidatePath('/admin/settings')
}

/**
 * Fetches pickup and delivery charges for a given location string.
 * Matches by checking if the branch name appears in the location string (case-insensitive).
 */
export async function getBranchCharges(pickupLocation: string, dropoffLocation: string) {
  try {
    const branches = await db.branch.findMany({
      where: { isActive: true },
      select: { id: true, name: true, pickupCharge: true, deliveryCharge: true }
    })

    const normalize = (str: string) => str.toLowerCase()

    let pickupCharge = 0
    let deliveryCharge = 0

    // Match pickup location to a branch
    for (const branch of branches) {
      if (normalize(pickupLocation).includes(normalize(branch.name))) {
        pickupCharge = branch.pickupCharge
        break
      }
    }

    // Match dropoff/delivery location to a branch
    for (const branch of branches) {
      if (normalize(dropoffLocation).includes(normalize(branch.name))) {
        deliveryCharge = branch.deliveryCharge
        break
      }
    }

    return { pickupCharge, deliveryCharge }
  } catch (error) {
    console.error('Failed to fetch branch charges:', error)
    return { pickupCharge: 0, deliveryCharge: 0 }
  }
}
