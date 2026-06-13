# 🗂️ CAR HIRE MAURITIUS — MASTER INDEX
## Read this first. Every file in this project explained.

---

## 📂 FILE STRUCTURE OVERVIEW

```
car-hire-mauritius/
│
├── 📋 AGENT_INSTRUCTIONS.md     ← START HERE — Full project brief, tech stack, build order
├── 📋 PAGES_MAP.md              ← Every page to build with exact section-by-section specs
├── 📋 SETUP_GUIDE.md            ← package.json, .env, deployment, shadcn install commands
├── 📋 CODE_MAP.md               ← THIS FILE — master index
│
├── prisma/
│   ├── schema.prisma            ← Complete DB schema (Users, Cars, Bookings, Payments, etc.)
│   └── seed.ts                  ← 20 real cars + locations + addons + pricing rules + coupons
│
├── lib/
│   └── pricing.ts              ← Server-side dynamic pricing engine (USE AS-IS)
│
└── skills/
    ├── BOOKING_AND_PAYMENT_SKILL.md  ← Zustand store, Stripe flow, webhooks, PDF invoice, Zod
    ├── ADMIN_PANEL_SKILL.md          ← Middleware, dashboard data, booking kanban, audit log
    └── DESIGN_SYSTEM_SKILL.md        ← Colours, typography, component specs, responsive rules
```

---

## 🎯 WHAT TO BUILD — PRIORITY ORDER

### Phase 1: Foundation (Days 1-3)
- [ ] `npx create-next-app` with TypeScript + Tailwind
- [ ] Install all packages from SETUP_GUIDE.md
- [ ] Copy `prisma/schema.prisma` as-is
- [ ] Run `npx prisma db push` + `npm run db:seed`
- [ ] Set up NextAuth with email + Google providers
- [ ] Build Navbar + Footer layout shells

### Phase 2: Core Product (Days 4-8)
- [ ] Homepage with HeroSearch component (most critical!)
- [ ] `/api/locations` → populate search dropdowns
- [ ] `/api/cars/available` → availability check API
- [ ] Fleet page `/fleet` with filters
- [ ] Car detail page `/fleet/[slug]`
- [ ] Booking results page `/booking`

### Phase 3: Booking & Payment (Days 9-13)
- [ ] Checkout flow (3 steps) using BookingStore from Zustand
- [ ] `/api/payments/intent` → Stripe payment intent
- [ ] Stripe Elements in checkout
- [ ] `/api/webhooks/stripe` → booking confirmation
- [ ] Confirmation page + PDF invoice
- [ ] Resend emails (confirmation, reminder)

### Phase 4: Customer Dashboard (Days 14-16)
- [ ] `/dashboard` — overview
- [ ] `/dashboard/bookings` — booking list + status
- [ ] `/dashboard/profile` — edit profile
- [ ] `/dashboard/documents` — upload licence/passport

### Phase 5: Admin Panel (Days 17-22)
- [ ] Admin middleware (role protection)
- [ ] `/admin` — executive dashboard with KPIs
- [ ] `/admin/fleet` — car management CRUD
- [ ] `/admin/bookings` — kanban + table view
- [ ] `/admin/customers` — CRM
- [ ] `/admin/pricing` — rules + coupons
- [ ] `/admin/reports` — revenue charts

### Phase 6: Polish (Days 23-25)
- [ ] Mobile responsiveness audit
- [ ] Loading skeletons everywhere
- [ ] Error boundaries
- [ ] Lighthouse performance audit
- [ ] SEO meta tags + sitemap

---

## 🚨 DO NOT DO

- ❌ Do not expose pricing logic to the client — always server-side
- ❌ Do not hardcode prices — always fetch from DB
- ❌ Do not delete cars or bookings — use status fields
- ❌ Do not use localStorage for booking state — use Zustand with persistence
- ❌ Do not skip Zod validation — validate all API inputs
- ❌ Do not render the Leaflet map on the server — use `dynamic(() => import(), { ssr: false })`
- ❌ Do not add admin navigation links visible to regular customers

