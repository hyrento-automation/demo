# Car Hire Admin Calendar — Full Redesign Brief
# For: Your Developer / Antigravity Team
# Project: carhire-nine.vercel.app — Admin Dashboard Calendar

---

## OVERVIEW

Redesign the /admin/calendar page with a world-class fleet management calendar.
The goal is a professional, competitive admin tool that no car rental company in
the region can match. Every screen, component, and interaction is described below.
Code files for all 3 main components are included alongside this document.

---

## FILES INCLUDED (use these as the implementation base)

1. CalendarMonthView.jsx   — Month view calendar with stats, events, quick actions
2. CalendarWeekView.jsx    — Week view with hourly time grid and live now-line
3. BookingDetail.jsx       — Full booking detail card with all fields and actions
4. EditBookingForm.jsx     — Live edit form with real-time price recalculation

---

## 1. OVERALL PAGE STRUCTURE

The /admin/calendar page should render one of four views depending on the active
view toggle: Month, Week, Day, Timeline.

All views share:
- A top bar (title + month/week navigation + view toggle + New Booking button)
- A stats row (4 metric cards)
- A legend row below the calendar grid
- A quick-actions row at the bottom (5 buttons)

Routing: use a URL query param ?view=month|week|day|timeline so users can
bookmark and share specific views. Default to month.

---

## 2. COLOUR SYSTEM — BOOKING TYPES

Use these exact colours for all booking event blocks. Never deviate.

| Type        | Background | Text    |
|-------------|------------|---------|
| pickup      | #B5D4F4    | #042C53 |
| return      | #C0DD97    | #173404 |
| pending     | #FAC775    | #412402 |
| overdue     | #F7C1C1    | #501313 |
| maintenance | #CECBF6    | #26215C |
| longterm    | #9FE1CB    | #04342C |

Primary action blue: #185FA5 (buttons, today highlight, pickup date text)
Hover blue: #0C447C

---

## 3. STATS ROW (all views)

Show these 4 metric cards in a 4-column grid above the calendar:

