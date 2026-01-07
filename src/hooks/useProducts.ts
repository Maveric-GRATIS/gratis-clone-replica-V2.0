import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];

interface UseProductsOptions {
  category?: string;
  featured?: boolean;
  tier?: string;
}

export const useProducts = (categoryOrOptions?: string | UseProductsOptions, legacyFeatured?: boolean) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle both old and new API
  const options: UseProductsOptions = typeof categoryOrOptions === 'string' 
    ? { category: categoryOrOptions, featured: legacyFeatured }
    : categoryOrOptions || {};

  const { category, featured, tier } = options;

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      if (featured !== undefined) {
        query = query.eq('featured', featured);
      }

      if (tier) {
        query = query.eq('tier', tier);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, featured, tier]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  };
};