import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';

interface ProductGridProps {
  category?: 'beverage' | 'merch';
  featured?: boolean;
  tier?: string;
  title?: string;
  showTitle?: boolean;
}

export default function ProductGrid({ 
  category, 
  featured,
  tier,
  title, 
  showTitle = true 
}: ProductGridProps) {
  const { products, loading, error } = useProducts({ category, featured, tier });

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Products</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  const displayTitle = title || (
    featured ? 'Featured Products' : 
    category === 'beverage' ? 'Water Collection' :
    category === 'merch' ? 'Merch Collection' :
    'All Products'
  );

  return (
    <section className="space-y-8">
      {showTitle && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">{displayTitle}</h2>
          {category === 'beverage' && (
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the purest hydration with our premium alkaline water collection.
              Each bottle is crafted for the street-savvy individual who demands excellence.
            </p>
          )}
          {category === 'merch' && (
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Express your street style with our exclusive GRATIS merch collection.
              Premium quality meets urban aesthetics.
            </p>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 8 }).map((_, i) => (
            <ProductCard key={i} loading={true} />
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              {category ? `No ${category} products are currently available.` : 'No products are currently available.'}
            </p>
          </div>
        ) : (
          products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={{
                ...product,
                price: Number(product.price),
                original_price: product.original_price ? Number(product.original_price) : null,
                rating: Number(product.rating || 0),
                review_count: product.reviews_count || 0,
              }} 
            />
          ))
        )}
      </div>
    </section>
  );
}