"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Car, Search, MessageSquare, Phone } from 'lucide-react'
import { useBrand } from '@/src/components/providers/BrandProvider'
import { cn } from '@/src/lib/utils'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const brand = useBrand()

  // Don't show bottom nav inside admin panel
  if (pathname.startsWith('/admin')) {
    return null
  }

  const navItems = [
    {
      name: 'Explore',
      href: '/',
      icon: Compass,
      isActive: pathname === '/' || pathname === '/en',
    },
    {
      name: 'Fleet',
      href: '/fleet',
      icon: Car,
      isActive: pathname.startsWith('/fleet'),
    },
    {
      name: 'Book',
      href: '/booking',
      icon: Search,
      isActive: pathname.startsWith('/booking'),
      primary: true,
    },
    {
      name: 'WhatsApp',
      href: brand?.whatsapp ? `https://wa.me/${(brand.whatsapp || '').replace(/[^0-9]/g, '')}` : '#',
      icon: MessageSquare,
      isExternal: true,
      color: 'text-emerald-500',
    },
    {
      name: 'Call',
      href: brand?.phone ? `tel:${(brand.phone || '').replace(/[^0-9+]/g, '')}` : '#',
      icon: Phone,
      isExternal: true,
    },
  ]

  return (
    <nav
      aria-label="Mobile Bottom App Bar"
      className="fixed inset-x-0 bottom-0 z-[90] lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] pb-safe"
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          if (item.primary) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center -top-3 relative group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-white shadow-lg shadow-gold/30 transition-transform active:scale-95">
                  <Icon size={22} className="stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-navy mt-1">
                  {item.name}
                </span>
              </Link>
            )
          }

          if (item.isExternal) {
            return (
              <a
                key={item.name}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex flex-col items-center justify-center w-14 py-1 text-gray-500 hover:text-navy transition-colors active:scale-95"
              >
                <Icon size={20} className={item.color || 'stroke-[1.8]'} />
                <span className="text-[10px] font-bold mt-1 tracking-tight truncate">
                  {item.name}
                </span>
              </a>
            )
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center w-14 py-1 transition-all active:scale-95',
                item.isActive
                  ? 'text-gold font-bold'
                  : 'text-gray-500 hover:text-navy font-medium'
              )}
            >
              <Icon size={20} className={cn('transition-colors', item.isActive ? 'stroke-[2.5]' : 'stroke-[1.8]')} />
              <span className="text-[10px] mt-1 tracking-tight truncate">
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
