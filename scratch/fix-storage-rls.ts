import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixStorageRLS() {
  console.log("Applying Storage RLS Policies...")
  
  const commands = [
    `ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;`,
    `DROP POLICY IF EXISTS "Public Access" ON storage.objects;`,
    `DROP POLICY IF EXISTS "Public Upload" ON storage.objects;`,
    `CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'vehicle-images');`,
    `CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'vehicle-images');`
  ]
  
  for (const sql of commands) {
      try {
        await prisma.$executeRawUnsafe(sql)
      } catch (error) {
        console.error("Error executing:", sql)
        console.error(error)
      }
  }

  console.log("✅ Storage RLS command sequence completed!")
  await prisma.$disconnect()
}

fixStorageRLS()
