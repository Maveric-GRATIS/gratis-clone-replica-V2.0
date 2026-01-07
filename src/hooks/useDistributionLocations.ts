import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type DistributionLocation = Database['public']['Tables']['distribution_locations']['Row'];

export const useDistributionLocations = () => {
  const [locations, setLocations] = useState<DistributionLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('distribution_locations')
          .select('*')
          .eq('active', true)
          .order('total_distributed', { ascending: false });

        if (error) throw error;
        setLocations(data || []);
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
