# Car Hire Mauritius — Project Context & Architecture

> **Last Updated:** 2026-04-15  
> **Status:** GitHub-connected Vercel deployment in progress; latest pushed commit is `b42bef9`  
> **GitHub Repo:** https://github.com/avadhbajaj07/carhire  
> **Vercel URL:** carhire-avadhbajaj07.vercel.app  
> **Git Author Email:** shouryasaad6@gmail.com  

---

## 1. What This Project Is

A **premium luxury car rental platform** for Mauritius. It's a full-stack Next.js 14 web application with a multi-step booking system, fleet showcase, and admin dashboard. The brand identity is "Car Hire Mauritius" — a luxury island car rental service.

### Business Model
- Cars are rented in **EUR (€)** with daily pricing
- Delivery/drop-off at SSR International Airport, hotels, or custom locations across Mauritius
- Payment via 25% deposit or 100% upfront
- Add-on extras: Accident Protection, Baby/Booster/Child Seats, SIM Cards
- Free island-wide delivery, full insurance included

---

## 2. Tech Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| **Framework** | Next.js 14.2 (App Router) | All pages in `src/app/` |
| **Language** | TypeScript | Strict mode |
| **Styling** | Tailwind CSS v3 + Custom CSS | Config in `tailwind.config.ts`, globals in `globals.css` |
| **Fonts** | Inter (body) + Playfair Display (display) | Google Fonts, loaded via `next/font` |
| **State** | Zustand | Booking flow state in `src/store/bookingStore.ts` |
| **Database** | PostgreSQL via Prisma ORM | Schema in `prisma/schema.prisma` |
| **DB Host** | Supabase | Connection via `DATABASE_URL` env var |
| **UI** | Lucide React icons, Radix UI primitives | Custom components in `src/components/ui/` |
| **Auth** | NextAuth credentials | Admin login uses seeded DB user + role-based middleware |
| **Deployment** | Vercel (auto-deploy from GitHub `main` branch) | Build: `prisma generate && next build` |

### Key Dependencies
```
next ^14.2, react ^18.3, zustand ^4.5, @prisma/client ^5.10,
lucide-react, framer-motion, tailwind-merge, clsx,
date-fns, react-hook-form, zod, stripe, resend
```

---

## 3. Design System

### Brand Colors (Tailwind tokens)
```
navy:      #1B2D4F (primary dark)
navy-light: #2A4A7F
navy-dark:  #0F1E35
gold:       #C9A84C (CTA / accent)
gold-light: #E8C97A
gold-dark:  #A68432
offWhite:   #F8F7F4 (page background)
```

### Booking Flow Colors (teal-based, different from main brand)
```
teal:       #0D9B84 (primary CTA in booking flow)
teal-light: #00C4A0 (hover state)
teal-bg:    #E1F5EE (light background)
accent-red: #E8534A (banners, alerts)
page-bg:    #F5F5F5 (booking pages background)
```

### Typography
- **Display:** Playfair Display (serif) — headings, hero text
- **Body:** Inter (sans-serif) — everything else
- Applied via CSS variables: `--font-playfair`, `--font-inter`

### Custom CSS Classes (in `globals.css`)
- `.glass-card` / `.glass-dark` — glassmorphism effects
- `.gold-gradient` / `.navy-gradient` — brand gradients
- `.luxury-btn` — hover-up button with shimmer
- `.premium-card` — hover-lift card with gold overlay
- `.animate-slow-zoom`, `.animate-float`, `.animate-shimmer`
- `.dot-pattern`, `.line-pattern` — decorative backgrounds

---

## 4. Project File Structure

