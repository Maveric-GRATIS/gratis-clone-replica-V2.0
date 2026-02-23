import { useQuery } from '@tanstack/react-query';
import { db } from '@/firebase';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';

export interface Partner {
  id: string;
  organizationName?: string;
  name?: string;
  email: string;
  website?: string;
  logo?: string;
  description?: string;
  type?: string;
  country?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  projectsCount?: number;
  active?: boolean;
  createdAt: Timestamp;
}

/**
 * Fetch all approved partners
 */
export function usePartners() {
  return useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const partnersCollection = collection(db, 'partners');
      const q = query(
        partnersCollection,
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Partner[];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Fetch active approved partners only
 */
export function useActivePartners() {
  return useQuery({
    queryKey: ['partners', 'active'],
    queryFn: async () => {
      const partnersCollection = collection(db, 'partners');
      const q = query(
        partnersCollection,
        where('status', '==', 'approved'),
        where('active', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Partner[];
    },
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Fetch partners by tier
 */
export function usePartnersByTier(tier: Partner['tier']) {
  return useQuery({
    queryKey: ['partners', 'tier', tier],
    queryFn: async () => {
      const partnersCollection = collection(db, 'partners');
      const q = query(
        partnersCollection,
        where('status', '==', 'approved'),
        where('tier', '==', tier),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Partner[];
    },
    enabled: !!tier,
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Fetch featured partners (platinum & gold tiers)
 */
export function useFeaturedPartners(limitCount = 6) {
  return useQuery({
    queryKey: ['partners', 'featured', limitCount],
    queryFn: async () => {
      const partnersCollection = collection(db, 'partners');

      // Get platinum partners
      const platinumQuery = query(
        partnersCollection,
        where('status', '==', 'approved'),
        where('tier', '==', 'platinum'),
        limit(limitCount)
      );
      const platinumSnapshot = await getDocs(platinumQuery);
      const platinum = platinumSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Partner[];

      // If we need more, get gold partners
      const remaining = limitCount - platinum.length;
      if (remaining > 0) {
        const goldQuery = query(
          partnersCollection,
          where('status', '==', 'approved'),
          where('tier', '==', 'gold'),
          limit(remaining)
        );
        const goldSnapshot = await getDocs(goldQuery);
        const gold = goldSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Partner[];
        return [...platinum, ...gold];
      }

      return platinum;
    },
    staleTime: 1000 * 60 * 10,
  });
}
