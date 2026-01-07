-- Insert GRATIS merchandise products into the products table
INSERT INTO public.products (
  id,
  name,
  slug,
  description,
  short_description,
  category,
  price,
  original_price,
  images,
  image_url,
  badge,
  rating,
  review_count,
  in_stock,
  stock_quantity,
  available_sizes,
  available_colors,
  sku,
  featured
) VALUES
-- Product 1: GRATIS Neon Tank
(
  gen_random_uuid(),
  'GRATIS Neon Tank',
  'gratis-neon-tank-1',
  'Bold neon streetwear with vibrant GRATIS branding. This electric yellow tank is designed for those who dare to stand out. Premium fabric blend offers maximum comfort while maintaining that crisp, bold look.',
  'Bold neon streetwear with vibrant GRATIS branding.',
  'merch',
  45.00,
  55.00,
  ARRAY['/lovable-uploads/62f5c8a0-3d3d-468c-bbac-754523d00d9f.png'],
  '/lovable-uploads/62f5c8a0-3d3d-468c-bbac-754523d00d9f.png',
  'BESTSELLER',
  4.9,
  1842,
  true,
  250,
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Electric Yellow'],
  'GRATIS-TANK-NY-001',
  true
),
-- Product 2: GRATIS Geometric Swimsuit
(
  gen_random_uuid(),
  'GRATIS Geometric Swimsuit',
  'gratis-geometric-suit-1',
  'Stunning geometric patterns with vibrant color blocking. Made from premium quick-dry fabric with UV protection. Perfect for making a statement at the beach or pool.',
  'Stunning geometric patterns with vibrant color blocking.',
  'merch',
  85.00,
  120.00,
  ARRAY['/lovable-uploads/0496b1d0-a122-41f7-8391-2e759e99a770.png'],
  '/lovable-uploads/0496b1d0-a122-41f7-8391-2e759e99a770.png',
  'NEW DROP',
  4.8,
  967,
  true,
  180,
  ARRAY['XS', 'S', 'M', 'L'],
  ARRAY['Multi-Pattern'],
  'GRATIS-SWIM-GEO-001',
  true
),
-- Product 3: GRATIS Multi-Color Bucket Hat
(
  gen_random_uuid(),
  'GRATIS Multi-Color Bucket Hat',
  'gratis-bucket-hat-1',
  'Iconic bucket hat with bold color-blocked design. Crafted from durable cotton with a reinforced brim. The geometric multi-color pattern is perfect for completing any streetwear outfit.',
  'Iconic bucket hat with bold color-blocked design.',
  'merch',
  35.00,
  NULL,
  ARRAY['/lovable-uploads/9ac6ca6a-c33b-407e-ae9d-d71edd6d1a95.png'],
  '/lovable-uploads/9ac6ca6a-c33b-407e-ae9d-d71edd6d1a95.png',
  'LIMITED',
  4.7,
  1234,
  true,
  95,
  ARRAY['Adjustable'],
  ARRAY['Geometric Multi'],
  'GRATIS-HAT-BUCKET-001',
  true
),
-- Product 4: GRATIS Color Block Tracksuit
(
  gen_random_uuid(),
  'GRATIS Color Block Tracksuit',
  'gratis-tracksuit-1',
  'Premium streetwear tracksuit with vibrant geometric patterns. Featuring a full-zip hoodie and matching joggers. Amsterdam-inspired design with breathable fabric for all-day comfort.',
  'Premium streetwear tracksuit with vibrant geometric patterns.',
  'merch',
  150.00,
  200.00,
  ARRAY['/lovable-uploads/48ce1e2e-0cbc-49f2-b2d0-0a2d372b640d.png'],
  '/lovable-uploads/48ce1e2e-0cbc-49f2-b2d0-0a2d372b640d.png',
  'SALE',
  4.9,
  756,
  true,
  120,
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Amsterdam Multi'],
  'GRATIS-TRACK-CB-001',
  true
),
-- Product 5: GRATIS Water Tetrapack
(
  gen_random_uuid(),
  'GRATIS Water Tetrapack',
  'gratis-tetrapack-1',
  'Limited edition colorful tetrapack water bottle. Eco-friendly and 100% recyclable packaging. Collectible edition featuring vibrant GRATIS branding. Perfect for sustainable hydration.',
  'Limited edition colorful tetrapack water bottle.',
  'merch',
  12.00,
  NULL,
  ARRAY['/lovable-uploads/04b91434-502b-42c5-842d-c4e359e816c9.png'],
  '/lovable-uploads/04b91434-502b-42c5-842d-c4e359e816c9.png',
  'ECO',
  4.8,
  2156,
  true,
  500,
  ARRAY['600ml'],
  ARRAY['Multi-Color'],
  'GRATIS-WATER-TETRA-001',
  true
),
-- Product 6: GRATIS Crew Hoodie Set
(
  gen_random_uuid(),
  'GRATIS Crew Hoodie Set',
  'gratis-crew-hoodie-1',
  'Complete crew collection with bold geometric designs. Includes matching hoodie and joggers in premium cotton blend. Multi-color pack perfect for street style enthusiasts.',
  'Complete crew collection with bold geometric designs.',
  'merch',
  120.00,
  160.00,
  ARRAY['/lovable-uploads/82428317-889f-4b40-9f0d-e35a6a8bb7b6.png'],
  '/lovable-uploads/82428317-889f-4b40-9f0d-e35a6a8bb7b6.png',
  'CREW PACK',
  4.9,
  892,
  true,
  145,
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Multi-Color Pack'],
  'GRATIS-CREW-HOOD-001',
  true
),
-- Product 7: GRATIS Color Block Crew
(
  gen_random_uuid(),
  'GRATIS Color Block Crew',
  'gratis-colorblock-crew-1',
  'Retro-inspired color block sweatshirt collection. Features bold neon blocking with vintage GRATIS branding. Oversized fit for that authentic 90s streetwear vibe.',
  'Retro-inspired color block sweatshirt collection.',
  'merch',
  95.00,
  NULL,
  ARRAY['/lovable-uploads/26d32706-4163-476d-b0c4-932c669daf09.png'],
  '/lovable-uploads/26d32706-4163-476d-b0c4-932c669daf09.png',
  'RETRO',
  4.6,
  1445,
  true,
  200,
  ARRAY['XS', 'S', 'M', 'L', 'XL'],
  ARRAY['Neon Block'],
  'GRATIS-CREW-CB-001',
  false
),
-- Product 8: GRATIS Amsterdam Set
(
  gen_random_uuid(),
  'GRATIS Amsterdam Set',
  'gratis-amsterdam-set-1',
  'Amsterdam-inspired geometric streetwear set. Features canal-inspired multi-color design with matching top and bottoms. Premium quality fabric with moisture-wicking technology.',
  'Amsterdam-inspired geometric streetwear set.',
  'merch',
  110.00,
  140.00,
  ARRAY['/lovable-uploads/1253d645-9ac6-4d39-bd24-3d3901f39cd7.png'],
  '/lovable-uploads/1253d645-9ac6-4d39-bd24-3d3901f39cd7.png',
  'LOCATION',
  4.8,
  623,
  true,
  88,
  ARRAY['S', 'M', 'L'],
  ARRAY['Canal Multi'],
  'GRATIS-AMS-SET-001',
  false
),
-- Product 9: GRATIS Urban Crew Collection
(
  gen_random_uuid(),
  'GRATIS Urban Crew Collection',
  'gratis-urban-crew-1',
  'Urban streetwear collection with vibrant patterns. Premium quality fabric with reinforced stitching. Street multi-color design perfect for city adventures.',
  'Urban streetwear collection with vibrant patterns.',
  'merch',
  165.00,
  NULL,
  ARRAY['/lovable-uploads/1788a965-772c-43e2-af66-c9ed8ffc22aa.png'],
  '/lovable-uploads/1788a965-772c-43e2-af66-c9ed8ffc22aa.png',
  'PREMIUM',
  4.9,
  1089,
  true,
  75,
  ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  ARRAY['Street Multi'],
  'GRATIS-URBAN-CREW-001',
  true
),
-- Product 10: GRATIS Beach Tank
(
  gen_random_uuid(),
  'GRATIS Beach Tank',
  'gratis-beach-tank-1',
  'Bold beach-ready tank with striking GRATIS branding. Lime punch color that pops. Lightweight breathable fabric perfect for summer vibes and beach days.',
  'Bold beach-ready tank with striking GRATIS branding.',
  'merch',
  38.00,
  48.00,
  ARRAY['/lovable-uploads/31e8a7ae-19a2-4f28-b5f0-bb8e49fef455.png'],
  '/lovable-uploads/31e8a7ae-19a2-4f28-b5f0-bb8e49fef455.png',
  'SUMMER',
  4.7,
  1567,
  true,
  320,
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Lime Punch'],
  'GRATIS-BEACH-TANK-001',
  false
);

