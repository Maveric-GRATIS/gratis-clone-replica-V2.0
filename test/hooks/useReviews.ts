import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, auth } from '@/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  helpful_votes: number;
  verified_purchase: boolean;
  created_at: any;
}

export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const q = query(collection(db, 'reviews'), where('product_id', '==', productId), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      const reviews: Review[] = [];
      querySnapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() } as Review);
      });
      return reviews;
    }
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, rating, comment }: { 
      productId: string; 
      rating: number; 
      comment: string;
    }) => {
      const user = auth.currentUser;
      if (!user) throw new Error('Must be logged in to review');

      const docRef = await addDoc(collection(db, 'reviews'), {
        product_id: productId,
        user_id: user.uid,
        rating,
        comment,
        helpful_votes: 0,
        verified_purchase: false, // This might need more logic based on actual purchases
        created_at: serverTimestamp()
      });
      
      return { id: docRef.id };
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      toast.success('Review submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit review');
    }
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      reviewId, 
      productId, 
      rating, 
      comment 
    }: { 
      reviewId: string;
      productId: string;
      rating: number; 
      comment: string;
    }) => {
      const reviewRef = doc(db, "reviews", reviewId);
      await updateDoc(reviewRef, { rating, comment });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      toast.success('Review updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update review');
    }
  });
};
