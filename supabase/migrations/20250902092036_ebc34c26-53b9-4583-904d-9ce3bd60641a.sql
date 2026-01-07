-- Insert initial products for GRATIS
INSERT INTO public.products (name, description, price, original_price, category, subcategory, image_url, badge, rating, review_count, in_stock, stock_quantity, variant_options, metadata, featured) VALUES
-- Water Products
('GRATIS Original', 'Pure alkaline water with electrolytes. The original GRATIS experience in a sleek black bottle.', 4.99, NULL, 'beverage', 'alkaline', '/lovable-uploads/5fb80093-c88d-4f40-87ed-593974c38b11.png', 'Original', 4.8, 127, true, 500, '{"sizes": ["500ml", "750ml", "1L"], "flavors": ["original"]}', '{"ingredients": ["alkaline water", "electrolytes"], "ph": "8.5"}', true),

('GRATIS Energy', 'Premium alkaline water infused with natural caffeine and B-vitamins. Perfect for the grind.', 6.99, NULL, 'beverage', 'energy', '/lovable-uploads/c51ea472-b223-4a6a-934c-74b38370615e.png', 'Energy Boost', 4.6, 89, true, 350, '{"sizes": ["500ml", "750ml"], "flavors": ["citrus", "berry"]}', '{"caffeine": "80mg", "vitamins": ["B6", "B12"], "ph": "8.5"}', true),

('GRATIS Pure', 'Ultra-filtered alkaline water. Clean, crisp, and elevated.', 3.99, NULL, 'beverage', 'alkaline', '/lovable-uploads/cdefb4a2-d74d-4f9f-be84-9100cb927d52.png', 'Pure', 4.9, 203, true, 800, '{"sizes": ["500ml", "750ml", "1L"], "flavors": ["original"]}', '{"filtration": "reverse osmosis", "ph": "9.0"}', true),

-- Merch Products
('GRATIS Black Hoodie', 'Premium oversized hoodie with embroidered GRATIS logo. Street-ready comfort.', 89.99, 119.99, 'merch', 'apparel', '/placeholder.svg', 'Limited Drop', 4.7, 45, true, 120, '{"sizes": ["S", "M", "L", "XL", "XXL"], "colors": ["black", "charcoal"]}', '{"material": "heavyweight cotton", "fit": "oversized"}', true),

('GRATIS Metal Bottle', 'Insulated stainless steel bottle with GRATIS branding. Keeps drinks cold for 24h.', 39.99, 49.99, 'merch', 'accessories', '/placeholder.svg', 'Eco-Friendly', 4.8, 78, true, 200, '{"sizes": ["500ml", "750ml"], "colors": ["matte black", "gunmetal"]}', '{"material": "316 stainless steel", "insulation": "double wall"}', false),

('GRATIS Cap', 'Structured snapback with 3D embroidered logo. Classic street style.', 34.99, NULL, 'merch', 'accessories', '/placeholder.svg', 'New', 4.5, 32, true, 150, '{"colors": ["black", "white", "grey"], "styles": ["snapback", "fitted"]}', '{"material": "cotton twill", "closure": "snapback"}', false),

('GRATIS T-Shirt', 'Oversized cotton tee with bold GRATIS graphics. Essential streetwear.', 29.99, 39.99, 'merch', 'apparel', '/placeholder.svg', 'Bestseller', 4.6, 156, true, 300, '{"sizes": ["S", "M", "L", "XL", "XXL"], "colors": ["black", "white", "grey"]}', '{"material": "100% cotton", "fit": "oversized", "print": "screen print"}', false);

-- Create corresponding inventory records
INSERT INTO public.inventory (product_id, current_stock, reserved_stock, reorder_level, max_stock_level) 
SELECT id, stock_quantity, 0, 
  CASE 
    WHEN category = 'beverage' THEN 50
    ELSE 20
  END as reorder_level,
  CASE 
    WHEN category = 'beverage' THEN 1000
    ELSE 500
  END as max_stock_level
FROM public.products;