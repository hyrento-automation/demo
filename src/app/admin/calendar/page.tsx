"use client"
import React from 'react'
import FleetCalendar from '@/src/components/admin/FleetCalendar'

export default function CalendarPage() {
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold text-[#1E293B] font-[family-name:var(--font-inter)]">
              Interactive Fleet Gantt
           </h2>
           <p className="text-gray-500 text-sm mt-1">Rentgine style booking management</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <FleetCalendar />
      </div>
    </div>
  )
}
