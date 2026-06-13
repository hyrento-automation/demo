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
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkState() {
  const counts: any = {}
  const tables = ['Coupon', 'Branch', 'Location', 'Addon', 'PricingRule', 'User']
  
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
    counts[table] = error ? error.message : count
  }
  
  console.log('Database Table Counts:', JSON.stringify(counts, null, 2))
}

checkState()
