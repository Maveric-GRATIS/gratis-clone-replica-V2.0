-- Fix 1: Make orders.user_id NOT NULL to prevent access control gaps
-- First, ensure all existing orders have a user_id (if any don't, this will need manual cleanup)
ALTER TABLE public.orders ALTER COLUMN user_id SET NOT NULL;

-- Fix 2: Restrict profile access to owner and admins only
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

-- Fix 3: Allow anonymous users to view products (e-commerce best practice)
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;

CREATE POLICY "Products are viewable by everyone" 
  ON public.products 
  FOR SELECT 
  USING (true);

-- Fix 4: Allow anonymous viewing of videos, campaigns, and events for public content
DROP POLICY IF EXISTS "Videos are viewable by everyone" ON public.videos;

CREATE POLICY "Published videos are viewable by everyone" 
  ON public.videos 
  FOR SELECT 
  USING ((published = true) OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'marketing'));

DROP POLICY IF EXISTS "Published events are viewable by everyone" ON public.events;

CREATE POLICY "Published events are viewable by everyone" 
  ON public.events 
  FOR SELECT 
  USING ((published = true) OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'marketing'));

DROP POLICY IF EXISTS "Active campaigns are viewable by everyone" ON public.campaigns;

CREATE POLICY "Active campaigns are viewable by everyone" 
  ON public.campaigns 
  FOR SELECT 
  USING ((active = true) OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'marketing'));

-- Fix 5: Ensure products table has reserved_quantity column for stock management
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'reserved_quantity'
  ) THEN
    ALTER TABLE public.products ADD COLUMN reserved_quantity INTEGER DEFAULT 0;
  END IF;
END $$;