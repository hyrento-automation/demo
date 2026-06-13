"use client"

import React, { useState } from 'react'
import { X, Calendar, Activity } from 'lucide-react'
import { updateBookingStatus } from '@/src/lib/actions/admin.actions'

interface EditRideModalProps {
  isOpen: boolean
  ride: any
  onClose: () => void
  onSuccess: () => void
}

export default function EditRideModal({ isOpen, ride, onClose, onSuccess }: EditRideModalProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(ride?.status || 'CONFIRMED')

  React.useEffect(() => {
    setStatus(ride?.status || 'CONFIRMED')
  }, [ride])

  if (!isOpen || !ride) return null

  const handleUpdate = async () => {
    setLoading(true)
    try {
      await updateBookingStatus(ride.id, status as any)
      onSuccess()
      onClose()
    } catch(e) {
      console.error(e)
      alert("Failed offline mock status override.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#1E293B] text-white">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="text-[#0D9B84]" size={18} /> Ride Overseer
            </h2>
            <p className="text-[10px] uppercase font-black tracking-widest text-white/50">{ride.bookingRef}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4 bg-gray-50">
          <div>
            <span className="text-[10px] uppercase font-black text-gray-400">Driver</span>
            <p className="font-bold text-[#1E293B] text-sm">{ride.driverName}</p>
            <p className="text-xs text-gray-500">{ride.driverPhone}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-black text-gray-400">Vehicle</span>
            <p className="font-bold text-[#1E293B] text-sm">{ride.car?.make} {ride.car?.model}</p>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <span className="text-[10px] uppercase font-black text-[#0D9B84] tracking-[0.2em] mb-2 block flex items-center gap-1"><Activity size={12}/> Live Status Override</span>
            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1E293B] outline-none shadow-sm">
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="ACTIVE">ACTIVE (On Road)</option>
                <option value="COMPLETED">COMPLETED (Returned)</option>
                <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-white flex gap-2">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-xs text-gray-500 hover:bg-gray-100">Cancel</button>
          <button onClick={handleUpdate} disabled={loading} className="flex-1 py-3 rounded-xl font-black uppercase text-white bg-[#0D9B84] hover:bg-[#0b826f] text-[10px] tracking-widest disabled:opacity-50">
            {loading ? 'Committing...' : 'Commit Status'}
          </button>
        </div>
      </div>
    </div>
  )
}
