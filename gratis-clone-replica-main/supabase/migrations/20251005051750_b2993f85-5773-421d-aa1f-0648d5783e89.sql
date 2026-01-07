-- Ensure proper access grants for public_reviews view
-- Views are read-only by design, but we need explicit SELECT grants

-- First revoke any existing grants to start clean
REVOKE ALL ON public.public_reviews FROM anon;
REVOKE ALL ON public.public_reviews FROM authenticated;

-- Grant SELECT only to anon and authenticated roles
-- This is safe because the view excludes user_id for privacy
GRANT SELECT ON public.public_reviews TO anon;
GRANT SELECT ON public.public_reviews TO authenticated;

-- Add a database comment documenting the security model
COMMENT ON VIEW public.public_reviews IS 
'Security: This view is read-only and excludes user_id to protect customer privacy. 
Access is explicitly granted via SELECT permissions only.
Views cannot have RLS policies - they inherit security from underlying product_reviews table.
The underlying product_reviews table has full RLS protection with proper policies.';