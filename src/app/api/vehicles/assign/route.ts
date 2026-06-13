import { NextRequest, NextResponse } from 'next/server'
import { assignAndCheckAvailability } from '@/src/lib/actions/booking.actions'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { make, model, year, branchId, pickupDate, dropoffDate } = body

    if (!make || !model || !year || !pickupDate || !dropoffDate) {
      return NextResponse.json(
        { error: 'Missing required fields: make, model, year, pickupDate, dropoffDate' },
        { status: 400 }
      )
    }

    const result = await assignAndCheckAvailability(
      make,
      model,
      Number(year),
      branchId ?? null,
      pickupDate,
      dropoffDate
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in /api/vehicles/assign:', error)
    return NextResponse.json({ available: 0, carId: null }, { status: 500 })
  }
}
