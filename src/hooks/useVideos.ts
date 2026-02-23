import { useQuery } from '@tanstack/react-query';
import { db } from '@/firebase';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';

export interface Video {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl: string;
  videoUrl: string;
  category: string;
  status: string;
  views: number;
  likes: number;
  featured?: boolean;
  publishedAt?: Timestamp;
  createdAt: Timestamp;
}

/**
 * Fetch all published videos
 */
export function useVideos() {
  return useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const videosCollection = collection(db, 'videos');
      const q = query(
        videosCollection,
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Video[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch videos by category
 */
export function useVideosByCategory(category: string) {
  return useQuery({
    queryKey: ['videos', 'category', category],
    queryFn: async () => {
      const videosCollection = collection(db, 'videos');
      const q = query(
        videosCollection,
        where('status', '==', 'published'),
        where('category', '==', category),
        orderBy('publishedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Video[];
    },
    enabled: !!category,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch featured videos
 */
export function useFeaturedVideos(limitCount = 3) {
  return useQuery({
    queryKey: ['videos', 'featured', limitCount],
    queryFn: async () => {
      const videosCollection = collection(db, 'videos');
      const q = query(
        videosCollection,
        where('status', '==', 'published'),
        where('featured', '==', true),
        orderBy('views', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Video[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch trending videos (most viewed)
 */
export function useTrendingVideos(limitCount = 10) {
  return useQuery({
    queryKey: ['videos', 'trending', limitCount],
    queryFn: async () => {
      const videosCollection = collection(db, 'videos');
      const q = query(
        videosCollection,
        where('status', '==', 'published'),
        orderBy('views', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Video[];
    },
    staleTime: 1000 * 60 * 5,
  });
}
