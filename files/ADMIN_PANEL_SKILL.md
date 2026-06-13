# SKILL: Admin Panel
## Car Hire Mauritius

---

## 🔐 ADMIN MIDDLEWARE

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard')

    if (isAdminRoute && !['ADMIN', 'MANAGER', 'BRANCH_STAFF'].includes(token?.role as string)) {
      return NextResponse.redirect(new URL('/login?error=unauthorized', req.url))
    }

    if (isDashboardRoute && !token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  },
  { callbacks: { authorized: ({ token }) => !!token } }
)

export const config = { matcher: ['/admin/:path*', '/dashboard/:path*'] }
```

---

## 📊 EXECUTIVE DASHBOARD COMPONENT

```typescript
// app/(admin)/admin/page.tsx
import { prisma } from '@/lib/prisma'
import { StatsCard } from '@/components/admin/StatsCard'
import { RevenueChart } from '@/components/admin/RevenueChart'
import { BookingTable } from '@/components/admin/BookingTable'

async function getAdminStats() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [monthRevenue, monthBookings, activeRentals, totalCars, availableCars] = await Promise.all([
    prisma.booking.aggregate({
      where: { createdAt: { gte: startOfMonth }, paymentStatus: 'PAID' },
      _sum: { totalPrice: true }
    }),
    prisma.booking.count({
      where: { createdAt: { gte: startOfMonth } }
    }),
    prisma.booking.count({
      where: { status: 'ACTIVE' }
    }),
    prisma.car.count(),
    prisma.car.count({ where: { status: 'AVAILABLE' } }),
  ])

  return {
    monthRevenue: monthRevenue._sum.totalPrice ?? 0,
    monthBookings,
    activeRentals,
    fleetUtilisation: Math.round(((totalCars - availableCars) / totalCars) * 100),
  }
}

export default async function AdminDashboard() {
  const stats = await getAdminStats()
  // Render StatsCard grid + charts
}
```

---

## 🚗 FLEET MANAGEMENT RULES

- Every car must have at least 1 primary image before it can be set to AVAILABLE
- Cars cannot be deleted — only set to RETIRED status (preserves booking history)
- Maintenance log is required when changing status to MAINTENANCE
- Price changes do NOT retroactively affect existing confirmed bookings
- Car slug must be unique and URL-friendly (auto-generate from make+model+year)

---

## 📋 BOOKING KANBAN BOARD

```typescript
// components/admin/BookingKanban.tsx
const COLUMNS = [
  { id: 'PENDING', label: 'Pending', color: 'amber' },
  { id: 'CONFIRMED', label: 'Confirmed', color: 'blue' },
  { id: 'ACTIVE', label: 'Active', color: 'green' },
  { id: 'COMPLETED', label: 'Completed', color: 'gray' },
]

// Each card shows: car thumbnail, customer name, dates, total price, action buttons
// Drag-and-drop via @dnd-kit/core
// Status change via PATCH /api/admin/bookings/[id]
```

---

## 💰 PRICING ENGINE UI (Admin)

The pricing engine page `/admin/pricing` must show:

1. **Active Rules Table:**
   - Rule name, type, applicable period/category, multiplier, status toggle, edit/delete
   
2. **Add Rule Form:**
   ```
   Rule Type: [Seasonal | Duration | Category | Surge]
   Name: ____________
   Category (if type=category): [dropdown]
   Start Date / End Date (if seasonal): [date pickers]
   Min Days / Max Days (if duration): [number inputs]
   Multiplier: [1.0 - 3.0 slider with preview: "30% increase / 20% discount"]
   Priority: [0-10]
   ```

3. **Live Preview Panel:**
   - Select any car + date range → shows live calculated price with all rules applied
   - Shows which rules fired and their contribution

4. **Coupon Manager:**
   - Table with: code, type, value, uses/max, expiry, status
   - "Create Coupon" form
   - Copy code button
   - One-click deactivate

---

## 📈 REPORTS

```typescript
// app/api/admin/reports/revenue/route.ts
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const period = searchParams.get('period') ?? '30days'
  
  const startDate = period === '30days' 
    ? new Date(Date.now() - 30 * 86400000)
    : period === '12months'
    ? new Date(Date.now() - 365 * 86400000)
    : new Date(Date.now() - 7 * 86400000)

  const revenue = await prisma.booking.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: { gte: startDate },
      paymentStatus: { in: ['PAID', 'PARTIALLY_PAID'] }
    },
    _sum: { totalPrice: true },
    _count: true,
  })

  return NextResponse.json(revenue)
}
```

---

## 🔔 AUDIT LOG

Every admin action must be logged to the AuditLog table:
```typescript
await prisma.auditLog.create({
  data: {
    userId: session.user.id,
    action: 'UPDATE_BOOKING_STATUS',
    entity: 'Booking',
    entityId: bookingId,
    oldData: { status: oldStatus },
    newData: { status: newStatus },
    ip: req.ip,
  }
})
```
