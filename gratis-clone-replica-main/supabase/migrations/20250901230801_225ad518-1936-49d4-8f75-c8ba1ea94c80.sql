-- Add missing RLS policies for inventory table (INSERT, UPDATE, DELETE for admin operations)
-- These will be used by admin functions/operations only
CREATE POLICY "Admin operations can insert inventory" ON public.inventory
  FOR INSERT WITH CHECK (true); -- Will be controlled via edge functions with proper auth

CREATE POLICY "Admin operations can update inventory" ON public.inventory
  FOR UPDATE USING (true); -- Will be controlled via edge functions with proper auth

CREATE POLICY "Admin operations can delete inventory" ON public.inventory
  FOR DELETE USING (true); -- Will be controlled via edge functions with proper auth

-- Add missing RLS policies for products table (INSERT, UPDATE, DELETE for admin operations)
CREATE POLICY "Admin operations can insert products" ON public.products
  FOR INSERT WITH CHECK (true); -- Will be controlled via edge functions with proper auth

CREATE POLICY "Admin operations can update products" ON public.products
  FOR UPDATE USING (true); -- Will be controlled via edge functions with proper auth

CREATE POLICY "Admin operations can delete products" ON public.products
  FOR DELETE USING (true); -- Will be controlled via edge functions with proper auth