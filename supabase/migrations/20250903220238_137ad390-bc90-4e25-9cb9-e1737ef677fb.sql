-- Insert sample products for GRATIS
INSERT INTO products (name, description, price, original_price, category, subcategory, image_url, badge, rating, review_count, in_stock, stock_quantity, variant_options, metadata, featured) VALUES

-- Featured Water Products
('GRATIS 500ml', 'Premium alkaline water with natural minerals. Perfect for urban hydration and street culture lifestyle.', 3.99, 4.99, 'beverage', 'water', '/lovable-uploads/5fb80093-c88d-4f40-87ed-593974c38b11.png', 'Featured', 4.8, 156, true, 500, '{"sizes": ["500ml"], "flavors": ["Natural"]}', '{"featured_position": 1, "ingredients": ["Natural spring water", "Electrolytes", "Minerals"]}', true),

('GRATIS 1L', 'Large format premium alkaline water for those who stay hydrated all day. Street-approved hydration.', 6.99, 8.99, 'beverage', 'water', '/lovable-uploads/c51ea472-b223-4a6a-934c-74b38370615e.png', 'Popular', 4.9, 203, true, 300, '{"sizes": ["1L"], "flavors": ["Natural"]}', '{"featured_position": 2, "ingredients": ["Natural spring water", "Electrolytes", "Minerals"]}', true),

('GRATIS 330ml', 'Compact premium alkaline water perfect for on-the-go lifestyle. Street culture essential.', 2.99, null, 'beverage', 'water', '/lovable-uploads/cdefb4a2-d74d-4f9f-be84-9100cb927d52.png', 'New', 4.7, 89, true, 800, '{"sizes": ["330ml"], "flavors": ["Natural"]}', '{"featured_position": 3, "ingredients": ["Natural spring water", "Electrolytes", "Minerals"]}', true),

-- Regular Water Products
('GRATIS Hydrate Pro', 'Enhanced alkaline water with added electrolytes for peak performance and street credibility.', 4.49, null, 'beverage', 'water', '/placeholder.svg', null, 4.6, 67, true, 200, '{"sizes": ["500ml"], "flavors": ["Natural", "Lemon"]}', '{"ingredients": ["Natural spring water", "Electrolytes", "Minerals", "Natural flavoring"]}', false),

('GRATIS Pure', 'Clean, crisp alkaline water that embodies the essence of street culture purity.', 3.49, null, 'beverage', 'water', '/placeholder.svg', null, 4.5, 45, true, 400, '{"sizes": ["500ml"], "flavors": ["Natural"]}', '{"ingredients": ["Natural spring water", "Minerals"]}', false),

-- Merchandise
('GRATIS Streetwear Tee', 'Premium cotton t-shirt with bold GRATIS branding. Essential streetwear for the conscious urban dweller.', 29.99, 39.99, 'merch', 'apparel', '/placeholder.svg', 'Limited', 4.8, 92, true, 150, '{"sizes": ["S", "M", "L", "XL"], "colors": ["Black", "White", "Grey"]}', '{"material": "100% Organic Cotton", "fit": "Regular"}', true),

('GRATIS Cap', 'Minimalist streetwear cap with subtle GRATIS logo. Perfect for the urban aesthetic.', 24.99, null, 'merch', 'accessories', '/placeholder.svg', null, 4.7, 54, true, 200, '{"sizes": ["One Size"], "colors": ["Black", "White", "Navy"]}', '{"material": "Cotton Twill", "style": "Snapback"}', false),

('GRATIS Hoodie', 'Premium heavyweight hoodie with embroidered GRATIS logo. Streetwear meets comfort.', 79.99, 99.99, 'merch', 'apparel', '/placeholder.svg', 'Popular', 4.9, 78, true, 100, '{"sizes": ["S", "M", "L", "XL", "XXL"], "colors": ["Black", "Grey", "White"]}', '{"material": "80% Cotton 20% Polyester", "weight": "350gsm"}', true);

-- Insert corresponding inventory records
INSERT INTO inventory (product_id, current_stock, reserved_stock, reorder_level, max_stock_level, last_restocked_at) 
SELECT 
  id,
  stock_quantity,
  0,
  CASE 
    WHEN category = 'beverage' THEN 50
    ELSE 20
  END,
  CASE 
    WHEN category = 'beverage' THEN 1000
    ELSE 500
  END,
  now()
FROM products;