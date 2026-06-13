# SKILL: Design System & UI
## Car Hire Mauritius — Luxury Island Aesthetic

---

## 🎨 DESIGN TOKENS

```css
/* globals.css */
:root {
  --navy: #1B2D4F;           /* Primary — deep ocean navy */
  --navy-light: #2A4A7F;
  --gold: #C9A84C;           /* Accent — Mauritian sunshine gold */
  --gold-light: #E8C97A;
  --white: #FFFFFF;
  --off-white: #F8F7F4;      /* Warm page background */
  --light-gray: #F0EFEC;
  --mid-gray: #8A8A8A;
  --dark-gray: #2C2C2A;
  
  --font-display: 'Playfair Display', Georgia, serif;  /* Hero headings */
  --font-body: 'Inter', system-ui, sans-serif;          /* Body copy */
  
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  
  --shadow-card: 0 2px 12px rgba(27, 45, 79, 0.08);
  --shadow-hover: 0 8px 32px rgba(27, 45, 79, 0.15);
  --transition: all 0.2s ease;
}
```

---

## 🧱 CORE COMPONENTS

### Navbar
```tsx
// components/layout/Navbar.tsx
// - Logo: "Car Hire" (navy) + "Mauritius" (gold) — two-tone text
// - Links: Fleet, Locations, About, Contact
// - Right: Phone number with icon, "Book Now" button (gold background)
// - Mobile: hamburger menu with slide-in drawer
// - Scroll behaviour: transparent with white text on hero, white bg + navy text after 80px scroll
// - On auth: show customer avatar dropdown (Dashboard, Bookings, Logout)
```

### Hero Search Form
```tsx
// components/home/HeroSearch.tsx
// This is the most critical component — must work perfectly

// Layout: horizontal card on desktop, stacked on mobile
// Fields:
//   [Pickup Location ▼] [Return Location ▼] [Pick-up Date 📅] [Return Date 📅] [Search Cars →]
// 
// "Same return location" checkbox — when checked, hides return location field
// Locations are a searchable select populated from /api/locations
// Date picker: react-day-picker, disables past dates, min 1 day range
// Button: gold background, white text, full width on mobile
// On submit: navigate to /booking?pickup=X&return=Y&from=DATE&to=DATE
```

### Car Card
```tsx
// components/fleet/CarCard.tsx
interface CarCardProps {
  car: Car & { images: CarImage[]; reviews: { rating: number }[] }
  showPricing?: 'perDay' | 'total'
  totalDays?: number
}

// Layout:
// - Image (aspect 16:9, object-cover, rounded top)
// - Availability badge (top-right corner overlay)
// - Category badge (top-left, e.g. "LUXURY" in navy pill)
// - Car name: "2023 Toyota RAV4" 
// - Specs row: 🧑 5 seats  🧳 4 bags  ⚙️ Automatic  ⛽ Hybrid
// - Star rating + review count
// - Price: "MUR 3,500 / day" (large) + "~EUR 74 / day" (small, muted)
// - "Book Now" button (full width, gold on hover)
// - Card hover: translateY(-4px) + shadow-hover

// CSS:
// .car-card { border-radius: var(--radius-lg); overflow: hidden; transition: var(--transition); }
// .car-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
```

### Price Summary
```tsx
// components/booking/PriceSummary.tsx
// Shows full pricing breakdown:
// Base rate: MUR X,XXX × N days = MUR XX,XXX
// [Applied rule] Peak Season (+30%): + MUR X,XXX
// [Applied rule] 7+ Day Discount (-10%): - MUR X,XXX  
// Add-ons: + MUR X,XXX
//   └ GPS Navigation × 5 days: MUR 750
//   └ Full Insurance × 5 days: MUR 2,500
// ─────────────────────────────────
// Subtotal: MUR XX,XXX
// Coupon (WELCOME10 -10%): - MUR X,XXX  ← green text
// VAT (15%): + MUR X,XXX
// ═════════════════════════════════
// TOTAL: MUR XX,XXX (≈ EUR XXX)
// Security deposit: MUR XX,XXX (refundable)
```

