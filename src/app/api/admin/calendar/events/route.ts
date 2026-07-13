import { NextRequest, NextResponse } from 'next/server'
import db from '@/src/lib/db'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// GET /api/admin/calendar/events?from=2026-04-13&to=2026-04-19
// Returns all cars + their bookings for the date window
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const fromDate = from ? new Date(from) : new Date()
  const toDate = to ? new Date(to) : new Date(fromDate.getTime() + 7 * 24 * 60 * 60 * 1000)
  toDate.setHours(23, 59, 59, 999)
  fromDate.setHours(0, 0, 0, 0)

  try {
    const [cars, bookings] = await Promise.all([
      db.car.findMany({
        where: { status: { not: 'RETIRED' } },
        orderBy: [{ status: 'asc' }, { make: 'asc' }],
        select: {
          id: true,
          make: true,
          model: true,
          plateNumber: true,
          category: true,
          status: true,
        },
      }),
      db.booking.findMany({
        where: {
          status: { not: 'CANCELLED' },
          OR: [
            { pickupDate: { gte: fromDate, lte: toDate } },
            { returnDate: { gte: fromDate, lte: toDate } },
            // booking that spans the whole window
            { pickupDate: { lte: fromDate }, returnDate: { gte: toDate } },
          ],
        },
        include: {
          car: { select: { id: true, make: true, model: true } },
          user: { select: { name: true, email: true } },
        },
      }),
    ])

    return NextResponse.json({ cars, bookings })
  } catch (error: any) {
    console.error('[Calendar Events API Error]', error)
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      return NextResponse.json({ error: 'Calendar data is temporarily unavailable.' }, { status: 503 })
    }

    try {
      const supabase = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
      const [{ data: cars, error: carsError }, { data: rawBookings, error: bookingsError }] = await Promise.all([
        supabase
          .from('Car')
          .select('id,make,model,plateNumber,category,status')
          .neq('status', 'RETIRED')
          .order('status', { ascending: true })
          .order('make', { ascending: true }),
        supabase
          .from('Booking')
          .select('*')
          .neq('status', 'CANCELLED')
          .lte('pickupDate', toDate.toISOString())
          .gte('returnDate', fromDate.toISOString()),
      ])
      if (carsError || bookingsError) throw carsError || bookingsError

      const userIds = Array.from(new Set((rawBookings || []).map(booking => booking.userId).filter(Boolean)))
      const carIds = Array.from(new Set((rawBookings || []).map(booking => booking.carId).filter(Boolean)))
      const [{ data: users }, { data: bookingCars }] = await Promise.all([
        userIds.length
          ? supabase.from('User').select('id,name,email').in('id', userIds)
          : Promise.resolve({ data: [] }),
        carIds.length
          ? supabase.from('Car').select('id,make,model').in('id', carIds)
          : Promise.resolve({ data: [] }),
      ])

      const bookings = (rawBookings || []).map(booking => ({
        ...booking,
        user: (users || []).find(user => user.id === booking.userId) || null,
        car: (bookingCars || []).find(car => car.id === booking.carId) || null,
      }))
      return NextResponse.json({ cars: cars || [], bookings })
    } catch (fallbackError) {
      console.error('[Supabase Calendar Fallback Error]', fallbackError)
      return NextResponse.json({ error: 'Calendar data is temporarily unavailable.' }, { status: 503 })
    }
  }
}
