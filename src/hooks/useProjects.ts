import { useQuery, useQueryClient } from '@tanstack/react-query';
import { db } from '@/firebase';
import { collection, getDocs, query, where, orderBy, limit, Timestamp, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';

export interface Project {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  category: string;
  status: string;
  ngoId?: string;
  images?: string[];
  imageUrl?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Fetch all active projects with real-time updates
 */
export function useProjects() {
  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const projectsCollection = collection(db, 'projects');
      const q = query(
        projectsCollection,
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
    },
    staleTime: Infinity, // Keep data fresh via real-time listener
  });

  // Real-time listener - updates automatically when admin changes projects
  useEffect(() => {
    const projectsCollection = collection(db, 'projects');
    const q = query(
      projectsCollection,
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const projects = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];

        queryClient.setQueryData(['projects'], projects);
      }
    );

    return () => unsubscribe();
  }, [queryClient]);

  return queryResult;
}

/**
 * Fetch projects by category
 */
export function useProjectsByCategory(category: string) {
  return useQuery({
    queryKey: ['projects', 'category', category],
    queryFn: async () => {
      const projectsCollection = collection(db, 'projects');
      const q = query(
        projectsCollection,
        where('status', '==', 'active'),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
    },
    enabled: !!category,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch featured/trending projects with real-time updates
 */
export function useFeaturedProjects(limitCount = 3) {
  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey: ['projects', 'featured', limitCount],
    queryFn: async () => {
      const projectsCollection = collection(db, 'projects');
      const q = query(
        projectsCollection,
        where('status', '==', 'active'),
        orderBy('raised', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
    },
    staleTime: Infinity,
  });

  // Real-time listener
  useEffect(() => {
    const projectsCollection = collection(db, 'projects');
    const q = query(
      projectsCollection,
      where('status', '==', 'active'),
      orderBy('raised', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const projects = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];

        queryClient.setQueryData(['projects', 'featured', limitCount], projects);
      }
    );

    return () => unsubscribe();
  }, [queryClient, limitCount]);

  return queryResult;
}
