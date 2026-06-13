// CalendarMonthView.jsx
// Car Hire Admin — Month View Calendar

import { useState } from "react";

const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS    = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const EVENT_COLOURS = {
  pickup:      { bg: "#B5D4F4", text: "#042C53" },
  return:      { bg: "#C0DD97", text: "#173404" },
  pending:     { bg: "#FAC775", text: "#412402" },
  overdue:     { bg: "#F7C1C1", text: "#501313" },
  maintenance: { bg: "#CECBF6", text: "#26215C" },
  longterm:    { bg: "#9FE1CB", text: "#04342C" },
};

// Sample events keyed by day-of-month — replace with API-driven data
// Shape: { [day]: [{ id, type, label, bookingId }] }
const SAMPLE_MONTH_EVENTS = {
  3:  [{ id:1, type:"pickup",  label:"BMW Pickup · Kumar" }, { id:2, type:"return", label:"Fortuner Return" }],
  5:  [{ id:3, type:"pickup",  label:"Mercedes Pickup" }],
  7:  [{ id:4, type:"maintenance", label:"Audi Maint." }],
  8:  [{ id:5, type:"pickup",  label:"Q7 Pickup · Patel" }, { id:6, type:"longterm", label:"Long-term: Sharma" }, { id:7, type:"return", label:"Innova Return" }],
  10: [{ id:8, type:"pickup",  label:"Fortuner Pickup" }, { id:9, type:"pending", label:"Pending: Gupta" }],
  12: [{ id:10, type:"return", label:"BMW Return" }, { id:11, type:"overdue", label:"Overdue: MH-04" }],
  14: [{ id:12, type:"maintenance", label:"Mercedes Maint." }, { id:13, type:"pickup", label:"Audi Pickup" }],
  15: [{ id:14, type:"pickup", label:"Innova Pickup" }, { id:15, type:"return", label:"SUV Return" }, { id:16, type:"pending", label:"Pending x2" }],
  17: [{ id:17, type:"return", label:"Q7 Return" }, { id:18, type:"longterm", label:"Long-term end" }],
  19: [{ id:19, type:"pickup", label:"Sedan Pickup" }],
  21: [{ id:20, type:"pickup", label:"BMW Pickup" }, { id:21, type:"return", label:"Fortuner Return" }],
  22: [{ id:22, type:"pickup", label:"Audi Q7 Pickup" }, { id:23, type:"maintenance", label:"Maint: RAV-001" }, { id:24, type:"pending", label:"Pending: Mehta" }],
  24: [{ id:25, type:"return", label:"Mercedes Return" }, { id:26, type:"overdue", label:"Overdue alert" }],
  26: [{ id:27, type:"pickup", label:"SUV Pickup x3" }, { id:28, type:"return", label:"Economy Return" }],
  28: [{ id:29, type:"longterm", label:"Long-term Ext." }, { id:30, type:"return", label:"BMW Return" }],
  30: [{ id:31, type:"maintenance", label:"Month-end check" }],
};

