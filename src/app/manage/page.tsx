"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/src/components/layout/Navbar'
import Footer from '@/src/components/layout/Footer'
import { ArrowRight, Loader2, KeyRound } from 'lucide-react'
import { verifyBookingAccess } from '@/src/lib/actions/manage.actions'

export default function ManagePortalLogin() {
  const router = useRouter()
  const [bookingRef, setBookingRef] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const id = await verifyBookingAccess(bookingRef.trim(), email.trim())
      router.push(`/manage/dashboard?id=${id}`)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-offWhite flex flex-col font-body">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6 py-32">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-12 shadow-card relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10 space-y-8">
            <div>
              <div className="w-12 h-12 bg-sageBg rounded-2xl flex items-center justify-center text-navy mb-6">
                <KeyRound size={24} />
              </div>
              <h1 className="text-3xl font-display font-black text-navy leading-tight">Find your booking.</h1>
              <p className="text-sm text-gray-500 mt-2 font-medium">Enter your Booking Reference and Email to manage your reservation securely.</p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-100">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Booking Reference</label>
                <input 
                  type="text" 
                  required
                  value={bookingRef}
                  onChange={e => setBookingRef(e.target.value.toUpperCase())}
                  placeholder="e.g. CHM-A1B2C3"
                  className="w-full bg-offWhite/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-navy focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-offWhite/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-navy focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all placeholder:font-normal placeholder:text-gray-400"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-2 bg-gold hover:bg-gold-light text-white font-black uppercase text-xs tracking-widest py-4 rounded-xl shadow-lg shadow-gold/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying</> : <><ArrowRight size={16} /> Access Dashboard</>}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
