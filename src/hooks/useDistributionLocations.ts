
import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

interface DistributionLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  totalDistributed: number;
  active: boolean;
}

export const useDistributionLocations = () => {
  const [locations, setLocations] = useState<DistributionLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      setError(null);
      try {
        const locationsRef = collection(db, 'distribution_locations');
        const q = query(
          locationsRef,
          where('active', '==', true),
          orderBy('totalDistributed', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const fetchedLocations = querySnapshot.docs.map(doc => 
          ({ id: doc.id, ...doc.data() } as DistributionLocation)
        );
        setLocations(fetchedLocations);
      } catch (err: any) {
        console.error("Error fetching distribution locations: ", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return { locations, loading, error };
};
