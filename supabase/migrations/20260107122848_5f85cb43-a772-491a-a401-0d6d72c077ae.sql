-- Tighten RLS policies flagged as 'always true' for non-SELECT operations

-- 1. REFERRALS: "System can update referrals" - restrict to service role only
-- This is a system-managed table, updates should only come from edge functions
DROP POLICY IF EXISTS "System can update referrals" ON referrals;
CREATE POLICY "Service role can update referrals" 
ON referrals 
FOR UPDATE 
TO service_role
USING (true);

-- 2. USER_IMPACT: "System can update user impact" - restrict to service role only  
-- This is a system-calculated table, should only be updated by edge functions
DROP POLICY IF EXISTS "System can update user impact" ON user_impact;
CREATE POLICY "Service role can manage user impact" 
ON user_impact 
FOR ALL 
TO service_role
USING (true);

-- 3. NEWSLETTER_SUBSCRIBERS: "Anyone can subscribe" - add email validation
-- Require valid email format and prevent duplicate subscriptions
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter" 
ON newsletter_subscribers 
FOR INSERT 
WITH CHECK (
  email IS NOT NULL 
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND NOT EXISTS (
    SELECT 1 FROM newsletter_subscribers ns 
    WHERE ns.email = newsletter_subscribers.email
  )
);