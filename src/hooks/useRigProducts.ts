import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  QueryConstraint,
} from 'firebase/firestore';

export interface RigProduct {
  id: string;
  item_name: string;
  description: string;
  color_options: string[];
  sizes_available: string[];
  price: number;
  collection_id: string;
  category: string;
  in_stock: boolean;
  featured: boolean;
}

/**
 * Fetches products from the `rig_products` Firestore collection.
 * @param collectionId  Optional collection_id filter (e.g. "prime_picks").
 *                      Omit to fetch all RIG products.
 */
export const useRigProducts = (collectionId?: string) => {
  const [products, setProducts] = useState<RigProduct[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const ref = collection(db, 'rig_products');
    const constraints: QueryConstraint[] = [where('in_stock', '==', true)];

    if (collectionId) {
      constraints.push(where('collection_id', '==', collectionId));
    }

    const q = query(ref, ...constraints);

    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() } as RigProduct),
        );
        // Sort featured first, then by name
        items.sort((a, b) => {
          if (a.featured === b.featured) return a.item_name.localeCompare(b.item_name);
          return a.featured ? -1 : 1;
        });
        setProducts(items);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );

    return unsub;
  }, [collectionId]);

  return { products, loading, error };
};
