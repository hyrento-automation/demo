"use client"

import React, { useState, useEffect } from 'react'
import { Car, PlusCircle, Power, Search, MapPin, GaugeCircle, Edit2, Trash2 } from 'lucide-react'
import { getFleetDashboard } from '@/src/lib/actions/admin.actions'
import AddFleetModal from '@/src/app/admin/components/AddFleetModal'
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts'

export default function FleetPage() {
  const [data, setData] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [carToEdit, setCarToEdit] = useState<any>(null)
  const [search, setSearch] = useState('')

  const fetchDashboard = () => {
    getFleetDashboard()
      .then(setData)
      .catch(err => {
        console.error("Failed to load Fleet data:", err)
        setData({
          cars: [],
          stats: {
            total: 0,
            available: 0,
            maintenance: 0,
            rented: 0,
            categoryDistribution: [],
          },
        })
      })
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  if (!data) return <div className="text-center py-20 text-[#1E293B] font-bold animate-pulse">Loading Fleet Intelligence...</div>

  const filteredCars = data.cars.filter((c: any) => 
    `${c.make} ${c.model} ${c.plateNumber}`.toLowerCase().includes(search.toLowerCase())
  )

  const CategoryColors: Record<string, string> = {
    SUV: "#1E293B",
    MINI: "#0D9B84",
    PICKUP: "#0D9B84",
    VAN: "#E8534A",
    COMPACT: "#F59E0B",
    ECONOMY: "#3B82F6",
    LUXURY: "#7C3AED",
    MIDSIZE: "#14B8A6",
    SPORTS: "#DC2626",
    CONVERTIBLE: "#EC4899",
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1E293B] flex items-center gap-2 font-[family-name:var(--font-inter)]">
            Fleet Intelligence Hub
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage vehicles, specs, and status metrics.</p>
        </div>
        <button onClick={() => { setCarToEdit(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-[#1E293B] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_4px_14px_0_rgba(27,45,79,0.39)] hover:bg-[#0D9B84] hover:shadow-[0_4px_14px_0_rgba(201,168,76,0.39)] transition-all">
          <PlusCircle size={16} /> Add New Vehicle
        </button>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <p className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 mb-1">Total Fleet Size</p>
          <p className="text-4xl font-black text-[#1E293B]">{data.stats.total}</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:col-span-3 flex items-center">
          <div className="w-1/3">
             <p className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 mb-2">Category Distribution</p>
             <div className="h-16 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.stats.categoryDistribution}>
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                      {data.stats.categoryDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={CategoryColors[entry.name] || '#1E293B'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
          <div className="w-2/3 pl-8 flex gap-8">
             <div>
                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 mb-1">Active on road</p>
                <p className="text-2xl font-black text-[#1E293B]">{data.stats.rented}</p>
             </div>
             <div>
                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-[#0D9B84] mb-1">Available to rent</p>
                <p className="text-2xl font-black text-[#0D9B84]">{data.stats.available}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
           <h3 className="font-bold text-[#1E293B]">Active Roster</h3>
           <div className="relative">
             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input type="text" placeholder="Search make, plate..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-[#0D9B84]" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[10px] uppercase font-black text-gray-400 tracking-wider bg-white">
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Vehicle Details</th>
                <th className="px-6 py-4 font-medium">Plate</th>
                <th className="px-6 py-4 font-medium">Category / Specs</th>
                <th className="px-6 py-4 font-medium">Depreciation Rate</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {filteredCars.map((car: any) => (
                <tr key={car.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#1E293B] text-sm">{car.make} {car.model}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-600 font-bold tracking-widest">{car.plateNumber || 'TBA'}</span>
                  </td>
                  <td className="px-6 py-4">
                     <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#E1F5EE] text-[#0D9B84] mb-1">
                       {car.category}
                     </span>
                     <p className="text-gray-400 text-[10px] uppercase tracking-wide">{car.transmission} · {car.fuelType}</p>
                  </td>
                  <td className="px-6 py-4">
                     <p className="font-black text-[#1E293B]">MUR {car.pricePerDay} <span className="text-gray-400 font-normal">/ day</span></p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                      car.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                      car.status === 'RENTED' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                      'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      <Power size={10} /> {car.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={async () => {
                          await import('@/src/lib/actions/admin.actions').then(m => m.toggleVehicleStatus(car.id))
                          fetchDashboard()
                        }}
                        title={car.status === 'AVAILABLE' ? "Mark Maintenance" : "Mark Available"}
                        className={`p-2 rounded-xl transition-colors ${
                          car.status === 'AVAILABLE' ? 'bg-orange-50 text-orange-500 hover:bg-orange-100' : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100'
                        }`}
                      >
                        <Power size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          setCarToEdit(car)
                          setIsModalOpen(true)
                        }}
                        title="Edit Vehicle"
                        className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={async () => {
                          if (confirm(`Are you sure you want to delete ${car.make} ${car.model}?`)) {
                            await import('@/src/lib/actions/admin.actions').then(m => m.deleteFleetVehicle(car.id))
                            fetchDashboard()
                          }
                        }}
                        title="Delete Vehicle"
                        className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCars.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">No vehicles found matching your criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddFleetModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setCarToEdit(null); }} onSuccess={fetchDashboard} carToEdit={carToEdit} />
    </div>
  )
}
