// prisma/seed.ts
// Car Hire Mauritius — Complete Dummy Data Seed
// Run with: npx prisma db seed

import { PrismaClient, CarCategory, FuelType, Transmission, CarStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Car Hire Mauritius database...')

  // ─── BRANCHES ───────────────────────────────────────────────────────────
  const mainBranch = await prisma.branch.create({
    data: {
      name: 'Port Louis HQ',
      address: 'Sir William Newton Street, Port Louis, Mauritius',
      phone: '+230 211 0000',
      email: 'portlouis@carhiremauritius.com',
    }
  })

  const airportBranch = await prisma.branch.create({
    data: {
      name: 'SSR International Airport',
      address: 'Sir Seewoosagur Ramgoolam International Airport, Plaine Magnien',
      phone: '+230 603 0000',
      email: 'airport@carhiremauritius.com',
    }
  })

  // ─── PICKUP LOCATIONS ────────────────────────────────────────────────────
  await prisma.location.createMany({
    data: [
      { name: 'SSR International Airport', address: 'Plaine Magnien, Mauritius', type: 'airport', lat: -20.4302, lng: 57.6836 },
      { name: 'Port Louis City Centre', address: 'Sir William Newton Street, Port Louis', type: 'city', lat: -20.1609, lng: 57.4991 },
      { name: 'Grand Baie', address: 'Grand Baie, Rivière du Rempart', type: 'city', lat: -20.0122, lng: 57.5832 },
      { name: 'Flic en Flac', address: 'Flic en Flac, Black River', type: 'city', lat: -20.2958, lng: 57.3638 },
      { name: 'Mahébourg', address: 'Mahébourg, Grand Port', type: 'city', lat: -20.4081, lng: 57.7022 },
      { name: 'Belle Mare', address: 'Belle Mare, Flacq', type: 'city', lat: -20.1895, lng: 57.7888 },
      { name: 'Trou aux Biches', address: 'Trou aux Biches, Pamplemousses', type: 'city', lat: -20.0359, lng: 57.5298 },
      { name: 'Port Louis Harbour', address: 'Quay D, Port Louis Harbour', type: 'port', lat: -20.1601, lng: 57.5022 },
    ]
  })

  // ─── ADD-ONS ─────────────────────────────────────────────────────────────
  await prisma.addon.createMany({
    data: [
      { name: 'GPS Navigation', description: 'Portable GPS device with Mauritius maps pre-loaded', icon: 'Navigation', priceType: 'per_day', price: 150, maxQuantity: 1 },
      { name: 'Baby Seat (0–9 kg)', description: 'Infant carrier seat, rear-facing, Group 0+', icon: 'Baby', priceType: 'per_day', price: 200, maxQuantity: 2 },
      { name: 'Child Seat (9–18 kg)', description: 'Forward-facing child seat, Group 1', icon: 'Baby', priceType: 'per_day', price: 200, maxQuantity: 2 },
      { name: 'Booster Seat (15–36 kg)', description: 'Booster seat for children 4–12 years', icon: 'Baby', priceType: 'per_day', price: 150, maxQuantity: 2 },
      { name: 'Additional Driver', description: 'Add a second authorised driver to the policy', icon: 'UserPlus', priceType: 'per_day', price: 250, maxQuantity: 3 },
      { name: 'Full Insurance Cover', description: 'Zero excess, full collision & theft protection', icon: 'Shield', priceType: 'per_day', price: 500, maxQuantity: 1 },
      { name: 'Roadside Assistance Plus', description: '24/7 priority breakdown & towing service', icon: 'Wrench', priceType: 'per_booking', price: 800, maxQuantity: 1 },
      { name: 'Wi-Fi Hotspot Device', description: '4G portable hotspot, unlimited data in Mauritius', icon: 'Wifi', priceType: 'per_day', price: 250, maxQuantity: 1 },
      { name: 'Airport Meet & Greet', description: 'Staff meets you at arrivals with name board', icon: 'PlaneLanding', priceType: 'per_booking', price: 1200, maxQuantity: 1 },
      { name: 'Cooler Box', description: 'Insulated cooler box perfect for beach trips', icon: 'Package', priceType: 'per_day', price: 100, maxQuantity: 1 },
      { name: 'Toll Pass', description: 'Pre-paid toll pass for Mauritius expressways', icon: 'CreditCard', priceType: 'per_booking', price: 300, maxQuantity: 1 },
      { name: 'Snorkelling Kit', description: 'Mask, fins & snorkel for two people', icon: 'Waves', priceType: 'per_booking', price: 600, maxQuantity: 2 },
    ]
  })

  // ─── PRICING RULES ───────────────────────────────────────────────────────
  await prisma.pricingRule.createMany({
    data: [
      // Peak Christmas / New Year
      { name: 'Christmas Peak Season', type: 'seasonal', startDate: new Date('2024-12-20'), endDate: new Date('2025-01-05'), multiplier: 1.45, priority: 10 },
      // July–August peak
      { name: 'Winter European Peak', type: 'seasonal', startDate: new Date('2025-07-01'), endDate: new Date('2025-08-31'), multiplier: 1.30, priority: 9 },
      // Easter
      { name: 'Easter Holiday', type: 'seasonal', startDate: new Date('2025-04-14'), endDate: new Date('2025-04-22'), multiplier: 1.25, priority: 8 },
      // Week+ discount
      { name: '7+ Day Discount', type: 'duration', minDays: 7, maxDays: 13, multiplier: 0.90, priority: 5 },
      { name: '14+ Day Discount', type: 'duration', minDays: 14, maxDays: 30, multiplier: 0.82, priority: 6 },
      // Luxury surge
      { name: 'Luxury Demand Surge', type: 'category', category: 'LUXURY', multiplier: 1.15, priority: 4 },
      { name: 'Sports Demand Surge', type: 'category', category: 'SPORTS', multiplier: 1.20, priority: 4 },
    ]
  })

  // ─── COUPONS ─────────────────────────────────────────────────────────────
  await prisma.coupon.createMany({
    data: [
      { code: 'WELCOME10', type: 'percentage', value: 10, minBookingVal: 1000, maxUses: 500, expiresAt: new Date('2025-12-31') },
      { code: 'SUMMER25', type: 'percentage', value: 25, minBookingVal: 5000, maxUses: 100, expiresAt: new Date('2025-08-31') },
      { code: 'FLAT500', type: 'fixed', value: 500, minBookingVal: 3000, maxUses: 200 },
      { code: 'AIRPORT20', type: 'percentage', value: 20, minBookingVal: 2000, maxUses: 50 },
    ]
  })

  // ─── ADMIN USER ──────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Admin@1234', 12)
  await prisma.user.create({
    data: {
      email: 'admin@carhiremauritius.com',
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date(),
    }
  })

  // ─── 20 CARS ─────────────────────────────────────────────────────────────
  const cars = [
    // ECONOMY (4 cars)
    {
      slug: 'toyota-yaris-2023',
      make: 'Toyota', model: 'Yaris', year: 2023,
      category: CarCategory.ECONOMY,
      seats: 5, doors: 4, luggage: 2,
      fuelType: FuelType.PETROL, transmission: Transmission.AUTOMATIC,
      engineCC: 1000, pricePerDay: 1200, pricePerWeek: 7200, priceDeposit: 5000,
      color: 'White', plateNumber: 'MU-1234-A',
      features: ['Air Conditioning', 'Bluetooth Audio', 'USB Charging', 'Power Steering', 'Central Locking'],
      description: 'The Toyota Yaris is our most popular economy car — fuel-efficient and easy to navigate around Mauritius\'s coastal roads and city traffic.',
      branchId: mainBranch.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800',
    },
    {
      slug: 'suzuki-swift-2023',
      make: 'Suzuki', model: 'Swift', year: 2023,
      category: CarCategory.ECONOMY,
      seats: 5, doors: 4, luggage: 2,
      fuelType: FuelType.PETROL, transmission: Transmission.MANUAL,
      engineCC: 1200, pricePerDay: 1100, pricePerWeek: 6600, priceDeposit: 4500,
      color: 'Red', plateNumber: 'MU-5678-B',
      features: ['Air Conditioning', 'Bluetooth Audio', 'USB Charging', 'Fuel Efficient'],
      description: 'Nimble and fun to drive, the Suzuki Swift handles Mauritius\'s winding mountain roads with ease.',
      branchId: airportBranch.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1597007066704-67bf2068d5b2?w=800',
    },
    {
      slug: 'dacia-sandero-2022',
      make: 'Dacia', model: 'Sandero', year: 2022,
      category: CarCategory.ECONOMY,
      seats: 5, doors: 4, luggage: 2,
      fuelType: FuelType.PETROL, transmission: Transmission.MANUAL,
      engineCC: 900, pricePerDay: 950, pricePerWeek: 5700, priceDeposit: 4000,
      color: 'Blue', plateNumber: 'MU-9012-C',
      features: ['Air Conditioning', 'Power Windows', 'Central Locking'],
      description: 'Affordable and reliable, the Dacia Sandero is perfect for budget-conscious travellers exploring Mauritius.',
      branchId: mainBranch.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
    },
    {
      slug: 'hyundai-i10-2023',
      make: 'Hyundai', model: 'i10', year: 2023,
      category: CarCategory.ECONOMY,
      seats: 4, doors: 4, luggage: 1,
      fuelType: FuelType.PETROL, transmission: Transmission.AUTOMATIC,
      engineCC: 1000, pricePerDay: 1050, pricePerWeek: 6300, priceDeposit: 4000,
      color: 'Silver', plateNumber: 'MU-3456-D',
      features: ['Air Conditioning', 'Bluetooth Audio', 'Reverse Camera'],
      description: 'Compact city car, ideal for couples or solo travellers navigating Port Louis and beach towns.',
      branchId: airportBranch.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800',
    },

    // COMPACT (3 cars)
    {
      slug: 'toyota-corolla-2023',
      make: 'Toyota', model: 'Corolla', year: 2023,
      category: CarCategory.COMPACT,
      seats: 5, doors: 4, luggage: 3,
      fuelType: FuelType.HYBRID, transmission: Transmission.AUTOMATIC,
      engineCC: 1800, pricePerDay: 1800, pricePerWeek: 10800, priceDeposit: 6000,
      color: 'Pearl White', plateNumber: 'MU-7890-E',
      features: ['Air Conditioning', 'Apple CarPlay', 'Android Auto', 'Reverse Camera', 'Lane Assist', 'Hybrid Engine'],
      description: 'The Corolla Hybrid combines Toyota\'s legendary reliability with excellent fuel economy — perfect for island-wide exploration.',
      branchId: mainBranch.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
    },
    {
      slug: 'volkswagen-polo-2022',
      make: 'Volkswagen', model: 'Polo', year: 2022,
      category: CarCategory.COMPACT,
      seats: 5, doors: 4, luggage: 3,
      fuelType: FuelType.PETROL, transmission: Transmission.AUTOMATIC,
      engineCC: 1000, pricePerDay: 1650, pricePerWeek: 9900, priceDeposit: 5500,
      color: 'Graphite Grey', plateNumber: 'MU-2345-F',
      features: ['Air Conditioning', 'Bluetooth Audio', 'Touchscreen', 'Cruise Control', 'Alloy Wheels'],
      description: 'European refinement at an accessible price point. The VW Polo is a premium compact choice.',
      branchId: airportBranch.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
    },
    {
      slug: 'honda-fit-2023',
      make: 'Honda', model: 'Fit', year: 2023,
      category: CarCategory.COMPACT,
      seats: 5, doors: 4, luggage: 3,
      fuelType: FuelType.PETROL, transmission: Transmission.AUTOMATIC,
      engineCC: 1500, pricePerDay: 1500, pricePerWeek: 9000, priceDeposit: 5000,
      color: 'Champagne', plateNumber: 'MU-6789-G',
      features: ['Air Conditioning', 'Bluetooth', 'Magic Seat', 'Excellent Visibility'],
      description: 'The Honda Fit\'s unique Magic Seat system offers surprising cargo flexibility for an island road trip.',
      branchId: mainBranch.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    },

    // MIDSIZE (2 cars)
    {
      slug: 'toyota-camry-2023',
      make: 'Toyota', model: 'Camry', year: 2023,
      category: CarCategory.MIDSIZE,
      seats: 5, doors: 4, luggage: 4,
      fuelType: FuelType.HYBRID, transmission: Transmission.AUTOMATIC,
      engineCC: 2500, pricePerDay: 2800, pricePerWeek: 16800, priceDeposit: 8000,
      color: 'Midnight Black', plateNumber: 'MU-1122-H',
      features: ['Leather Seats', 'Apple CarPlay', 'Android Auto', 'Adaptive Cruise Control', 'Sunroof', 'Wireless Charging', 'Hybrid'],
      description: 'Executive comfort meets fuel efficiency. The Camry Hybrid is ideal for business travellers and families seeking comfort.',
      branchId: mainBranch.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
    },
    {
      slug: 'mazda-6-2022',
      make: 'Mazda', model: '6', year: 2022,
      category: CarCategory.MIDSIZE,
      seats: 5, doors: 4, luggage: 4,
      fuelType: FuelType.PETROL, transmission: Transmission.AUTOMATIC,
      engineCC: 2000, pricePerDay: 2600, pricePerWeek: 15600, priceDeposit: 7500,
      color: 'Soul Red Crystal', plateNumber: 'MU-3344-I',
      features: ['Leather Seats', 'Bose Sound System', 'Heads-Up Display', 'Blind Spot Monitoring', 'Sunroof'],
      description: 'Mazda\'s award-winning design and KODO soul in motion philosophy makes the Mazda 6 a driver\'s delight on Mauritius roads.',
      branchId: airportBranch.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
    },

    // SUV (4 cars)
    {
      slug: 'toyota-rav4-2023',
      make: 'Toyota', model: 'RAV4', year: 2023,
      category: CarCategory.SUV,
      seats: 5, doors: 5, luggage: 5,
      fuelType: FuelType.HYBRID, transmission: Transmission.AUTOMATIC,
      engineCC: 2500, pricePerDay: 3500, pricePerWeek: 21000, priceDeposit: 10000,
      color: 'Jungle Green', plateNumber: 'MU-5566-J',
      features: ['AWD', 'Apple CarPlay', 'Android Auto', 'Panoramic Sunroof', 'Hybrid Engine', 'Adaptive Headlights', 'Power Tailgate'],
      description: 'The RAV4 Hybrid is our bestselling SUV — tackle Mauritius\'s interior highland roads and beach tracks with confidence.',
      branchId: mainBranch.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800',
    },
    {
      slug: 'nissan-qashqai-2022',
      make: 'Nissan', model: 'Qashqai', year: 2022,
      category: CarCategory.SUV,
      seats: 5, doors: 5, luggage: 4,
      fuelType: FuelType.PETROL, transmission: Transmission.AUTOMATIC,
      engineCC: 1300, pricePerDay: 3000, pricePerWeek: 18000, priceDeposit: 9000,
      color: 'Storm Blue', plateNumber: 'MU-7788-K',
      features: ['ProPilot Assist', 'Surround Camera', 'Heated Seats', 'Wireless Apple CarPlay', 'Alloy Wheels'],
      description: 'The Qashqai\'s intelligent driver assistance makes it effortless to explore every corner of Mauritius.',
      branchId: airportBranch.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800',
    },
    {
      slug: 'mitsubishi-outlander-2023',
      make: 'Mitsubishi', model: 'Outlander', year: 2023,
      category: CarCategory.SUV,
      seats: 7, doors: 5, luggage: 5,
      fuelType: FuelType.PETROL, transmission: Transmission.AUTOMATIC,
      engineCC: 2500, pricePerDay: 3800, pricePerWeek: 22800, priceDeposit: 11000,
      color: 'Diamond White', plateNumber: 'MU-9900-L',
      features: ['7 Seats', 'AWD', 'Apple CarPlay', '360° Camera', 'Heated Seats', 'Power Tailgate', 'Rear Entertainment'],
      description: 'Perfect for families — the 7-seat Outlander offers generous space and AWD capability for Mauritius adventures.',
      branchId: mainBranch.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
    },
    {
      slug: 'ford-everest-2022',
      make: 'Ford', model: 'Everest', year: 2022,
      category: CarCategory.SUV,
      seats: 7, doors: 5, luggage: 6,
      fuelType: FuelType.DIESEL, transmission: Transmission.AUTOMATIC,
      engineCC: 2000, pricePerDay: 4200, pricePerWeek: 25200, priceDeposit: 12000,
      color: 'Magnetic Grey', plateNumber: 'MU-1324-M',
      features: ['7 Seats', '4WD', 'SYNC 4 Infotainment', 'Terrain Management System', 'Tow Bar', 'Ambient Lighting'],
      description: 'For true off-road adventures through Mauritius\'s Black River Gorges and highland terrain, the Everest is unmatched.',
      branchId: airportBranch.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=800',
    },

    // LUXURY (4 cars)
    {
      slug: 'mercedes-benz-e-class-2023',
      make: 'Mercedes-Benz', model: 'E-Class', year: 2023,
      category: CarCategory.LUXURY,
      seats: 5, doors: 4, luggage: 4,
      fuelType: FuelType.PETROL, transmission: Transmission.AUTOMATIC,
      engineCC: 2000, pricePerDay: 7500, pricePerWeek: 45000, priceDeposit: 20000,
      color: 'Obsidian Black', plateNumber: 'MU-9988-N',
      features: ['Burmester Sound System', 'MBUX AI Assistant', 'Massage Seats', 'Ambient Lighting 64-colour', 'Driver Assistance Package', 'Panoramic Roof', 'Night Package'],
      description: 'The E-Class redefines first-class travel in Mauritius. Arrive at your resort in absolute elegance with chauffeur-level comfort.',
      branchId: mainBranch.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
    },
    {
      slug: 'bmw-5-series-2023',
      make: 'BMW', model: '5 Series', year: 2023,
      category: CarCategory.LUXURY,
      seats: 5, doors: 4, luggage: 4,
      fuelType: FuelType.PETROL, transmission: Transmission.AUTOMATIC,
      engineCC: 2000, pricePerDay: 8000, pricePerWeek: 48000, priceDeposit: 22000,
      color: 'Alpine White', plateNumber: 'MU-7766-O',
      features: ['iDrive 8 Touchscreen', 'Harman Kardon Sound', 'Gesture Control', 'Heated & Cooled Seats', 'Head-Up Display', 'M Sport Package', 'Reversing Assistant'],
      description: 'The ultimate driving machine on Mauritius\'s coastal highways. The BMW 5 Series delivers driver engagement and executive comfort in equal measure.',
      branchId: airportBranch.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    },
    {
      slug: 'audi-a6-2022',
      make: 'Audi', model: 'A6', year: 2022,
      category: CarCategory.LUXURY,
      seats: 5, doors: 4, luggage: 4,
      fuelType: FuelType.DIESEL, transmission: Transmission.AUTOMATIC,
      engineCC: 3000, pricePerDay: 7800, pricePerWeek: 46800, priceDeposit: 21000,
      color: 'Daytona Grey', plateNumber: 'MU-5544-P',
      features: ['Virtual Cockpit', 'Bang & Olufsen Sound', 'Matrix LED Headlights', 'Quattro AWD', 'Massage Seats', 'Air Suspension', 'Night Vision Assistant'],
      description: 'Understated German luxury at its finest. The Audi A6 combines quattro performance with refined sophistication for discerning guests.',
      branchId: mainBranch.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800',
    },
    {
      slug: 'range-rover-sport-2023',
      make: 'Land Rover', model: 'Range Rover Sport', year: 2023,
      category: CarCategory.LUXURY,
      seats: 5, doors: 5, luggage: 5,
      fuelType: FuelType.PETROL, transmission: Transmission.AUTOMATIC,
      engineCC: 3000, pricePerDay: 12000, pricePerWeek: 72000, priceDeposit: 30000,
      color: 'Firenze Red', plateNumber: 'MU-3322-Q',
      features: ['Meridian Sound 1430W', 'Terrain Response 2', 'Massage Seats', 'Pivi Pro Infotainment', 'Head-Up Display', 'Air Suspension', 'Dynamic Mode', 'Privacy Glass'],
      description: 'The pinnacle of luxury SUV experience. The Range Rover Sport commands every road in Mauritius — from beachside boulevards to highland estates.',
      branchId: airportBranch.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1617654112368-307921291f42?w=800',
    },

    // SPORTS (1 car)
    {
      slug: 'porsche-718-boxster-2022',
      make: 'Porsche', model: '718 Boxster', year: 2022,
      category: CarCategory.SPORTS,
      seats: 2, doors: 2, luggage: 1,
      fuelType: FuelType.PETROL, transmission: Transmission.AUTOMATIC,
      engineCC: 2000, pricePerDay: 15000, pricePerWeek: 90000, priceDeposit: 40000,
      color: 'Shark Blue',  plateNumber: 'MU-1199-R',
      features: ['Sport Chrono Package', 'BOSE Surround Sound', 'Convertible Soft Top', 'Sport Exhaust', 'PASM Suspension', 'Lane Change Assist', 'Carbon Interior'],
      description: 'Experience Mauritius\'s northern coastal road like never before. The 718 Boxster convertible is pure driving emotion under tropical skies.',
      branchId: mainBranch.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800',
    },

    // VAN (1 car)
    {
      slug: 'toyota-hiace-2022',
      make: 'Toyota', model: 'Hiace', year: 2022,
      category: CarCategory.VAN,
      seats: 12, doors: 4, luggage: 8,
      fuelType: FuelType.DIESEL, transmission: Transmission.MANUAL,
      engineCC: 2700, pricePerDay: 4500, pricePerWeek: 27000, priceDeposit: 13000,
      color: 'Glacier White', plateNumber: 'MU-8877-S',
      features: ['12 Passenger Seats', 'Air Conditioning', 'Large Luggage Space', 'Tinted Windows', 'Roof Luggage Rack'],
      description: 'Perfect for group transfers, wedding parties, or corporate events. The Hiace comfortably seats up to 12 passengers across Mauritius.',
      branchId: mainBranch.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1613843439331-2e58a82b2b40?w=800',
    },

    // CONVERTIBLE (1 car)
    {
      slug: 'mazda-mx5-miata-2023',
      make: 'Mazda', model: 'MX-5 Miata', year: 2023,
      category: CarCategory.CONVERTIBLE,
      seats: 2, doors: 2, luggage: 1,
      fuelType: FuelType.PETROL, transmission: Transmission.MANUAL,
      engineCC: 2000, pricePerDay: 5500, pricePerWeek: 33000, priceDeposit: 15000,
      color: 'Racing Orange', plateNumber: 'MU-6655-T',
      features: ['Convertible Soft Top', 'Brembo Brakes', 'Bilstein Suspension', 'Recaro Seats', 'Sport Exhaust'],
      description: 'Sunshine, sea breeze, and open roads — the MX-5 Miata is the most joyful way to experience Mauritius\'s coastline.',
      branchId: airportBranch.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    },
  ]

  for (const carData of cars) {
    const { thumbnailUrl, ...rest } = carData
    await prisma.car.create({
      data: {
        ...rest,
        thumbnailUrl,
        images: {
          create: [
            { url: thumbnailUrl || '', isPrimary: true, order: 0, alt: `${carData.make} ${carData.model} front view` },
          ]
        }
      }
    })
  }

  // ─── DEMO CUSTOMER ───────────────────────────────────────────────────────
  await prisma.user.create({
    data: {
      email: 'demo@customer.com',
      name: 'Sarah Thompson',
      phone: '+44 7700 900123',
      role: 'CUSTOMER',
      emailVerified: new Date(),
      loyaltyPoints: 350,
      isVIP: true,
    }
  })

  console.log('✅ Seeded:')
  console.log('   - 2 branches')
  console.log('   - 8 pickup locations')
  console.log('   - 12 add-ons')
  console.log('   - 7 pricing rules')
  console.log('   - 4 coupons')
  console.log('   - 20 cars across 7 categories')
  console.log('   - 1 admin user + 1 demo customer')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
