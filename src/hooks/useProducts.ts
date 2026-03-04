
import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, query, where, getDocs, orderBy, QueryConstraint, onSnapshot } from 'firebase/firestore';

// Define a TypeScript interface for the Product
export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url?: string;
  images?: string[];
  description?: string;
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

  useEffect(() => {
    setLoading(true);
    setError(null);

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
    let unsubscribe: (() => void) | undefined;

    try {
      constraints.push(orderBy('createdAt', 'desc'));
      const q = query(productsRef, ...constraints);

      // Real-time listener - updates automatically when admin changes data
      unsubscribe = onSnapshot(q,
        (snapshot) => {
          const fetchedProducts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Product));
          setProducts(fetchedProducts);
          setLoading(false);
        },
        (err) => {
          // If index error, try without orderBy
          if (err.code === 'failed-precondition' || err.message?.includes('index')) {
            console.warn('Index not ready, using fallback query');
            const simpleQuery = query(productsRef, ...constraints.slice(0, -1));

            unsubscribe = onSnapshot(simpleQuery,
              (snapshot) => {
                const fetchedProducts = snapshot.docs.map(doc => ({
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
                setLoading(false);
              },
              (error) => {
                console.error('Error fetching products:', error);
                setError(error.message);
                setLoading(false);
              }
            );
          } else {
            console.error('Error fetching products:', err);
            setError(err.message);
            setLoading(false);
          }
        }
      );
    } catch (err: any) {
      console.error('Error setting up products listener:', err);
      setError(err.message);
      setLoading(false);
    }

    // Cleanup listener on unmount or when dependencies change
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [category, featured, tier]);

  return {
    products,
    loading,
    error
  };
};
