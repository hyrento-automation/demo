"use client"

import React from 'react'
import { Vehicle } from '../../types/fleet.types'
import VehicleCard from './VehicleCard'
import { motion, AnimatePresence } from 'framer-motion'

interface VehicleGridProps {
  vehicles: Vehicle[]
}

export default function VehicleGrid({ vehicles }: VehicleGridProps) {
  return (
    <motion.div 
      layout 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AnimatePresence>
        {vehicles.map((vehicle) => (
          <motion.div
            key={vehicle.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <VehicleCard vehicle={vehicle} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
