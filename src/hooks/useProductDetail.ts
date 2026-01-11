
import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

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
  // Add other product fields as necessary
}

export const useProductDetail = (slug: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError(null);

      try {
        const docRef = doc(db, 'products', slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          setError('Product not found');
        }
      } catch (err: any) {
        console.error("Error fetching product detail: ", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return {
    product,
    variants: [], // These will need to be fetched separately if needed
    reviews: [],
    relatedProducts: [],
    loading,
    error
  };
};