export default function CalendarMonthView({
  events = SAMPLE_MONTH_EVENTS,
  onEventClick,
  onDayClick,
  onNewBooking,
  initialDate = new Date(2026, 3, 1), // April 2026
}) {
  const [date, setDate]       = useState(initialDate);
  const [activeView, setActiveView] = useState("Month");

  const year  = date.getFullYear();
  const month = date.getMonth();

  const firstDay     = new Date(year, month, 1).getDay();
  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const daysInPrev   = new Date(year, month, 0).getDate();
  const today        = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const prevMonth = () => setDate(new Date(year, month - 1, 1));
  const nextMonth = () => setDate(new Date(year, month + 1, 1));
  const goToday   = () => setDate(new Date(today.getFullYear(), today.getMonth(), 1));

  // build cell array
  const cells = [];
  for (let i = 0; i < firstDay; i++)
    cells.push({ day: daysInPrev - firstDay + 1 + i, current: false });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, current: true });
  const trailing = (7 - (cells.length % 7)) % 7;
  for (let d = 1; d <= trailing; d++)
    cells.push({ day: d, current: false });

  // stats
  const allEvents = Object.values(events).flat();
  const activeRentals = allEvents.filter(e => e.type === "pickup" || e.type === "longterm").length;
  const pendingCount  = allEvents.filter(e => e.type === "pending").length;
  const todayEvents   = isCurrentMonth ? (events[today.getDate()] || []) : [];

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", padding: "1rem 0" }}>

      {/* ── top bar ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Fleet Calendar</h1>
          <button onClick={prevMonth} style={btnStyle}>←</button>
          <span style={{ fontSize: 15, fontWeight: 500, minWidth: 140, textAlign: "center" }}>
            {MONTHS[month]} {year}
          </span>
          <button onClick={nextMonth} style={btnStyle}>→</button>
          <button onClick={goToday}   style={btnStyle}>Today</button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", background: "#f0f0f0", borderRadius: 8, border: "0.5px solid #ddd", overflow: "hidden" }}>
            {["Month","Week","Day","Timeline"].map(v => (
              <button key={v} onClick={() => setActiveView(v)} style={{ padding: "5px 11px", fontSize: 12, cursor: "pointer", border: "none", background: activeView === v ? "#fff" : "transparent", fontWeight: activeView === v ? 500 : 400, color: activeView === v ? "#111" : "#666" }}>
                {v}
              </button>
            ))}
          </div>
          <button onClick={onNewBooking} style={primaryBtnStyle}>+ New Booking</button>
        </div>
      </div>

      {/* ── stats row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 20 }}>
        <StatCard label="Active rentals"    value={activeRentals} sub="+3 from last week"   subColour="#3B6D11" />
        <StatCard label="Upcoming today"    value={todayEvents.length} sub={`${todayEvents.filter(e=>e.type==="pickup").length} pickups · ${todayEvents.filter(e=>e.type==="return").length} returns`} />
        <StatCard label="Fleet utilisation" value="78%"           sub="+5% vs last month"   subColour="#3B6D11" />
        <StatCard label="Pending confirm"   value={pendingCount}  sub="Action needed"        subColour="#854F0B" />
      </div>

      {/* ── calendar grid ── */}
      <div style={{ border: "0.5px solid #e0e0e0", borderRadius: 12, overflow: "hidden" }}>
        {/* day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", background: "#fafafa", borderBottom: "0.5px solid #e0e0e0" }}>
          {DAY_NAMES.map(d => (
            <div key={d} style={{ padding: 8, textAlign: "center", fontSize: 11, fontWeight: 500, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>{d}</div>
          ))}
        </div>

        {/* day cells */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", background: "#fff" }}>
          {cells.map((cell, idx) => {
            const cellEvents = cell.current ? (events[cell.day] || []) : [];
            const isTodayCell = isCurrentMonth && cell.current && cell.day === today.getDate();
            const showMax = 2;

            return (
              <div
                key={idx}
                onClick={() => cell.current && onDayClick?.(new Date(year, month, cell.day))}
                style={{
                  borderRight:  idx % 7 !== 6 ? "0.5px solid #f0f0f0" : "none",
                  borderBottom: idx < cells.length - 7 ? "0.5px solid #f0f0f0" : "none",
                  padding: 6,
                  minHeight: 90,
                  cursor: cell.current ? "pointer" : "default",
                  background: isTodayCell ? "rgba(24,95,165,0.04)" : undefined,
                }}
                onMouseEnter={e => cell.current && (e.currentTarget.style.background = "#fafafa")}
                onMouseLeave={e => e.currentTarget.style.background = isTodayCell ? "rgba(24,95,165,0.04)" : ""}
              >
                {/* day number */}
                <div style={{
                  fontSize: 13, fontWeight: 500, marginBottom: 4,
                  width: 24, height: 24,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: "50%",
                  color: !cell.current ? "#ccc" : isTodayCell ? "#fff" : "#111",
                  background: isTodayCell ? "#185FA5" : undefined,
                }}>
                  {cell.day}
                </div>

                {/* events */}
                {cellEvents.slice(0, showMax).map(ev => {
                  const col = EVENT_COLOURS[ev.type] || EVENT_COLOURS.pickup;
                  return (
                    <div
                      key={ev.id}
                      onClick={e => { e.stopPropagation(); onEventClick?.(ev); }}
                      style={{
                        borderRadius: 4, padding: "2px 6px", fontSize: 11, fontWeight: 500,
                        marginBottom: 2, cursor: "pointer", whiteSpace: "nowrap",
                        overflow: "hidden", textOverflow: "ellipsis",
                        background: col.bg, color: col.text,
                      }}
                    >
                      {ev.label}
                    </div>
                  );
                })}
                {cellEvents.length > showMax && (
                  <div
                    onClick={e => { e.stopPropagation(); onDayClick?.(new Date(year, month, cell.day)); }}
                    style={{ fontSize: 10, color: "#aaa", cursor: "pointer", padding: "1px 4px" }}
                  >
                    +{cellEvents.length - showMax} more
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── legend ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>Legend:</span>
        {Object.entries(EVENT_COLOURS).map(([type, col]) => (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#666" }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: col.bg }} />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </div>
        ))}
      </div>

      {/* ── quick actions ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
        {[
          { icon: "⏰", label: "Overdue alerts"  },
          { icon: "📊", label: "Revenue report"  },
          { icon: "🔧", label: "Maintenance due" },
          { icon: "💡", label: "Smart pricing"   },
          { icon: "📄", label: "Export schedule" },
        ].map(({ icon, label }) => (
          <button key={label} style={{ flex: 1, minWidth: 110, border: "0.5px solid #ddd", borderRadius: 8, padding: "8px 10px", cursor: "pointer", background: "#fff", fontSize: 12, fontWeight: 500, textAlign: "center" }}>
            <span style={{ fontSize: 16, marginBottom: 3, display: "block" }}>{icon}</span>
            {label}
          </button>
        ))}
      </div>

    </div>
  );
}

function StatCard({ label, value, sub, subColour = "#888" }) {
  return (
    <div style={{ background: "#f5f5f5", borderRadius: 8, padding: "10px 14px" }}>
      <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: subColour, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

const btnStyle       = { background: "#f5f5f5", border: "0.5px solid #ddd", borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontSize: 13, color: "#666" };
const primaryBtnStyle = { background: "#185FA5", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer" };
