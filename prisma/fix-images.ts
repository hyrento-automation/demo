import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Same image map as the original seed
const imageMap: Record<string, { primary: string; secondary: string }> = {
  'Suzuki Ciaz': {
    primary:   'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=800&auto=format&fit=crop',
    secondary: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800&auto=format&fit=crop',
  },
  'Toyota Vitz HYBRID': {
    primary:   'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=800&auto=format&fit=crop',
    secondary: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=800&auto=format&fit=crop',
  },
  'Suzuki Ertiga 7 Seater': {
    primary:   'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop',
    secondary: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
  },
  'Suzuki SPRESSO': {
    primary:   'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop',
    secondary: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop',
  },
  'Suzuki ALTO M/T': {
    primary:   'https://images.unsplash.com/photo-1543465077-db45d34b88a5?q=80&w=800&auto=format&fit=crop',
    secondary: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?q=80&w=800&auto=format&fit=crop',
  },
  'Suzuki Swift': {
    primary:   'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=800&auto=format&fit=crop',
    secondary: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop',
  },
  'Suzuki Avenis 125': {
    primary:   'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop',
    secondary: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
  },
}

const fallback = {
  primary:   'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop',
  secondary: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
}

async function main() {
  console.log('🔍 Fetching all cars...')
  const cars = await prisma.car.findMany({
    include: { images: true }
  })
  console.log(`Found ${cars.length} cars.\n`)

  let fixed = 0

  for (const car of cars) {
    const modelKey = `${car.make} ${car.model}`
    const imgs = imageMap[modelKey] ?? fallback

    // 1. Fix thumbnailUrl
    await prisma.car.update({
      where: { id: car.id },
      data: { thumbnailUrl: imgs.primary }
    })

    // 2. Delete any existing images for this car then recreate both
    await prisma.carImage.deleteMany({ where: { carId: car.id } })
    await prisma.carImage.createMany({
      data: [
        { carId: car.id, url: imgs.primary,   alt: `${car.make} ${car.model} – ${car.color || ''}`, isPrimary: true,  order: 0 },
        { carId: car.id, url: imgs.secondary, alt: `${car.make} ${car.model} side view`,             isPrimary: false, order: 1 },
      ]
    })

    fixed++
    console.log(`   [${fixed}/${cars.length}] ✅ ${car.make} ${car.model} → ${imgs.primary.slice(0, 60)}...`)
  }

  const totalImages = await prisma.carImage.count()
  console.log(`\n🎉 Done! ${fixed} cars updated. Total CarImage records: ${totalImages}`)
}

main()
  .catch(e => { console.error('❌ Error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
