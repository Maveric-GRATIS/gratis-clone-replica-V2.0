import ProductCard from '@/components/ProductCard';
import { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
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
        ))}
      </div>
    </section>
  );
}
