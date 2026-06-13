import { NextRequest, NextResponse } from 'next/server'
import { getAvailableVehicles } from '@/src/lib/actions/booking.actions'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const pickupDate = searchParams.get('pickupDate') || undefined
  const dropoffDate = searchParams.get('dropoffDate') || undefined

  try {
    const vehicles = await getAvailableVehicles(pickupDate, dropoffDate)
    return NextResponse.json(vehicles)
  } catch (error) {
    console.error('Error in /api/vehicles:', error)
    return NextResponse.json([], { status: 500 })
  }
}
