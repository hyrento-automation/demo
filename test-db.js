const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function test() {
  console.log("Checking cars...")
  const cars = await prisma.car.findMany()
  console.log(`Found ${cars.length} cars in database.`)
  
  if (cars.length > 0) {
    console.log("First car:", cars[0].make, cars[0].model)
  }
  
  console.log("Checking bookings...")
  const bookings = await prisma.booking.findMany({
    include: { car: true }
  })
  console.log(`Found ${bookings.length} bookings.`)
}

test().finally(() => prisma.$disconnect())
