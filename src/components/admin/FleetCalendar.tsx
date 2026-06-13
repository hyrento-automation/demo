"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Plus, RefreshCw, Loader2, AlertCircle, X, CalendarDays } from "lucide-react";
import CalendarMonthView from "./CalendarMonthView";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Vehicle {
  id: string;
  make: string;
  model: string;
  plateNumber: string | null;
  category: string;
  status: string;
}

interface Booking {
  id: string;
  bookingRef: string;
  carId: string;
  pickupDate: string;
  returnDate: string;
  status: string;
  paymentStatus: string;
  driverName: string | null;
  totalPrice: number;
  totalDays: number;
  user?: { name: string | null; email: string | null } | null;
  car?: { make: string; model: string } | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getWeekDays(offsetWeeks: number): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monday = new Date(today);
  const dayOfWeek = today.getDay(); // 0=Sun
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // adjust to Monday
  monday.setDate(today.getDate() + diff + offsetWeeks * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatDateParam(d: Date) {
  return d.toISOString().split("T")[0];
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function clampToRange(d: Date, start: Date, end: Date) {
  if (d < start) return new Date(start);
  if (d > end) return new Date(end);
  return new Date(d);
}

const STATUS_CONFIG: Record<string, { bg: string; border: string; text: string; label: string; dot: string }> = {
  CONFIRMED: { bg: "#B5D4F4", border: "#8abce8", text: "#042C53", label: "Confirmed", dot: "#042C53" },
  PENDING:   { bg: "#FAC775", border: "#f5b244", text: "#412402", label: "Pending",   dot: "#412402" },
  ACTIVE:    { bg: "#C0DD97", border: "#a6cd75", text: "#173404", label: "Active",    dot: "#173404" },
  COMPLETED: { bg: "#eceff1", border: "#cfd8dc", text: "#374151", label: "Completed", dot: "#607d8b" },
  CANCELLED: { bg: "#F7C1C1", border: "#e89494", text: "#501313", label: "Cancelled/Overdue", dot: "#501313" },
};

// VIBGYOR-inspired category colors
const CATEGORY_COLOR: Record<string, { bg: string; border: string; text: string; bar: string; label: string; emoji: string }> = {
  LUXURY:      { bg: "#f3e8ff", border: "#c084fc", text: "#7e22ce", bar: "#a855f7", label: "Luxury",      emoji: "💜" },
  SPORTS:      { bg: "#ffe4e6", border: "#f9a8d4", text: "#9f1239", bar: "#f43f5e", label: "Sports",      emoji: "❤️" },
  SUV:         { bg: "#ffedd5", border: "#fdba74", text: "#9a3412", bar: "#f97316", label: "SUV",          emoji: "🧡" },
  CONVERTIBLE: { bg: "#fef9c3", border: "#fde047", text: "#854d0e", bar: "#eab308", label: "Convertible",  emoji: "💛" },
  MIDSIZE:     { bg: "#d1fae5", border: "#6ee7b7", text: "#065f46", bar: "#10b981", label: "Midsize",      emoji: "💚" },
  COMPACT:     { bg: "#cffafe", border: "#67e8f9", text: "#164e63", bar: "#06b6d4", label: "Compact",      emoji: "🩵" },
  ECONOMY:     { bg: "#dbeafe", border: "#93c5fd", text: "#1e40af", bar: "#3b82f6", label: "Economy",      emoji: "💙" },
  MINI:        { bg: "#ede9fe", border: "#c4b5fd", text: "#4c1d95", bar: "#8b5cf6", label: "Mini",         emoji: "🪻" },
  VAN:         { bg: "#fce7f3", border: "#f9a8d4", text: "#831843", bar: "#ec4899", label: "Van",          emoji: "🌸" },
  PICKUP:      { bg: "#f1f5f9", border: "#94a3b8", text: "#334155", bar: "#64748b", label: "Pickup",       emoji: "🩶" },
};

const CAR_STATUS_DOT: Record<string, string> = {
  AVAILABLE:   "#0D9B84",
  RENTED:      "#f59e0b",
  MAINTENANCE: "#ef4444",
  RETIRED:     "#9ca3af",
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── Booking Modal ────────────────────────────────────────────────────────────

interface ModalProps {
  booking?: Booking | null;
  vehicles: Vehicle[];
  prefilledCarId?: string;
  prefilledDate?: string;
  onSave: (data: any) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onClose: () => void;
  saving: boolean;
  error: string | null;
}

function BookingModal({ booking, vehicles, prefilledCarId, prefilledDate, onSave, onDelete, onClose, saving, error }: ModalProps) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    carId:        booking?.carId        || prefilledCarId || (vehicles[0]?.id ?? ""),
    driverName:   booking?.driverName   || "",
    driverPhone:  "",
    pickupDate:   booking ? booking.pickupDate.split("T")[0]  : (prefilledDate || today),
    returnDate:   booking ? booking.returnDate.split("T")[0]  : (prefilledDate || today),
    status:       booking?.status       || "CONFIRMED",
    paymentStatus: booking?.paymentStatus || "PENDING",
    totalPrice:   booking?.totalPrice   || 0,
    internalNotes: "",
    pickupLocation: "Admin Portal",
    returnLocation: "Admin Portal",
  });

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const isEdit = !!booking;

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: 440, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.25)", fontFamily: "'DM Sans', sans-serif" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1E293B" }}>
            {isEdit ? `Edit — ${booking?.bookingRef}` : "New Booking"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 4 }}><X size={20} /></button>
        </div>

        {error && (
          <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 10, padding: "10px 14px", color: "#991b1b", fontSize: 13, fontWeight: 600, marginBottom: 16, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} /> {error}
          </div>
        )}

        {/* Vehicle */}
        <label style={lbl}>Vehicle *</label>
        <select style={inp} value={form.carId} onChange={(e) => set("carId", e.target.value)}>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.make} {v.model} {v.plateNumber ? `· ${v.plateNumber}` : ""} [{v.status}]
            </option>
          ))}
        </select>

        {/* Driver */}
        <label style={lbl}>Customer / Driver Name</label>
        <input style={inp} value={form.driverName} onChange={(e) => set("driverName", e.target.value)} placeholder="e.g. Jean-Marc Dupont" />

        <label style={lbl}>Driver Phone</label>
        <input style={inp} value={form.driverPhone} onChange={(e) => set("driverPhone", e.target.value)} placeholder="+230 5XXX XXXX" />

        {/* Dates */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={lbl}>Pickup Date *</label>
            <input type="date" style={inp} value={form.pickupDate} onChange={(e) => set("pickupDate", e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={lbl}>Return Date *</label>
            <input type="date" style={inp} value={form.returnDate} min={form.pickupDate} onChange={(e) => set("returnDate", e.target.value)} />
          </div>
        </div>

        {/* Locations */}
        <label style={lbl}>Pickup Location</label>
        <input style={inp} value={form.pickupLocation} onChange={(e) => set("pickupLocation", e.target.value)} placeholder="e.g. SSR Airport, Grand Baie" />

        <label style={lbl}>Return Location</label>
        <input style={inp} value={form.returnLocation} onChange={(e) => set("returnLocation", e.target.value)} placeholder="Same as pickup" />

        {/* Status row */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={lbl}>Booking Status</label>
            <select style={inp} value={form.status} onChange={(e) => set("status", e.target.value)}>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={lbl}>Payment</label>
            <select style={inp} value={form.paymentStatus} onChange={(e) => set("paymentStatus", e.target.value)}>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="PARTIALLY_PAID">Partial</option>
            </select>
          </div>
        </div>

        {/* Price */}
        <label style={lbl}>Total Price (MUR)</label>
        <input type="number" style={inp} value={form.totalPrice} onChange={(e) => set("totalPrice", Number(e.target.value))} min={0} placeholder="0" />

        <label style={lbl}>Internal Notes</label>
        <textarea style={{ ...inp, resize: "vertical", minHeight: 60 } as any} value={form.internalNotes} onChange={(e) => set("internalNotes", e.target.value)} placeholder="Optional notes…" />

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          {isEdit && onDelete && (
            <button style={{ ...btn, background: "#fee2e2", color: "#991b1b", flex: "0 0 auto" }} onClick={() => onDelete(booking!.id)} disabled={saving}>
              Cancel Booking
            </button>
          )}
          <button style={{ ...btn, background: "#f3f4f6", color: "#374151" }} onClick={onClose}>Close</button>
          <button style={{ ...btn, background: "#1E293B", color: "#fff" }} onClick={() => onSave(form)} disabled={saving}>
            {saving ? <Loader2 size={14} style={{ display: "inline", animation: "spin 1s linear infinite" }} /> : isEdit ? "Save Changes" : "Create Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

const lbl: any = { display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 4, marginTop: 14, textTransform: "uppercase", letterSpacing: "0.05em" };
const inp: any = { width: "100%", padding: "9px 12px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 14, color: "#111", background: "#fafafa", boxSizing: "border-box", outline: "none", fontFamily: "inherit" };
const btn: any = { flex: 1, padding: "11px 0", borderRadius: 12, border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.15s" };
const navBtn: any = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "7px 12px", fontWeight: 700, fontSize: 14, cursor: "pointer", color: "#374151", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 };

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FleetCalendar() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<{ mode: "new" | "edit"; booking?: Booking; preCarId?: string; preDate?: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL");
  const [activeView, setActiveView] = useState<string>("Timeline");
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const days = getWeekDays(weekOffset);
  const from = days[0];
  const to = days[6];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ── Data fetch ──────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/calendar/events?from=${formatDateParam(from)}&to=${formatDateParam(to)}`,
        { cache: "no-store" }
      );
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setVehicles(data.cars || []);
      setBookings(data.bookings || []);
      setLastRefresh(new Date());
    } catch (e: any) {
      setError(e.message || "Failed to load calendar data");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekOffset]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // ── Derived stats ────────────────────────────────────────────────────────────
  const visibleBookings = bookings.filter((b) => {
    if (filter === "ALL") return true;
    return b.status === filter;
  });

  const stats = {
    active:    bookings.filter((b) => b.status === "ACTIVE").length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    pending:   bookings.filter((b) => b.status === "PENDING").length,
    revenue:   bookings.filter((b) => b.paymentStatus === "PAID").reduce((s, b) => s + b.totalPrice, 0),
    utilisation: vehicles.length
      ? Math.round((vehicles.filter((v) => v.status === "RENTED" || v.status === "MAINTENANCE").length / vehicles.length) * 100)
      : 0,
  };

  // ── Booking layout helpers ───────────────────────────────────────────────────
  function getBookingsForVehicleDay(vehicleId: string, day: Date): Booking[] {
    const dayStart = new Date(day); dayStart.setHours(0, 0, 0, 0);
    const dayEnd   = new Date(day); dayEnd.setHours(23, 59, 59, 999);
    return visibleBookings.filter((b) => {
      if (b.carId !== vehicleId) return false;
      const pickup = new Date(b.pickupDate);
      const ret    = new Date(b.returnDate);
      return pickup <= dayEnd && ret >= dayStart;
    });
  }

  function isBookingStartOnDay(b: Booking, day: Date): boolean {
    const pickup = new Date(b.pickupDate);
    return isSameDay(pickup, day) || (pickup < from && isSameDay(day, from));
  }

  function getSpanDays(b: Booking, day: Date): number {
    const startClamped = clampToRange(new Date(b.pickupDate), from, to);
    const endClamped   = clampToRange(new Date(b.returnDate), from, to);
    const startDayIdx  = days.findIndex((d) => isSameDay(d, startClamped));
    const endDayIdx    = days.findIndex((d) => isSameDay(d, endClamped));
    const dayIdx       = days.findIndex((d) => isSameDay(d, day));
    if (startDayIdx === -1 || endDayIdx === -1 || dayIdx === -1) return 1;
    if (startDayIdx !== dayIdx) return 0;
    return endDayIdx - startDayIdx + 1;
  }

  // ── Save / Delete ────────────────────────────────────────────────────────────
  async function handleSave(form: any) {
    setSaving(true);
    setSaveError(null);
    try {
      const isEdit = modal?.mode === "edit";
      const url = "/api/admin/calendar/booking";
      const method = isEdit ? "PATCH" : "POST";
      const body = isEdit ? { ...form, id: modal?.booking?.id } : form;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");

      setModal(null);
      await fetchData();
    } catch (e: any) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Cancel this booking? This action will be logged.")) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/admin/calendar/booking?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed");
      setModal(null);
      await fetchData();
    } catch (e: any) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  }

  // ── Month View Adapter ───────────────────────────────────────────────────────
  const getMonthEventsMap = () => {
    const map: Record<number, any[]> = {};
    const daysInTargetMonth = new Date(from.getFullYear(), from.getMonth() + 1, 0).getDate();
    
    // We iterate through bookings and map them to their specific day integers
    visibleBookings.forEach(b => {
       const p = new Date(b.pickupDate);
       const r = new Date(b.returnDate);
       const isPickupTargetMonth = p.getFullYear() === from.getFullYear() && p.getMonth() === from.getMonth();
       const isReturnTargetMonth = r.getFullYear() === from.getFullYear() && r.getMonth() === from.getMonth();
       
       const customer = b.driverName || b.user?.name || "Walk-in";
       const type = b.status === "ACTIVE" ? "return" : b.status === "CONFIRMED" ? "pickup" : b.status.toLowerCase();
       
       if (isPickupTargetMonth) {
          const d = p.getDate();
          if (!map[d]) map[d] = [];
          map[d].push({ id: `${b.id}-p`, type: "pickup", label: `[Pick] ${customer}`, bookingId: b.id, original: b });
       }
       if (isReturnTargetMonth) {
          const d = r.getDate();
          if (!map[d]) map[d] = [];
          map[d].push({ id: `${b.id}-r`, type: "return", label: `[Ret] ${customer}`, bookingId: b.id, original: b });
       }
       // If standard pending/maintenance
       if (b.status === "PENDING" && isPickupTargetMonth) {
           const d = p.getDate();
           if (!map[d]) map[d] = [];
           map[d].push({ id: `${b.id}-pend`, type: "pending", label: `[Pend] ${customer}`, bookingId: b.id, original: b });
       }
    });
    return map;
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  const headerLabel = `${from.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${to.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f8f9fb", padding: 20, borderRadius: 24 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        td { position: relative; }
      `}</style>

      {/* ── Top Bar ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <button style={navBtn} onClick={() => setWeekOffset((o) => o - 1)}>
          <ChevronLeft size={16} />
        </button>
        <span style={{ fontWeight: 800, fontSize: 17, color: "#1E293B", minWidth: 200, textAlign: "center" }}>
          {headerLabel}
        </span>
        <button style={navBtn} onClick={() => setWeekOffset((o) => o + 1)}>
          <ChevronRight size={16} />
        </button>
        <button style={{ ...navBtn, background: weekOffset === 0 ? "#1E293B" : "#fff", color: weekOffset === 0 ? "#fff" : "#374151" }}
          onClick={() => setWeekOffset(0)}>
          Today
        </button>
        <div style={{ flex: 1 }} />
        
        {/* Toggle Panel from Brief */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", background: "#f0f0f0", borderRadius: 8, border: "1px solid #ddd", overflow: "hidden" }}>
            {["Month","Week","Day","Timeline"].map(v => (
              <button key={v} onClick={() => setActiveView(v)} style={{ padding: "5px 11px", fontSize: 13, cursor: "pointer", border: "none", background: activeView === v ? "#fff" : "transparent", fontWeight: activeView === v ? 700 : 500, color: activeView === v ? "#111" : "#666", transition: "all 0.2s" }}>
                {v}
              </button>
            ))}
          </div>
          <button
            style={{ background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 2px 5px rgba(24,95,165,0.3)" }}
            onClick={() => { setModal({ mode: "new" }); setSaveError(null); }}
          >
            <Plus size={16} /> New Booking
          </button>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        {["ALL", "CONFIRMED", "ACTIVE", "PENDING", "COMPLETED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              background: filter === s ? "#1E293B" : "#fff",
              color: filter === s ? "#fff" : "#6b7280",
              border: filter === s ? "none" : "1px solid #e5e7eb",
              transition: "all 0.15s",
            }}
          >
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* ── Stats row (Brief Style) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 14 }}>
        {[
          { label: "Active rentals", value: stats.active, sub: `+${Math.floor(stats.active * 0.1)} from last week`, subColor: "#3B6D11" },
          { label: "Upcoming today", value: bookings.filter(b => isSameDay(new Date(b.pickupDate), today)).length, sub: "Action needed", subColor: "#854F0B" },
          { label: "Fleet utilisation", value: `${stats.utilisation}%`, sub: "+5% vs last month", subColor: "#3B6D11" },
          { label: "Pending confirm", value: stats.pending, sub: stats.pending > 0 ? "Needs Review" : "All clear", subColor: stats.pending > 0 ? "#854F0B" : "#3B6D11" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#f5f5f5", borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3, fontWeight: 700 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#111" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: s.subColor, marginTop: 2, fontWeight: 600 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Legend ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {/* Status legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 14px", background: "#fff", borderRadius: 10, border: "1px solid #f3f4f6", flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>Status</span>
          {Object.entries(STATUS_CONFIG).map(([k, c]) => (
            <span key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
              <span style={{ color: "#374151", fontWeight: 600, fontSize: 12 }}>{c.label}</span>
            </span>
          ))}
        </div>
        {/* Category legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: "#fff", borderRadius: 10, border: "1px solid #f3f4f6", flexWrap: "wrap", flex: 1 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>Category</span>
          {Object.entries(CATEGORY_COLOR).map(([k, c]) => (
            <span key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: c.bar, display: "inline-block" }} />
              <span style={{ color: "#374151", fontWeight: 600, fontSize: 11 }}>{c.label}</span>
            </span>
          ))}
        </div>
        <span style={{ display: "flex", alignItems: "center", color: "#9ca3af", fontSize: 11, whiteSpace: "nowrap" }}>Click empty cell to add · Click booking to edit</span>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 12, padding: "12px 16px", color: "#991b1b", fontSize: 13, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <AlertCircle size={16} /> {error}
          <button onClick={fetchData} style={{ marginLeft: "auto", background: "none", border: "1px solid #fca5a5", borderRadius: 8, padding: "4px 10px", cursor: "pointer", color: "#991b1b", fontSize: 12, fontWeight: 700 }}>Retry</button>
        </div>
      )}

      {/* ── Calendar Grid ── */}
      <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid #e5e7eb", position: "relative" }}>
        
        {/* Loading overlay */}
        {loading && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, borderRadius: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <Loader2 size={28} style={{ color: "#0D9B84", animation: "spin 1s linear infinite" }} />
              <span style={{ fontWeight: 700, color: "#6b7280", fontSize: 13 }}>Loading fleet data…</span>
            </div>
          </div>
        )}

        {vehicles.length === 0 && !loading ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <CalendarDays size={40} style={{ color: "#d1d5db", marginBottom: 12, display: "block", margin: "0 auto 12px" }} />
            <p style={{ fontWeight: 700, color: "#9ca3af", fontSize: 15 }}>No vehicles found</p>
            <p style={{ color: "#d1d5db", fontSize: 13, marginTop: 4 }}>
              Add vehicles to your fleet to see them in the calendar.
              {error && <> — <span style={{ color: "#ef4444" }}>{error}</span></>}
            </p>
          </div>
        ) : activeView === "Month" ? (
          <div>
            <CalendarMonthView 
              events={getMonthEventsMap()} 
              initialDate={from}
              onEventClick={(ev: any) => { setModal({ mode: "edit", booking: ev.original }); setSaveError(null); }}
              onDayClick={(d: Date) => { setModal({ mode: "new", preDate: formatDateParam(d) }); setSaveError(null); }}
              onNewBooking={() => { setModal({ mode: "new" }); setSaveError(null); }}
            />
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 168 }} />
              {days.map((_, i) => <col key={i} />)}
            </colgroup>
            <thead>
              <tr style={{ borderBottom: "1px solid #e5e7eb", background: "#fafafa" }}>
                <th style={{ padding: "12px 14px", textAlign: "left", fontSize: 12, color: "#9ca3af", fontWeight: 700, borderRight: "1px solid #f3f4f6" }}>
                  Vehicle
                </th>
                {days.map((d, i) => {
                  const isToday = isSameDay(d, today);
                  return (
                    <th key={i} style={{
                      padding: "10px 6px", textAlign: "center", fontSize: 12, fontWeight: 600,
                      color: isToday ? "#2563eb" : "#374151",
                      borderLeft: isToday ? "2px solid #2563eb" : "1px solid #f3f4f6",
                      background: isToday ? "#eff6ff" : "transparent",
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: isToday ? "#2563eb" : "#9ca3af" }}>{DAY_LABELS[i]}</div>
                      <div style={{ fontSize: 19, fontWeight: 800, marginTop: 1 }}>{d.getDate()}</div>
                      <div style={{ fontSize: 10, color: isToday ? "#93c5fd" : "#d1d5db" }}>
                        {d.toLocaleDateString("en-GB", { month: "short" })}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  {/* Vehicle label cell */}
                  <td style={{ padding: "10px 14px", verticalAlign: "top", borderRight: "1px solid #f3f4f6", background: "#fafafa", minWidth: 168 }}>
                    {(() => {
                      const catColor = CATEGORY_COLOR[vehicle.category] || { bar: "#94a3b8", bg: "#f1f5f9", text: "#334155", label: vehicle.category, emoji: "🚗" };
                      return (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {/* Category color strip */}
                          <div style={{ width: 4, height: 44, borderRadius: 4, background: catColor.bar, flexShrink: 0 }} />
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: CAR_STATUS_DOT[vehicle.status] || "#9ca3af", flexShrink: 0 }} />
                            <div>
                              <div style={{ fontWeight: 800, fontSize: 13, color: "#1E293B", lineHeight: 1.2 }}>{vehicle.make} {vehicle.model}</div>
                              {vehicle.plateNumber && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1, fontFamily: "monospace" }}>{vehicle.plateNumber}</div>}
                              <div style={{ fontSize: 10, marginTop: 2, display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 6px", borderRadius: 6, background: catColor.bg, color: catColor.text, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                {catColor.emoji} {catColor.label || vehicle.category}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </td>

                  {/* Day cells */}
                  {days.map((day, di) => {
                    const isToday = isSameDay(day, today);
                    const cellBookings = getBookingsForVehicleDay(vehicle.id, day);
                    const startingBookings = cellBookings.filter((b) => isBookingStartOnDay(b, day));

                    return (
                      <td
                        key={di}
                        onClick={() => {
                          const covered = cellBookings.length > 0;
                          if (!covered) {
                            setModal({ mode: "new", preCarId: vehicle.id, preDate: formatDateParam(day) });
                            setSaveError(null);
                          }
                        }}
                        style={{
                          padding: 3,
                          border: "none",
                          borderLeft: isToday ? "2px solid #2563eb" : "1px solid #f3f4f6",
                          background: isToday ? "rgba(37,99,235,0.025)" : "transparent",
                          cursor: cellBookings.length === 0 ? "pointer" : "default",
                          verticalAlign: "top",
                          minHeight: 56,
                        }}
                      >
                        {startingBookings.map((b) => {
                          const span = getSpanDays(b, day);
                          if (span === 0) return null;
                          const catColor = CATEGORY_COLOR[vehicle.category] || { bar: "#94a3b8", bg: "#f1f5f9", text: "#334155", border: "#cbd5e1" };
                          const statusCfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.CONFIRMED;
                          const customerName = b.driverName || b.user?.name || "Walk-in";
                          return (
                            <div
                              key={b.id}
                              onClick={(e) => { e.stopPropagation(); setModal({ mode: "edit", booking: b }); setSaveError(null); }}
                              style={{
                                position: "absolute",
                                left: 3, top: 3,
                                width: `calc(${span * 100}% + ${(span - 1) * 8}px - 6px)`,
                                minHeight: 52,
                                background: catColor.bg,
                                border: `2px solid ${catColor.border}`,
                                borderLeft: `5px solid ${catColor.bar}`,
                                borderRadius: 10,
                                padding: "5px 9px 5px 8px",
                                fontSize: 12,
                                fontWeight: 700,
                                color: catColor.text,
                                cursor: "pointer",
                                zIndex: 2,
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                boxShadow: `0 2px 8px ${catColor.bar}30`,
                                transition: "filter 0.12s, transform 0.12s",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                gap: 2,
                              }}
                              onMouseEnter={(e: any) => { e.currentTarget.style.filter = "brightness(0.93)"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${catColor.bar}50`; }}
                              onMouseLeave={(e: any) => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = `0 2px 8px ${catColor.bar}30`; }}
                              title={`${customerName} | ${b.pickupDate.split("T")[0]} → ${b.returnDate.split("T")[0]} | MUR ${b.totalPrice.toLocaleString()} | ${statusCfg.label}`}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: statusCfg.dot, flexShrink: 0 }} />
                                <span style={{ fontWeight: 800, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis" }}>{customerName}</span>
                              </div>
                              <span style={{ fontSize: 10, opacity: 0.7, fontFamily: "monospace" }}>{b.bookingRef}</span>
                            </div>
                          );
                        })}
                        {/* Empty spacer */}
                        {startingBookings.length === 0 && (
                          <div style={{ minHeight: 50, transition: "background 0.1s" }}
                            onMouseEnter={(e: any) => { if (cellBookings.length === 0) e.currentTarget.style.background = "rgba(37,99,235,0.06)"; }}
                            onMouseLeave={(e: any) => { e.currentTarget.style.background = ""; }}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, fontSize: 12, color: "#9ca3af" }}>
        <span>{vehicles.length} vehicles · {bookings.length} bookings in range</span>
        <span>Auto-refreshes every 60s · Last: {lastRefresh.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
      </div>

      {/* ── Quick Actions ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
        {[
          { icon: "⏰", label: "Overdue alerts"  },
          { icon: "📊", label: "Revenue report"  },
          { icon: "🔧", label: "Maintenance due" },
          { icon: "💡", label: "Smart pricing"   },
          { icon: "📄", label: "Export schedule" },
        ].map(({ icon, label }) => (
          <button key={label} style={{ flex: 1, minWidth: 120, border: "1px solid #e5e7eb", borderRadius: 12, padding: "12px 10px", cursor: "pointer", background: "#fff", fontSize: 12, fontWeight: 700, color: "#374151", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "all 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#185FA5"; e.currentTarget.style.color = "#185FA5"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}>
            <span style={{ fontSize: 20, marginBottom: 6, display: "block" }}>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* ── Booking Modal ── */}
      {modal && (
        <BookingModal
          booking={modal.booking}
          vehicles={vehicles}
          prefilledCarId={modal.preCarId}
          prefilledDate={modal.preDate}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => { setModal(null); setSaveError(null); }}
          saving={saving}
          error={saveError}
        />
      )}
    </div>
  );
}
