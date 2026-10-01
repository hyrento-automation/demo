-- =========================================================
-- Hyrento Companies Schema
-- Run this script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Run
-- =========================================================

CREATE TABLE IF NOT EXISTS public.companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  website TEXT,
  currency TEXT DEFAULT 'MUR',
  booking_ref_prefix TEXT DEFAULT 'HYR',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on slug for rapid lookup
CREATE INDEX IF NOT EXISTS idx_companies_slug ON public.companies (slug);

-- Enable Row Level Security (RLS)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Allow public read access so any visitor can load company info
DROP POLICY IF EXISTS "Allow public read access on companies" ON public.companies;
CREATE POLICY "Allow public read access on companies"
  ON public.companies FOR SELECT
  USING (true);

-- Allow service role full write access
DROP POLICY IF EXISTS "Allow service role full access on companies" ON public.companies;
CREATE POLICY "Allow service role full access on companies"
  ON public.companies FOR ALL
  USING (true);

-- Pre-seed initial companies from CSV
INSERT INTO public.companies (id, name, slug, phone, whatsapp, email, address, city, country, website, currency, booking_ref_prefix)
VALUES
  ('comp_irf', 'IRF Car Rental LTD', 'irfcarrentalltd', '+23054295210', '+23054295210', 'info@irfcarrentalltd.com', 'Grand Bel Air, Mauritius', 'Grand Bel Air', 'Mauritius', 'https://www.irfcarrentalltd.com/', 'MUR', 'IRF'),
  ('comp_titan', 'TITAN CAR RENTALS GOA', 'titancarrentalsgoa', '+917030525563', '+917030525563', 'contact@titancarrentalsgoa.com', 'Davorlim, Margao, Goa', 'Margao, Goa', 'India', '', 'INR', 'TIT'),
  ('comp_urban', 'Urban Ride Car Rental Co.', 'urbanridecarrentalco', '+971501261521', '+971501261521', 'info@urbanride.ae', 'BUSINESS BAY, TAMANI ARTS BUILDING OFFICE NO. 540', 'Dubai', 'United Arab Emirates', '', 'AED', 'URB'),
  ('comp_splash', 'Splash Car Holiday', 'splashcarholiday', '+23057727994', '+23057727994', 'contact@splashcarholiday.com', 'Plaine Magnien, Mauritius', 'Plaine Magnien', 'Mauritius', 'http://www.splashcarholiday.com/', 'MUR', 'SPL'),
  ('comp_panda', 'Rental Panda', 'rentalpanda', '+34641161607', '+34641161607', 'hola@rentalpanda.es', 'Palma de Mallorca, Spain', 'Palma', 'Spain', 'http://www.rentalpanda.es/', 'EUR', 'PAN'),
  ('comp_mallorca_hire', 'Mallorca Car Hire Company', 'mallorcacarhirecompany', '+34627294626', '+34627294626', 'info@mallorcacarhirecompany.com', 'Palma, Spain', 'Palma', 'Spain', 'https://www.mallorcacarhirecompany.com/', 'EUR', 'MCH'),
  ('comp_badsha', 'Badsha car rental Goa', 'badshacarrentalgoa', '+918600129608', '+918600129608', 'info@badshacarrental.com', 'Panaji, Goa', 'Panaji', 'India', 'https://badsha-car-rental.grexa.site/', 'INR', 'BAD'),
  ('comp_selfdrive_goa', 'Self Drive Car Rental Goa', 'selfdrivecarrentalgoa', '+919175887187', '+919175887187', 'info@selfdrivecarrentalgoa.com', 'Salcete, Davorlim, Goa', 'Salcete', 'India', 'https://selfdrivecarrentalgoa.com/', 'INR', 'SDG'),
  ('comp_mallorca_excursions', 'Mallorca Rental & Excursions', 'mallorcarentalexcursions', '+34613600572', '+34613600572', 'info@mallorcarentalexcursions.com', 'Palma, Spain', 'Palma', 'Spain', 'https://mallorcarentalexcursions.com/', 'EUR', 'MRE'),
  ('comp_greenrent', 'Greenrent.ch', 'greenrentch', '+41788605820', '+41788605820', 'info@greenrent.ch', 'Grand-Saconnex, Switzerland', 'Grand-Saconnex', 'Switzerland', 'http://greenrent.ch/', 'CHF', 'GRE'),
  ('comp_cars4you', '(Cars4you)Margao Self Drive Car Rental', 'margaoselfdrivecarrental', '+919682933407', '+919682933407', 'info@car4yougoa.in', 'Margao, Goa', 'Margao', 'India', 'https://car4yougoa.in/', 'INR', 'C4Y'),
  ('comp_deluxe', 'Deluxe Car Rental Goa', 'deluxecarrentalgoa', '+919922657357', '+919922657357', 'info@deluxecarrentalgoa.com', 'Margao, Goa', 'Margao', 'India', 'https://www.deluxecarrentalgoa.com/', 'INR', 'DLX'),
  ('comp_selfdrive_in_goa', 'Self Drive Car Rental in Goa', 'selfdrivecarrentalingoa', '+919104912661', '+919104912661', 'info@goaselfdrivecars.in', 'Sancoale, Dabolim, Goa', 'Dabolim', 'India', 'https://goaselfdrivecars.in/', 'INR', 'SDR'),
  ('comp_bon_plan', 'Bon Plan Voyage Car Rental', 'bonplanvoyagecarrental', '+23057608332', '+23057608332', 'info@sunrisedestination.com', 'Flic en Flac, Mauritius', 'Flic en Flac', 'Mauritius', 'http://www.sunrisedestination.com/', 'MUR', 'BPV'),
  ('comp_nads', 'Nad''s Car Rental', 'nadscarrental', '+23052538355', '+23052538355', 'info@carhiremru.com', 'Triolet, Mauritius', 'Triolet', 'Mauritius', 'https://carhiremru.com/', 'MUR', 'NAD'),
  ('comp_pleasure_drive', 'Pleasure Drive Ltd -Car rental/ Location Voiture Mauritius', 'pleasuredriveltd', '+23052553669', '+23052553669', 'contact@pleasuredriveltd.com', 'Forbach road Mapou MU', 'Mapou', 'Mauritius', 'http://www.pleasuredriveltd.com/', 'MUR', 'PDL'),
  ('comp_ambrose', 'Ambrose Car Rental', 'ambrosecarrental', '+23052520195', '+23052520195', 'info@getgoingmauritius.com', 'Grand Baie, Mauritius', 'Grand Baie', 'Mauritius', 'https://www.getgoingmauritius.com/', 'MUR', 'AMB'),
  ('comp_cheapest', 'Cheapest car rental', 'cheapestcarrental', '+23059255425', '+23059255425', 'info@rentalmauritius.live', 'Port Louis, Mauritius', 'Port Louis', 'Mauritius', 'https://rentalmauritius.live/', 'MUR', 'CCR'),
  ('comp_sunset_drive', 'Sunset Drive ( Mauritius) Car Rental (Flic en Flac)', 'sunsetdrivecarrental', '+23055008028', '+23055008028', 'sunsetdrive@hyrento.com', 'Flic en Flac, Mauritius', 'Flic en Flac', 'Mauritius', '', 'MUR', 'SSD'),
  ('comp_le_morne', 'Le Morne Travel Ltd Car Rental Company', 'lemornetravelltd', '+23058014692', '+23058014692', 'lemornetravel@hyrento.com', 'Le Morne, Mauritius', 'Le Morne', 'Mauritius', 'https://lemornetravel.wordpress.com/', 'MUR', 'LMT'),
  ('comp_victoria', 'Victoria Car Rental', 'victoriacarrental', '+23059206432', '+23059206432', 'victoriacarrental@hyrento.com', 'Pointe aux Piments, Mauritius', 'Pointe aux Piments', 'Mauritius', 'https://wa.me/c/23059206432', 'MUR', 'VIC'),
  ('comp_kls', 'KLS Car Rental', 'klscarrental', '+23055007555', '+23055007555', 'info@klscarrental.com', 'Lalmatie, Mauritius', 'Lalmatie', 'Mauritius', 'https://www.klscarrental.com/', 'MUR', 'KLS'),
  ('comp_albion', 'Albion Car Rental Mauritius', 'albioncarrental', '+23057595808', '+23057595808', 'albion@hyrento.com', 'Albion, Mauritius', 'Albion', 'Mauritius', '', 'MUR', 'ALB'),
  ('comp_mauhire', 'MAUHIRE Mauritius Car Rental', 'mauhirecarrental', '+23057688168', '+23057688168', 'info@mauhire.com', 'Plaine Magnien, Mauritius', 'Plaine Magnien', 'Mauritius', 'http://mauhire.com/', 'MUR', 'MAU'),
  ('comp_yahweh', 'YAHWEH CAR RENTAL', 'yahwehcarrental', '+23057648053', '+23057648053', 'info@yahwehcars.com', 'Chemin Le Flamant Muguet Road MU', 'Chemin Le Flamant', 'Mauritius', 'http://yahwehcars.com/', 'MUR', 'YAH'),
  ('comp_yoyo', 'Yoyo Car Rental', 'yoyocarrental', '+230123456', '+230123456', 'hello@yoyo.com', 'Royal Road, Grand Baie, Mauritius', 'Grand Baie', 'Mauritius', 'https://yoyocarrental.hyrento.com', 'MUR', 'YOY')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  whatsapp = EXCLUDED.whatsapp,
  email = EXCLUDED.email,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  country = EXCLUDED.country,
  website = EXCLUDED.website,
  updated_at = NOW();
