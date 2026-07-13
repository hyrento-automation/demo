-- ================================
-- CAR
-- ================================
ALTER TABLE "Car" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "car_select" ON "Car";
DROP POLICY IF EXISTS "car_insert" ON "Car";
DROP POLICY IF EXISTS "car_update" ON "Car";
DROP POLICY IF EXISTS "car_delete" ON "Car";
CREATE POLICY "car_select" ON "Car" FOR SELECT USING (true);
CREATE POLICY "car_insert" ON "Car" FOR INSERT WITH CHECK (true);
CREATE POLICY "car_update" ON "Car" FOR UPDATE USING (true);
CREATE POLICY "car_delete" ON "Car" FOR DELETE USING (true);

-- ================================
-- CarImage
-- ================================
ALTER TABLE "CarImage" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "carimage_all" ON "CarImage";
CREATE POLICY "carimage_all" ON "CarImage" FOR ALL USING (true) WITH CHECK (true);

-- ================================
-- Branch
-- ================================
ALTER TABLE "Branch" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "branch_all" ON "Branch";
CREATE POLICY "branch_all" ON "Branch" FOR ALL USING (true) WITH CHECK (true);

-- ================================
-- Booking
-- ================================
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "booking_select" ON "Booking";
DROP POLICY IF EXISTS "booking_insert" ON "Booking";
DROP POLICY IF EXISTS "booking_update" ON "Booking";
CREATE POLICY "booking_select" ON "Booking" FOR SELECT USING (true);
CREATE POLICY "booking_insert" ON "Booking" FOR INSERT WITH CHECK (true);
CREATE POLICY "booking_update" ON "Booking" FOR UPDATE USING (true);

-- ================================
-- BookingAddon
-- ================================
ALTER TABLE "BookingAddon" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "bookingaddon_all" ON "BookingAddon";
CREATE POLICY "bookingaddon_all" ON "BookingAddon" FOR ALL USING (true) WITH CHECK (true);

-- ================================
-- Addon
-- ================================
ALTER TABLE "Addon" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "addon_all" ON "Addon";
CREATE POLICY "addon_all" ON "Addon" FOR ALL USING (true) WITH CHECK (true);

-- ================================
-- Payment
-- ================================
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "payment_all" ON "Payment";
CREATE POLICY "payment_all" ON "Payment" FOR ALL USING (true) WITH CHECK (true);

-- ================================
-- PricingRule
-- ================================
ALTER TABLE "PricingRule" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "pricingrule_all" ON "PricingRule";
CREATE POLICY "pricingrule_all" ON "PricingRule" FOR ALL USING (true) WITH CHECK (true);

-- ================================
-- Coupon
-- ================================
ALTER TABLE "Coupon" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "coupon_all" ON "Coupon";
CREATE POLICY "coupon_all" ON "Coupon" FOR ALL USING (true) WITH CHECK (true);

-- ================================
-- Review
-- ================================
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "review_select" ON "Review";
DROP POLICY IF EXISTS "review_insert" ON "Review";
CREATE POLICY "review_select" ON "Review" FOR SELECT USING (true);
CREATE POLICY "review_insert" ON "Review" FOR INSERT WITH CHECK (true);

-- ================================
-- Session
-- ================================
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "session_all" ON "Session";
CREATE POLICY "session_all" ON "Session" FOR ALL USING (true) WITH CHECK (true);

-- ================================
-- AuditLog
-- ================================
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auditlog_all" ON "AuditLog";
CREATE POLICY "auditlog_all" ON "AuditLog" FOR ALL USING (true) WITH CHECK (true);

-- ================================
-- User
-- ================================
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_select" ON "User";
DROP POLICY IF EXISTS "user_update" ON "User";
CREATE POLICY "user_select" ON "User" FOR SELECT USING (true);
CREATE POLICY "user_update" ON "User" FOR UPDATE USING (true) WITH CHECK (true);

-- ================================
-- CustomerNote
-- ================================
ALTER TABLE "CustomerNote" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "customernote_all" ON "CustomerNote";
CREATE POLICY "customernote_all" ON "CustomerNote" FOR ALL USING (true) WITH CHECK (true);

-- ================================
-- MaintenanceLog
-- ================================
ALTER TABLE "MaintenanceLog" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "maintenance_all" ON "MaintenanceLog";
CREATE POLICY "maintenance_all" ON "MaintenanceLog" FOR ALL USING (true) WITH CHECK (true);

-- First, insert a Branch (Car references branchId)
INSERT INTO "Branch" (id, name, "address", phone, email, "isActive")
VALUES (
  'branch-001',
  'SSR Airport Branch',
  'SSR International Airport, Plaine Magnien',
  '+230 211 0000',
  'info@carhiremauritius.com',
  true
) ON CONFLICT (id) DO NOTHING;

-- Now insert the Car
INSERT INTO "Car" (
  id, slug, make, model, year,
  category, status,
  seats, doors, luggage,
  "fuelType", transmission,
  "engineCC", "mileagePerDay",
  "pricePerDay", "pricePerWeek", "priceDeposit",
  "thumbnailUrl",
  features, description,
  "plateNumber", color,
  "branchId",
  "updatedAt"
) VALUES (
  'car-porsche-001', 'porsche-911-carrera-2024',
  'Porsche', '911 Carrera', 2024,
  'SPORTS', 'AVAILABLE',
  2, 2, 1,
  'PETROL', 'AUTOMATIC',
  3000, 200,
  250, 1500, 500,
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
  ARRAY['Sport Exhaust', 'PDK Gearbox', 'Sport Chrono'],
  'The iconic Porsche 911 Carrera — a true sports legend.',
  'MU-001-AA', 'Guards Red',
  'branch-001',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert Car Image
INSERT INTO "CarImage" (id, "carId", url, alt, "isPrimary", "order")
SELECT 'img-porsche-001', id, 
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200',
  'Porsche 911 Carrera side view',
  true, 1
FROM "Car" WHERE slug = 'porsche-911-carrera-2024'
ON CONFLICT (id) DO NOTHING;

-- ================================
-- Storage (Images)
-- ================================
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'vehicle-images');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'vehicle-images');
