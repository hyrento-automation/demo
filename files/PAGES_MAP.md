# 📄 CAR HIRE MAURITIUS — COMPLETE PAGES MAP
## Every page the agent MUST build with exact specifications

---

## 🌐 PUBLIC PAGES

### 1. Homepage `/`
**Purpose:** Convert visitors into bookings
**Sections (top to bottom):**
1. **Navbar** — Logo left, nav links centre, "Book Now" CTA gold button right. Transparent on scroll, white on scroll-down
2. **Hero Section** — Full-width background (tropical coast + luxury car), large headline "Discover Mauritius Your Way", subheading, embedded SearchForm component
3. **SearchForm (critical)** — Pickup location dropdown, return location checkbox ("same location"), date range picker, "Search Cars" button. This is the MOST IMPORTANT component on the site
4. **Popular Categories** — Icon row: Economy, Compact, SUV, Luxury, Sports, Van — click filters fleet
5. **Featured Cars** — 6-car grid with CarCard components (image, name, specs, price/day, "Book Now")
6. **Why Choose Us** — 4 icon blocks: Free Cancellation, 24/7 Support, Island-Wide Delivery, Best Price Guarantee
7. **How It Works** — 3-step horizontal: Search → Book & Pay → Drive
8. **Popular Locations** — Photo cards: Grand Baie, Flic en Flac, Port Louis, Belle Mare, Mahébourg — each links to `/booking?location=X`
9. **Testimonials** — 3 review cards with stars, name, country flag
10. **Promo Banner** — "15% off 7+ day bookings | Use code WEEK15" gold strip
11. **Footer** — Logo, nav columns, social links, trust badges

---

### 2. Fleet Page `/fleet`
**Purpose:** Browse all available cars with filters
**Layout:** Sidebar filters (left, collapsible on mobile) + Car grid (right)
**Filter options:**
- Category: All / Economy / Compact / Midsize / SUV / Luxury / Sports / Van / Convertible
- Transmission: All / Automatic / Manual
- Fuel: All / Petrol / Diesel / Hybrid / Electric
- Seats: 2+ / 4+ / 5+ / 7+
- Price range: Slider MUR 0–15,000/day
- Sort by: Price low-high, Price high-low, Popularity, Newest
**URL params:** `/fleet?category=suv&transmission=automatic&minPrice=2000`

---

### 3. Car Detail Page `/fleet/[slug]`
**Purpose:** Showcase one car, drive booking
**Sections:**
1. Breadcrumb: Home > Fleet > Toyota RAV4
2. **Image gallery** — Main large image + thumbnail strip (Embla Carousel), fullscreen mode
3. **Car title block** — Make + Model + Year, Category badge, Availability badge (green "Available" / red "Unavailable")
4. **Booking widget (sticky right sidebar)** — Inline search form for this specific car, shows real-time price as dates are selected
5. **Specs grid** — Seats, Doors, Luggage, Fuel, Transmission, Engine CC, AC (yes/no)
6. **Features list** — Chips/pills for each feature
7. **Description** — Full car description
8. **Add-ons section** — Checkbox grid of available add-ons, quantities, prices
9. **Price breakdown preview** — Updates live as dates and add-ons change
10. **Reviews section** — Star average, review count, individual review cards
11. **Similar cars** — 3 CarCard components of same category

---

### 4. Search Results / Booking Page `/booking`
**Purpose:** Show available cars for selected dates/location
**Query params:** `?pickup=SSR+Airport&return=Grand+Baie&from=2025-08-01&to=2025-08-08`
**Layout:**
1. **Summary bar** — Selected dates, locations, edit button
2. **Filter/sort controls** — Compact top bar
3. **Results grid** — Available cars with price for the selected period (NOT per day — show total)
4. **Unavailable cars** — Greyed out at the bottom with "Not available for these dates"
5. **No results state** — Suggest alternate dates

---

### 5. Checkout Page `/booking/checkout`
**Purpose:** Complete booking with payment
**Steps (progress bar):**
- Step 1: Your Details (name, email, phone, license number, age verification)
- Step 2: Add-Ons (if not selected on car detail)
- Step 3: Review & Pay
**Step 3 content:**
- Left: Order summary (car details, dates, add-ons, coupon input, price breakdown)
- Right: Payment form (Stripe Elements — card, or "Pay Later" deposit option)
- Coupon code input with "Apply" button
- Terms acceptance checkbox
- "Confirm & Pay" button (gold)
**IMPORTANT:** Show both MUR and EUR prices throughout checkout

---

### 6. Booking Confirmation Page `/booking/confirmation`
**Purpose:** Confirm booking + trigger emails
**Sections:**
1. Success animation (checkmark)
2. Booking reference number (large, bold: CHM-2025-12345)
3. Summary box (car, dates, location, total paid)
4. "Download Invoice PDF" button
5. WhatsApp contact button
6. "Add to Calendar" button (.ics download)
7. Next steps (what to bring, pickup instructions)
8. Related cars (upsell for future bookings)

