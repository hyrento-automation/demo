import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy'

// Client-side Supabase client (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─────────────────────────────────────────
// STORAGE: Upload vehicle image to Supabase Storage
// ─────────────────────────────────────────

export async function uploadVehicleImage(file: File): Promise<string> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase credentials not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `fleet/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('vehicle-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    if (error.message.includes('Bucket not found')) {
      throw new Error(`Storage upload failed: The bucket "vehicle-images" was not found. Please create a PUBLIC bucket named "vehicle-images" in your Supabase project dashboard under Storage.`)
    }
    throw new Error(`Storage upload failed: ${error.message}`)
  }

  const { data: publicData } = supabase.storage
    .from('vehicle-images')
    .getPublicUrl(data.path)

  return publicData.publicUrl
}
