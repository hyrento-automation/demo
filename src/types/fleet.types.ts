export type VehicleCategory =
  | 'All' | 'Mini' | 'Compact' | 'Standard'
  | 'Sedan' | 'Mid-SUV' | 'SUV'
  | 'Pickup (4x4)' | '7-seater' | 'Premium 7-seater'
  | 'Sports' | 'Luxury' | 'Economy' | 'Van'

export interface Vehicle {
  id: string
  name?: string
  make?: string
  model?: string
  year?: number
  transmission: 'Automatic' | 'Manual'
  category: VehicleCategory
  priceFrom: number
  imageUrl: string
  seats: number
  bags: number
  doors?: number
  hasAC?: boolean
  acrissCode?: string
  fuel?: string
  rating?: number
  tag?: string
  tagColor?: string
}
