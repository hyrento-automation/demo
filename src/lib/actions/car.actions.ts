"use server"

import { unstable_noStore as noStore } from 'next/cache';
import db from '@/src/lib/db'
import { createClient } from '@supabase/supabase-js'

type PublicCar = {
  id: string
  slug: string
  make: string
  model: string
  year: number
  pricePerDay: number
  category: string
  transmission: string
  fuelType: string
  seats: number
  luggage: number
  images: Array<{ url: string }>
}

function formatPublicCars(cars: PublicCar[]) {
  return cars.map(car => ({
    id: car.id,
    slug: car.slug,
    make: car.make,
    model: car.model,
    year: car.year,
    priceDay: car.pricePerDay,
    category: car.category,
    transmission: car.transmission,
    fuel: car.fuelType,
    seats: car.seats,
    luggage: car.luggage,
    img: car.images[0]?.url || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=400&auto=format&fit=crop',
    rating: 4.8,
    reviews: 12,
    tag: car.category === 'LUXURY' ? 'Top Rated' : car.category === 'MINI' ? 'Best Value' : '',
    tagColor: car.category === 'LUXURY' ? 'bg-gold' : 'bg-blue-500'
  }))
}

async function getCarsFromSupabase(): Promise<PublicCar[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) return []

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
  const { data: cars, error: carsError } = await supabase
    .from('Car')
    .select('*')
    .eq('status', 'AVAILABLE')
    .order('pricePerDay', { ascending: true })

  if (carsError || !cars?.length) {
    if (carsError) console.error('Supabase car fallback failed:', carsError.message)
    return []
  }

  const { data: images, error: imagesError } = await supabase
    .from('CarImage')
    .select('carId,url,sortOrder')
    .in('carId', cars.map(car => car.id))
    .order('sortOrder', { ascending: true })

  if (imagesError) console.error('Supabase car image fallback failed:', imagesError.message)

  return cars.map(car => ({
    ...car,
    images: (images || []).filter(image => image.carId === car.id)
  })) as PublicCar[]
}

export async function getPublicCars() {
  noStore();
  try {
    const cars = await db.car.findMany({
      where: { status: 'AVAILABLE' },
      include: {
        images: true
      },
      orderBy: { pricePerDay: 'asc' }
    })
    
    return formatPublicCars(cars)
  } catch (error) {
    console.error("Error fetching public cars:", error)
    return formatPublicCars(await getCarsFromSupabase())
  }
}
