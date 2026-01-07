-- Fix profiles table RLS policies
-- Remove the restrictive policy that blocks all access with USING (false)
-- This policy was AND'd with other restrictive policies, blocking all access
DROP POLICY IF EXISTS "Anonymous users cannot view profiles" ON public.profiles;

-- The remaining SELECT policy "Users can view their own profile" with USING (auth.uid() = user_id)
-- now works correctly to allow users to view only their own profile data
-- This protects email addresses from being accessed by other authenticated users