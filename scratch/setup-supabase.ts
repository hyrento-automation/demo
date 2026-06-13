import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Manual .env parsing
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env')
  if (!fs.existsSync(envPath)) return {}
  
  const content = fs.readFileSync(envPath, 'utf8')
  const env: Record<string, string> = {}
  
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    if (match) {
      let value = match[2] || ''
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1)
      env[match[1]] = value
    }
  })
  return env
}

const env = loadEnv()
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env')
  console.log('ENV keys found:', Object.keys(env))
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
  console.log('--- Setting up Supabase Storage ---')
  
  const bucketName = 'vehicle-images'
  
  // 1. Create the bucket if it doesn't exist
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  if (listError) {
    console.error('Error listing buckets:', listError.message)
    return
  }

  const exists = buckets.find(b => b.name === bucketName)
  
  if (!exists) {
    console.log(`Creating bucket: ${bucketName}...`)
    const { error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    })
    
    if (createError) {
      console.error('Error creating bucket:', createError.message)
    } else {
      console.log('✅ Bucket created successfully!')
    }
  } else {
    console.log(`✅ Bucket "${bucketName}" already exists.`)
    
    // Ensure it's public
    if (!exists.public) {
       console.log('Updating bucket to PUBLIC...')
       await supabase.storage.updateBucket(bucketName, { public: true })
    }
  }

  console.log('--- Storage setup complete ---')
}

async function checkDatabase() {
  console.log('\n--- Checking Database Connection ---')
  const { data, error } = await supabase.from('Booking').select('count', { count: 'exact', head: true })
  
  if (error) {
    console.error('Database connection error:', error.message)
  } else {
    console.log(`✅ Database connected! Booking count: ${data || 0}`)
  }
}

async function main() {
  await setupStorage()
  await checkDatabase()
}

main().catch(err => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
