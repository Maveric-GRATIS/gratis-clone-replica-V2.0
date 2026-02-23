import { useQuery } from '@tanstack/react-query';
import { db } from '@/firebase';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';

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
 * Fetch all active projects
 */
export function useProjects() {
  return useQuery({
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
    staleTime: 1000 * 60 * 5,
  });
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
 * Fetch featured/trending projects
 */
export function useFeaturedProjects(limitCount = 3) {
  return useQuery({
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
    staleTime: 1000 * 60 * 5,
  });
}
