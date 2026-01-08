import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, query, where, getDocs, orderBy, QueryConstraint } from 'firebase/firestore';

interface Product {
  id: string;
  [key: string]: any;
}

interface UseProductsOptions {
  category?: string;
  featured?: boolean;
  tier?: string;
}

export const useProducts = (categoryOrOptions?: string | UseProductsOptions, legacyFeatured?: boolean) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const options: UseProductsOptions = typeof categoryOrOptions === 'string' 
    ? { category: categoryOrOptions, featured: legacyFeatured }
    : categoryOrOptions || {};

  const { category, featured, tier } = options;

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const productCollection = collection(db, 'products');
      const queryConstraints: QueryConstraint[] = [
          where('in_stock', '==', true),
          orderBy('created_at', 'desc')
      ];

      if (category) {
        queryConstraints.push(where('category', '==', category));
      }

      if (featured !== undefined) {
        queryConstraints.push(where('featured', '==', featured));
      }

      if (tier) {
        queryConstraints.push(where('tier', '==', tier));
      }

      const q = query(productCollection, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      const productsData: Product[] = [];
      querySnapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(productsData);

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