Card 1 — Active Rentals
  Value:  count of currently active bookings from DB
  Sub:    "+N from last week" in green (#3B6D11)

Card 2 — Upcoming Today
  Value:  count of today's events
  Sub:    "N pickups · N returns"

Card 3 — Fleet Utilisation
  Value:  (rented cars / total cars) as percentage
  Sub:    "+N% vs last month" in green

Card 4 — Pending Confirm
  Value:  count of pending bookings
  Sub:    "Action needed" in amber (#854F0B), or "All clear" in green

---

## 4. MONTH VIEW  (CalendarMonthView.jsx)

Grid: 7 columns, one cell per day. Each cell minimum height 90px.

Day number circle:
- Today: white text on #185FA5 circle (30×30px, border-radius 50%)
- Other current month: #111
- Adjacent month days: #ccc, no events shown

Event blocks inside cells:
- Show max 2 events, then "+N more" link
- Each block: border-radius 4px, font-size 11px, font-weight 500, truncated
- Clicking an event opens BookingDetail drawer/modal
- Clicking "+N more" opens a day detail popover listing all events
- Clicking any empty cell opens the New Booking form pre-filled with that date

Today's cell background: rgba(24, 95, 165, 0.04)

Navigation: ← month label → arrows. "Today" button resets to current month.

---

## 5. WEEK VIEW  (CalendarWeekView.jsx)

Layout: 52px time label column + 7 equal day columns.

Time range: 8 AM – 7 PM (12 slots, each 52px tall).

Day headers:
- Day name (MON, TUE …) in uppercase 11px
- Date number in 18px
- Today: blue #185FA5 text for day name, number in white on #185FA5 circle

Event blocks:
- Positioned absolutely within each day column
- Top = (hour - 8) × 52 + 3 pixels
- Height = duration × 52 - 6 pixels
- Left/right: 2px gutter each side
- Clicking opens BookingDetail

NOW line:
- 2px red (#E24B4A) horizontal line across ALL day columns
- Position = current minute proportion within the current hour slot
- Only show on today's column (or full-width — your preference)
- Refreshes every 60 seconds

Slot hover: clicking any empty slot opens New Booking form pre-filled with
that date and time.

---

## 6. DAY VIEW

Same time grid as week view but showing only a single day.
Columns represent individual CARS (show registration, model, and a colour dot).
This lets staff see which car is booked when at a glance.

- Left column: 52px time labels (8 AM – 7 PM)
- Each subsequent column = one car in the fleet
- Event blocks span the full column width for that car
- Scroll horizontally if fleet is large (>6 cars)
- Header row shows car reg, model name, and availability indicator:
    Green dot = available now
    Amber dot = returning today
    Red dot   = currently rented

---

## 7. TIMELINE VIEW (Gantt-style)

Rows = cars. Columns = days of the selected month.

- Left column (120px): car registration + model
- Each cell: one day for that car
- Booking blocks span across columns by date range, coloured by booking type
- Hovering a block shows customer name + dates tooltip
- Clicking opens BookingDetail

This view is the most powerful for fleet utilisation — staff can immediately
see which cars are free on which dates.

---

## 8. BOOKING DETAIL  (BookingDetail.jsx)

Opens as a right-side drawer (on desktop) or full-screen modal (on mobile).

Sections:
1. Header — vehicle name + reg, booking ID, created date, status badge
2. Customer — avatar initials, name, phone, email, loyalty badge, licence, prior bookings, rating
3. Rental period — pickup date/time/location → return date/time/location, duration, km limit, fuel policy
4. Vehicle details — model, reg, plate, category, colour, odometer, last service date
5. Pricing breakdown — daily rate × days, add-ons, airport fee, discount, total, payment status
6. Notes — free text
7. Action bar — Mark as picked up | Send reminder | Edit booking | Cancel booking

Status badge colours:
  confirmed pickup → #B5D4F4 bg / #042C53 text
  returned         → #C0DD97 bg / #173404 text
  pending          → #FAC775 bg / #412402 text
  overdue          → #F7C1C1 bg / #501313 text

---

## 9. EDIT BOOKING FORM  (EditBookingForm.jsx)

Full-page form with live price recalculation.

Sections: Customer | Vehicle | Rental period | Add-ons | Pricing | Notes

Live pricing:
  total = (days × dailyRate) + addonsTotal + airportFee − (subtotal × discount/100)
  Update in real-time as any field changes.
  Show unsaved-changes red dot in the heading until saved.

Add-ons (checkbox grid, 2 columns):
  Child seat     ₹200/day
  GPS navigator  ₹300/day
  Driver service ₹500/day
  Premium insurance ₹150/day

Vehicles dropdown: query your fleet DB for currently available cars, filtering
out cars already booked for the same dates (excluding this booking itself).

On save: PATCH /api/bookings/:id with the full updated payload.
On discard: confirm dialog if isDirty, then navigate back.

---

## 10. QUICK ACTION BUTTONS (all views)

5 buttons in a flex row below the calendar:

1. ⏰ Overdue alerts  → /admin/alerts?type=overdue
2. 📊 Revenue report  → /admin/reports?period=week|month depending on view
3. 🔧 Maintenance due → /admin/fleet/maintenance
4. 💡 Smart pricing   → /admin/pricing (dynamic pricing suggestions)
5. 📄 Export schedule → trigger PDF download of current view

---

## 11. TODAY'S SCHEDULE PANEL (Month view only — optional sidebar)

A side panel showing today's bookings in chronological order.
Each row: car icon | car model + reg | customer name + time | status badge

Fleet availability bars below:
  Sedans (N cars)  — filled bar showing % rented
  SUVs (N cars)    — filled bar
  Luxury (N cars)  — filled bar
  Economy (N cars) — filled bar

Bar colours:
  < 70% utilisation: #378ADD (blue)
  70–89%: #BA7517 (amber)
  ≥ 90%: #E24B4A (red — flag for urgent restocking)

---

## 12. NEW BOOKING FORM

Accessible from:
  - "+ New Booking" button (any view)
  - Clicking an empty calendar slot (pre-fills date/time)

Fields: same as Edit Booking Form, but all blank.
On save: POST /api/bookings, then refresh calendar data.

---

## 13. API INTEGRATION

Replace all sample data with real API calls:

GET  /api/bookings?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD  → list for calendar
GET  /api/bookings/:id                                        → booking detail
POST /api/bookings                                            → create
PATCH /api/bookings/:id                                       → update
DELETE /api/bookings/:id                                      → cancel

GET  /api/fleet                                               → all vehicles
GET  /api/fleet/available?start=&end=&excludeBookingId=       → available for a date range

For calendar views, fetch bookings for the visible date range (+/- buffer days).
Use SWR or React Query for caching and background revalidation.

---

## 14. MOBILE RESPONSIVENESS

- Month view: shrink cells, show coloured dot instead of full event label on small screens
- Week view: show 3 days at a time on mobile, swipe to scroll
- Day view: scrollable columns
- Booking detail / Edit form: full-screen on mobile, max-width 600px centred on desktop
- Stats row: 2×2 grid on mobile

---

## 15. PERFORMANCE NOTES

- Virtualise the timeline view rows if fleet > 30 cars (use react-window)
- Debounce the live price recalculation by 100ms
- Lazy-load BookingDetail and EditBookingForm (they're large)
- Cache fleet data for 5 minutes (changes rarely)

---

## QUESTIONS FOR DEVELOPER

1. What is your current state management — Redux, Zustand, React Query, or plain useState?
2. Is there an existing design system / component library (Tailwind, MUI, shadcn)?
3. What is the booking data schema in your database?
4. Do you want the Booking Detail as a drawer (slides in from right) or a modal overlay?
5. Should the "Smart Pricing" button integrate with any external pricing engine?

---

## PRIORITY ORDER FOR IMPLEMENTATION

Phase 1 (core):
  ✅ Month view with colour-coded events
  ✅ Booking detail drawer
  ✅ Edit booking form with live pricing

Phase 2 (power features):
  ✅ Week view with hourly grid + now-line
  ✅ Day view (cars as columns)
  ✅ Stats row connected to real data
  ✅ Today's schedule + fleet availability sidebar

Phase 3 (competitive edge):
  ✅ Timeline/Gantt view
  ✅ Smart pricing button
  ✅ PDF export
  ✅ Overdue alerts panel
  ✅ Mobile swipe gestures

---

End of brief. All questions → [your contact here]
