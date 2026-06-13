"use client"

import React from 'react'
import { Car, CheckCircle, Clock, AlertTriangle, TrendingUp, Calendar as CalIcon, Users, CreditCard, Activity, ArrowRight, Zap, Navigation } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import Link from 'next/link'
import { getDashboardStats } from '@/src/lib/actions/admin.actions'
import dynamic from 'next/dynamic'
import EditRideModal from '@/src/app/admin/components/EditRideModal'
import ManualBookingModal from '@/src/app/admin/components/ManualBookingModal'

const AddFleetModal = dynamic(() => import('@/src/app/admin/components/AddFleetModal'), { ssr: false })

export default function AdminOverview() {
  const [stats, setStats] = React.useState<any>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editRideTarget, setEditRideTarget] = React.useState<any>(null)

  const handleEditRide = (ride: any) => setEditRideTarget(ride)

  const fetchStats = () => {
    getDashboardStats()
      .then(setStats)
      .catch(() => {
        setStats({
          pulse: { available: 0, active: 0, maintenance: 0, dueBack: 0 },
          revenue: [
            { name: 'Mon', revenue: 0 },
            { name: 'Tue', revenue: 0 },
            { name: 'Wed', revenue: 0 },
            { name: 'Thu', revenue: 0 },
            { name: 'Fri', revenue: 0 },
            { name: 'Sat', revenue: 0 },
            { name: 'Sun', revenue: 0 },
          ],
          paymentStats: [],
          recentBookings: [],
          upcomingRides: [],
          visitorsGraph: Array.from({ length: 12 }).map((_, index) => ({
            time: (index * 10) + 'm',
            visitors: 0,
          })),
        })
      })
  }

  React.useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 60000)
    return () => clearInterval(interval)
  }, [])

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="w-12 h-12 border-4 border-[#0D9B84] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#1E293B] font-bold animate-pulse">Initializing Smart Dashboard...</p>
      </div>
    )
  }

  const { pulse, revenue, paymentStats, recentBookings, upcomingRides, visitorsGraph } = stats

  const paidCount = paymentStats.find((p: any) => p.paymentStatus === 'PAID')?.count || 0
  const pendingCount = paymentStats.find((p: any) => p.paymentStatus === 'PENDING')?.count || 0
  const partialCount = paymentStats.find((p: any) => p.paymentStatus === 'PARTIALLY_PAID')?.count || 0
  const totalPayments = paidCount + pendingCount + partialCount || 1

  return (
    <div className="space-y-10 pb-10">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#1E293B] uppercase tracking-tight">Smart Command Center</h1>
          <p className="text-gray-500 font-medium mt-1">Real-time fleet intelligence for {process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'}.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1E293B] text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-[#0D9B84] transition-all active:scale-95 group shadow-lg"
        >
          <Activity className="w-4 h-4" />
          Manual Booking Entry
        </button>
      </div>

      {/* Fleet Pulse Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="relative p-6 rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 bg-[#E1F5EE]">
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/40 rounded-bl-[100px] group-hover:scale-125 transition-transform duration-700" />
          <div className="p-3 rounded-2xl w-fit bg-white/70 text-[#0D9B84] mb-4 relative z-10">
            <CheckCircle className="w-6 h-6" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-[#0D9B84] relative z-10">Available</p>
          <p className="text-5xl font-black text-[#1E293B] relative z-10">{pulse.available}</p>
        </div>

        <div className="relative p-6 rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 bg-yellow-50">
          <div className="absolute top-0 right-0 w-28 h-28 bg-yellow-200/40 rounded-bl-[100px] group-hover:scale-125 transition-transform duration-700" />
          <div className="p-3 rounded-2xl w-fit bg-yellow-100 text-yellow-600 mb-4 relative z-10">
            <Car className="w-6 h-6" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-yellow-600 relative z-10">Active Rent</p>
          <p className="text-5xl font-black text-[#1E293B] relative z-10">{pulse.active}</p>
        </div>

        <div className="relative p-6 rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 bg-orange-50">
          <div className="absolute top-0 right-0 w-28 h-28 bg-orange-200/30 rounded-bl-[100px] group-hover:scale-125 transition-transform duration-700" />
          <div className="p-3 rounded-2xl w-fit bg-orange-100 text-orange-500 mb-4 relative z-10">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-orange-500 relative z-10">Due Back</p>
          <p className="text-5xl font-black text-[#1E293B] relative z-10">{pulse.dueBack}</p>
        </div>

        <div className="relative p-6 rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 bg-red-50">
          <div className="absolute top-0 right-0 w-28 h-28 bg-red-200/30 rounded-bl-[100px] group-hover:scale-125 transition-transform duration-700" />
          <div className="p-3 rounded-2xl w-fit bg-red-100 text-red-500 mb-4 relative z-10">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-red-500 relative z-10">Maintenance</p>
          <p className="text-5xl font-black text-[#1E293B] relative z-10">{pulse.maintenance}</p>
        </div>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Charts + Bookings */}
        <div className="lg:col-span-2 space-y-8">

          {/* Revenue Chart */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-[#1E293B] uppercase tracking-tight">Revenue Trajectory</h3>
                <p className="text-sm text-gray-500 mt-1">Gross income from fully paid bookings (7 days)</p>
              </div>
              <div className="bg-[#E1F5EE] text-[#0D9B84] px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2">
                <TrendingUp size={16} />
                Live
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9B84" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0D9B84" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 'bold' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 'bold' }} width={80} tickFormatter={(val: number) => 'MUR ' + (val / 1000) + 'k'} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold', color: '#1E293B' }}
                    formatter={(value: number) => ['MUR ' + value.toLocaleString(), 'Income']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#0D9B84" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Rides + Smart Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Upcoming Departures */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-[#1E293B] flex items-center gap-2 uppercase">
                  <Activity size={18} className="text-[#0D9B84]" /> Upcoming Rides
                </h3>
                <Link href="/admin/calendar" className="text-xs font-bold text-[#0D9B84] flex items-center gap-1 hover:opacity-70">
                  Calendar <ArrowRight size={12} />
                </Link>
              </div>
              <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1">
                {upcomingRides.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6 border border-dashed rounded-xl">No rides scheduled today.</p>
                ) : upcomingRides.map((ride: any) => (
                  <div
                    key={ride.id}
                    onClick={() => handleEditRide(ride)}
                    className="cursor-pointer p-4 border border-gray-100 rounded-xl hover:border-[#0D9B84]/30 hover:bg-[#E1F5EE]/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="font-bold text-sm text-[#1E293B]">{ride.car?.make} {ride.car?.model}</p>
                        <p className="text-xs text-gray-500">{ride.driverName || ride.user?.name || 'Walk-in Client'}</p>
                      </div>
                      <span className={[
                        'text-[10px] font-bold px-2 py-1 rounded tracking-wide',
                        ride.status === 'CONFIRMED' ? 'bg-[#E1F5EE] text-[#0D9B84]' : 'bg-gray-100 text-gray-700'
                      ].join(' ')}>
                        {ride.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Pickup: <span className="font-bold text-gray-700">{new Date(ride.pickupDate).toLocaleDateString()}</span>
                      <span className="ml-4 font-black text-[#1E293B]">MUR {ride.totalPrice?.toLocaleString()}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights Panel */}
            <div className="bg-gradient-to-br from-[#1E293B] to-[#121f38] rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 bg-[#0D9B84]/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#0D9B84]" />
                </div>
                <div>
                  <h2 className="text-base font-black tracking-tight uppercase">Smart Insights</h2>
                  <p className="text-xs text-white/50 font-bold uppercase tracking-wider">Fleet Intelligence</p>
                </div>
              </div>
              <div className="space-y-3 relative z-10">
                <div className="bg-white/10 p-4 border border-white/10 rounded-2xl">
                  <h4 className="text-sm font-black text-emerald-400 flex items-center gap-2 mb-1">
                    <Navigation className="w-4 h-4" /> Fleet Status
                  </h4>
                  <p className="text-xs text-white/70">{pulse.available} cars ready to rent. Consider promotional pricing to maximize occupancy.</p>
                </div>
                {pulse.maintenance > 0 && (
                  <div className="bg-red-500/20 p-4 border border-red-500/30 rounded-2xl">
                    <h4 className="text-sm font-black text-red-400 flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4" /> Maintenance Alert
                    </h4>
                    <p className="text-xs text-white/70">{pulse.maintenance} vehicle(s) need attention. Quick turnaround means more bookings.</p>
                  </div>
                )}
                {pulse.dueBack > 0 && (
                  <div className="bg-[#0D9B84]/20 p-4 border border-[#0D9B84]/30 rounded-2xl">
                    <h4 className="text-sm font-black text-[#0D9B84] flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4" /> Due Returns
                    </h4>
                    <p className="text-xs text-white/70">{pulse.dueBack} car(s) returning soon. Prepare cleaning crew for rapid turnaround.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Bookings Ledger */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-[#1E293B] flex items-center gap-2 uppercase">
                <CalIcon size={18} className="text-blue-500" /> Recent Ledgers
              </h3>
              <span className="text-xs text-gray-400">Latest 5 database entries</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="text-[10px] uppercase font-black text-gray-400 tracking-wider">
                  <tr className="border-b border-gray-100">
                    <th className="pb-3">Ref</th>
                    <th className="pb-3">Vehicle</th>
                    <th className="pb-3">Payment</th>
                    <th className="pb-3 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {recentBookings.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-6 text-gray-400">No recent entries</td></tr>
                  ) : recentBookings.map((book: any) => (
                    <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 font-mono text-gray-500">{book.bookingRef?.slice(0, 8)}</td>
                      <td className="py-3 font-bold text-[#1E293B]">{book.car?.make} {book.car?.model}</td>
                      <td className="py-3">
                        <span className={[
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold',
                          book.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' :
                          book.paymentStatus === 'PARTIALLY_PAID' ? 'bg-yellow-50 text-yellow-600' :
                          'bg-red-50 text-red-600'
                        ].join(' ')}>
                          {book.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 font-black text-[#1E293B] text-right">MUR {book.totalPrice?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">

          {/* Financial Health */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-widest mb-6 flex items-center gap-2">
              <CreditCard size={18} className="text-[#0D9B84]" /> Financial Health
            </h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-black mb-1">
                  <span className="text-[#0D9B84]">Paid in Full ({paidCount})</span>
                  <span className="text-[#1E293B]">{Math.round((paidCount / totalPayments) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0D9B84] rounded-full transition-all duration-700" style={{ width: (paidCount / totalPayments * 100) + '%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-black mb-1">
                  <span className="text-yellow-500">Partial ({partialCount})</span>
                  <span className="text-[#1E293B]">{Math.round((partialCount / totalPayments) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full transition-all duration-700" style={{ width: (partialCount / totalPayments * 100) + '%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-black mb-1">
                  <span className="text-red-500">Pending ({pendingCount})</span>
                  <span className="text-[#1E293B]">{Math.round((pendingCount / totalPayments) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div className="h-full bg-red-400 rounded-full transition-all duration-700" style={{ width: (pendingCount / totalPayments * 100) + '%' }} />
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-6 py-3 rounded-xl border-2 border-dashed border-[#0D9B84]/50 text-[#0D9B84] hover:bg-[#0D9B84] hover:text-white hover:border-[#0D9B84] font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              Force Manual Booking
            </button>
          </div>

          {/* Live Website Traffic */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#0D9B84] animate-ping" />
                <span className="text-xs font-black uppercase tracking-widest text-gray-500">Website Traffic</span>
              </div>
              <Users size={16} className="text-gray-300" />
            </div>
            <p className="text-4xl font-black text-[#1E293B] mb-1">
              {(visitorsGraph[visitorsGraph.length - 1]?.visitors || 0) + 24}
              <span className="text-sm text-gray-400 font-sans font-normal ml-2">visitors now</span>
            </p>
            <div className="h-[100px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visitorsGraph}>
                  <Bar dataKey="visitors" fill="#1E293B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-widest mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Fleet Manager', href: '/admin/fleet', color: 'bg-[#E1F5EE] text-[#0D9B84] hover:bg-[#0D9B84] hover:text-white' },
                { label: 'Customers', href: '/admin/customers', color: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white' },
                { label: 'Calendar', href: '/admin/calendar', color: 'bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white' },
                { label: 'Settings', href: '/admin/settings', color: 'bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white' },
              ].map((action) => (
                <Link key={action.href} href={action.href}>
                  <div className={['p-4 rounded-2xl text-center font-black text-xs uppercase tracking-wide transition-all duration-300 cursor-pointer', action.color].join(' ')}>
                    {action.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      <ManualBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchStats} />
      <EditRideModal isOpen={!!editRideTarget} ride={editRideTarget} onClose={() => setEditRideTarget(null)} onSuccess={() => { setEditRideTarget(null); fetchStats() }} />
    </div>
  )
}
