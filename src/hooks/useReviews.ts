
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, auth } from '@/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { toast } from 'sonner';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string | null;
  helpfulVotes: number;
  verifiedPurchase: boolean;
  createdAt: Timestamp;
  // Assuming user details might be needed
  author?: {
    name: string;
    avatarUrl: string;
  };
}

// Fetch reviews for a product
export const useProductReviews = (productId: string) => {
  return useQuery<Review[], Error>({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      if (!productId) return [];

      const reviewsRef = collection(db, 'reviews');
      const q = query(
        reviewsRef,
        where('productId', '==', productId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const reviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));

      // Here you might want to fetch user details for each review
      return reviews;
    },
    enabled: !!productId, // Only run if productId is available
  });
};

// Create a new review
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { productId: string; rating: number; comment: string; }>({
    mutationFn: async ({ productId, rating, comment }) => {
      const user = auth.currentUser;
      if (!user) throw new Error('You must be logged in to post a review.');

      // Optional: Check if the user has purchased this product before setting verifiedPurchase

      await addDoc(collection(db, 'reviews'), {
        productId,
        userId: user.uid,
        rating,
        comment,
        helpfulVotes: 0,
        verifiedPurchase: false, // This would require order history lookup
        createdAt: serverTimestamp(),
        author: {
          name: user.displayName || 'Anonymous',
          avatarUrl: user.photoURL || '',
        }
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      toast.success('Your review has been submitted!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit review. Please try again.');
    }
  });
};

// Update an existing review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { reviewId: string; productId: string; rating: number; comment: string; }>({
    mutationFn: async ({ reviewId, rating, comment }) => {
      const user = auth.currentUser;
      if (!user) throw new Error('Authentication error.');

      const reviewRef = doc(db, 'reviews', reviewId);
      // Optional: check if user is the owner of the review before updating

      await updateDoc(reviewRef, {
        rating,
        comment,
        updatedAt: serverTimestamp(),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
      toast.success('Review updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update review.');
    }
  });
};

// Optional: Hook for upvoting a review
export const useVoteReview = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { reviewId: string; productId: string; currentVotes: number; }>({
    mutationFn: async ({ reviewId, currentVotes }) => {
      const reviewRef = doc(db, 'reviews', reviewId);
      await updateDoc(reviewRef, {
        helpfulVotes: currentVotes + 1,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId] });
    },
    onError: () => {
      toast.error('Failed to register vote.');
    }
  });
};