-- Drop the overly permissive public SELECT policy on profiles table
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a new policy that only allows users to view their own profile
-- This protects sensitive data like email addresses from being scraped
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Note: The existing INSERT and UPDATE policies already correctly restrict 
-- users to only modify their own profiles, so no changes needed there