```
pingouin-car-rental/
├── prisma/
│   ├── schema.prisma          # Full DB schema (20+ models, enums)
│   └── seed.ts                # Database seeder script
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (Navbar + Footer + fonts)
│   │   ├── page.tsx           # Homepage (hero, featured cars, stats, testimonials)
│   │   ├── globals.css        # Global styles, animations, custom classes
│   │   ├── about/page.tsx     # About page (company story, team, values)
│   │   ├── fleet/page.tsx     # Fleet showcase (filterable car grid)
│   │   ├── locations/page.tsx # 4 branch locations across Mauritius
│   │   ├── contact/page.tsx   # Contact form + map + details
│   │   ├── admin/page.tsx     # Admin dashboard
│   │   ├── admin/login/page.tsx # NextAuth admin login page
│   │   ├── booking/
│   │   │   ├── page.tsx           # STEP 1: Vehicle List (filters + car cards)
│   │   │   ├── options/page.tsx   # STEP 2: Add Options (extras with +/- counters)
│   │   │   ├── checkout/page.tsx  # STEP 3: Driver Details + Payment mode
│   │   │   └── confirmation/page.tsx # STEP 4: Booking Confirmation
│   │   └── api/               # Includes NextAuth route handler
│   ├── components/
│   │   ├── booking/
│   │   │   ├── BookingLayout.tsx   # Shared layout: StepProgress + PriceSidebar
│   │   │   ├── StepProgress.tsx    # 4-step chevron progress bar
│   │   │   └── PriceSidebar.tsx    # Right sidebar: car, dates, price breakdown
│   │   ├── home/
│   │   │   ├── HeroSearch.tsx      # Search widget on homepage hero
│   │   │   ├── FeaturedCars.tsx    # Top picks car carousel
│   │   │   ├── WhyChooseUs.tsx     # Benefits grid
│   │   │   ├── TestimonialsSection.tsx # Customer reviews
│   │   │   ├── StatsSection.tsx    # Numbers (10,000+ rentals, etc.)
│   │   │   ├── CategoriesSection.tsx  # Car categories (SUV, Sport, etc.)
│   │   │   └── BrandMarquee.tsx    # Scrolling brand logos
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Fixed top navbar (transparent on home)
│   │   │   ├── Footer.tsx          # Site footer
│   │   │   └── AppChrome.tsx       # Hides public chrome on admin routes
│   │   └── ui/
│   │       ├── button.tsx          # Shadcn-style button
│   │       └── badge.tsx           # Shadcn-style badge
│   ├── store/
│   │   └── bookingStore.ts    # Zustand store (booking state machine)
│   ├── lib/
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── auth.ts            # NextAuth credentials config
│   │   ├── pricing.ts         # Dynamic pricing engine (server-side)
│   │   └── utils.ts           # cn() utility (clsx + tailwind-merge)
│   ├── hooks/                 # (empty — for future custom hooks)
│   └── types/                 # (empty — for future TypeScript interfaces)
├── package.json               # Dependencies and scripts
├── tailwind.config.ts         # Tailwind with brand colors + fonts
├── tsconfig.json              # TypeScript config with @/ alias
├── next.config.mjs            # Next.js config (Unsplash image domain)
├── postcss.config.js          # PostCSS for Tailwind
├── .env.example               # Environment variable template
├── .gitignore                 # node_modules, .next, .env*
├── PROGRESS.md                # Earlier progress tracking
└── PROJECT_CONTEXT.md         # THIS FILE — you're reading it
```

---

## 5. The 4-Step Booking Flow (IMPORTANT)

This is the core feature. The flow uses **Zustand** for client-side state persistence across pages.

### Flow: `/booking` → `/booking/options` → `/booking/checkout` → `/booking/confirmation`

### Step 1: Vehicle List (`/booking`)
- **Left sidebar:** Search details card (pickup/dropoff locations & dates), Google Map preview, filter panel (price range, car spec, mileage, fuel policy, seats)
- **Main area:** Coral result count banner, horizontal category tabs (Pickup, Mini, SUV, 7-seater), currency selector, vehicle listing cards
- **Each car card shows:** image, name, category, transmission/seating/fuel badges, pickup location, fuel policy, payment option (25%/100%), price for N days, "Included for free" checklist, "Select This Car" CTA, "Extend & Save More" accordion
- **On car selection:** saves to Zustand store → navigates to Step 2

