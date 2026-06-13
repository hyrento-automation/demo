const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const BRANCH_ID = 'branch-seed-001'
const BRANCH_B = 'branch-seed-002'

const cats = ['MINI','ECONOMY','COMPACT','MIDSIZE','SUV','LUXURY','SPORTS','VAN','PICKUP','CONVERTIBLE']

const carTemplates = {
  MINI: [
    { make:'Kia', model:'Picanto', year:2023, price:800, week:4800, deposit:3000, plate:'MU-MN1', color:'White', fuel:'PETROL', trans:'AUTOMATIC', cc:1000, seats:4, doors:5, bags:1, img:'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800' },
    { make:'Hyundai', model:'i10', year:2022, price:750, week:4500, deposit:3000, plate:'MU-MN2', color:'Silver', fuel:'PETROL', trans:'MANUAL', cc:1000, seats:4, doors:5, bags:1, img:'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800' },
    { make:'Fiat', model:'500', year:2023, price:900, week:5400, deposit:3500, plate:'MU-MN3', color:'Red', fuel:'PETROL', trans:'AUTOMATIC', cc:1200, seats:4, doors:3, bags:1, img:'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800' },
    { make:'Chevrolet', model:'Spark', year:2022, price:850, week:5100, deposit:3000, plate:'MU-MN4', color:'Blue', fuel:'PETROL', trans:'AUTOMATIC', cc:1400, seats:4, doors:5, bags:1, img:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800' },
    { make:'Peugeot', model:'108', year:2023, price:800, week:4800, deposit:3000, plate:'MU-MN5', color:'Black', fuel:'PETROL', trans:'MANUAL', cc:1000, seats:4, doors:5, bags:1, img:'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800' },
  ],
  ECONOMY: [
    { make:'Toyota', model:'Yaris', year:2023, price:1200, week:7200, deposit:5000, plate:'MU-EC1', color:'White', fuel:'PETROL', trans:'AUTOMATIC', cc:1000, seats:5, doors:4, bags:2, img:'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800' },
    { make:'Suzuki', model:'Swift', year:2023, price:1100, week:6600, deposit:4500, plate:'MU-EC2', color:'Red', fuel:'PETROL', trans:'MANUAL', cc:1200, seats:5, doors:4, bags:2, img:'https://images.unsplash.com/photo-1597007066704-67bf2068d5b2?w=800' },
    { make:'Dacia', model:'Sandero', year:2022, price:950, week:5700, deposit:4000, plate:'MU-EC3', color:'Blue', fuel:'PETROL', trans:'MANUAL', cc:900, seats:5, doors:4, bags:2, img:'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800' },
    { make:'Hyundai', model:'i20', year:2023, price:1150, week:6900, deposit:4500, plate:'MU-EC4', color:'Silver', fuel:'PETROL', trans:'AUTOMATIC', cc:1200, seats:5, doors:5, bags:2, img:'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800' },
    { make:'Nissan', model:'Micra', year:2022, price:1100, week:6600, deposit:4500, plate:'MU-EC5', color:'Orange', fuel:'PETROL', trans:'AUTOMATIC', cc:1200, seats:5, doors:5, bags:2, img:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800' },
  ],
  COMPACT: [
    { make:'Toyota', model:'Corolla', year:2023, price:1800, week:10800, deposit:6000, plate:'MU-CO1', color:'Pearl White', fuel:'HYBRID', trans:'AUTOMATIC', cc:1800, seats:5, doors:4, bags:3, img:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800' },
    { make:'Volkswagen', model:'Polo', year:2022, price:1650, week:9900, deposit:5500, plate:'MU-CO2', color:'Grey', fuel:'PETROL', trans:'AUTOMATIC', cc:1000, seats:5, doors:4, bags:3, img:'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800' },
    { make:'Honda', model:'Fit', year:2023, price:1500, week:9000, deposit:5000, plate:'MU-CO3', color:'Champagne', fuel:'PETROL', trans:'AUTOMATIC', cc:1500, seats:5, doors:4, bags:3, img:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800' },
    { make:'Mazda', model:'3', year:2023, price:1700, week:10200, deposit:5500, plate:'MU-CO4', color:'Soul Red', fuel:'PETROL', trans:'AUTOMATIC', cc:2000, seats:5, doors:4, bags:3, img:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800' },
    { make:'Kia', model:'Forte', year:2022, price:1600, week:9600, deposit:5000, plate:'MU-CO5', color:'Black', fuel:'PETROL', trans:'AUTOMATIC', cc:2000, seats:5, doors:4, bags:3, img:'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800' },
  ],
  MIDSIZE: [
    { make:'Toyota', model:'Camry', year:2023, price:2800, week:16800, deposit:8000, plate:'MU-MD1', color:'Black', fuel:'HYBRID', trans:'AUTOMATIC', cc:2500, seats:5, doors:4, bags:4, img:'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800' },
    { make:'Mazda', model:'6', year:2022, price:2600, week:15600, deposit:7500, plate:'MU-MD2', color:'Soul Red', fuel:'PETROL', trans:'AUTOMATIC', cc:2000, seats:5, doors:4, bags:4, img:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800' },
    { make:'Honda', model:'Accord', year:2023, price:2700, week:16200, deposit:8000, plate:'MU-MD3', color:'White', fuel:'HYBRID', trans:'AUTOMATIC', cc:2000, seats:5, doors:4, bags:4, img:'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800' },
    { make:'Hyundai', model:'Sonata', year:2022, price:2500, week:15000, deposit:7000, plate:'MU-MD4', color:'Silver', fuel:'PETROL', trans:'AUTOMATIC', cc:2500, seats:5, doors:4, bags:4, img:'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800' },
    { make:'Nissan', model:'Altima', year:2023, price:2400, week:14400, deposit:7000, plate:'MU-MD5', color:'Grey', fuel:'PETROL', trans:'AUTOMATIC', cc:2500, seats:5, doors:4, bags:4, img:'https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=800' },
  ],
  SUV: [
    { make:'Toyota', model:'RAV4', year:2023, price:3500, week:21000, deposit:10000, plate:'MU-SV1', color:'Green', fuel:'HYBRID', trans:'AUTOMATIC', cc:2500, seats:5, doors:5, bags:5, img:'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800' },
    { make:'Nissan', model:'Qashqai', year:2022, price:3000, week:18000, deposit:9000, plate:'MU-SV2', color:'Blue', fuel:'PETROL', trans:'AUTOMATIC', cc:1300, seats:5, doors:5, bags:4, img:'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800' },
    { make:'Mitsubishi', model:'Outlander', year:2023, price:3800, week:22800, deposit:11000, plate:'MU-SV3', color:'White', fuel:'PETROL', trans:'AUTOMATIC', cc:2500, seats:7, doors:5, bags:5, img:'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800' },
    { make:'Ford', model:'Everest', year:2022, price:4200, week:25200, deposit:12000, plate:'MU-SV4', color:'Grey', fuel:'DIESEL', trans:'AUTOMATIC', cc:2000, seats:7, doors:5, bags:6, img:'https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=800' },
    { make:'Kia', model:'Sportage', year:2023, price:3400, week:20400, deposit:9500, plate:'MU-SV5', color:'Black', fuel:'PETROL', trans:'AUTOMATIC', cc:2000, seats:5, doors:5, bags:5, img:'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800' },
  ],
  LUXURY: [
    { make:'Mercedes-Benz', model:'E-Class', year:2023, price:7500, week:45000, deposit:20000, plate:'MU-LX1', color:'Black', fuel:'PETROL', trans:'AUTOMATIC', cc:2000, seats:5, doors:4, bags:4, img:'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800' },
    { make:'BMW', model:'5 Series', year:2023, price:8000, week:48000, deposit:22000, plate:'MU-LX2', color:'White', fuel:'PETROL', trans:'AUTOMATIC', cc:2000, seats:5, doors:4, bags:4, img:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800' },
    { make:'Audi', model:'A6', year:2022, price:7800, week:46800, deposit:21000, plate:'MU-LX3', color:'Grey', fuel:'DIESEL', trans:'AUTOMATIC', cc:3000, seats:5, doors:4, bags:4, img:'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800' },
    { make:'Land Rover', model:'Range Rover Sport', year:2023, price:12000, week:72000, deposit:30000, plate:'MU-LX4', color:'Red', fuel:'PETROL', trans:'AUTOMATIC', cc:3000, seats:5, doors:5, bags:5, img:'https://images.unsplash.com/photo-1617654112368-307921291f42?w=800' },
    { make:'Lexus', model:'ES', year:2023, price:7200, week:43200, deposit:19000, plate:'MU-LX5', color:'Pearl White', fuel:'HYBRID', trans:'AUTOMATIC', cc:2500, seats:5, doors:4, bags:4, img:'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800' },
  ],
  SPORTS: [
    { make:'Porsche', model:'718 Boxster', year:2022, price:15000, week:90000, deposit:40000, plate:'MU-SP1', color:'Blue', fuel:'PETROL', trans:'AUTOMATIC', cc:2000, seats:2, doors:2, bags:1, img:'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800' },
    { make:'Ford', model:'Mustang', year:2023, price:12000, week:72000, deposit:35000, plate:'MU-SP2', color:'Red', fuel:'PETROL', trans:'AUTOMATIC', cc:5000, seats:4, doors:2, bags:2, img:'https://images.unsplash.com/photo-1584345604476-8cb5e136084a?w=800' },
    { make:'Chevrolet', model:'Camaro', year:2022, price:11000, week:66000, deposit:33000, plate:'MU-SP3', color:'Yellow', fuel:'PETROL', trans:'AUTOMATIC', cc:6200, seats:4, doors:2, bags:2, img:'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800' },
    { make:'BMW', model:'Z4', year:2023, price:14000, week:84000, deposit:38000, plate:'MU-SP4', color:'Blue', fuel:'PETROL', trans:'AUTOMATIC', cc:3000, seats:2, doors:2, bags:1, img:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800' },
    { make:'Audi', model:'TT', year:2022, price:10000, week:60000, deposit:30000, plate:'MU-SP5', color:'White', fuel:'PETROL', trans:'AUTOMATIC', cc:2000, seats:4, doors:2, bags:2, img:'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800' },
  ],
  VAN: [
    { make:'Toyota', model:'Hiace', year:2022, price:4500, week:27000, deposit:13000, plate:'MU-VN1', color:'White', fuel:'DIESEL', trans:'MANUAL', cc:2700, seats:12, doors:4, bags:8, img:'https://images.unsplash.com/photo-1613843439331-2e58a82b2b40?w=800' },
    { make:'Mercedes-Benz', model:'V-Class', year:2023, price:9000, week:54000, deposit:25000, plate:'MU-VN2', color:'Black', fuel:'DIESEL', trans:'AUTOMATIC', cc:2000, seats:7, doors:5, bags:6, img:'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800' },
    { make:'Hyundai', model:'Staria', year:2023, price:6000, week:36000, deposit:15000, plate:'MU-VN3', color:'Silver', fuel:'DIESEL', trans:'AUTOMATIC', cc:2200, seats:9, doors:5, bags:6, img:'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800' },
    { make:'Kia', model:'Carnival', year:2023, price:6500, week:39000, deposit:16000, plate:'MU-VN4', color:'White', fuel:'PETROL', trans:'AUTOMATIC', cc:3500, seats:8, doors:5, bags:6, img:'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800' },
    { make:'Volkswagen', model:'Multivan', year:2022, price:7500, week:45000, deposit:18000, plate:'MU-VN5', color:'Red/White', fuel:'HYBRID', trans:'AUTOMATIC', cc:1400, seats:7, doors:5, bags:5, img:'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800' },
  ],
  PICKUP: [
    { make:'Toyota', model:'Hilux', year:2023, price:4000, week:24000, deposit:12000, plate:'MU-PK1', color:'White', fuel:'DIESEL', trans:'AUTOMATIC', cc:2800, seats:5, doors:4, bags:4, img:'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800' },
    { make:'Ford', model:'Ranger', year:2023, price:4200, week:25200, deposit:12500, plate:'MU-PK2', color:'Orange', fuel:'DIESEL', trans:'AUTOMATIC', cc:2000, seats:5, doors:4, bags:4, img:'https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=800' },
    { make:'Nissan', model:'Navara', year:2022, price:3800, week:22800, deposit:11000, plate:'MU-PK3', color:'Grey', fuel:'DIESEL', trans:'AUTOMATIC', cc:2300, seats:5, doors:4, bags:4, img:'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800' },
    { make:'Isuzu', model:'D-Max', year:2023, price:3600, week:21600, deposit:10000, plate:'MU-PK4', color:'Silver', fuel:'DIESEL', trans:'MANUAL', cc:3000, seats:5, doors:4, bags:4, img:'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800' },
    { make:'Mitsubishi', model:'Triton', year:2022, price:3700, week:22200, deposit:10500, plate:'MU-PK5', color:'Red', fuel:'DIESEL', trans:'AUTOMATIC', cc:2400, seats:5, doors:4, bags:4, img:'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800' },
  ],
  CONVERTIBLE: [
    { make:'Mazda', model:'MX-5 Miata', year:2023, price:5500, week:33000, deposit:15000, plate:'MU-CV1', color:'Orange', fuel:'PETROL', trans:'MANUAL', cc:2000, seats:2, doors:2, bags:1, img:'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800' },
    { make:'MINI', model:'Cooper Convertible', year:2023, price:6000, week:36000, deposit:16000, plate:'MU-CV2', color:'Aqua', fuel:'PETROL', trans:'AUTOMATIC', cc:1500, seats:4, doors:2, bags:1, img:'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800' },
    { make:'BMW', model:'4 Series Convertible', year:2022, price:9500, week:57000, deposit:25000, plate:'MU-CV3', color:'Green', fuel:'PETROL', trans:'AUTOMATIC', cc:2000, seats:4, doors:2, bags:2, img:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800' },
    { make:'Audi', model:'A5 Cabriolet', year:2023, price:9000, week:54000, deposit:24000, plate:'MU-CV4', color:'Blue', fuel:'PETROL', trans:'AUTOMATIC', cc:2000, seats:4, doors:2, bags:2, img:'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800' },
    { make:'Mercedes-Benz', model:'C-Class Cabriolet', year:2022, price:10000, week:60000, deposit:26000, plate:'MU-CV5', color:'White', fuel:'PETROL', trans:'AUTOMATIC', cc:2000, seats:4, doors:2, bags:2, img:'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800' },
  ],
}

async function main() {
  // Upsert branches
  await prisma.branch.upsert({
    where: { id: BRANCH_ID },
    update: {},
    create: { id: BRANCH_ID, name: 'Port Louis HQ', address: 'Sir William Newton Street, Port Louis', phone: '+230 211 0000', email: 'portlouis@carhiremauritius.com' }
  })
  await prisma.branch.upsert({
    where: { id: BRANCH_B },
    update: {},
    create: { id: BRANCH_B, name: 'SSR Airport', address: 'SSR International Airport, Plaine Magnien', phone: '+230 603 0000', email: 'airport@carhiremauritius.com' }
  })

  let total = 0
  for (const [cat, cars] of Object.entries(carTemplates)) {
    for (let i = 0; i < cars.length; i++) {
      const c = cars[i]
      const slug = `${c.make.toLowerCase().replace(/[\s-]+/g,'-')}-${c.model.toLowerCase().replace(/[\s-]+/g,'-')}-${c.year}-${cat.toLowerCase()}-${i+1}`
      const branchId = i % 2 === 0 ? BRANCH_ID : BRANCH_B
      try {
        await prisma.car.upsert({
          where: { slug },
          update: {},
          create: {
            slug,
            make: c.make, model: c.model, year: c.year,
            category: cat,
            status: 'AVAILABLE',
            seats: c.seats, doors: c.doors, luggage: c.bags,
            fuelType: c.fuel, transmission: c.trans,
            engineCC: c.cc,
            pricePerDay: c.price, pricePerWeek: c.week, priceDeposit: c.deposit,
            color: c.color, plateNumber: c.plate,
            thumbnailUrl: c.img,
            features: ['Air Conditioning', 'GPS', 'Bluetooth'],
            description: `${c.make} ${c.model} ${c.year} — available for rental in Mauritius.`,
            branchId,
            images: { create: [{ url: c.img, isPrimary: true, order: 0, alt: `${c.make} ${c.model}` }] }
          }
        })
        total++
        console.log(`✓ ${cat}: ${c.make} ${c.model}`)
      } catch(e) {
        console.error(`✗ ${slug}: ${e.message}`)
      }
    }
  }
  console.log(`\n✅ Done — ${total} cars seeded`)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
