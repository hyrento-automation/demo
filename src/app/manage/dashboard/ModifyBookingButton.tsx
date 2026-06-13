"use client"

import React, { useState } from 'react'
import { Edit2, X, Calendar, Loader2, CheckCircle } from 'lucide-react'
import { submitModificationRequest } from '@/src/lib/actions/manage.actions'
import { useRouter } from 'next/navigation'

export default function ModifyBookingButton({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    pickupDate: '',
    returnDate: '',
    notes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await submitModificationRequest(bookingId, form)
      setSuccess(true)
      setTimeout(() => {
        setIsOpen(false)
        setSuccess(false)
        router.refresh()
      }, 2000)
    } catch (err: any) {
      alert("Failed to request modification: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-4 rounded-xl border-2 border-gray-200 bg-white hover:border-[#1E293B] text-[#1E293B] font-black transition-all flex items-center justify-center gap-2"
      >
        <Edit2 size={18} />
        Request Modification
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !loading && setIsOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-black text-[#1E293B] text-xl">Modify Booking</h3>
              <button onClick={() => !loading && setIsOpen(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-full">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 bg-gray-50 flex-1">
              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h4 className="text-xl font-black text-[#1E293B] mb-2">Request Sent</h4>
                  <p className="text-gray-500 text-sm">Our team will review your modification request and contact you shortly with updated availability and pricing.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="bg-[#0D9B84]/10 p-4 rounded-xl text-[11px] font-bold text-[#0D9B84] mb-2 leading-relaxed">
                    Changes within 48 hours of pickup are subject to availability and may incur a fee. We will recalculate your rate and contact you for confirmation.
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-[#1E293B]">New Pickup Date (Optional)</label>
                    <input 
                      type="date" 
                      value={form.pickupDate} 
                      onChange={e => setForm(prev => ({ ...prev, pickupDate: e.target.value }))}
                      className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-[#1E293B] focus:border-[#0D9B84] focus:ring-1 focus:ring-[#0D9B84] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-[#1E293B]">New Return Date (Optional)</label>
                    <input 
                      type="date" 
                      value={form.returnDate} 
                      onChange={e => setForm(prev => ({ ...prev, returnDate: e.target.value }))}
                      className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-[#1E293B] focus:border-[#0D9B84] focus:ring-1 focus:ring-[#0D9B84] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-[#1E293B]">Details / Vehicle Changes *</label>
                    <textarea 
                      required
                      rows={3}
                      value={form.notes}
                      onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="e.g. I need to change my vehicle to an SUV, or push back my pickup by 1 day."
                      className="w-full mt-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-[#1E293B] focus:border-[#0D9B84] focus:ring-1 focus:ring-[#0D9B84] outline-none resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading || !form.notes}
                    className="w-full mt-4 bg-[#0D9B84] text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-[#087B68] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting</> : "Submit Request"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
