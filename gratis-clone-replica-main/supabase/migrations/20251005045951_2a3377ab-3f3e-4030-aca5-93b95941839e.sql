-- Add policy to allow anonymous users to view reviews
-- This enables the public_reviews view to work for unauthenticated users
-- while still protecting user_id through the view's anonymization
CREATE POLICY "Anonymous users can view reviews"
ON public.product_reviews
FOR SELECT
TO anon
USING (true);