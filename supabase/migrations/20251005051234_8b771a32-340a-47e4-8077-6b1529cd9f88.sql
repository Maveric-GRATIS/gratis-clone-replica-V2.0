-- Remove anonymous access to product_reviews table to prevent user_id exposure
-- Anonymous users should access reviews through the public_reviews view which excludes user_id
DROP POLICY IF EXISTS "Anonymous users can view reviews" ON public.product_reviews;

-- Grant SELECT on the public_reviews view to anonymous users
-- This view already excludes user_id for privacy protection
GRANT SELECT ON public.public_reviews TO anon;
GRANT SELECT ON public.public_reviews TO authenticated;

-- Authenticated users can still see full reviews including user_id via the 
-- "Authenticated users can view all reviews" policy on product_reviews table
-- This is needed so users can manage their own reviews