-- Add some sample product variants for a few products
INSERT INTO public.product_variants (product_id, size, color, variant_sku, price_adjustment, stock_quantity, in_stock)
SELECT 
  p.id,
  s.size,
  c.color,
  p.sku || '-' || s.size || '-' || SUBSTRING(c.color, 1, 3),
  0,
  CASE 
    WHEN s.size IN ('S', 'M', 'L') THEN 50
    WHEN s.size IN ('XS', 'XL') THEN 30
    ELSE 20
  END,
  true
FROM products p
CROSS JOIN UNNEST(p.available_sizes) AS s(size)
CROSS JOIN UNNEST(p.available_colors) AS c(color)
WHERE p.slug IN ('gratis-neon-tank-1', 'gratis-tracksuit-1', 'gratis-crew-hoodie-1')
LIMIT 50;

-- Add some sample reviews
INSERT INTO public.product_reviews (product_id, user_id, rating, review_title, review_text, verified_purchase, helpful_count)
SELECT 
  p.id,
  gen_random_uuid(),
  5,
  'Amazing quality!',
  'Absolutely love this piece. The colors are even more vibrant in person and the fit is perfect. GRATIS never disappoints!',
  true,
  42
FROM products p
WHERE p.slug = 'gratis-neon-tank-1'
LIMIT 1;

INSERT INTO public.product_reviews (product_id, user_id, rating, review_title, review_text, verified_purchase, helpful_count)
SELECT 
  p.id,
  gen_random_uuid(),
  4,
  'Great tracksuit',
  'Really comfortable and stylish. Got so many compliments wearing this around the city. The Amsterdam multi color is fire.',
  true,
  28
FROM products p
WHERE p.slug = 'gratis-tracksuit-1'
LIMIT 1;

INSERT INTO public.product_reviews (product_id, user_id, rating, review_title, review_text, verified_purchase, helpful_count)
SELECT 
  p.id,
  gen_random_uuid(),
  5,
  'Perfect for the beach!',
  'This swimsuit is incredible. The geometric patterns are bold and unique. Fits great and the fabric quality is top-notch.',
  true,
  35
FROM products p
WHERE p.slug = 'gratis-geometric-suit-1'
LIMIT 1;