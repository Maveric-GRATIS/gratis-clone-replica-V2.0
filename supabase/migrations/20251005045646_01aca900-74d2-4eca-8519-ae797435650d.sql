-- Enable RLS on the public_reviews view
-- This ensures the view is protected even though it's read-only
ALTER VIEW public.public_reviews SET (security_invoker = true);

-- Note: Views don't support RLS policies directly, but security_invoker
-- ensures the view uses the permissions of the querying user rather than the view creator