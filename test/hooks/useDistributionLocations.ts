import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

interface DistributionLocation {
  id: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  total_distributed: number;
  active: boolean;
}

export const useDistributionLocations = () => {
  const [locations, setLocations] = useState<DistributionLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'distribution_locations'), 
          where('active', '==', true), 
          orderBy('total_distributed', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const fetchedLocations: DistributionLocation[] = [];
        querySnapshot.forEach((doc) => {
          fetchedLocations.push({ id: doc.id, ...doc.data() } as DistributionLocation);
        });
        setLocations(fetchedLocations);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return { locations, loading, error };
};
