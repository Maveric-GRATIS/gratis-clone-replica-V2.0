import { useQuery, useQueryClient } from '@tanstack/react-query';
import { db } from '@/firebase';
import { collection, getDocs, query, where, orderBy, limit, Timestamp, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';

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
 * Fetch all approved partners with real-time updates
 */
export function usePartners() {
  const queryClient = useQueryClient();

  const queryResult = useQuery({
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
    staleTime: Infinity, // Keep data fresh via real-time listener
  });

  // Real-time listener for automatic updates when admin changes partners
  useEffect(() => {
    const partnersCollection = collection(db, 'partners');
    const q = query(
      partnersCollection,
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const partners = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Partner[];

        queryClient.setQueryData(['partners'], partners);
      }
    );

    return () => unsubscribe();
  }, [queryClient]);

  return queryResult;
}

/**
 * Fetch active approved partners only with real-time updates
 */
export function useActivePartners() {
  const queryClient = useQueryClient();

  const queryResult = useQuery({
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
    staleTime: Infinity,
  });

  // Real-time listener
  useEffect(() => {
    const partnersCollection = collection(db, 'partners');
    const q = query(
      partnersCollection,
      where('status', '==', 'approved'),
      where('active', '==', true),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const partners = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Partner[];

        queryClient.setQueryData(['partners', 'active'], partners);
      }
    );

    return () => unsubscribe();
  }, [queryClient]);

  return queryResult;
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
