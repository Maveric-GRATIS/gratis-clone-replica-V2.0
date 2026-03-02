import { useQuery } from '@tanstack/react-query';
import { db } from '@/firebase';
import { collection, getDocs, getDoc, doc, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  locationDetails?: string;
  date: Timestamp;
  endDate?: Timestamp;
  capacity: number;
  registered: number;
  type: string;
  status: string;
  imageUrl?: string;
  featured: boolean;
  published: boolean;
  createdAt: Timestamp;
}

/**
 * Fetch all published events
 */
export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const eventsCollection = collection(db, 'events');
      const q = query(
        eventsCollection,
        where('published', '==', true),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch upcoming events only
 */
export function useUpcomingEvents(limitCount = 10) {
  return useQuery({
    queryKey: ['events', 'upcoming', limitCount],
    queryFn: async () => {
      const eventsCollection = collection(db, 'events');
      const now = Timestamp.now();
      const q = query(
        eventsCollection,
        where('published', '==', true),
        where('date', '>=', now),
        orderBy('date', 'asc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch featured events
 */
export function useFeaturedEvents(limitCount = 3) {
  return useQuery({
    queryKey: ['events', 'featured', limitCount],
    queryFn: async () => {
      const eventsCollection = collection(db, 'events');
      const q = query(
        eventsCollection,
        where('published', '==', true),
        where('featured', '==', true),
        orderBy('date', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch past events
 */
export function usePastEvents(limitCount = 10) {
  return useQuery({
    queryKey: ['events', 'past', limitCount],
    queryFn: async () => {
      const eventsCollection = collection(db, 'events');
      const now = Timestamp.now();
      const q = query(
        eventsCollection,
        where('published', '==', true),
        where('date', '<', now),
        orderBy('date', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Fetch a single event by ID
 */
export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id) throw new Error('Event ID is required');

      const eventDoc = await getDoc(doc(db, 'events', id));

      if (!eventDoc.exists()) return null;

      const data = eventDoc.data();

      // Only return if published
      if (!data?.published) return null;

      return {
        id: eventDoc.id,
        ...data
      } as Event;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}
