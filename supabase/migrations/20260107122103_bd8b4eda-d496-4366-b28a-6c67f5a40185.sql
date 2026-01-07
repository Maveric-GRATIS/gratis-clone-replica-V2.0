-- Fix PUBLIC_DATA_EXPOSURE: Newsletter subscriber emails exposed
-- Drop the permissive policy that allows any authenticated user to view emails
DROP POLICY IF EXISTS "Public can view active subscribers count" ON newsletter_subscribers;