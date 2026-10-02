"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  CalendarDays,
  Car,
  Users,
  Settings,
  BookOpen,
  BarChart3,
  Building2,
  ClipboardList,
  Menu,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { usePathname } from 'next/navigation'

const MENU = [
  { name: 'Dashboard',  icon: LayoutDashboard, href: '/admin',          short: 'Dash' },
  { name: 'Bookings',   icon: BookOpen,        href: '/admin/bookings', short: 'Bookings' },
  { name: 'Calendar',   icon: CalendarDays,    href: '/admin/calendar', short: 'Calendar' },
  { name: 'Fleet',      icon: Car,             href: '/admin/fleet',    short: 'Fleet' },
  { name: 'Customers',  icon: Users,           href: '/admin/customers',short: 'Customers' },
  { name: 'Analytics',  icon: BarChart3,       href: '/admin/analytics',short: 'Analytics' },
  { name: 'Branches',   icon: Building2,       href: '/admin/branches', short: 'Branches' },
  { name: 'Audit Log',  icon: ClipboardList,   href: '/admin/audit',    short: 'Audit' },
  { name: 'Settings',   icon: Settings,        href: '/admin/settings', short: 'Settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const activeItem = MENU.find(m => m.href === pathname) || MENU[0]

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row relative z-0 pb-20 md:pb-0">
      {/* =========================================================
          MOBILE TOP APP BAR + QUICK JUMP TABS
      ========================================================= */}
      <header className="md:hidden sticky top-0 z-40 bg-[#1E293B] text-white shadow-lg">
        {/* Top Header Row */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-black text-xl italic tracking-wider text-[#0D9B84]">HYRENTO</span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#0D9B84]/20 text-[#0D9B84] border border-[#0D9B84]/30">ADMIN</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-300 bg-white/10 px-2.5 py-1 rounded-lg">
              {activeItem.name}
            </span>
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-xl bg-[#0D9B84] text-white transition-transform active:scale-95 shadow-md flex items-center gap-1.5"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Quick Horizontal Jump Tabs (Phone Single-Tap Navigation) */}
        <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto scrollbar-none bg-[#141E2E]">
          {MENU.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                  isActive
                    ? 'bg-[#0D9B84] text-white shadow-md shadow-[#0D9B84]/30'
                    : 'text-gray-300 hover:text-white bg-white/5 hover:bg-white/10'
                }`}
              >
                <item.icon size={13} className={isActive ? 'text-white' : 'text-[#0D9B84]'} />
                <span>{item.short}</span>
              </Link>
            )
          })}
        </div>
      </header>

      {/* =========================================================
          MOBILE SLIDE-OVER DRAWER MENU
      ========================================================= */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#0F172A]/95 backdrop-blur-md flex flex-col p-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl italic tracking-wider text-[#0D9B84]">HYRENTO</span>
              <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-md bg-[#0D9B84]/20 text-[#0D9B84]">CONTROL PANEL</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3 px-2">
            Switch Admin Section
          </p>

          <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
            {MENU.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-[#0D9B84] text-white shadow-lg shadow-[#0D9B84]/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={19} className={isActive ? 'text-white' : 'text-[#0D9B84]'} />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight size={16} className={isActive ? 'text-white' : 'text-gray-500'} />
                </Link>
              )
            })}
          </nav>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 px-2">
            <span>Admin Portal v2.4</span>
            <span className="flex items-center gap-1 text-[#0D9B84]">
              <Sparkles size={13} />
              Active Session
            </span>
          </div>
        </div>
      )}

      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}
      <aside className="w-64 bg-[#1E293B] text-white flex-col hidden md:flex fixed inset-y-0 z-50">
        <div className="p-6">
          <Link href="/admin" className="inline-block">
            <div className="font-[family-name:var(--font-inter)] font-black text-2xl italic tracking-widest text-[#0D9B84] uppercase">HYRENTO</div>
          </Link>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mt-1">Admin Portal</div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-6 overflow-y-auto">
          {MENU.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon size={18} className="text-[#0D9B84]" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 mt-auto mb-4 border-t border-white/10 mx-4">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#0D9B84]/10 border border-[#0D9B84]/30">
            <div className="w-2 h-2 rounded-full bg-[#0D9B84] animate-pulse" />
            <span className="text-xs font-bold text-[#0D9B84] uppercase tracking-widest">Hyrento Cloud OS</span>
          </div>
        </div>
      </aside>

      {/* =========================================================
          MAIN ADMIN CONTENT AREA
      ========================================================= */}
      <main className="flex-1 md:pl-64 flex flex-col min-h-screen w-full overflow-x-hidden">
        <div className="flex-1 p-3.5 sm:p-6 md:p-8 w-full max-w-7xl mx-auto overflow-x-hidden">
          {children}
        </div>
      </main>

      {/* =========================================================
          MOBILE BOTTOM QUICK-ACCESS BAR
      ========================================================= */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200/90 flex items-center justify-around py-2 px-1 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        {[
          { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
          { name: 'Bookings',  icon: BookOpen,        href: '/admin/bookings' },
          { name: 'Calendar',  icon: CalendarDays,    href: '/admin/calendar' },
          { name: 'Fleet',     icon: Car,             href: '/admin/fleet' },
          { name: 'Customers', icon: Users,           href: '/admin/customers' },
        ].map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-[#0D9B84]' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] ${isActive ? 'font-black' : 'font-semibold'}`}>{item.name}</span>
            </Link>
          )
        })}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-gray-400 hover:text-[#0D9B84] transition-all"
        >
          <Menu size={18} strokeWidth={2} />
          <span className="text-[10px] font-semibold">More</span>
        </button>
      </nav>
    </div>
  )
}
