"use client"

import { usePathname } from 'next/navigation'
import Navbar from '@/src/components/layout/Navbar'
import Footer from '@/src/components/layout/Footer'

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) {
    return <main className="flex-grow">{children}</main>
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  )
}
