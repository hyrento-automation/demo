"use client"

import { usePathname } from 'next/navigation'
import Navbar from '@/src/components/layout/Navbar'
import Footer from '@/src/components/layout/Footer'
import { useBrand } from '@/src/components/providers/BrandProvider'
import { cn } from '@/src/lib/utils'
import MobileBottomNav from '@/src/components/layout/MobileBottomNav'

const homeHeaderSpacing: Record<string, string> = {
  Spain: 'bg-[#fff8ed] pt-24 lg:pt-[112px]',
  Europe: 'bg-[#f2f3ef] pt-24 lg:pt-[113px]',
  USA: 'bg-[#f4f0e8] pt-24 lg:pt-[100px]',
  UAE: 'bg-[#080a0d] pt-24 lg:pt-[104px]',
  'South Africa': 'bg-[#f4ead8] pt-24 lg:pt-[116px]',
  Mauritius: 'bg-[#E8F8F5] pt-24 lg:pt-24',
}

export default function AppChrome({ 
  children,
  cookieBanner,
  whatsappButton,
  isAdminDomain = false,
}: { 
  children: React.ReactNode
  cookieBanner?: React.ReactNode
  whatsappButton?: React.ReactNode
  isAdminDomain?: boolean
}) {
  const pathname = usePathname()
  const brand = useBrand()
  const isClientAdmin = typeof window !== 'undefined' && window.location.hostname.startsWith('admin.')
  const isAdminRoute = isAdminDomain || isClientAdmin || pathname.startsWith('/admin')
  const isHomeRoute = pathname === '/' || pathname === '/en'

  // If inside admin panel or on admin domain, strictly omit public website chrome (no Navbar, no Footer, no MobileBottomNav)
  if (isAdminRoute) {
    return <main className="flex-grow">{children}</main>
  }

  return (
    <>
      <Navbar />
      <main
        className={cn(
          'flex-grow pb-20 lg:pb-0',
          isHomeRoute && (homeHeaderSpacing[brand.country] || homeHeaderSpacing.Mauritius),
        )}
      >
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
      {cookieBanner}
      {whatsappButton}
    </>
  )
}
