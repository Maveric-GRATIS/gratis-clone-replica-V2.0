
import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, query, where, getDocs, orderBy, QueryConstraint } from 'firebase/firestore';

// Define a TypeScript interface for the Product
interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url?: string;
  category: string;
  in_stock: boolean;
  featured: boolean;
  tier?: string;
  // Add other product fields as necessary
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
      const productsRef = collection(db, 'products');
      const constraints: QueryConstraint[] = [];

      // Always filter by in_stock first (most selective)
      constraints.push(where('in_stock', '==', true));

      // Add category filter if specified
      if (category) {
        constraints.push(where('category', '==', category));
      }

      // Add featured filter if specified
      if (featured !== undefined) {
        constraints.push(where('featured', '==', featured));
      }

      // Add tier filter if specified
      if (tier) {
        constraints.push(where('tier', '==', tier));
      }

      // Try to add orderBy, but catch if index doesn't exist yet
      try {
        constraints.push(orderBy('createdAt', 'desc'));
        const q = query(productsRef, ...constraints);
        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(fetchedProducts);
      } catch (indexError: any) {
        // If index error, fetch without orderBy and sort in memory
        if (indexError.code === 'failed-precondition' || indexError.message?.includes('index')) {
          console.warn('Index not ready yet, fetching without orderBy and sorting in memory');
          const simpleQuery = query(productsRef, ...constraints.slice(0, -1)); // Remove orderBy
          const querySnapshot = await getDocs(simpleQuery);
          const fetchedProducts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Product));

          // Sort in memory by createdAt
          fetchedProducts.sort((a: any, b: any) => {
            const aTime = a.createdAt?.toMillis?.() || 0;
            const bTime = b.createdAt?.toMillis?.() || 0;
            return bTime - aTime;
          });

          setProducts(fetchedProducts);
        } else {
          throw indexError;
        }
      }
    } catch (err: any) {
      console.error("Error fetching products: ", err);
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
