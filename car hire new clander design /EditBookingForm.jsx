// EditBookingForm.jsx
// Car Hire Admin — Edit Booking Form
// Usage: <EditBookingForm booking={booking} onSave={fn} onDiscard={fn} vehicles={[]} />

import { useState, useEffect } from "react";

const DEFAULT_BOOKING = {
  id: "BK-20260423-007",
  customer: { name: "Neha Verma", phone: "+91 98765 43210", email: "neha.verma@gmail.com", licence: "MH-DL-2019-004821" },
  vehicle: "lux007",
  category: "Luxury SUV",
  pickupDate: "2026-04-23",
  pickupTime: "10:00",
  returnDate: "2026-04-26",
  returnTime: "10:00",
  pickupLocation: "Airport Terminal 1, Indore",
  returnLocation: "Airport Terminal 1, Indore",
  kilometres: "Unlimited",
  fuelPolicy: "Full to full",
  dailyRate: 4500,
  discount: 5,
  airportFee: 500,
  addons: { childseat: true, gps: false, driver: false, insurance: true },
  notes: "Customer requested child seat (confirmed available). Will collect from Airport T1 arrivals bay. Preferred drop-off inside terminal. Verified licence and Aadhaar on booking.",
};

const VEHICLES = [
  { value: "lux007", label: "Mercedes GLC 300 · LUX-007" },
  { value: "lux004", label: "Mercedes GLE 450 · LUX-004" },
  { value: "lux002", label: "BMW 5 Series · LUX-002" },
  { value: "suv008", label: "Audi Q7 · SUV-008" },
  { value: "suv003", label: "Toyota Fortuner · SUV-003" },
];

const ADDON_DEFS = [
  { key: "childseat",  label: "Child seat",       pricePerDay: 200 },
  { key: "gps",        label: "GPS navigator",    pricePerDay: 300 },
  { key: "driver",     label: "Driver service",   pricePerDay: 500 },
  { key: "insurance",  label: "Premium insurance", pricePerDay: 150 },
];

const LOCATIONS = [
  "Airport Terminal 1, Indore",
  "Airport Terminal 2, Indore",
  "City Centre Office",
  "Hotel delivery",
  "Custom address",
];

