-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  street_style TEXT,
  favorite_products TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create products table with full e-commerce features
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT NOT NULL,
  subcategory TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Inventory
  sku TEXT UNIQUE,
  stock_quantity INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  
  -- Variants
  available_sizes TEXT[] DEFAULT '{}',
  available_colors TEXT[] DEFAULT '{}',
  available_materials TEXT[] DEFAULT '{}',
  
  -- Media
  images TEXT[] DEFAULT '{}',
  image_url TEXT,
  
  -- Shipping
  weight DECIMAL(10,2),
  dimensions JSONB,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  free_shipping_threshold DECIMAL(10,2),
  
  -- Product relationships
  related_products UUID[] DEFAULT '{}',
  bundle_products UUID[] DEFAULT '{}',
  
  -- Metadata
  badge TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  meta_description TEXT,
  
  -- Additional details
  specifications JSONB,
  care_instructions TEXT,
  size_guide TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT USING (true);

CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_featured ON public.products(featured);

-- Create product variants table
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  
  -- Variant attributes
  size TEXT,
  color TEXT,
  material TEXT,
  
  -- Variant specifics
  variant_sku TEXT UNIQUE,
  price_adjustment DECIMAL(10,2) DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  images TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(product_id, size, color, material)
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product variants are viewable by everyone" 
ON public.product_variants FOR SELECT USING (true);

CREATE INDEX idx_variants_product ON public.product_variants(product_id);

-- Create product reviews table
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title TEXT,
  review_text TEXT,
  
  verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  
  variant_size TEXT,
  variant_color TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone" 
ON public.product_reviews FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" 
ON public.product_reviews FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
ON public.product_reviews FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON public.product_reviews FOR DELETE 
USING (auth.uid() = user_id);

CREATE INDEX idx_reviews_product ON public.product_reviews(product_id);
CREATE INDEX idx_reviews_user ON public.product_reviews(user_id);

-- Create shipping options table
CREATE TABLE IF NOT EXISTS public.shipping_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  estimated_days_min INTEGER,
  estimated_days_max INTEGER,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.shipping_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shipping options are viewable by everyone" 
ON public.shipping_options FOR SELECT USING (true);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default shipping options
INSERT INTO public.shipping_options (name, description, price, estimated_days_min, estimated_days_max, sort_order) VALUES
  ('Standard Shipping', 'Delivery in 5-7 business days', 5.99, 5, 7, 1),
  ('Express Shipping', 'Delivery in 2-3 business days', 12.99, 2, 3, 2),
  ('Next Day', 'Delivery next business day', 24.99, 1, 1, 3),
  ('Free Shipping', 'Free delivery in 7-10 business days (orders over $50)', 0.00, 7, 10, 0);