---

### 7. About Page `/about`
**Sections:** Company story, team, fleet stats (number of cars, years in business, happy customers), certifications, insurance partners

---

### 8. Contact Page `/contact`
**Sections:**
- Contact form (name, email, phone, message, booking ref optional)
- Contact details (phone, email, WhatsApp, address)
- Leaflet map showing 2 branch locations
- Opening hours
- Emergency breakdown number

---

### 9. FAQ Page `/faq`
**Format:** Accordion expand/collapse
**Categories:** Booking, Payments, Requirements, Fleet, Locations, Insurance

---

### 10. Locations Page `/locations`
**Sections:** Interactive Leaflet map + cards for each pickup location with address, type (airport/city/port), available cars count

---

## 🔒 AUTH PAGES

### 11. Login `/login`
- Email + password form
- Google OAuth button
- "Continue as guest" option
- Forgot password link

### 12. Register `/register`
- Name, email, password, phone
- Google OAuth button
- Terms acceptance

### 13. Forgot Password `/forgot-password`

---

## 👤 CUSTOMER DASHBOARD (requires auth)

### 14. Dashboard Home `/dashboard`
- Welcome message, loyalty points bar
- Upcoming bookings (max 3 cards)
- Past bookings summary
- Quick actions: New Booking, Upload Document, Contact Support

### 15. My Bookings `/dashboard/bookings`
- Tabs: Upcoming / Active / Completed / Cancelled
- Each booking card: car image, dates, status badge, total, action buttons (view, cancel, download invoice)
- Detail modal/page on click

### 16. Profile `/dashboard/profile`
- Edit name, phone, address
- Change password
- Notification preferences (email/SMS)
- Delete account

### 17. Documents `/dashboard/documents`
- Upload: Driving Licence (front + back), Passport, ID Card
- Status: Verified / Pending / Expired
- Expiry alerts

### 18. Loyalty & Rewards `/dashboard/loyalty`
- Points balance, tier (Bronze/Silver/Gold/Platinum)
- Points history table
- Rewards to redeem
- How to earn more points

---

## 🔧 ADMIN PANEL (requires ADMIN or MANAGER role)

### 19. Admin Dashboard `/admin`
**KPI Cards (top row):**
- Total Revenue (month), Bookings (month), Active Rentals, Fleet Utilisation %
**Charts:**
- Revenue line chart (last 12 months)
- Bookings by category bar chart
- Peak demand calendar heatmap
**Tables:**
- Recent bookings (last 10) with status
- Cars needing service (maintenance due)

### 20. Fleet Management `/admin/fleet`
- Table: All cars, status badge, last service, utilisation %, actions
- "Add New Car" button → modal/form
- Edit car: all fields including pricing, images upload
- Status toggle: Available / Maintenance / Retired
- Service log modal per car

### 21. Bookings Management `/admin/bookings`
- **Kanban view:** Pending → Confirmed → Active → Completed
- **Table view toggle:** Sortable, filterable, searchable
- Click booking → detail drawer/page
- Actions: Confirm, Assign driver, Modify dates, Cancel, Issue refund
- Bulk select + bulk status change

### 22. Customer Management `/admin/customers`
- Table: Name, email, phone, total bookings, total spend, VIP badge, blacklist badge
- Click → customer profile with full history
- Actions: Add note, Toggle VIP, Toggle blacklist, Send email, View documents

### 23. Pricing Engine `/admin/pricing`
- Current pricing rules table (active/inactive toggle)
- "Add Rule" form: type, category, dates, multiplier
- Coupon manager: create, edit, deactivate coupons, see usage stats
- Live pricing preview: select car + dates → shows what price would be

### 24. Reports `/admin/reports`
- Revenue report (by period, category, location)
- Fleet utilisation report
- Customer acquisition report
- Export all as Excel or PDF

### 25. Settings `/admin/settings`
- Company info (name, address, phone, logo)
- Tax rate configuration
- Email template editor
- Notification settings
- User management (add/edit/remove staff)
- Integrations (Stripe, Twilio, Cloudinary keys — masked)

---

## 📧 AUTOMATED EMAIL TEMPLATES (trigger via Resend)

1. **Booking Confirmation** — booking ref, car details, dates, pickup instructions, invoice PDF attached
2. **Booking Reminder** — 24h before pickup
3. **Return Reminder** — 24h before return date
4. **Receipt/Invoice** — after payment, PDF attached
5. **Cancellation Confirmation** — with refund details
6. **Welcome Email** — on registration, includes WELCOME10 coupon
7. **Review Request** — 24h after return date
8. **Password Reset**
9. **Document Expiry Alert** — 30 days before document expires
10. **Booking Status Update** — when admin changes booking status
