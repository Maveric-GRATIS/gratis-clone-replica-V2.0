import { useQuery, useQueryClient } from '@tanstack/react-query';
import { db } from '@/firebase';
import { collection, getDocs, query, where, orderBy, limit, Timestamp, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';

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
 * Fetch all published videos with real-time updates
 */
export function useVideos() {
  const queryClient = useQueryClient();

  const queryResult = useQuery({
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
    staleTime: Infinity, // Keep data fresh via real-time listener
  });

  // Real-time listener for automatic updates when admin changes videos
  useEffect(() => {
    const videosCollection = collection(db, 'videos');
    const q = query(
      videosCollection,
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const videos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Video[];

        queryClient.setQueryData(['videos'], videos);
      }
    );

    return () => unsubscribe();
  }, [queryClient]);

  return queryResult;
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
 * Fetch featured videos with real-time updates
 */
export function useFeaturedVideos(limitCount = 3) {
  const queryClient = useQueryClient();

  const queryResult = useQuery({
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
    staleTime: Infinity,
  });

  // Real-time listener
  useEffect(() => {
    const videosCollection = collection(db, 'videos');
    const q = query(
      videosCollection,
      where('status', '==', 'published'),
      where('featured', '==', true),
      orderBy('views', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const videos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Video[];

        queryClient.setQueryData(['videos', 'featured', limitCount], videos);
      }
    );

    return () => unsubscribe();
  }, [queryClient, limitCount]);

  return queryResult;
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
