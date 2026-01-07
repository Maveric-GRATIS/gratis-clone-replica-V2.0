-- Fix 1: Block public SELECT access to advertising_inquiries
-- Only admins via service role can view inquiries
CREATE POLICY "Only admins can view advertising inquiries"
ON advertising_inquiries
FOR SELECT
USING (false);

-- Fix 2: Block all user UPDATE operations on orders
-- Order updates should only happen server-side via edge functions
CREATE POLICY "Users cannot update orders"
ON orders
FOR UPDATE
USING (false)
WITH CHECK (false);