
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  addDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Product } from '@/types'; // Assuming you have a Product type defined

interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product; // Embed product data
}

// Helper function to fetch product details
const getProduct = async (productId: string): Promise<Product | null> => {
  const productRef = doc(db, 'products', productId);
  const productSnap = await getDoc(productRef);
  if (productSnap.exists()) {
    return { id: productSnap.id, ...productSnap.data() } as Product;
  }
  return null;
};

export const useWishlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: wishlist, isLoading } = useQuery<WishlistItem[], Error>({
    queryKey: ['wishlist', user?.uid],
    queryFn: async () => {
      if (!user) return [];

      const wishlistRef = collection(db, 'wishlists');
      const q = query(wishlistRef, where('user_id', '==', user.uid));
      const snapshot = await getDocs(q);

      const wishlistItems = await Promise.all(
        snapshot.docs.map(async (d) => {
          const item = { id: d.id, ...d.data() } as WishlistItem;
          const product = await getProduct(item.product_id);
          if (product) {
            item.product = product;
          }
          return item;
        })
      );

      return wishlistItems.filter(item => item.product); // Filter out items where product not found
    },
    enabled: !!user,
  });

  const addToWishlist = useMutation<void, Error, string>({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error('Must be logged in to add to wishlist.');

      // Check for duplicates
      const wishlistRef = collection(db, 'wishlists');
      const q = query(
        wishlistRef,
        where('user_id', '==', user.uid),
        where('product_id', '==', productId)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        throw new Error('Duplicate');
      }

      await addDoc(collection(db, 'wishlists'), {
        user_id: user.uid,
        product_id: productId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.uid] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-count', user?.uid] });
      toast.success('Added to wishlist!');
    },
    onError: (error) => {
      if (error.message === 'Duplicate') {
        toast.error('This item is already in your wishlist.');
      } else {
        toast.error('Failed to add item to wishlist. Please try again.');
      }
    },
  });

  const removeFromWishlist = useMutation<void, Error, string>({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error('Must be logged in to remove from wishlist.');

      const wishlistRef = collection(db, 'wishlists');
      const q = query(
        wishlistRef,
        where('user_id', '==', user.uid),
        where('product_id', '==', productId)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        throw new Error('Item not found in wishlist.');
      }

      const docToDelete = snapshot.docs[0];
      await deleteDoc(doc(db, 'wishlists', docToDelete.id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.uid] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-count', user?.uid] });
      toast.success('Removed from wishlist.');
    },
    onError: () => {
      toast.error('Failed to remove item from wishlist. Please try again.');
    },
  });

  const isInWishlist = (productId: string) => {
    return wishlist?.some((item) => item.product_id === productId) || false;
  };

  return {
    wishlist: wishlist?.map(item => item.product).filter(p => p) as Product[] || [],
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
};
