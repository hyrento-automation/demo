// BookingDetail.jsx
// Car Hire Admin — Booking Detail Card / Drawer
// Usage: <BookingDetail booking={booking} onClose={fn} onEdit={fn} onMarkPickup={fn} onCancel={fn} />

export default function BookingDetail({ booking, onClose, onEdit, onMarkPickup, onSendReminder, onCancel }) {
  if (!booking) return null;

  const {
    id = "BK-20260423-007",
    vehicle = { name: "Mercedes GLC 300", reg: "LUX-007", plate: "MH 04 BZ 7291", category: "Luxury SUV", colour: "Obsidian Black", odometer: "18,430 km", lastService: "Mar 12, 2026" },
    customer = { name: "Neha Verma", initials: "NV", phone: "+91 98765 43210", email: "neha.verma@gmail.com", licence: "MH-DL-2019-004821", priorBookings: 4, rating: "5.0" },
    pickup = { date: "Wed, Apr 23", time: "10:00 AM", location: "Airport Terminal 1, Indore" },
    returnDate = { date: "Sat, Apr 26", time: "10:00 AM", location: "Airport Terminal 1, Indore" },
    duration = "3 days",
    kilometres = "Unlimited",
    fuelPolicy = "Full to full",
    pricing = { dailyRate: 4500, days: 3, addons: 1050, airportFee: 500, discount: 675, total: 14375 },
    status = "Confirmed pickup",
    paymentStatus = "Paid in full",
    paymentMethod = "UPI",
    paymentDate = "Apr 18, 2026",
    notes = "Customer requested child seat (confirmed available). Will collect from Airport T1 arrivals bay. Preferred drop-off inside terminal. Verified licence and Aadhaar on booking.",
    createdAt = "Apr 18, 2026",
  } = booking;

  return (
    <div style={wrapStyle}>

      {/* back button */}
      <button onClick={onClose} style={backBtnStyle}>
        ← Back to calendar
      </button>

      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>Booking detail</h1>
          <p style={{ fontSize: 12, color: "#888", margin: "2px 0 0" }}>{id} · Created {createdAt}</p>
        </div>
        <span style={statusBadgeStyle}>{status}</span>
      </div>

      {/* card shell */}
      <div style={cardStyle}>

        {/* vehicle header */}
        <div style={{ padding: "1.25rem", borderBottom: "0.5px solid #eee", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={carAvatarStyle}>
              <CarIcon />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 500 }}>{vehicle.name} · {vehicle.reg}</div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 3 }}>Booking {id} · Created {createdAt}</div>
            </div>
          </div>
        </div>

        {/* customer */}
        <Section title="Customer">
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#f8f8f8", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>
            <div style={avatarStyle}>{customer.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{customer.name}</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>{customer.phone} · {customer.email}</div>
            </div>
            <span style={loyaltyBadgeStyle}>Loyal customer</span>
          </div>
          <Grid cols={3}>
            <Field label="Licence"         value={customer.licence} />
            <Field label="Prior bookings"  value={`${customer.priorBookings} bookings`} />
            <Field label="Rating"          value={`${customer.rating} ★`} />
          </Grid>
        </Section>

        {/* rental period */}
        <Section title="Rental period">
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>Pickup</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#185FA5" }}>{pickup.date} · {pickup.time}</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{pickup.location}</div>
            </div>
            <div style={{ padding: "18px 8px 0", color: "#ccc", fontSize: 18 }}>→</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>Return</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#3B6D11" }}>{returnDate.date} · {returnDate.time}</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{returnDate.location}</div>
            </div>
          </div>
          <Grid cols={3}>
            <Field label="Duration"     value={duration} />
            <Field label="Kilometres"   value={kilometres} />
            <Field label="Fuel policy"  value={fuelPolicy} />
          </Grid>
        </Section>

        {/* vehicle details */}
        <Section title="Vehicle details">
          <Grid cols={3}>
            <Field label="Make & model"   value={vehicle.name} />
            <Field label="Registration"   value={`${vehicle.reg} · ${vehicle.plate}`} />
            <Field label="Category"       value={vehicle.category} />
            <Field label="Colour"         value={vehicle.colour} />
            <Field label="Odometer"       value={vehicle.odometer} />
            <Field label="Last serviced"  value={vehicle.lastService} />
          </Grid>
        </Section>

        {/* pricing */}
        <Section title="Pricing breakdown">
          <PriceRow label={`Daily rate (${pricing.days} × ₹${pricing.dailyRate.toLocaleString("en-IN")})`} value={`₹${(pricing.days * pricing.dailyRate).toLocaleString("en-IN")}`} />
          <PriceRow label="Add-ons"          value={`₹${pricing.addons.toLocaleString("en-IN")}`} />
          <PriceRow label="Airport pickup fee" value={`₹${pricing.airportFee.toLocaleString("en-IN")}`} />
          <PriceRow label="Loyalty discount" value={`–₹${pricing.discount.toLocaleString("en-IN")}`} valueStyle={{ color: "#3B6D11" }} />
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 6, borderTop: "0.5px solid #eee" }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Total</span>
            <span style={{ fontSize: 18, fontWeight: 500, color: "#185FA5" }}>₹{pricing.total.toLocaleString("en-IN")}</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
            Payment: <span style={{ color: "#3B6D11", fontWeight: 500 }}>{paymentStatus}</span> · {paymentMethod} · {paymentDate}
          </div>
        </Section>

        {/* notes */}
        <Section title="Notes">
          <div style={{ background: "#f8f8f8", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#555", lineHeight: 1.6 }}>
            {notes}
          </div>
        </Section>

        {/* actions */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "1.25rem", background: "#fafafa", borderTop: "0.5px solid #eee" }}>
          <button onClick={onMarkPickup}   style={primaryActionStyle}>Mark as picked up</button>
          <button onClick={onSendReminder} style={secondaryActionStyle}>Send reminder</button>
          <button onClick={onEdit}         style={secondaryActionStyle}>Edit booking</button>
          <button onClick={onCancel}       style={dangerActionStyle}>Cancel booking</button>
        </div>

      </div>
    </div>
  );
}

