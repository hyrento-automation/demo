-- ===== STEP 1: RLS POLICIES =====
ALTER TABLE "Car" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "car_select" ON "Car"; DROP POLICY IF EXISTS "car_insert" ON "Car"; DROP POLICY IF EXISTS "car_update" ON "Car"; DROP POLICY IF EXISTS "car_delete" ON "Car";
CREATE POLICY "car_select" ON "Car" FOR SELECT USING (true);
CREATE POLICY "car_insert" ON "Car" FOR INSERT WITH CHECK (true);
CREATE POLICY "car_update" ON "Car" FOR UPDATE USING (true);
CREATE POLICY "car_delete" ON "Car" FOR DELETE USING (true);
ALTER TABLE "CarImage" ENABLE ROW LEVEL SECURITY; DROP POLICY IF EXISTS "ci_all" ON "CarImage"; CREATE POLICY "ci_all" ON "CarImage" FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE "Branch" ENABLE ROW LEVEL SECURITY; DROP POLICY IF EXISTS "br_all" ON "Branch"; CREATE POLICY "br_all" ON "Branch" FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "bk_sel" ON "Booking"; DROP POLICY IF EXISTS "bk_ins" ON "Booking"; DROP POLICY IF EXISTS "bk_upd" ON "Booking";
CREATE POLICY "bk_sel" ON "Booking" FOR SELECT USING (true); CREATE POLICY "bk_ins" ON "Booking" FOR INSERT WITH CHECK (true); CREATE POLICY "bk_upd" ON "Booking" FOR UPDATE USING (true);
ALTER TABLE "BookingAddon" ENABLE ROW LEVEL SECURITY; DROP POLICY IF EXISTS "ba_all" ON "BookingAddon"; CREATE POLICY "ba_all" ON "BookingAddon" FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE "Addon" ENABLE ROW LEVEL SECURITY; DROP POLICY IF EXISTS "ad_all" ON "Addon"; CREATE POLICY "ad_all" ON "Addon" FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY; DROP POLICY IF EXISTS "py_all" ON "Payment"; CREATE POLICY "py_all" ON "Payment" FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE "PricingRule" ENABLE ROW LEVEL SECURITY; DROP POLICY IF EXISTS "pr_all" ON "PricingRule"; CREATE POLICY "pr_all" ON "PricingRule" FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE "Coupon" ENABLE ROW LEVEL SECURITY; DROP POLICY IF EXISTS "cp_all" ON "Coupon"; CREATE POLICY "cp_all" ON "Coupon" FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "rv_sel" ON "Review"; DROP POLICY IF EXISTS "rv_ins" ON "Review";
CREATE POLICY "rv_sel" ON "Review" FOR SELECT USING (true); CREATE POLICY "rv_ins" ON "Review" FOR INSERT WITH CHECK (true);
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY; DROP POLICY IF EXISTS "ss_all" ON "Session"; CREATE POLICY "ss_all" ON "Session" FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY; DROP POLICY IF EXISTS "al_all" ON "AuditLog"; CREATE POLICY "al_all" ON "AuditLog" FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "us_sel" ON "User"; DROP POLICY IF EXISTS "us_upd" ON "User";
CREATE POLICY "us_sel" ON "User" FOR SELECT USING (true); CREATE POLICY "us_upd" ON "User" FOR UPDATE USING (true) WITH CHECK (true);
ALTER TABLE "CustomerNote" ENABLE ROW LEVEL SECURITY; DROP POLICY IF EXISTS "cn_all" ON "CustomerNote"; CREATE POLICY "cn_all" ON "CustomerNote" FOR ALL USING (true) WITH CHECK (true);
ALTER TABLE "MaintenanceLog" ENABLE ROW LEVEL SECURITY; DROP POLICY IF EXISTS "ml_all" ON "MaintenanceLog"; CREATE POLICY "ml_all" ON "MaintenanceLog" FOR ALL USING (true) WITH CHECK (true);

-- ===== STEP 2: BRANCHES =====
INSERT INTO "Branch" (id, name, address, phone, email, "isActive") VALUES
('br-001','Port Louis HQ','Sir William Newton Street, Port Louis','+230 211 0000','portlouis@carhiremauritius.com',true),
('br-002','SSR Airport','SSR International Airport, Plaine Magnien','+230 603 0000','airport@carhiremauritius.com',true)
ON CONFLICT (id) DO NOTHING;

