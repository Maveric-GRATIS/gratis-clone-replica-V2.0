-- Fix the RLS policy gap by adding a policy for the GRATIS data table
CREATE POLICY "Allow public read access to GRATIS data" 
ON "GRATIS data" 
FOR SELECT 
USING (true);

-- Note: Auth OTP expiry is a platform setting that needs to be configured in Supabase dashboard
-- This warning can be addressed by going to Authentication > Settings in the Supabase dashboard