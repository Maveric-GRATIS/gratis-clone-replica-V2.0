import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  category: string;
  in_stock: boolean;
  featured: boolean;
  tier?: string;
  size?: string;
  flavor?: string;
  createdAt?: any;
  updatedAt?: any;
}

export const useAllProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, orderBy('createdAt', 'desc'));

        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];

        setProducts(productsData);
        console.log('Fetched products:', productsData.length);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};
