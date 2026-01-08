import { useQuery } from '@tanstack/react-query';
import { db } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

export const useUserImpact = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-impact', user?.uid],
    queryFn: async () => {
      if (!user) return null;
      
      const q = query(collection(db, 'user_impact'), where('user_id', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return {
          total_spent: 0,
          liters_funded: 0,
          carbon_saved: 0,
          orders_count: 0
        };
      }
      
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    },
    enabled: !!user
  });
};
