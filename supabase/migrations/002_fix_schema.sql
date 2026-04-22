-- Fix: create sequence before bookings table references it
-- This migration is idempotent for fresh installs

-- Drop and recreate booking_number default if sequence didn't exist
-- (handles case where 001 failed partway)
DO $$
BEGIN
  -- Ensure sequence exists
  IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'booking_seq') THEN
    CREATE SEQUENCE booking_seq START WITH 2054;
  END IF;
END $$;

-- Add referrals table (new)
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_name text NOT NULL,
  referred_email text,
  referred_phone text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'booked', 'credited')),
  credit_amount int DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own referrals" ON referrals FOR ALL USING (auth.uid() = referrer_id);
CREATE POLICY "Admins manage all referrals" ON referrals FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);

-- Add services table for admin-editable service catalog
CREATE TABLE IF NOT EXISTS services (
  id text PRIMARY KEY,
  name text NOT NULL,
  tier text NOT NULL,
  description text,
  price_from int NOT NULL,
  duration_minutes int NOT NULL,
  features text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Anyone can read active services (public catalog)
CREATE POLICY "Anyone reads active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage services" ON services FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed default services
INSERT INTO services (id, name, tier, description, price_from, duration_minutes, features, sort_order) VALUES
  ('express', 'Express Shine', 'TIER 1', 'Quick exterior wash plus interior wipe-down. Perfect for maintenance between full details.', 59, 45, ARRAY['Hand wash and dry', 'Wheel and tire clean', 'Window cleaning', 'Interior vacuum', 'Dashboard wipe'], 1),
  ('signature', 'Signature Detail', 'TIER 2', 'Our most popular full detail. Deep clean inside and out with clay bar and sealant.', 159, 150, ARRAY['Everything in Express', 'Clay bar treatment', 'Machine polish', 'Paint sealant', 'Leather conditioning', 'Engine bay clean'], 2),
  ('premier', 'Premier Ceramic', 'TIER 3', 'The ultimate protection. Full paint correction followed by professional ceramic coating with 3-year warranty.', 489, 480, ARRAY['Everything in Signature', 'Multi-stage paint correction', 'Gtechniq Crystal Serum Light', '3-year ceramic warranty', 'Bi-annual maintenance wash', 'Paint depth readings documented'], 3)
ON CONFLICT (id) DO NOTHING;

-- Add AI follow-up tracking
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS ai_followup_sent_at timestamptz;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS ai_followup_text text;
