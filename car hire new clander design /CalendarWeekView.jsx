// CalendarWeekView.jsx
// Car Hire Admin — Week View Calendar
// Drop this into your /components/admin/ folder

import { useState } from "react";
import { useRouter } from "next/router"; // or your routing lib

const HOURS = ["8 AM","9 AM","10 AM","11 AM","12 PM","1 PM","2 PM","3 PM","4 PM","5 PM","6 PM","7 PM"];
const HOUR_START = 8;
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── colour helpers ───────────────────────────────────────────────────────────
const EVENT_COLOURS = {
  pickup:      { bg: "#B5D4F4", text: "#042C53" },
  return:      { bg: "#C0DD97", text: "#173404" },
  pending:     { bg: "#FAC775", text: "#412402" },
  overdue:     { bg: "#F7C1C1", text: "#501313" },
  maintenance: { bg: "#CECBF6", text: "#26215C" },
  longterm:    { bg: "#9FE1CB", text: "#04342C" },
};

// ─── sample data — replace with your API call ────────────────────────────────
// Each event: { id, dayOffset (0=Sun of week), hour (24h), dur (hours), type, label, bookingId }
const SAMPLE_EVENTS = [
  { id:1,  dayOffset:0, hour:9,  dur:1,   type:"pickup",      label:"BMW Pickup · Kumar",      bookingId:"BK-001" },
  { id:2,  dayOffset:0, hour:11, dur:1.5, type:"return",      label:"Fortuner Return · Rao",   bookingId:"BK-002" },
  { id:3,  dayOffset:0, hour:14, dur:1,   type:"pickup",      label:"Q7 Pickup · Patel",       bookingId:"BK-003" },
  { id:4,  dayOffset:1, hour:9,  dur:2,   type:"longterm",    label:"Long-term · Sharma",      bookingId:"BK-004" },
  { id:5,  dayOffset:1, hour:13, dur:1,   type:"pending",     label:"Pending · Mehta",         bookingId:"BK-005" },
  { id:6,  dayOffset:1, hour:16, dur:1,   type:"maintenance", label:"Maint: RAV-001",          bookingId:null     },
  { id:7,  dayOffset:2, hour:10, dur:1,   type:"pickup",      label:"Mercedes Pickup · Verma", bookingId:"BK-007" },
  { id:8,  dayOffset:2, hour:15, dur:1.5, type:"return",      label:"Audi Q7 Return",          bookingId:"BK-008" },
  { id:9,  dayOffset:3, hour:8,  dur:1,   type:"pickup",      label:"Fortuner Pickup",         bookingId:"BK-009" },
  { id:10, dayOffset:3, hour:11, dur:1,   type:"overdue",     label:"Overdue: MH-04",          bookingId:"BK-010" },
  { id:11, dayOffset:4, hour:9,  dur:1,   type:"pickup",      label:"Sedan Pickup x2",         bookingId:"BK-011" },
  { id:12, dayOffset:4, hour:12, dur:1,   type:"return",      label:"BMW Return",              bookingId:"BK-012" },
  { id:13, dayOffset:5, hour:10, dur:1.5, type:"pickup",      label:"SUV Pickup",              bookingId:"BK-013" },
  { id:14, dayOffset:6, hour:11, dur:1,   type:"maintenance", label:"Fleet check",             bookingId:null     },
];

