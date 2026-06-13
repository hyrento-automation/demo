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

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex relative z-0">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E293B] text-white flex-col hidden md:flex fixed inset-y-0 z-50">
        <div className="p-6">
          <Link href="/" className="inline-block">
            <div className="font-[family-name:var(--font-inter)] font-black text-2xl italic tracking-widest text-[#0D9B84] uppercase">{process.env.NEXT_PUBLIC_BRAND_NAME?.toUpperCase() || 'CAR HIRE'}</div>
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
            <span className="text-xs font-bold text-[#0D9B84] uppercase tracking-widest">MVP — Open Access</span>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 md:pl-64 flex flex-col min-h-screen w-full overflow-x-hidden">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center px-4 md:px-8 sticky top-0 z-40 shadow-sm">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[#1E293B]">Command Center</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-[#1E293B]">System Admin</p>
              <p className="text-xs text-[#0D9B84] font-bold">MVP Demo Mode</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#0D9B84] text-white flex items-center justify-center font-bold text-sm shadow-md">
              SA
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}
