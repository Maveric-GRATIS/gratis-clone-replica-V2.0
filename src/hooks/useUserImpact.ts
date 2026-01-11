
import { useQuery } from '@tanstack/react-query';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

interface UserImpactData {
  total_spent: number;
  liters_funded: number;
  carbon_saved: number;
  orders_count: number;
}

export const useUserImpact = () => {
  const { user } = useAuth();

  return useQuery<UserImpactData | null, Error>({
    queryKey: ['user-impact', user?.uid],
    queryFn: async () => {
      if (!user) return null;
      
      const impactRef = doc(db, 'user_impact', user.uid);
      const impactSnap = await getDoc(impactRef);
      
      if (impactSnap.exists()) {
        return impactSnap.data() as UserImpactData;
      }
      
      // If no impact record exists, return defaults
      return {
        total_spent: 0,
        liters_funded: 0,
        carbon_saved: 0,
        orders_count: 0
      };
    },
    enabled: !!user,
  });
};
