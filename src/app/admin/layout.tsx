"use client"

import React from 'react'
import Link from 'next/link'
import { LayoutDashboard, CalendarDays, Car, Users, Settings, BookOpen, BarChart3, Building2, ClipboardList } from 'lucide-react'
import { usePathname } from 'next/navigation'

const MENU = [
  { name: 'Dashboard',  icon: LayoutDashboard, href: '/admin' },
  { name: 'Bookings',   icon: BookOpen,        href: '/admin/bookings' },
  { name: 'Calendar',   icon: CalendarDays,    href: '/admin/calendar' },
  { name: 'Fleet',      icon: Car,             href: '/admin/fleet' },
  { name: 'Customers',  icon: Users,           href: '/admin/customers' },
  { name: 'Analytics',  icon: BarChart3,       href: '/admin/analytics' },
  { name: 'Branches',   icon: Building2,       href: '/admin/branches' },
  { name: 'Audit Log',  icon: ClipboardList,   href: '/admin/audit' },
  { name: 'Settings',   icon: Settings,        href: '/admin/settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row relative z-0 pb-16 md:pb-0">
      {/* Mobile Top App Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#1E293B] text-white sticky top-0 z-40 shadow-md">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-black text-xl italic tracking-wider text-[#0D9B84]">HYRENTO</span>
          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#0D9B84]/20 text-[#0D9B84] border border-[#0D9B84]/30">OS</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-xs font-bold flex items-center gap-1.5"
        >
          {mobileMenuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#1E293B]/95 backdrop-blur-md flex flex-col p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <span className="font-black text-2xl italic tracking-wider text-[#0D9B84]">HYRENTO ADMIN</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-white/10 text-white text-sm font-bold"
            >
              ✕
            </button>
          </div>
          <nav className="flex-1 space-y-2 overflow-y-auto">
            {MENU.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-bold transition-colors ${
                  pathname === item.href
                    ? 'bg-[#0D9B84] text-white shadow-lg shadow-[#0D9B84]/30'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <item.icon size={20} className={pathname === item.href ? 'text-white' : 'text-[#0D9B84]'} />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#1E293B] text-white flex-col hidden md:flex fixed inset-y-0 z-50">
        <div className="p-6">
          <Link href="/admin" className="inline-block">
            <div className="font-[family-name:var(--font-inter)] font-black text-2xl italic tracking-widest text-[#0D9B84] uppercase">HYRENTO</div>
          </Link>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mt-1">Admin Portal</div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-8">
          {MENU.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                pathname === item.href
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <item.icon size={18} className="text-[#0D9B84]" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* MVP badge in sidebar footer */}
        <div className="p-4 mt-auto mb-4 border-t border-white/10 mx-4">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#0D9B84]/10 border border-[#0D9B84]/30">
            <div className="w-2 h-2 rounded-full bg-[#0D9B84] animate-pulse" />
            <span className="text-xs font-bold text-[#0D9B84] uppercase tracking-widest">Hyrento Cloud OS</span>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 md:pl-64 flex flex-col min-h-screen w-full overflow-x-hidden">
        <div className="flex-1 p-3.5 sm:p-6 md:p-8 w-full max-w-7xl mx-auto overflow-x-hidden">
          {children}
        </div>
      </main>

      {/* Mobile Bottom App Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200/90 flex items-center justify-around py-2 px-1 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        {[
          { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
          { name: 'Bookings', icon: BookOpen, href: '/admin/bookings' },
          { name: 'Calendar', icon: CalendarDays, href: '/admin/calendar' },
          { name: 'Fleet', icon: Car, href: '/admin/fleet' },
          { name: 'Customers', icon: Users, href: '/admin/customers' },
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
      </nav>
    </div>
  )
}
