-- Fix security definer view issue
-- The view should not use SECURITY DEFINER since it's meant for public access
-- and relies on RLS policies on the underlying table

DROP VIEW IF EXISTS public.public_reviews;

CREATE VIEW public.public_reviews AS
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

-- Grant SELECT permission on the view
GRANT SELECT ON public.public_reviews TO anon, authenticated;