---

## 📱 RESPONSIVE BREAKPOINTS

```css
/* Mobile first */
/* sm: 640px — tablet portrait */
/* md: 768px — tablet landscape */  
/* lg: 1024px — desktop */
/* xl: 1280px — wide desktop */

/* Key responsive rules: */
/* - Hero search: stacked mobile, horizontal grid lg+ */
/* - Fleet grid: 1 col mobile, 2 col sm, 3 col lg, 4 col xl */
/* - Admin sidebar: hidden mobile (drawer), fixed lg+ */
/* - Car detail: single col mobile, 2-col (gallery + booking) lg+ */
```

---

## 🏷️ STATUS BADGE COLOURS

```typescript
// utils/badgeColours.ts
export const bookingStatusColours = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  ACTIVE: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-purple-100 text-purple-800',
}

export const carStatusColours = {
  AVAILABLE: 'bg-green-100 text-green-800',
  RENTED: 'bg-blue-100 text-blue-800',
  MAINTENANCE: 'bg-amber-100 text-amber-800',
  RETIRED: 'bg-gray-100 text-gray-600',
}

export const categoryColours = {
  ECONOMY: 'bg-gray-100 text-gray-700',
  COMPACT: 'bg-blue-100 text-blue-800',
  MIDSIZE: 'bg-teal-100 text-teal-800',
  SUV: 'bg-green-100 text-green-800',
  LUXURY: 'bg-yellow-100 text-yellow-800',
  SPORTS: 'bg-red-100 text-red-800',
  VAN: 'bg-purple-100 text-purple-800',
  CONVERTIBLE: 'bg-pink-100 text-pink-800',
}
```

---

## 🌊 HOMEPAGE VISUAL SECTIONS

### Hero
```
Background: Linear gradient overlay (navy 40% opacity) over tropical coastal image
Height: 100vh on desktop, 85vh on mobile
Headline: font-display, 72px desktop / 40px mobile, white
Subheadline: font-body, 20px, white/80%
Search card: white card, rounded-xl, shadow-card, padding 24px
```

### Why Choose Us — 4 Cards
```
Icons: Lucide (Shield, Clock, MapPin, BadgeCheck)
Icon background: gold/10 (very light gold tint)
Icon colour: gold
Title: navy, font-weight 600
Body: mid-gray
Layout: 4-column grid on lg, 2-col sm, 1-col mobile
```

### How It Works — 3 Steps
```
1. Search & Select — (magnifying glass icon)
2. Book & Pay Securely — (credit card icon)  
3. Pick Up & Drive — (car icon)
Connector: dashed line between steps (desktop only)
Step number: large background digit in off-white (opacity 0.3)
```

---

## 🔤 TYPOGRAPHY SCALE

```
Display XL: Playfair Display, 72px, normal weight — Hero headline only
Display LG: Playfair Display, 48px — Page headings
H1: Playfair Display, 36px — Section headings
H2: Inter, 24px, 600 weight — Card headings
H3: Inter, 18px, 600 weight — Sub-sections
Body LG: Inter, 18px, 400 — Lead paragraphs
Body: Inter, 16px, 400 — Default text
Small: Inter, 14px, 400 — Meta, labels
XSmall: Inter, 12px, 500 — Badges, tags
```

---

## ⚡ PERFORMANCE NOTES

1. **Hero image:** Use Next.js `<Image>` with priority={true}, sizes="100vw"
2. **Car cards:** Lazy load images below the fold
3. **Fleet page:** Use React.Suspense with skeleton loaders
4. **Admin charts:** Lazy import recharts — it's large
5. **Fonts:** Use `next/font` with `display: swap` — avoid font flash
6. **Tailwind:** Only include used classes — ensure purge is configured
7. **API responses:** Cache location list (changes rarely) with Next.js unstable_cache
8. **Images:** Accept WebP from Cloudinary with auto format transformation