-- ===== STEP 3: CARS =====
INSERT INTO "Car" (id,slug,make,model,year,category,status,seats,doors,luggage,"fuelType",transmission,"engineCC","pricePerDay","pricePerWeek","priceDeposit","thumbnailUrl",features,description,"plateNumber",color,"branchId","updatedAt") VALUES
-- MINI
('c-mn1','kia-picanto-2023','Kia','Picanto',2023,'MINI','AVAILABLE',4,5,1,'PETROL','AUTOMATIC',1000,800,4800,3000,'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',ARRAY['AC','Bluetooth'],'Compact city car.','MU-MN1','White','br-001',NOW()),
('c-mn2','hyundai-i10-2022','Hyundai','i10',2022,'MINI','AVAILABLE',4,5,1,'PETROL','MANUAL',1000,750,4500,3000,'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800',ARRAY['AC','Radio'],'Reliable mini.','MU-MN2','Silver','br-002',NOW()),
('c-mn3','fiat-500-2023','Fiat','500',2023,'MINI','AVAILABLE',4,3,1,'PETROL','AUTOMATIC',1200,900,5400,3500,'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',ARRAY['AC','Sunroof'],'Iconic Italian mini.','MU-MN3','Red','br-001',NOW()),
('c-mn4','chevrolet-spark-2022','Chevrolet','Spark',2022,'MINI','AVAILABLE',4,5,1,'PETROL','AUTOMATIC',1400,850,5100,3000,'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',ARRAY['AC','CarPlay'],'Modern mini.','MU-MN4','Blue','br-002',NOW()),
('c-mn5','peugeot-108-2023','Peugeot','108',2023,'MINI','AVAILABLE',4,5,1,'PETROL','MANUAL',1000,800,4800,3000,'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800',ARRAY['AC','Bluetooth'],'Chic economy mini.','MU-MN5','Black','br-001',NOW()),
-- ECONOMY
('c-ec1','toyota-yaris-2023','Toyota','Yaris',2023,'ECONOMY','AVAILABLE',5,4,2,'PETROL','AUTOMATIC',1000,1200,7200,5000,'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800',ARRAY['AC','Bluetooth','USB'],'Most popular economy car.','MU-EC1','White','br-001',NOW()),
('c-ec2','suzuki-swift-2023','Suzuki','Swift',2023,'ECONOMY','AVAILABLE',5,4,2,'PETROL','MANUAL',1200,1100,6600,4500,'https://images.unsplash.com/photo-1597007066704-67bf2068d5b2?w=800',ARRAY['AC','Bluetooth'],'Nimble hatchback.','MU-EC2','Red','br-002',NOW()),
('c-ec3','dacia-sandero-2022','Dacia','Sandero',2022,'ECONOMY','AVAILABLE',5,4,2,'PETROL','MANUAL',900,950,5700,4000,'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',ARRAY['AC','Power Windows'],'Budget-friendly choice.','MU-EC3','Blue','br-001',NOW()),
('c-ec4','hyundai-i20-2023','Hyundai','i20',2023,'ECONOMY','AVAILABLE',5,5,2,'PETROL','AUTOMATIC',1200,1150,6900,4500,'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800',ARRAY['AC','Reverse Camera'],'Spacious hatchback.','MU-EC4','Silver','br-002',NOW()),
('c-ec5','nissan-micra-2022','Nissan','Micra',2022,'ECONOMY','AVAILABLE',5,5,2,'PETROL','AUTOMATIC',1200,1100,6600,4500,'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',ARRAY['AC','Bluetooth'],'Stylish economy car.','MU-EC5','Orange','br-001',NOW()),
-- COMPACT
('c-co1','toyota-corolla-2023','Toyota','Corolla',2023,'COMPACT','AVAILABLE',5,4,3,'HYBRID','AUTOMATIC',1800,1800,10800,6000,'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',ARRAY['AC','CarPlay','Lane Assist'],'Reliable hybrid compact.','MU-CO1','Pearl White','br-001',NOW()),
('c-co2','volkswagen-polo-2022','Volkswagen','Polo',2022,'COMPACT','AVAILABLE',5,4,3,'PETROL','AUTOMATIC',1000,1650,9900,5500,'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',ARRAY['AC','Touchscreen','Cruise Control'],'European compact.','MU-CO2','Grey','br-002',NOW()),
('c-co3','honda-fit-2023','Honda','Fit',2023,'COMPACT','AVAILABLE',5,4,3,'PETROL','AUTOMATIC',1500,1500,9000,5000,'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',ARRAY['AC','Bluetooth','Magic Seat'],'Versatile compact.','MU-CO3','Champagne','br-001',NOW()),
('c-co4','mazda-3-2023','Mazda','3',2023,'COMPACT','AVAILABLE',5,4,3,'PETROL','AUTOMATIC',2000,1700,10200,5500,'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',ARRAY['AC','Heads Up Display'],'Sporty compact.','MU-CO4','Soul Red','br-002',NOW()),
('c-co5','kia-forte-2022','Kia','Forte',2022,'COMPACT','AVAILABLE',5,4,3,'PETROL','AUTOMATIC',2000,1600,9600,5000,'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',ARRAY['AC','CarPlay','Rear Camera'],'Great value compact.','MU-CO5','Black','br-001',NOW()),
-- MIDSIZE
('c-md1','toyota-camry-2023','Toyota','Camry',2023,'MIDSIZE','AVAILABLE',5,4,4,'HYBRID','AUTOMATIC',2500,2800,16800,8000,'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',ARRAY['Leather','CarPlay','Sunroof','Wireless Charging'],'Executive hybrid sedan.','MU-MD1','Black','br-001',NOW()),
('c-md2','mazda-6-2022','Mazda','6',2022,'MIDSIZE','AVAILABLE',5,4,4,'PETROL','AUTOMATIC',2000,2600,15600,7500,'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',ARRAY['Leather','Bose Audio','Sunroof'],'Award-winning midsize.','MU-MD2','Soul Red','br-002',NOW()),
('c-md3','honda-accord-2023','Honda','Accord',2023,'MIDSIZE','AVAILABLE',5,4,4,'HYBRID','AUTOMATIC',2000,2700,16200,8000,'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800',ARRAY['Leather','CarPlay','Honda Sensing'],'Refined hybrid sedan.','MU-MD3','White','br-001',NOW()),
('c-md4','hyundai-sonata-2022','Hyundai','Sonata',2022,'MIDSIZE','AVAILABLE',5,4,4,'PETROL','AUTOMATIC',2500,2500,15000,7000,'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',ARRAY['Panoramic Sunroof','Bose Audio'],'Bold midsize sedan.','MU-MD4','Silver','br-002',NOW()),
('c-md5','nissan-altima-2023','Nissan','Altima',2023,'MIDSIZE','AVAILABLE',5,4,4,'PETROL','AUTOMATIC',2500,2400,14400,7000,'https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=800',ARRAY['AWD','ProPILOT Assist'],'Capable midsize.','MU-MD5','Grey','br-001',NOW()),
-- SUV
('c-sv1','toyota-rav4-2023','Toyota','RAV4',2023,'SUV','AVAILABLE',5,5,5,'HYBRID','AUTOMATIC',2500,3500,21000,10000,'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800',ARRAY['AWD','CarPlay','Panoramic Sunroof','Hybrid'],'Bestselling hybrid SUV.','MU-SV1','Green','br-001',NOW()),
('c-sv2','nissan-qashqai-2022','Nissan','Qashqai',2022,'SUV','AVAILABLE',5,5,4,'PETROL','AUTOMATIC',1300,3000,18000,9000,'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800',ARRAY['ProPilot','Surround Camera','Heated Seats'],'Intelligent SUV.','MU-SV2','Blue','br-002',NOW()),
('c-sv3','mitsubishi-outlander-2023','Mitsubishi','Outlander',2023,'SUV','AVAILABLE',7,5,5,'PETROL','AUTOMATIC',2500,3800,22800,11000,'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',ARRAY['7 Seats','AWD','360 Camera'],'Family 7-seat SUV.','MU-SV3','White','br-001',NOW()),
('c-sv4','ford-everest-2022','Ford','Everest',2022,'SUV','AVAILABLE',7,5,6,'DIESEL','AUTOMATIC',2000,4200,25200,12000,'https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=800',ARRAY['7 Seats','4WD','Terrain Management'],'Off-road capable SUV.','MU-SV4','Grey','br-002',NOW()),
('c-sv5','kia-sportage-2023','Kia','Sportage',2023,'SUV','AVAILABLE',5,5,5,'PETROL','AUTOMATIC',2000,3400,20400,9500,'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800',ARRAY['AWD','Panoramic Display'],'Stylish modern SUV.','MU-SV5','Black','br-001',NOW()),
-- LUXURY
('c-lx1','mercedes-e-class-2023','Mercedes-Benz','E-Class',2023,'LUXURY','AVAILABLE',5,4,4,'PETROL','AUTOMATIC',2000,7500,45000,20000,'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',ARRAY['Burmester Audio','MBUX','Massage Seats','Panoramic Roof'],'First-class luxury.','MU-LX1','Black','br-001',NOW()),
('c-lx2','bmw-5-series-2023','BMW','5 Series',2023,'LUXURY','AVAILABLE',5,4,4,'PETROL','AUTOMATIC',2000,8000,48000,22000,'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',ARRAY['Harman Kardon','HUD','M Sport','Gesture Control'],'Ultimate driving machine.','MU-LX2','White','br-002',NOW()),
('c-lx3','audi-a6-2022','Audi','A6',2022,'LUXURY','AVAILABLE',5,4,4,'DIESEL','AUTOMATIC',3000,7800,46800,21000,'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800',ARRAY['Quattro AWD','Bang Olufsen','Matrix LED'],'German precision luxury.','MU-LX3','Grey','br-001',NOW()),
('c-lx4','range-rover-sport-2023','Land Rover','Range Rover Sport',2023,'LUXURY','AVAILABLE',5,5,5,'PETROL','AUTOMATIC',3000,12000,72000,30000,'https://images.unsplash.com/photo-1617654112368-307921291f42?w=800',ARRAY['Meridian 1430W','Terrain Response 2','Air Suspension'],'Pinnacle luxury SUV.','MU-LX4','Red','br-002',NOW()),
('c-lx5','lexus-es-2023','Lexus','ES',2023,'LUXURY','AVAILABLE',5,4,4,'HYBRID','AUTOMATIC',2500,7200,43200,19000,'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',ARRAY['Mark Levinson Audio','Lexus Safety+'],'Exceptional ride comfort.','MU-LX5','Pearl White','br-001',NOW()),
-- SPORTS
('c-sp1','porsche-718-boxster-2022','Porsche','718 Boxster',2022,'SPORTS','AVAILABLE',2,2,1,'PETROL','AUTOMATIC',2000,15000,90000,40000,'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800',ARRAY['Sport Chrono','BOSE','Convertible','Sport Exhaust'],'Pure driving emotion.','MU-SP1','Blue','br-001',NOW()),
('c-sp2','ford-mustang-2023','Ford','Mustang',2023,'SPORTS','AVAILABLE',4,2,2,'PETROL','AUTOMATIC',5000,12000,72000,35000,'https://images.unsplash.com/photo-1584345604476-8cb5e136084a?w=800',ARRAY['V8 Engine','Active Exhaust','B&O Sound'],'Iconic muscle car.','MU-SP2','Red','br-002',NOW()),
('c-sp3','chevrolet-camaro-2022','Chevrolet','Camaro',2022,'SPORTS','AVAILABLE',4,2,2,'PETROL','AUTOMATIC',6200,11000,66000,33000,'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800',ARRAY['Magnetic Ride','Brembo Brakes','HUD'],'Bold muscle car.','MU-SP3','Yellow','br-001',NOW()),
('c-sp4','bmw-z4-2023','BMW','Z4',2023,'SPORTS','AVAILABLE',2,2,1,'PETROL','AUTOMATIC',3000,14000,84000,38000,'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',ARRAY['M Sport Differential','Adaptive Suspension','Convertible'],'Classic roadster.','MU-SP4','Blue','br-002',NOW()),
('c-sp5','audi-tt-2022','Audi','TT',2022,'SPORTS','AVAILABLE',4,2,2,'PETROL','AUTOMATIC',2000,10000,60000,30000,'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800',ARRAY['Quattro AWD','Virtual Cockpit','S Sport Seats'],'Distinctive sports car.','MU-SP5','White','br-001',NOW()),
-- VAN
('c-vn1','toyota-hiace-2022','Toyota','Hiace',2022,'VAN','AVAILABLE',12,4,8,'DIESEL','MANUAL',2700,4500,27000,13000,'https://images.unsplash.com/photo-1613843439331-2e58a82b2b40?w=800',ARRAY['12 Seats','AC','Roof Rack'],'Group transfer van.','MU-VN1','White','br-001',NOW()),
('c-vn2','mercedes-v-class-2023','Mercedes-Benz','V-Class',2023,'VAN','AVAILABLE',7,5,6,'DIESEL','AUTOMATIC',2000,9000,54000,25000,'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',ARRAY['Leather Captain Seats','Burmester Audio','Power Sliding Doors'],'Luxury people mover.','MU-VN2','Black','br-002',NOW()),
('c-vn3','hyundai-staria-2023','Hyundai','Staria',2023,'VAN','AVAILABLE',9,5,6,'DIESEL','AUTOMATIC',2200,6000,36000,15000,'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800',ARRAY['Panoramic Windows','Power Sliding Doors','Bose Audio'],'Futuristic family van.','MU-VN3','Silver','br-001',NOW()),
('c-vn4','kia-carnival-2023','Kia','Carnival',2023,'VAN','AVAILABLE',8,5,6,'PETROL','AUTOMATIC',3500,6500,39000,16000,'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800',ARRAY['VIP Lounge Seating','Dual Sunroofs','Smart Tailgate'],'Grand Utility Vehicle.','MU-VN4','White','br-002',NOW()),
('c-vn5','vw-multivan-2022','Volkswagen','Multivan',2022,'VAN','AVAILABLE',7,5,5,'HYBRID','AUTOMATIC',1400,7500,45000,18000,'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',ARRAY['Plug-in Hybrid','Multifunction Table','Panoramic Roof'],'Premium hybrid van.','MU-VN5','Red/White','br-001',NOW()),
-- PICKUP
('c-pk1','toyota-hilux-2023','Toyota','Hilux',2023,'PICKUP','AVAILABLE',5,4,4,'DIESEL','AUTOMATIC',2800,4000,24000,12000,'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800',ARRAY['4WD','Diff Lock','Tow Bar'],'Legendary tough pickup.','MU-PK1','White','br-001',NOW()),
('c-pk2','ford-ranger-2023','Ford','Ranger',2023,'PICKUP','AVAILABLE',5,4,4,'DIESEL','AUTOMATIC',2000,4200,25200,12500,'https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=800',ARRAY['4WD','SYNC 4','Side Steps'],'Modern capable pickup.','MU-PK2','Orange','br-002',NOW()),
('c-pk3','nissan-navara-2022','Nissan','Navara',2022,'PICKUP','AVAILABLE',5,4,4,'DIESEL','AUTOMATIC',2300,3800,22800,11000,'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800',ARRAY['4WD','Around View Monitor'],'Comfortable workhorse.','MU-PK3','Grey','br-001',NOW()),
('c-pk4','isuzu-dmax-2023','Isuzu','D-Max',2023,'PICKUP','AVAILABLE',5,4,4,'DIESEL','MANUAL',3000,3600,21600,10000,'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',ARRAY['4WD','Heavy Duty Suspension','CarPlay'],'Heavy duty pickup.','MU-PK4','Silver','br-002',NOW()),
('c-pk5','mitsubishi-triton-2022','Mitsubishi','Triton',2022,'PICKUP','AVAILABLE',5,4,4,'DIESEL','AUTOMATIC',2400,3700,22200,10500,'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',ARRAY['Super Select 4WD','Off-Road Mode','Rear Camera'],'Proven 4WD pickup.','MU-PK5','Red','br-001',NOW()),
-- CONVERTIBLE
('c-cv1','mazda-mx5-2023','Mazda','MX-5 Miata',2023,'CONVERTIBLE','AVAILABLE',2,2,1,'PETROL','MANUAL',2000,5500,33000,15000,'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',ARRAY['Convertible','Brembo Brakes','Recaro Seats'],'Pure open-top joy.','MU-CV1','Orange','br-001',NOW()),
('c-cv2','mini-cooper-conv-2023','MINI','Cooper Convertible',2023,'CONVERTIBLE','AVAILABLE',4,2,1,'PETROL','AUTOMATIC',1500,6000,36000,16000,'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',ARRAY['Convertible','Harman Kardon'],'Fun stylish convertible.','MU-CV2','Aqua','br-002',NOW()),
('c-cv3','bmw-4-conv-2022','BMW','4 Series Convertible',2022,'CONVERTIBLE','AVAILABLE',4,2,2,'PETROL','AUTOMATIC',2000,9500,57000,25000,'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',ARRAY['Neck Warmer','Wind Deflector','Live Cockpit'],'Elegant grand tourer.','MU-CV3','Green','br-001',NOW()),
('c-cv4','audi-a5-conv-2023','Audi','A5 Cabriolet',2023,'CONVERTIBLE','AVAILABLE',4,2,2,'PETROL','AUTOMATIC',2000,9000,54000,24000,'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800',ARRAY['Acoustic Soft Top','Bang Olufsen','Quattro AWD'],'Sophisticated cabriolet.','MU-CV4','Blue','br-002',NOW()),
('c-cv5','mercedes-c-conv-2022','Mercedes-Benz','C-Class Cabriolet',2022,'CONVERTIBLE','AVAILABLE',4,2,2,'PETROL','AUTOMATIC',2000,10000,60000,26000,'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',ARRAY['AIRSCARF','AIRCAP','Burmester Audio'],'Luxurious open-air motoring.','MU-CV5','White','br-001',NOW())
ON CONFLICT DO NOTHING;

-- ===== STEP 4: CAR IMAGES =====
INSERT INTO "CarImage" (id,"carId",url,alt,"isPrimary","order")
SELECT 'img-'||id, id, "thumbnailUrl", make||' '||model, true, 0 FROM "Car"
WHERE id LIKE 'c-%'
ON CONFLICT (id) DO NOTHING;