### Step 2: Add Options (`/booking/options`)
- **Top banner:** "Travel Together, Drive Together" free driver promo
- **Floating tooltip:** "Recommended for you!" popup on Accident Protection row
- **5 extras rows with +/- counters:**
  1. Accident Protection – Full Coverage (€10/day, max €150, "Most chosen" badge)
  2. Baby Seat (€5/day, max €30)
  3. Booster Seat (€5/day, max €30)
  4. Child Seat (€5/day, max €30)
  5. SIM Card (€30/unit, Emtel 5G)
- **Right sidebar (PriceSidebar):** sticky — car thumbnail, pickup/dropoff, price breakdown with dynamic rows for selected extras, total, and "You are fully covered" card when accident protection is added
- **Bottom nav:** Back ← | Continue →

### Step 3: Driver Details (`/booking/checkout`)
- **Form:** Title, First Name, Last Name, Email, Phone, Age Group (radio 18-29/30-69/70+), Country
- **Social login buttons:** Facebook + Gmail (visual only)
- **Collapsible sections:** Additional Driver (optional), Travel Info (optional)
- **Payment mode selector:** "Pay 25% Now" vs "Pay 100% Now" toggle cards
- **Promo code:** input + "Apply Code" red button
- **Terms checkbox:** required before payment
- **Bottom:** "Pay Now →" CTA + "Limited Availability" urgency text
- **Right sidebar:** same PriceSidebar with 25%/75% breakdown

### Step 4: Booking Confirmation (`/booking/confirmation`)
- Green checkmark success animation
- Generated booking reference (e.g., CHM-2026-12345)
- Full summary: vehicle, dates, extras, driver info, payment breakdown
- "Download Confirmation PDF" + "Back to Home" buttons

### Zustand Store (`bookingStore.ts`)
```typescript
// Key state:
currentStep, searchParams (pickup/dropoff location+date+time),
selectedVehicle, selectedOptions[], driverDetails, paymentMode ('25%' | '100%'),
promoCode, agreedToTerms

// Key computed values:
getRentalDays(), getRentalFee(), getOptionsTotal(), getTotal()

// Default search params:
pickup: SSR International Airport, Mauritius
dates: 2026-06-15 to 2026-06-25 (10 days)
```

---

## 6. Database Schema (Prisma)

The schema is comprehensive (411 lines) with these models:

| Model | Purpose |
|-------|---------|
| **User** | Customer/admin accounts (email, optional `passwordHash`, role, loyalty points, VIP, blacklist) |
| **Account / Session** | NextAuth.js authentication |
| **Car** | Fleet vehicles (make, model, year, category, specs, pricing, images, status) |
| **CarImage** | Multiple images per car |
| **Booking** | Reservations (dates, locations, pricing breakdown, status, driver info) |
| **BookingAddon** | Selected extras per booking |
| **Addon** | Available extras (baby seat, GPS, etc.) |
| **Payment** | Payment records (Stripe integration) |
| **PricingRule** | Dynamic pricing (seasonal, surge, duration, category multipliers) |
| **Coupon** | Promo codes (% or fixed discount) |
| **Review** | Customer ratings (1-5 stars) |
| **Location** | Pickup/dropoff points (airport, city, hotel, port) |
| **Branch** | Business locations |
| **Document** | Customer document uploads (license, passport) |
| **MaintenanceLog** | Vehicle maintenance tracking |
| **AuditLog** | System audit trail |
| **CustomerNote** | Admin notes on customers |

### Enums
`UserRole (Customer/Admin/Manager/Staff)`, `BookingStatus`, `PaymentStatus`, `CarStatus`, `FuelType`, `Transmission`, `CarCategory (Economy/Compact/Midsize/SUV/Luxury/Sports/Van/Convertible)`

---

## 7. Environment Variables Required

```bash
# Runtime DB connection (Supabase pooled Postgres)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true&connection_limit=1&schema=public"

# Direct DB connection for migrations/db push
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public"

# NextAuth (required for admin login)
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Future integrations (not active yet)
STRIPE_SECRET_KEY=""
RESEND_API_KEY=""
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=""
```

---

## 8. Pages & Routes Summary

