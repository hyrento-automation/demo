import React from 'react'
import { redirect } from 'next/navigation'
import db from '@/src/lib/db'
import Navbar from '@/src/components/layout/Navbar'
import Footer from '@/src/components/layout/Footer'
import { Calendar, MapPin, Clock, Info, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react'
import CancelBookingButton from './CancelBookingButton'
import ModifyBookingButton from './ModifyBookingButton'

export default async function ClientDashboard({ searchParams }: { searchParams: { id?: string } }) {
  if (!searchParams.id) redirect('/manage')

  const booking = await db.booking.findUnique({
    where: { id: searchParams.id },
    include: { car: { include: { images: true } } }
  })

  if (!booking) redirect('/manage')

  const pickup = new Date(booking.pickupDate)
  const now = new Date()
  const hoursUntilPickup = (pickup.getTime() - now.getTime()) / (1000 * 60 * 60)
  
  const canCancelFree = hoursUntilPickup >= 48
  const isPast = hoursUntilPickup < 0

  return (
    <div className="min-h-screen bg-offWhite flex flex-col font-body">
      <Navbar />
      
      <main className="flex-1 max-w-[1000px] w-full mx-auto p-6 md:p-12 py-32 space-y-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                booking.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' :
                booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700'
              }`}>
                {booking.status}
              </span>
              <span className="text-sm font-bold text-gray-400">Ref: {booking.bookingRef}</span>
            </div>
            <h1 className="text-4xl font-display font-black text-navy leading-tight">Your Reservation.</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center">
              {booking.car && (
                <div className="w-full sm:w-1/3 aspect-video bg-offWhite rounded-2xl overflow-hidden relative border border-gray-100 flex-shrink-0">
                  <img src={booking.car.thumbnailUrl || booking.car.images?.[0]?.url || ''} alt="Vehicle" className="w-full h-full object-cover object-center" />
                </div>
              )}
              <div className="flex-1 w-full relative">
                <p className="text-[10px] font-black uppercase tracking-widest text-gold mb-1">Vehicle</p>
                <h3 className="text-xl font-black text-navy">{booking.car ? `${booking.car.make} ${booking.car.model}` : 'Unknown Vehicle'}</h3>
                {booking.car && <p className="text-xs text-gray-500 font-bold mt-1">{booking.car.transmission} • {booking.car.fuelType} • {booking.car.seats} Seats</p>}
                
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400">Total Price</p>
                    <p className="text-lg font-black text-navy">MUR {booking.totalPrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-navy border-b border-gray-100 pb-4">Itinerary</h3>
              
              <div className="flex items-start gap-4 relative">
                <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center flex-shrink-0 z-10"><MapPin size={16} /></div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pick-up Location</p>
                  <p className="font-bold text-sm text-navy mt-1">{booking.pickupLocation}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Calendar size={12} /> {new Date(booking.pickupDate).toLocaleDateString()}</p>
                </div>
                <div className="absolute left-[19px] top-10 bottom-[-40px] w-0.5 bg-gray-100 z-0 hidden sm:block" />
              </div>

              <div className="flex items-start gap-4 relative mt-8">
                <div className="w-10 h-10 rounded-full bg-navy/5 text-navy flex items-center justify-center flex-shrink-0 z-10"><MapPin size={16} /></div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Return Location</p>
                  <p className="font-bold text-sm text-navy mt-1">{booking.returnLocation}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Calendar size={12} /> {new Date(booking.returnDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h4 className="font-black text-navy mb-4 border-b border-gray-100 pb-3">Direct Actions</h4>
              
              {booking.status === 'CANCELLED' ? (
                <div className="bg-red-50 p-4 rounded-xl text-red-700 text-xs font-bold flex gap-2">
                  <AlertTriangle size={16} className="flex-shrink-0" />
                  This booking has been cancelled and cannot be modified.
                </div>
              ) : isPast ? (
                <div className="bg-gray-50 p-4 rounded-xl text-gray-500 text-xs font-bold">
                  This booking has already commenced or passed.
                </div>
              ) : (
                <div className="space-y-4">
                  <ModifyBookingButton bookingId={booking.id} />
                  
                  <div className="bg-offWhite p-4 rounded-xl">
                    <h5 className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-2 flex items-center gap-1">
                      <ShieldAlert size={12} /> Cancellation Policy
                    </h5>
                    {canCancelFree ? (
                      <p className="text-xs text-emerald-600 font-bold leading-relaxed">
                        You have free cancellation until {new Date(pickup.getTime() - (48*60*60*1000)).toLocaleDateString()}.
                      </p>
                    ) : (
                      <p className="text-xs text-red-500 font-bold leading-relaxed">
                        Less than 48 hours to pickup. A 1-day rental penalty will apply if cancelled now.
                      </p>
                    )}
                  </div>
                  
                  <CancelBookingButton bookingId={booking.id} canCancelFree={canCancelFree} />
                </div>
              )}
            </div>
            
            {booking.driverName && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-sm">
                 <h4 className="font-black text-navy mb-3">Primary Driver</h4>
                 <p className="font-bold text-gray-700">{booking.driverName}</p>
                 {booking.driverEmail && <p className="text-gray-500 mt-1">{booking.driverEmail}</p>}
                 {booking.driverPhone && <p className="text-gray-500 mt-1">{booking.driverPhone}</p>}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
