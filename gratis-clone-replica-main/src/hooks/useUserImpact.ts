import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUserImpact = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-impact', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_impact')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      // If no impact record exists, return defaults
      if (!data) {
        return {
          total_spent: 0,
          liters_funded: 0,
          carbon_saved: 0,
          orders_count: 0
        };
      }
      
      return data;
    },
    enabled: !!user
  });
};