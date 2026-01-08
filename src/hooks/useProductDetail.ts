import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];

export const useProductDetail = (slug: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // For now, fetch by ID since we don't have slugs yet
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', slug)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return {
    product,
    variants: [],
    reviews: [],
    relatedProducts: [],
    loading,
    error
  };
};
