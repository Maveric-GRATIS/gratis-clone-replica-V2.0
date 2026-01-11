
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

      constraints.push(where('in_stock', '==', true));

      if (category) {
        constraints.push(where('category', '==', category));
      }

      if (featured !== undefined) {
        constraints.push(where('featured', '==', featured));
      }

      if (tier) {
        constraints.push(where('tier', '==', tier));
      }

      constraints.push(orderBy('createdAt', 'desc'));

      const q = query(productsRef, ...constraints);
      const querySnapshot = await getDocs(q);

      const fetchedProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(fetchedProducts);
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