export default function EditBookingForm({ booking = DEFAULT_BOOKING, vehicles = VEHICLES, onSave, onDiscard }) {
  const [form, setForm]       = useState(booking);
  const [isDirty, setIsDirty] = useState(false);
  const [pricing, setPricing] = useState({ days: 3, base: 0, addons: 0, airport: 0, discAmt: 0, total: 0 });

  const set = (key, value) => {
    setForm(f => ({ ...f, [key]: value }));
    setIsDirty(true);
  };
  const setCustomer = (key, value) => {
    setForm(f => ({ ...f, customer: { ...f.customer, [key]: value } }));
    setIsDirty(true);
  };
  const toggleAddon = (key) => {
    setForm(f => ({ ...f, addons: { ...f.addons, [key]: !f.addons[key] } }));
    setIsDirty(true);
  };

  // live price recalculation
  useEffect(() => {
    const p = new Date(form.pickupDate);
    const r = new Date(form.returnDate);
    const days = Math.max(1, Math.round((r - p) / 86400000));
    const base = days * (parseInt(form.dailyRate) || 0);
    const addonsTotal = ADDON_DEFS.reduce((sum, a) => sum + (form.addons[a.key] ? a.pricePerDay * days : 0), 0);
    const airport = parseInt(form.airportFee) || 0;
    const subtotal = base + addonsTotal + airport;
    const discAmt = Math.round(subtotal * (parseInt(form.discount) || 0) / 100);
    setPricing({ days, base, addons: addonsTotal, airport, discAmt, total: subtotal - discAmt });
  }, [form.pickupDate, form.returnDate, form.dailyRate, form.discount, form.airportFee, form.addons]);

  const handleSave = () => {
    if (onSave) onSave({ ...form, computedPricing: pricing });
  };

  const fmt = n => n.toLocaleString("en-IN");

  return (
    <div style={wrapStyle}>

      {/* header */}
      <button onClick={onDiscard} style={backBtnStyle}>← Back to booking details</button>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>
            Edit booking
            {isDirty && <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#E24B4A", marginLeft: 8, verticalAlign: "middle" }} />}
          </h1>
          <p style={{ fontSize: 12, color: "#888", margin: "2px 0 0" }}>{form.id} · Created Apr 18, 2026</p>
        </div>
        <span style={statusBadgeStyle}>Confirmed pickup</span>
      </div>

      {/* ── Customer section ── */}
      <Card>
        <SectionTitle>Customer</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#f8f8f8", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>
          <div style={avatarStyle}>NV</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{form.customer.name}</div>
            <div style={{ fontSize: 11, color: "#888" }}>{form.customer.phone} · {form.customer.email} · 4 prior bookings</div>
          </div>
          <span style={loyaltyBadgeStyle}>Loyal customer</span>
        </div>
        <div style={grid2}>
          <FormField label="Full name *">
            <input style={inputStyle} value={form.customer.name}    onChange={e => setCustomer("name",    e.target.value)} />
          </FormField>
          <FormField label="Phone *">
            <input style={inputStyle} value={form.customer.phone}   onChange={e => setCustomer("phone",   e.target.value)} />
          </FormField>
          <FormField label="Email">
            <input style={inputStyle} value={form.customer.email}   onChange={e => setCustomer("email",   e.target.value)} type="email" />
          </FormField>
          <FormField label="Licence number *">
            <input style={inputStyle} value={form.customer.licence} onChange={e => setCustomer("licence", e.target.value)} />
          </FormField>
        </div>
      </Card>

      {/* ── Vehicle section ── */}
      <Card>
        <SectionTitle>Vehicle</SectionTitle>
        <div style={grid2}>
          <FormField label="Assigned vehicle *">
            <select style={inputStyle} value={form.vehicle} onChange={e => set("vehicle", e.target.value)}>
              {vehicles.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
            </select>
          </FormField>
          <FormField label="Category">
            <select style={inputStyle} value={form.category} onChange={e => set("category", e.target.value)}>
              {["Luxury SUV","Luxury Sedan","Premium SUV","Economy"].map(c => <option key={c}>{c}</option>)}
            </select>
          </FormField>
        </div>
      </Card>

      {/* ── Rental period section ── */}
      <Card>
        <SectionTitle>Rental period</SectionTitle>
        <div style={grid2}>
          <FormField label="Pickup date *">
            <input style={inputStyle} type="date" value={form.pickupDate} onChange={e => set("pickupDate", e.target.value)} />
          </FormField>
          <FormField label="Pickup time *">
            <input style={inputStyle} type="time" value={form.pickupTime} onChange={e => set("pickupTime", e.target.value)} />
          </FormField>
          <FormField label="Return date *">
            <input style={inputStyle} type="date" value={form.returnDate} onChange={e => set("returnDate", e.target.value)} />
          </FormField>
          <FormField label="Return time *">
            <input style={inputStyle} type="time" value={form.returnTime} onChange={e => set("returnTime", e.target.value)} />
          </FormField>
          <FormField label="Pickup location *">
            <select style={inputStyle} value={form.pickupLocation} onChange={e => set("pickupLocation", e.target.value)}>
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
            </select>
          </FormField>
          <FormField label="Return location *">
            <select style={inputStyle} value={form.returnLocation} onChange={e => set("returnLocation", e.target.value)}>
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
            </select>
          </FormField>
          <FormField label="Kilometres">
            <select style={inputStyle} value={form.kilometres} onChange={e => set("kilometres", e.target.value)}>
              {["Unlimited","200 km/day","300 km/day"].map(k => <option key={k}>{k}</option>)}
            </select>
          </FormField>
          <FormField label="Fuel policy">
            <select style={inputStyle} value={form.fuelPolicy} onChange={e => set("fuelPolicy", e.target.value)}>
              {["Full to full","Full to empty","Prepaid fuel"].map(f => <option key={f}>{f}</option>)}
            </select>
          </FormField>
        </div>
      </Card>

      {/* ── Add-ons & Pricing section ── */}
      <Card>
        <SectionTitle>Add-ons</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
          {ADDON_DEFS.map(a => (
            <div
              key={a.key}
              onClick={() => toggleAddon(a.key)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: form.addons[a.key] ? "#E6F1FB" : "#f8f8f8",
                border: `0.5px solid ${form.addons[a.key] ? "#378ADD" : "#e0e0e0"}`,
                borderRadius: 8, padding: "8px 10px", cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <input
                type="checkbox"
                checked={form.addons[a.key]}
                onChange={() => toggleAddon(a.key)}
                style={{ width: 14, height: 14, accentColor: "#185FA5", flexShrink: 0 }}
                onClick={e => e.stopPropagation()}
              />
              <span style={{ fontSize: 12, flex: 1 }}>{a.label}</span>
              <span style={{ fontSize: 11, color: "#888" }}>₹{a.pricePerDay}/day</span>
            </div>
          ))}
        </div>

        <SectionTitle>Pricing</SectionTitle>
        <div style={{ ...grid2, gridTemplateColumns: "1fr 1fr 1fr", marginBottom: 12 }}>
          <FormField label="Daily rate (₹)">
            <input style={inputStyle} type="number" value={form.dailyRate}  onChange={e => set("dailyRate",  e.target.value)} />
          </FormField>
          <FormField label="Discount (%)">
            <input style={inputStyle} type="number" value={form.discount}   onChange={e => set("discount",   e.target.value)} min="0" max="100" />
          </FormField>
          <FormField label="Airport fee (₹)">
            <input style={inputStyle} type="number" value={form.airportFee} onChange={e => set("airportFee", e.target.value)} />
          </FormField>
        </div>

        {/* live price preview */}
        <div style={{ background: "#f8f8f8", borderRadius: 8, padding: "12px 14px" }}>
          {[
            { label: `Daily rate (${pricing.days} × ₹${fmt(parseInt(form.dailyRate)||0)})`, value: `₹${fmt(pricing.base)}` },
            { label: "Add-ons", value: `₹${fmt(pricing.addons)}` },
            { label: "Airport fee", value: `₹${fmt(pricing.airport)}` },
            { label: `Loyalty discount (${form.discount}%)`, value: `–₹${fmt(pricing.discAmt)}`, colour: "#3B6D11" },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", borderBottom: "0.5px solid #eee", color: "#888" }}>
              <span>{row.label}</span>
              <span style={{ fontWeight: 500, color: row.colour || "#111" }}>{row.value}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 6, borderTop: "0.5px solid #ddd" }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Total</span>
            <span style={{ fontSize: 18, fontWeight: 500, color: "#185FA5" }}>₹{fmt(pricing.total)}</span>
          </div>
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
          Payment status: <span style={{ color: "#3B6D11", fontWeight: 500 }}>Paid in full</span> · UPI · Apr 18, 2026
        </div>
      </Card>

      {/* ── Notes section ── */}
      <Card>
        <SectionTitle>Notes</SectionTitle>
        <FormField label="Internal notes">
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: "vertical", lineHeight: 1.5 }}
            value={form.notes}
            onChange={e => set("notes", e.target.value)}
          />
        </FormField>
      </Card>

      {/* actions */}
      <div style={{ display: "flex", gap: 8, padding: "1.25rem", background: "#fafafa", border: "0.5px solid #e0e0e0", borderRadius: 12, flexWrap: "wrap" }}>
        <button onClick={onDiscard} style={secondaryActionStyle}>Discard changes</button>
        <button onClick={handleSave} style={primaryActionStyle}>Save changes</button>
      </div>

    </div>
  );
}

// ─── small helpers ────────────────────────────────────────────────────────────
function Card({ children }) {
  return <div style={{ background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, overflow: "hidden", marginBottom: 12, padding: "1.25rem" }}>{children}</div>;
}
function SectionTitle({ children }) {
  return <div style={{ fontSize: 12, fontWeight: 500, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>{children}</div>;
}
function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────
const wrapStyle        = { fontFamily: "Inter, system-ui, sans-serif", padding: "1rem 0" };
const backBtnStyle     = { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#888", cursor: "pointer", marginBottom: 20, border: "none", background: "none", padding: 0 };
const statusBadgeStyle = { fontSize: 12, fontWeight: 500, padding: "4px 12px", borderRadius: 8, background: "#B5D4F4", color: "#042C53" };
const avatarStyle      = { width: 36, height: 36, borderRadius: "50%", background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500, color: "#0C447C", flexShrink: 0 };
const loyaltyBadgeStyle = { fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 8, background: "#C0DD97", color: "#173404" };
const inputStyle       = { width: "100%", fontFamily: "inherit", fontSize: 13, color: "#111", background: "#fff", border: "0.5px solid #ddd", borderRadius: 8, padding: "8px 10px", outline: "none", boxSizing: "border-box" };
const grid2            = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };
const primaryActionStyle   = { background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 500, cursor: "pointer", flex: 2, minWidth: 140 };
const secondaryActionStyle = { background: "#fff", color: "#111", border: "0.5px solid #ddd", borderRadius: 8, padding: "9px 16px", fontSize: 13, cursor: "pointer", flex: 1, minWidth: 100 };