| Route | Status | Description |
|-------|--------|-------------|
| `/` | ✅ Complete | Homepage — hero, search widget, featured cars, stats, testimonials, promo |
| `/fleet` | ✅ Complete | Fleet showcase with filters (category, transmission, price sort) |
| `/about` | ✅ Complete | Company story, values, team section |
| `/locations` | ✅ Complete | 4 branch locations across Mauritius |
| `/contact` | ✅ Complete | Contact form + business details |
| `/admin` | ✅ Active | Admin dashboard behind NextAuth session |
| `/admin/login` | ✅ Active | Credentials login for admin users |
| `/booking` | ✅ Complete | Step 1: Vehicle list with filters and car cards |
| `/booking/options` | ✅ Complete | Step 2: Add extras (5 options with counters) |
| `/booking/checkout` | ✅ Complete | Step 3: Driver details + payment mode |
| `/booking/confirmation` | ✅ Complete | Step 4: Booking success + summary |

---

## 9. Deployment Setup

### GitHub → Vercel Auto-Deploy
- **Repo:** `avadhbajaj07/carhire` (branch: `main`)
- **Build command:** `prisma generate && next build`
- **Git config:** `user.email = shouryasaad6@gmail.com` (MUST match GitHub account)
- **Push from terminal:** `git push origin main` (HTTPS, needs PAT)
- **.gitignore:** includes `.next/`, `node_modules/`, `.env*`

### Before Deploying
1. Ensure `DATABASE_URL` is set in Vercel env vars
2. Commit with correct author email (`shouryasaad6@gmail.com`)
3. Push → Vercel auto-deploys

---

## 10. Current Issues & Next Steps

### Known Issues
- [ ] **Vehicle images are Unsplash placeholders** — need real car images
- [ ] **Booking is client-side only** — no API routes to save bookings to database yet
- [ ] **Production admin auth depends on live DB update** — `User.passwordHash` and seeded admin must exist in Supabase
- [ ] **No search form on homepage → booking bridge** — currently uses hardcoded search params
- [ ] **No payment integration** — Stripe is in dependencies but not wired up
- [ ] **No email notifications** — Resend is in dependencies but not configured
- [ ] **Drop-off location** — same as pickup by default, no separate selector

### Suggested Next Steps (Priority Order)
1. **Wire up API routes** — POST `/api/bookings` to save bookings to Supabase
2. **Connect homepage search → booking** — pass search params via URL or Zustand
3. **Add real car images** — replace Unsplash with actual fleet photos
4. **Stripe payment** — integrate checkout on Step 3
5. **Email confirmations** — send booking confirmation via Resend
6. **Admin expansion** — list bookings, manage fleet, CRUD operations beyond current dashboard/fleet/calendar/customer screens
7. **Drop-off location selector** — separate from pickup in both homepage search and booking

---

## 11. Current Handoff Notes

- Latest pushed Git commit is `b42bef98531d8a86821712c5fda6184c3330c524` (`b42bef9` short SHA).
- The previous Vercel failure discussed in chat was for older commit `d868a35`, not the latest pushed fix.
- The fix in `src/app/admin/login/page.tsx` wraps `useSearchParams()` in a `Suspense` boundary to address the production prerender error.
- `origin/main` and local `HEAD` matched at the time of handoff.

## 12. Git History

```
54aa027 feat: Complete 4-step booking flow with vehicle list, add-ons, driver details, and confirmation
67ae2f4 feat: Premium luxury island redesign with new components and untrack .next build
cd14c77 Fix: Add prisma generate to build script for Vercel deployment
c631a74 Docs: Add project progress report and launch status
c1245ea Fix: Resolve pricing logic syntax errors and Vercel build blockers
630b511 Initial commit: Car Hire Mauritius Luxury Platform Rebuild
```

---

## 13. Quick Commands

```bash
# Development
npm run dev           # Start dev server (localhost:3000)
npm run build         # Production build
npm run lint          # Run ESLint

# Database
npm run db:push       # Push schema to database
npm run db:seed       # Seed with sample data
npm run db:studio     # Open Prisma Studio GUI
npm run db:migrate    # Create migration

# Git
git add -A && git commit -m "message"
git push origin main  # Deploy to Vercel
```
