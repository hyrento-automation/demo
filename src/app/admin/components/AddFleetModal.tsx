"use client"

import React, { useState, useRef } from 'react'
import { X, Car, LayoutDashboard, CircleDollarSign, Upload, ImageIcon, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { addFleetVehicle, editFleetVehicle } from '@/src/lib/actions/admin.actions'
import { uploadVehicleImage } from '@/src/lib/supabase'

interface AddFleetModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  carToEdit?: any
}

const CATEGORIES = ['MINI', 'ECONOMY', 'COMPACT', 'MIDSIZE', 'SUV', 'LUXURY', 'SPORTS', 'VAN', 'PICKUP', 'CONVERTIBLE']
const FEATURES = ['AC', 'GPS', 'Bluetooth', 'Baby Seat', 'Roof Rack', 'USB Charging', 'Heated Seats', '4x4', 'Sunroof', 'Dashcam']

export default function AddFleetModal({ isOpen, onClose, onSuccess, carToEdit }: AddFleetModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['AC', 'Bluetooth'])

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    plateNumber: '',
    color: '',
    category: 'MINI',
    transmission: 'AUTOMATIC',
    fuelType: 'PETROL',
    seats: 5,
    doors: 4,
    luggage: 2,
    engineCC: 1600,
    mileagePerDay: 200,
    pricePerDay: 1500,
    pricePerWeek: 8000,
    priceDeposit: 5000,
    description: '',
    imageUrl: '',
  })
  
  const isEdit = !!carToEdit

  React.useEffect(() => {
    if (isOpen) {
      if (isEdit && carToEdit) {
         setFormData({
            make: carToEdit.make || '',
            model: carToEdit.model || '',
            year: carToEdit.year || new Date().getFullYear(),
            plateNumber: carToEdit.plateNumber || '',
            color: carToEdit.color || '',
            category: carToEdit.category || 'MINI',
            transmission: carToEdit.transmission || 'AUTOMATIC',
            fuelType: carToEdit.fuelType || 'PETROL',
            seats: carToEdit.seats || 5,
            doors: carToEdit.doors || 4,
            luggage: carToEdit.luggage || 2,
            engineCC: carToEdit.engineCC || 1600,
            mileagePerDay: carToEdit.mileagePerDay || 200,
            pricePerDay: carToEdit.pricePerDay || 1500,
            pricePerWeek: carToEdit.pricePerWeek || 8000,
            priceDeposit: carToEdit.priceDeposit || 5000,
            description: carToEdit.description || '',
            imageUrl: carToEdit.thumbnailUrl || carToEdit.images?.[0]?.url || '',
         })
         setSelectedFeatures(carToEdit.features || ['AC', 'Bluetooth'])
         setImagePreview(carToEdit.thumbnailUrl || carToEdit.images?.[0]?.url || null)
      } else {
         setFormData({
            make: '', model: '', year: new Date().getFullYear(), plateNumber: '', color: '',
            category: 'MINI', transmission: 'AUTOMATIC', fuelType: 'PETROL',
            seats: 5, doors: 4, luggage: 2, engineCC: 1600, mileagePerDay: 200,
            pricePerDay: 1500, pricePerWeek: 8000, priceDeposit: 5000,
            description: '', imageUrl: '',
         })
         setSelectedFeatures(['AC', 'Bluetooth'])
         setImagePreview(null)
      }
      setStatus(null)
    }
  }, [isOpen, carToEdit, isEdit])

  if (!isOpen) return null

  const set = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }))

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show local preview immediately for instant feedback
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    setUploadingImage(true)
    setStatus(null)

    try {
      // Strategy 1: Supabase Storage (if configured)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (supabaseUrl && supabaseUrl !== 'https://[PROJECT-REF].supabase.co') {
        const publicUrl = await uploadVehicleImage(file)
        set('imageUrl', publicUrl)
        setStatus({ type: 'success', msg: '✅ Image uploaded to Supabase Storage!' })
        return
      }

      // Strategy 2: Cloudinary (if configured)
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      if (cloudName) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('upload_preset', 'pingouin_fleet')
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: fd,
        })
        if (!res.ok) throw new Error('Cloudinary upload failed')
        const data = await res.json()
        set('imageUrl', data.secure_url)
        setStatus({ type: 'success', msg: '✅ Image uploaded to Cloudinary!' })
        return
      }

      // Strategy 3: Dev mode — use local object URL (not persistent)
      const localUrl = URL.createObjectURL(file)
      set('imageUrl', localUrl)
      setStatus({ type: 'success', msg: '⚡ Preview mode — image not persisted. Configure Supabase Storage or Cloudinary for production.' })

    } catch (err: any) {
      setStatus({ type: 'error', msg: `Upload failed: ${err?.message || 'Unknown error'}. Vehicle will use default image.` })
    } finally {
      setUploadingImage(false)
    }
  }


  const toggleFeature = (f: string) => {
    setSelectedFeatures(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.make || !formData.model || !formData.plateNumber) {
      setStatus({ type: 'error', msg: 'Please fill in Make, Model and Plate Number.' })
      return
    }

    setLoading(true)
    setStatus(null)

    try {
      const payload = {
        ...formData,
        features: selectedFeatures,
        image: formData.imageUrl,
        dailyRate: formData.pricePerDay,
        seats: Number(formData.seats),
        doors: Number(formData.doors),
        luggage: Number(formData.luggage),
        year: Number(formData.year),
        engineCC: Number(formData.engineCC),
        mileagePerDay: Number(formData.mileagePerDay),
        pricePerDay: Number(formData.pricePerDay),
        pricePerWeek: Number(formData.pricePerWeek),
        priceDeposit: Number(formData.priceDeposit),
      }
      
      let res;
      if (isEdit) {
        res = await editFleetVehicle(carToEdit.id, payload)
      } else {
        res = await addFleetVehicle(payload)
      }

      if (res && !res.success) {
        throw new Error(res.error || 'Failed to persist vehicle data.')
      }
      
      setStatus({ 
        type: 'success', 
        msg: isEdit ? 'Vehicle updated successfully!' : 'Vehicle added to fleet successfully!' 
      })
      
      setTimeout(() => {
        onSuccess()
        onClose()
        setStatus(null)
        setImagePreview(null)
        setFormData({
          make: '', model: '', year: new Date().getFullYear(), plateNumber: '', color: '',
          category: 'MINI', transmission: 'AUTOMATIC', fuelType: 'PETROL',
          seats: 5, doors: 4, luggage: 2, engineCC: 1600, mileagePerDay: 200,
          pricePerDay: 1500, pricePerWeek: 8000, priceDeposit: 5000,
          description: '', imageUrl: '',
        })
        setSelectedFeatures(['AC', 'Bluetooth'])
      }, 1800)
    } catch (error: any) {
      setStatus({ type: 'error', msg: error?.message || 'Failed to add vehicle. Check database connection.' })
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-[#1E293B] focus:border-[#0D9B84] focus:ring-2 focus:ring-[#0D9B84]/10 outline-none transition-all'
  const labelCls = 'text-[10px] uppercase font-black text-gray-400 tracking-widest'

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh]">

        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-[#1E293B] text-white flex-shrink-0">
          <div>
            <h2 className="text-xl font-black tracking-wide flex items-center gap-3">
              <div className="w-8 h-8 bg-[#0D9B84] rounded-lg flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
              {isEdit ? 'Edit Fleet Vehicle' : 'Add Fleet Vehicle'}
            </h2>
            <p className="text-sm text-white/60 mt-1">All fields marked are stored in your Supabase database.</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-gray-50">
          <form id="add-fleet-form" onSubmit={handleSubmit} className="space-y-6">

            {/* Section 1: Image Upload */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-black text-[#1E293B] uppercase tracking-wide">
                <ImageIcon size={16} className="text-[#0D9B84]" /> Vehicle Photo
              </h3>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:border-[#0D9B84] transition-colors group"
                style={{ minHeight: '160px' }}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white font-bold text-sm">Click to change</p>
                    </div>
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                        <span className="text-white font-bold ml-2">Uploading...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <Upload className="w-10 h-10 mb-3 group-hover:text-[#0D9B84] transition-colors" />
                    <p className="font-bold text-sm">Click to upload vehicle photo</p>
                    <p className="text-xs mt-1">JPG, PNG, WEBP — Saved to Cloudinary</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <p className="text-xs text-gray-400">
                💡 To enable persistent cloud image uploads, add <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> and create upload preset <code className="bg-gray-100 px-1 rounded">pingouin_fleet</code> in your Cloudinary dashboard. Or use Supabase Storage — see instructions below.
              </p>
            </div>

            {/* Section 2: Core Identity */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-black text-[#1E293B] uppercase tracking-wide">
                <Car size={16} className="text-[#0D9B84]" /> Vehicle Identity
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className={labelCls}>Make / Brand *</span>
                  <input type="text" required value={formData.make} onChange={e => set('make', e.target.value)} className={inputCls} placeholder="e.g. Toyota" />
                </div>
                <div>
                  <span className={labelCls}>Model *</span>
                  <input type="text" required value={formData.model} onChange={e => set('model', e.target.value)} className={inputCls} placeholder="e.g. Yaris" />
                </div>
                <div>
                  <span className={labelCls}>Year *</span>
                  <input type="number" required value={formData.year} onChange={e => set('year', e.target.value)} min={2000} max={2030} className={inputCls} />
                </div>
                <div>
                  <span className={labelCls}>License Plate *</span>
                  <input type="text" required value={formData.plateNumber} onChange={e => set('plateNumber', e.target.value)} className={inputCls} placeholder="e.g. AB 1234" />
                </div>
                <div>
                  <span className={labelCls}>Color</span>
                  <input type="text" value={formData.color} onChange={e => set('color', e.target.value)} className={inputCls} placeholder="e.g. Pearl White" />
                </div>
                <div>
                  <span className={labelCls}>Category *</span>
                  <select value={formData.category} onChange={e => set('category', e.target.value)} className={inputCls}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Specs */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-black text-[#1E293B] uppercase tracking-wide">
                <LayoutDashboard size={16} className="text-[#0D9B84]" /> Technical Specifications
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <span className={labelCls}>Transmission</span>
                  <select value={formData.transmission} onChange={e => set('transmission', e.target.value)} className={inputCls}>
                    <option value="AUTOMATIC">Automatic</option>
                    <option value="MANUAL">Manual</option>
                  </select>
                </div>
                <div>
                  <span className={labelCls}>Fuel Type</span>
                  <select value={formData.fuelType} onChange={e => set('fuelType', e.target.value)} className={inputCls}>
                    <option value="PETROL">Petrol</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ELECTRIC">Electric</option>
                  </select>
                </div>
                <div>
                  <span className={labelCls}>Seats</span>
                  <input type="number" required value={formData.seats} onChange={e => set('seats', e.target.value)} min={2} max={12} className={inputCls} />
                </div>
                <div>
                  <span className={labelCls}>Doors</span>
                  <input type="number" required value={formData.doors} onChange={e => set('doors', e.target.value)} min={2} max={5} className={inputCls} />
                </div>
                <div>
                  <span className={labelCls}>Luggage (bags)</span>
                  <input type="number" required value={formData.luggage} onChange={e => set('luggage', e.target.value)} min={0} max={10} className={inputCls} />
                </div>
                <div>
                  <span className={labelCls}>Engine CC</span>
                  <input type="number" value={formData.engineCC} onChange={e => set('engineCC', e.target.value)} className={inputCls} />
                </div>
                <div className="col-span-2 md:col-span-3">
                  <span className={labelCls}>KM Allowed / Day</span>
                  <input type="number" value={formData.mileagePerDay} onChange={e => set('mileagePerDay', e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>

            {/* Section 4: Pricing */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-black text-[#1E293B] uppercase tracking-wide">
                <CircleDollarSign size={16} className="text-[#0D9B84]" /> Pricing (MUR)
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className={labelCls}>Daily Rate *</span>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 mt-0.5">MUR</span>
                    <input type="number" required value={formData.pricePerDay} onChange={e => set('pricePerDay', e.target.value)} min={1} className={inputCls + ' pl-14'} />
                  </div>
                </div>
                <div>
                  <span className={labelCls}>Weekly Rate *</span>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 mt-0.5">MUR</span>
                    <input type="number" required value={formData.pricePerWeek} onChange={e => set('pricePerWeek', e.target.value)} min={1} className={inputCls + ' pl-14'} />
                  </div>
                </div>
                <div>
                  <span className={labelCls}>Security Deposit *</span>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 mt-0.5">MUR</span>
                    <input type="number" required value={formData.priceDeposit} onChange={e => set('priceDeposit', e.target.value)} min={0} className={inputCls + ' pl-14'} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Features */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-wide">Features / Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {FEATURES.map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleFeature(f)}
                    className={[
                      'px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide border-2 transition-all',
                      selectedFeatures.includes(f)
                        ? 'bg-[#1E293B] border-[#1E293B] text-white'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-[#0D9B84] hover:text-[#0D9B84]'
                    ].join(' ')}
                  >
                    {selectedFeatures.includes(f) ? '✓ ' : ''}{f}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 6: Description */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-wide">Description (shown on Fleet page)</h3>
              <textarea
                value={formData.description}
                onChange={e => set('description', e.target.value)}
                rows={3}
                className={inputCls}
                placeholder="e.g. Perfect for exploring Mauritius, this fuel-efficient compact comes with AC and GPS..."
              />
            </div>

            {/* Status Message */}
            {status && (
              <div className={[
                'p-4 rounded-2xl flex items-start gap-3 text-sm font-bold',
                status.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'
              ].join(' ')}>
                {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                {status.msg}
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center flex-shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            form="add-fleet-form"
            disabled={loading || uploadingImage}
            className="px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[#111] text-[11px] bg-[#0D9B84] hover:bg-[#b08e36] shadow-lg shadow-[#0D9B84]/30 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving to Database...</>
            ) : (
              <><Car className="w-4 h-4" /> {isEdit ? 'Save Changes' : 'Add Vehicle to Fleet'}</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