// ─── small helpers ────────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div style={{ padding: "1.25rem", borderBottom: "0.5px solid #eee" }}>
      <div style={{ fontSize: 12, fontWeight: 500, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Grid({ cols = 2, children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12 }}>
      {children}
    </div>
  );
}

function Field({ label, value, highlight }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#aaa", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: highlight ? "#185FA5" : "#111" }}>{value}</div>
    </div>
  );
}

function PriceRow({ label, value, valueStyle }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "0.5px solid #f0f0f0", fontSize: 13 }}>
      <span style={{ color: "#888" }}>{label}</span>
      <span style={{ fontWeight: 500, ...(valueStyle || {}) }}>{value}</span>
    </div>
  );
}

function CarIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M4 14l3-6h14l3 6M4 14v5h20v-5M4 14h20" stroke="#185FA5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="8.5" cy="20" r="1.8" fill="#185FA5"/>
      <circle cx="19.5" cy="20" r="1.8" fill="#185FA5"/>
    </svg>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────
const wrapStyle      = { fontFamily: "Inter, system-ui, sans-serif", padding: "1rem 0" };
const backBtnStyle   = { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#888", cursor: "pointer", marginBottom: 20, border: "none", background: "none", padding: 0 };
const cardStyle      = { background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, overflow: "hidden" };
const statusBadgeStyle = { fontSize: 12, fontWeight: 500, padding: "4px 12px", borderRadius: 8, background: "#B5D4F4", color: "#042C53" };
const carAvatarStyle = { width: 52, height: 52, borderRadius: 8, background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
const avatarStyle    = { width: 36, height: 36, borderRadius: "50%", background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500, color: "#0C447C", flexShrink: 0 };
const loyaltyBadgeStyle = { fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 8, background: "#C0DD97", color: "#173404" };
const primaryActionStyle   = { background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", flex: 2, minWidth: 130 };
const secondaryActionStyle = { background: "#fff", color: "#111", border: "0.5px solid #ddd", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer", flex: 1, minWidth: 100 };
const dangerActionStyle    = { background: "#fff", color: "#A32D2D", border: "0.5px solid #F7C1C1", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer", flex: 1, minWidth: 100 };
