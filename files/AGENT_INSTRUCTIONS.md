# 🚗 CAR HIRE MAURITIUS — COMPLETE AGENT BUILD INSTRUCTIONS

## Project Overview
Build a **luxury car rental web app** named **"Car Hire Mauritius"** — a lightweight, fast, fully functional platform inspired by carrental-mauritius.com. This is a production-grade app with real booking flows, dynamic pricing, fleet showcase, admin panel, payments, and automation.

---

## 🎯 Design & Feel Reference
- **Inspired by:** carrental-mauritius.com
- **Style:** Clean, white/light backgrounds, luxury typography, full-width hero with car imagery, tropical/island color palette (deep navy, gold accents, white)
- **Primary Color:** #1B2D4F (deep navy)
- **Accent Color:** #C9A84C (gold)
- **Font:** Inter (body), Playfair Display (headings)
- **Feel:** Premium, trustworthy, fast, mobile-first
- **No heavy animations** — subtle fade-ins, hover effects only
- **Lightweight first:** Keep bundle < 500KB, lazy-load images, code-split by route

---

## 🏗️ Tech Stack (Mandatory)

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS v3
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **State:** Zustand (global) + React Hook Form (forms)
- **Date Picker:** react-day-picker
- **Map:** Leaflet.js (lightweight, not Google Maps)
- **Image Carousel:** Embla Carousel
- **Animations:** Framer Motion (minimal use only)

### Backend
- **Runtime:** Next.js API Routes (serverless)
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** NextAuth.js (email + Google OAuth)
- **Payments:** Stripe (primary) + Razorpay (fallback)
- **Email:** Resend (transactional emails)
- **SMS/WhatsApp:** Twilio
- **File Storage:** Cloudinary (car images, documents)
- **PDF Generation:** @react-pdf/renderer

### Infrastructure
- **Hosting:** Vercel (frontend + API)
- **DB Hosting:** Supabase (Postgres)
- **CDN:** Vercel Edge Network
- **Monitoring:** Vercel Analytics

---

## 📁 Project Structure

```
car-hire-mauritius/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes
│   │   ├── page.tsx              # Homepage
│   │   ├── fleet/                # Fleet listing
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx   # Car detail
│   │   ├── booking/
│   │   │   ├── page.tsx          # Search results
│   │   │   ├── checkout/page.tsx # Checkout
│   │   │   └── confirmation/page.tsx
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── faq/page.tsx
│   │   └── locations/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (customer)/               # Protected customer area
│   │   └── dashboard/
│   │       ├── page.tsx          # Overview
│   │       ├── bookings/page.tsx
│   │       ├── profile/page.tsx
│   │       ├── documents/page.tsx
│   │       └── loyalty/page.tsx
│   ├── (admin)/                  # Protected admin area
│   │   └── admin/
│   │       ├── page.tsx          # Executive dashboard
│   │       ├── fleet/page.tsx
│   │       ├── bookings/page.tsx
│   │       ├── customers/page.tsx
│   │       ├── pricing/page.tsx
│   │       ├── reports/page.tsx
│   │       └── settings/page.tsx
│   ├── api/                      # API Routes
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── cars/route.ts
│   │   ├── bookings/route.ts
│   │   ├── payments/route.ts
│   │   ├── pricing/route.ts
│   │   └── webhooks/stripe/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn components
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── AdminSidebar.tsx
│   ├── home/
│   │   ├── HeroSearch.tsx
│   │   ├── FeaturedCars.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── Testimonials.tsx
│   │   └── PopularLocations.tsx
│   ├── fleet/
│   │   ├── CarCard.tsx
│   │   ├── CarFilters.tsx
│   │   ├── CarGallery.tsx
│   │   ├── CarSpecs.tsx
│   │   └── AvailabilityBadge.tsx
│   ├── booking/
│   │   ├── SearchForm.tsx
│   │   ├── DateRangePicker.tsx
│   │   ├── LocationPicker.tsx
│   │   ├── AddonsSelector.tsx
│   │   ├── PriceSummary.tsx
│   │   └── BookingSteps.tsx
│   ├── checkout/
│   │   ├── PaymentForm.tsx
│   │   ├── CouponInput.tsx
│   │   └── OrderSummary.tsx
│   └── admin/
│       ├── StatsCard.tsx
│       ├── BookingTable.tsx
│       ├── FleetTable.tsx
│       └── RevenueChart.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── stripe.ts
│   ├── pricing.ts                # Dynamic pricing engine
│   ├── availability.ts
│   └── utils.ts
├── hooks/
│   ├── useBooking.ts
│   ├── usePricing.ts
│   └── useAvailability.ts
├── store/
│   └── bookingStore.ts           # Zustand store
├── types/
│   └── index.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                   # 20 dummy cars + data
└── public/
    └── images/
```

---

## 🔑 CRITICAL BUILD RULES

1. **Every page must be server-side rendered (SSR) or statically generated (SSG)** where possible for SEO
2. **Mobile-first always** — design for 375px width first, then expand
3. **No placeholder "lorem ipsum"** — use realistic Mauritius car rental content
4. **All prices in MUR (Mauritian Rupee) and EUR** — show both
5. **All dummy data must be realistic** — real Mauritius locations, real car models
6. **Stripe webhooks must be implemented** for payment confirmation
7. **Dynamic pricing engine must run server-side** — never expose pricing logic to client
8. **Images must use Next.js `<Image>` component** with proper sizing
9. **All forms must have validation** using Zod schemas
10. **Admin routes must be protected** with role-based middleware

---

## 📋 IMPLEMENTATION ORDER (follow this sequence)

1. Database schema + Prisma setup
2. Seed file with 20 cars + dummy data
3. Auth system (NextAuth)
4. Core layout (Navbar, Footer)
5. Homepage with hero search
6. Fleet listing + car detail pages
7. Booking flow (search → checkout → confirmation)
8. Payment integration (Stripe)
9. Dynamic pricing engine
10. Customer dashboard
11. Admin panel (all sections)
12. Email automation (Resend)
13. PDF invoice generation
14. Testing + optimisation

---

## ⚠️ PERFORMANCE REQUIREMENTS
- Lighthouse score > 90 on all metrics
- First Contentful Paint < 1.5s
- Images: WebP format, lazy loaded, proper srcsets
- No unused CSS (Tailwind purge enabled)
- API responses cached where appropriate
