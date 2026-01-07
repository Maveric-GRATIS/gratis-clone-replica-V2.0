-- Document the security model for public_reviews view
-- Views cannot have RLS policies directly - they inherit security from underlying tables
-- The public_reviews view is secured as follows:
-- 1. It's a READ-ONLY view (no INSERT/UPDATE/DELETE possible)
-- 2. It excludes user_id column to protect customer privacy
-- 3. It inherits RLS from product_reviews table which has proper policies
-- 4. Access is granted via GRANT SELECT to anon and authenticated roles

COMMENT ON VIEW public.public_reviews IS 
'Anonymized view of product reviews that excludes user_id for privacy. 
Read-only access is controlled by grants (SELECT only). 
Security is inherited from underlying product_reviews table RLS policies.';