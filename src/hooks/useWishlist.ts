import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, auth } from '@/firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const fetchProduct = async (productId: string) => {
  const productRef = doc(db, 'products', productId);
  const productSnap = await getDoc(productRef);
  return productSnap.exists() ? { id: productSnap.id, ...productSnap.data() } : null;
};

export const useWishlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: wishlist, isLoading } = useQuery({
    queryKey: ['wishlist', user?.uid],
    queryFn: async () => {
      if (!user) return [];
      
      const q = query(collection(db, 'wishlists'), where('user_id', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const wishlistItems = await Promise.all(querySnapshot.docs.map(async (d) => {
        const item = d.data();
        const product = await fetchProduct(item.product_id);
        return { ...item, id: d.id, product };
      }));
      
      return wishlistItems.filter(item => item.product !== null);
    },
    enabled: !!user
  });

  const addToWishlist = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error('Must be logged in');
      
      // Check if already in wishlist
      const q = query(collection(db, 'wishlists'), where('user_id', '==', user.uid), where('product_id', '==', productId));
      const existing = await getDocs(q);
      if (!existing.empty) {
        throw new Error('duplicate');
      }

      await addDoc(collection(db, 'wishlists'), { user_id: user.uid, product_id: productId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.uid] });
      toast.success('Added to wishlist');
    },
    onError: (error: any) => {
      if (error.message?.includes('duplicate')) {
        toast.error('Already in wishlist');
      } else {
        toast.error('Failed to add to wishlist');
      }
    }
  });

  const removeFromWishlist = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error('Must be logged in');
      
      const q = query(collection(db, 'wishlists'), where('user_id', '==', user.uid), where('product_id', '==', productId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) throw new Error("Not in wishlist");

      const docId = querySnapshot.docs[0].id;
      await deleteDoc(doc(db, 'wishlists', docId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.uid] });
      toast.success('Removed from wishlist');
    },
    onError: () => {
      toast.error('Failed to remove from wishlist');
    }
  });

  const isInWishlist = (productId: string) => {
    return wishlist?.some(item => item.product_id === productId) || false;
  };

  return {
    wishlist: wishlist || [],
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  };
};