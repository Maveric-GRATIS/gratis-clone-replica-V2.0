-- Phase 1: Database Schema Updates for F.U., Distribution Map, and Secret Cap Prizes

-- 1.1 Update products table with new columns
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS subcategory TEXT,
ADD COLUMN IF NOT EXISTS series_number INTEGER,
ADD COLUMN IF NOT EXISTS collaboration_brand TEXT,
ADD COLUMN IF NOT EXISTS pre_order BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS release_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS edition_size INTEGER,
ADD COLUMN IF NOT EXISTS material_specs TEXT,
ADD COLUMN IF NOT EXISTS care_instructions TEXT,
ADD COLUMN IF NOT EXISTS sizes_available TEXT[],
ADD COLUMN IF NOT EXISTS colors_available TEXT[];

-- Add index for tier filtering
CREATE INDEX IF NOT EXISTS idx_products_tier ON products(tier);
CREATE INDEX IF NOT EXISTS idx_products_pre_order ON products(pre_order) WHERE pre_order = true;

-- 1.2 Create distribution_locations table
CREATE TABLE IF NOT EXISTS distribution_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  location_type TEXT DEFAULT 'train_station',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  distribution_hours TEXT,
  active BOOLEAN DEFAULT true,
  total_distributed INTEGER DEFAULT 0,
  last_distribution_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE distribution_locations ENABLE ROW LEVEL SECURITY;

-- RLS policies for distribution_locations
CREATE POLICY "Distribution locations are viewable by everyone"
  ON distribution_locations FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage distribution locations"
  ON distribution_locations FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 1.3 Create distribution_events table
CREATE TABLE IF NOT EXISTS distribution_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES distribution_locations(id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  units_distributed INTEGER DEFAULT 0,
  volunteer_count INTEGER DEFAULT 0,
  weather TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE distribution_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for distribution_events
CREATE POLICY "Distribution events are viewable by everyone"
  ON distribution_events FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage distribution events"
  ON distribution_events FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 1.4 Create secret_cap_prizes table
CREATE TABLE IF NOT EXISTS secret_cap_prizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  prize_type TEXT NOT NULL,
  prize_title TEXT NOT NULL,
  prize_description TEXT NOT NULL,
  prize_value TEXT,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  claimed BOOLEAN DEFAULT false,
  claimed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  claimed_at TIMESTAMP WITH TIME ZONE,
  expiry_date DATE,
  terms_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE secret_cap_prizes ENABLE ROW LEVEL SECURITY;

-- RLS policies for secret_cap_prizes
CREATE POLICY "Users can check if their code is valid"
  ON secret_cap_prizes FOR SELECT
  USING (true);

CREATE POLICY "Users can claim prizes"
  ON secret_cap_prizes FOR UPDATE
  USING (NOT claimed AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage prizes"
  ON secret_cap_prizes FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 1.5 Create prize_claims table
CREATE TABLE IF NOT EXISTS prize_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prize_id UUID REFERENCES secret_cap_prizes(id) ON DELETE CASCADE NOT NULL,
  code_entered TEXT NOT NULL,
  claim_status TEXT DEFAULT 'pending',
  fulfillment_notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE prize_claims ENABLE ROW LEVEL SECURITY;

-- RLS policies for prize_claims
CREATE POLICY "Users can view their own claims"
  ON prize_claims FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create claims"
  ON prize_claims FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all claims"
  ON prize_claims FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_distribution_locations_active ON distribution_locations(active);
CREATE INDEX IF NOT EXISTS idx_distribution_locations_country ON distribution_locations(country);
CREATE INDEX IF NOT EXISTS idx_distribution_events_location ON distribution_events(location_id);
CREATE INDEX IF NOT EXISTS idx_distribution_events_date ON distribution_events(event_date);
CREATE INDEX IF NOT EXISTS idx_secret_cap_prizes_code ON secret_cap_prizes(code);
CREATE INDEX IF NOT EXISTS idx_secret_cap_prizes_claimed ON secret_cap_prizes(claimed);
CREATE INDEX IF NOT EXISTS idx_prize_claims_user ON prize_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_prize_claims_status ON prize_claims(claim_status);

-- Add trigger for updated_at on distribution_locations
CREATE TRIGGER update_distribution_locations_updated_at
  BEFORE UPDATE ON distribution_locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();