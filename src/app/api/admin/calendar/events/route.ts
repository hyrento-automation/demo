import { NextRequest, NextResponse } from 'next/server'
import db from '@/src/lib/db'

// GET /api/admin/calendar/events?from=2026-04-13&to=2026-04-19
// Returns all cars + their bookings for the date window
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const fromDate = from ? new Date(from) : new Date()
    const toDate = to ? new Date(to) : new Date(fromDate.getTime() + 7 * 24 * 60 * 60 * 1000)

    // Extend window slightly to catch bookings that span the boundary
    toDate.setHours(23, 59, 59, 999)
    fromDate.setHours(0, 0, 0, 0)

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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
