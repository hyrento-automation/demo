import { NextResponse } from 'next/server'
import { getPublicCars } from '@/src/lib/actions/car.actions'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cars = await getPublicCars()
    return NextResponse.json(cars)
  } catch (error) {
    console.error('Error in /api/cars:', error)
    return NextResponse.json([], { status: 500 })
  }
}
