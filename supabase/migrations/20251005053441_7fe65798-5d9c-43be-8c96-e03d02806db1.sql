-- Fix: Restrict product_reviews SELECT to only allow users to see their own reviews
-- This prevents linking user_id to reviews for privacy protection
-- Public display uses the public_reviews view which excludes user_id

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view all reviews" ON public.product_reviews;

-- Create restrictive policy: users can only view their own reviews
CREATE POLICY "Users can view their own reviews"
ON public.product_reviews
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Add comment explaining the security model
COMMENT ON TABLE public.product_reviews IS 'Contains full review data including user_id. RLS restricts viewing to review owners only. Public display uses public_reviews view which excludes user_id for privacy.';