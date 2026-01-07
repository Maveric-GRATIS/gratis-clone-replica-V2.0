-- Create advertising inquiries table for partnership applications
CREATE TABLE IF NOT EXISTS advertising_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  industry TEXT,
  estimated_volume TEXT,
  campaign_goals TEXT,
  preferred_start_date DATE,
  additional_notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE advertising_inquiries ENABLE ROW LEVEL SECURITY;

-- Public can insert (submit inquiries)
CREATE POLICY "Anyone can submit advertising inquiries"
ON advertising_inquiries
FOR INSERT
WITH CHECK (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_advertising_inquiries_status ON advertising_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_advertising_inquiries_created ON advertising_inquiries(created_at DESC);

-- Add update trigger
CREATE TRIGGER update_advertising_inquiries_updated_at
BEFORE UPDATE ON advertising_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();