---

## 🔗 KEY API ENDPOINTS TO BUILD

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cars | List all cars (with filters) |
| GET | /api/cars/available | Available cars for date range |
| GET | /api/cars/[slug] | Single car detail |
| GET | /api/locations | All pickup locations |
| POST | /api/bookings | Create booking |
| GET | /api/bookings/[id] | Get booking detail |
| PATCH | /api/bookings/[id] | Update booking status |
| POST | /api/payments/intent | Create Stripe payment intent |
| POST | /api/webhooks/stripe | Stripe webhook |
| POST | /api/pricing/calculate | Calculate price (authenticated) |
| POST | /api/pricing/validate-coupon | Validate & preview coupon discount |
| GET | /api/admin/stats | Dashboard KPIs |
| GET | /api/admin/reports/revenue | Revenue data |
| CRUD | /api/admin/cars | Fleet management |
| CRUD | /api/admin/pricing | Pricing rules |
| CRUD | /api/admin/coupons | Coupon management |

---

## 🚗 THE 20 CARS — CATEGORIES SUMMARY

| Category | Count | Price Range (MUR/day) | Examples |
|----------|-------|----------------------|---------|
| Economy | 4 | 950 – 1,200 | Yaris, Swift, Sandero, i10 |
| Compact | 3 | 1,500 – 1,800 | Corolla, Polo, Honda Fit |
| Midsize | 2 | 2,600 – 2,800 | Camry, Mazda 6 |
| SUV | 4 | 3,000 – 4,200 | RAV4, Qashqai, Outlander, Everest |
| Luxury | 4 | 7,500 – 12,000 | E-Class, 5 Series, A6, Range Rover |
| Sports | 1 | 15,000 | Porsche 718 Boxster |
| Convertible | 1 | 5,500 | Mazda MX-5 |
| Van | 1 | 4,500 | Toyota Hiace 12-seat |

---

## 📧 THE 12 ADD-ONS — QUICK REFERENCE

| Add-on | Type | Price (MUR) |
|--------|------|------------|
| GPS Navigation | per_day | 150 |
| Baby Seat (0-9kg) | per_day | 200 |
| Child Seat (9-18kg) | per_day | 200 |
| Booster Seat | per_day | 150 |
| Additional Driver | per_day | 250 |
| Full Insurance | per_day | 500 |
| Roadside Assistance Plus | per_booking | 800 |
| Wi-Fi Hotspot | per_day | 250 |
| Airport Meet & Greet | per_booking | 1,200 |
| Cooler Box | per_day | 100 |
| Toll Pass | per_booking | 300 |
| Snorkelling Kit | per_booking | 600 |

---

## 💰 PRICING RULES SUMMARY

| Rule | Type | Effect |
|------|------|--------|
| Christmas Peak (Dec 20 – Jan 5) | Seasonal | +45% |
| Winter European Peak (Jul-Aug) | Seasonal | +30% |
| Easter Holiday | Seasonal | +25% |
| 7–13 Day Booking | Duration | -10% |
| 14+ Day Booking | Duration | -18% |
| Luxury Category Demand | Category | +15% |
| Sports Category Demand | Category | +20% |

**Surge and discount rules stack independently:**
- Only 1 surge rule fires (the highest)
- All discount rules stack multiplicatively

---

## 🔑 TEST CREDENTIALS

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@carhiremauritius.com | Admin@1234 |
| Customer | demo@customer.com | (Google login or set via seed) |

---

## 📞 CONTACT DETAILS TO USE THROUGHOUT THE SITE

```
Company: Car Hire Mauritius
Address: Sir William Newton Street, Port Louis, Mauritius
Phone: +230 211 0000
WhatsApp: +230 5702 0000  
Email: info@carhiremauritius.com
Bookings: bookings@carhiremauritius.com
Emergency: +230 5911 0000 (24/7)
Airport Branch: +230 603 0000
```