// ─── utilities ────────────────────────────────────────────────────────────────
function getWeekStart(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function formatWeekLabel(start) {
  const end = addDays(start, 6);
  if (start.getMonth() === end.getMonth())
    return `${MONTHS[start.getMonth()]} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
  return `${MONTHS[start.getMonth()]} ${start.getDate()} – ${MONTHS[end.getMonth()]} ${end.getDate()}, ${start.getFullYear()}`;
}

function isToday(date) {
  const now = new Date();
  return date.toDateString() === now.toDateString();
}

// ─── sub-components ──────────────────────────────────────────────────────────
function StatCard({ label, value, sub, subColour = "#888" }) {
  return (
    <div style={{ background: "var(--color-bg-secondary, #f5f5f5)", borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: subColour, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function EventBlock({ event, slotHeight = 52, onEventClick }) {
  const col = EVENT_COLOURS[event.type] || EVENT_COLOURS.pickup;
  const topPx  = (event.hour - HOUR_START) * slotHeight + 3;
  const heightPx = event.dur * slotHeight - 6;

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
      style={{
        position: "absolute", left: 2, right: 2,
        top: topPx, height: heightPx,
        background: col.bg, color: col.text,
        borderRadius: 4, padding: "3px 5px",
        fontSize: 11, fontWeight: 500,
        overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
        cursor: "pointer", zIndex: 1,
        transition: "opacity 0.1s",
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >
      {event.label}
    </div>
  );
}

// ─── main component ──────────────────────────────────────────────────────────
export default function CalendarWeekView({
  events = SAMPLE_EVENTS,          // pass your real bookings here
  onEventClick,                    // (event) => void  — open detail drawer/modal
  onSlotClick,                     // (date, hour) => void  — open new booking form
  onNewBooking,                    // () => void
  currentDate = new Date(),
}) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(currentDate));
  const [activeView, setActiveView] = useState("Week");
  const SLOT_HEIGHT = 52;

  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const prevWeek = () => setWeekStart(d => addDays(d, -7));
  const nextWeek = () => setWeekStart(d => addDays(d,  7));
  const goToday  = () => setWeekStart(getWeekStart(new Date()));

  // stats derived from events for the displayed week
  const pickups  = events.filter(e => e.type === "pickup").length;
  const returns  = events.filter(e => e.type === "return").length;
  const pending  = events.filter(e => e.type === "pending").length;

  const handleViewChange = (view) => {
    setActiveView(view);
    // wire up your router here, e.g.:
    // router.push(`/admin/calendar?view=${view.toLowerCase()}`);
  };

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", padding: "1rem 0" }}>

      {/* ── top bar ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Fleet Calendar</h1>
          <button onClick={prevWeek} style={btnStyle}>←</button>
          <span style={{ fontSize: 14, fontWeight: 500, minWidth: 170, textAlign: "center" }}>
            {formatWeekLabel(weekStart)}
          </span>
          <button onClick={nextWeek} style={btnStyle}>→</button>
          <button onClick={goToday}  style={btnStyle}>Today</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* view toggle */}
          <div style={{ display: "flex", background: "#f0f0f0", borderRadius: 8, border: "0.5px solid #ddd", overflow: "hidden" }}>
            {["Month","Week","Day","Timeline"].map(v => (
              <button
                key={v}
                onClick={() => handleViewChange(v)}
                style={{
                  ...viewBtnStyle,
                  background: activeView === v ? "#fff" : "transparent",
                  fontWeight: activeView === v ? 500 : 400,
                  color: activeView === v ? "#111" : "#666",
                }}
              >
                {v}
              </button>
            ))}
          </div>
          <button onClick={onNewBooking} style={primaryBtnStyle}>+ New Booking</button>
        </div>
      </div>

      {/* ── stats row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 20 }}>
        <StatCard label="This week"  value={events.length} sub="bookings total" />
        <StatCard label="Pickups"    value={pickups}        sub={`${events.filter(e=>e.type==="pickup"  && e.dayOffset===new Date().getDay()).length} today`} subColour="#3B6D11" />
        <StatCard label="Returns"    value={returns}        sub={`${events.filter(e=>e.type==="return"  && e.dayOffset===new Date().getDay()).length} today`} />
        <StatCard label="Pending"    value={pending}        sub={pending > 0 ? "Needs action" : "All clear"} subColour={pending > 0 ? "#854F0B" : "#3B6D11"} />
      </div>

      {/* ── calendar grid ── */}
      <div style={{ border: "0.5px solid #e0e0e0", borderRadius: 12, overflow: "hidden", background: "#fff" }}>

        {/* day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "52px repeat(7, 1fr)", background: "#fafafa", borderBottom: "0.5px solid #e0e0e0" }}>
          <div style={{ borderRight: "0.5px solid #e0e0e0" }} />
          {weekDates.map((date, i) => (
            <div
              key={i}
              style={{
                padding: "8px 6px", textAlign: "center",
                borderRight: i < 6 ? "0.5px solid #e0e0e0" : "none",
                background: isToday(date) ? "#EBF4FF" : undefined,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 500, color: isToday(date) ? "#185FA5" : "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {DAY_NAMES[date.getDay()]}
              </div>
              <div style={{
                fontSize: 18, fontWeight: 500, lineHeight: 1.2, marginTop: 2,
                ...(isToday(date) ? {
                  background: "#185FA5", color: "#fff",
                  width: 30, height: 30, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "2px auto 0",
                } : { color: "#111" }),
              }}>
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* time grid */}
        <div style={{ display: "grid", gridTemplateColumns: "52px repeat(7, 1fr)" }}>

          {/* time labels */}
          <div style={{ borderRight: "0.5px solid #e0e0e0" }}>
            {HOURS.map((h, i) => (
              <div
                key={i}
                style={{
                  height: SLOT_HEIGHT,
                  borderBottom: i < HOURS.length - 1 ? "0.5px solid #f0f0f0" : "none",
                  display: "flex", alignItems: "flex-start", justifyContent: "flex-end",
                  padding: "4px 6px 0 0",
                }}
              >
                <span style={{ fontSize: 10, color: "#bbb", whiteSpace: "nowrap" }}>{h}</span>
              </div>
            ))}
          </div>

          {/* day columns */}
          {weekDates.map((date, di) => {
            const dayEvents = events.filter(e => e.dayOffset === di);
            const now = new Date();
            const nowHour = now.getHours() + now.getMinutes() / 60;

            return (
              <div key={di} style={{ borderRight: di < 6 ? "0.5px solid #e0e0e0" : "none", position: "relative" }}>
                {HOURS.map((_, hi) => {
                  const slotHour = HOUR_START + hi;
                  const showNowLine = isToday(date) && nowHour >= slotHour && nowHour < slotHour + 1;
                  return (
                    <div
                      key={hi}
                      onClick={() => onSlotClick?.(date, slotHour)}
                      style={{
                        height: SLOT_HEIGHT,
                        borderBottom: hi < HOURS.length - 1 ? "0.5px solid #f0f0f0" : "none",
                        position: "relative", cursor: "pointer",
                        background: isToday(date) ? "rgba(24,95,165,0.02)" : undefined,
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = isToday(date) ? "rgba(24,95,165,0.06)" : "#fafafa"}
                      onMouseLeave={e => e.currentTarget.style.background = isToday(date) ? "rgba(24,95,165,0.02)" : ""}
                    >
                      {showNowLine && (
                        <div style={{
                          position: "absolute", left: 0, right: 0,
                          top: `${((nowHour - slotHour) * SLOT_HEIGHT)}px`,
                          height: 2, background: "#E24B4A", zIndex: 3,
                        }} />
                      )}
                    </div>
                  );
                })}
                {/* render event blocks absolutely over the slots */}
                {dayEvents.map(ev => (
                  <EventBlock
                    key={ev.id}
                    event={ev}
                    slotHeight={SLOT_HEIGHT}
                    onEventClick={onEventClick || (() => {})}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── legend ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: "#888", fontWeight: 500 }}>Legend:</span>
        {Object.entries(EVENT_COLOURS).map(([type, col]) => (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#666" }}>
            <div style={{ width: 9, height: 9, borderRadius: 2, background: col.bg, border: `1px solid ${col.text}22` }} />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#666" }}>
          <div style={{ width: 16, height: 2, background: "#E24B4A", borderRadius: 1 }} />
          Now
        </div>
      </div>

      {/* ── quick actions ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
        {[
          { icon: "⏰", label: "Overdue alerts",  action: () => alert("Show overdue") },
          { icon: "📊", label: "Week revenue",    action: () => alert("Revenue report") },
          { icon: "🔧", label: "Maintenance due", action: () => alert("Maintenance list") },
          { icon: "💡", label: "Smart pricing",   action: () => alert("Pricing suggestions") },
          { icon: "📄", label: "Export week",     action: () => alert("Export PDF") },
        ].map(({ icon, label, action }) => (
          <button key={label} onClick={action} style={quickActionStyle}>
            <span style={{ fontSize: 15, marginBottom: 3, display: "block" }}>{icon}</span>
            {label}
          </button>
        ))}
      </div>

    </div>
  );
}

// ─── shared inline styles ────────────────────────────────────────────────────
const btnStyle = {
  background: "#f5f5f5", border: "0.5px solid #ddd", borderRadius: 8,
  padding: "5px 10px", cursor: "pointer", fontSize: 13, color: "#666",
};
const viewBtnStyle = {
  padding: "5px 11px", fontSize: 12, cursor: "pointer",
  border: "none", transition: "all 0.15s",
};
const primaryBtnStyle = {
  background: "#185FA5", color: "#fff", border: "none",
  borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer",
};
const quickActionStyle = {
  flex: 1, minWidth: 110,
  border: "0.5px solid #ddd", borderRadius: 8,
  padding: "8px 10px", cursor: "pointer",
  background: "#fff", fontSize: 11, fontWeight: 500, textAlign: "center",
};
