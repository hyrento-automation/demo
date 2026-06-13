"use server"

import { unstable_noStore as noStore } from 'next/cache';
import db from '@/src/lib/db'

export async function getPublicCars() {
  noStore();
  try {
    const cars = await db.car.findMany({
      where: { status: 'AVAILABLE' },
      include: {
        images: true,
        branch: { select: { name: true } },
      },
      orderBy: { pricePerDay: 'asc' }
    })

    // Group by make|model|year|branchId — identical units collapse into one card
    const groups = new Map<string, typeof cars>()
    for (const car of cars) {
      const key = `${car.make}|${car.model}|${car.year}|${car.branchId ?? 'none'}`
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(car)
    }

    return Array.from(groups.values()).map(group => {
      const car = group[0] // representative
      return {
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
        tagColor: car.category === 'LUXURY' ? 'bg-gold' : 'bg-blue-500',
        count: group.length,           // total identical units
        branchName: car.branch?.name ?? null,
      }
    })
  } catch (error) {
    console.error("Error fetching public cars:", error)
    return []
  }
}

