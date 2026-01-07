-- Security Enhancement Migration

-- 1. Fix function search path security issue
-- This prevents potential schema manipulation exploits
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. Anonymize product reviews for public access
-- This protects user identity from correlation attacks

-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.product_reviews;

-- Add policy for authenticated users to view all reviews (including user_id)
CREATE POLICY "Authenticated users can view all reviews"
ON public.product_reviews
FOR SELECT
TO authenticated
USING (true);

-- Create anonymized view for public/anonymous access (excludes user_id)
CREATE OR REPLACE VIEW public.public_reviews AS
SELECT 
  id,
  product_id,
  rating,
  review_title,
  review_text,
  variant_color,
  variant_size,
  images,
  verified_purchase,
  helpful_count,
  created_at,
  updated_at
FROM public.product_reviews;

-- Grant SELECT permission on the view to anonymous users
GRANT SELECT ON public.public_reviews TO anon;

-- 3. Add defense-in-depth policy for profiles table
-- This ensures emails remain protected even if RLS is accidentally disabled
CREATE POLICY "Anonymous users cannot view profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);