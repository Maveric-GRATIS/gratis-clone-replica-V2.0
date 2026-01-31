import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';

/**
 * Impact statistics by category
 */
interface ImpactByCategory {
  water: {
    amount: number;
    projectsCount: number;
    beneficiaries: number;
  };
  arts: {
    amount: number;
    projectsCount: number;
    beneficiaries: number;
  };
  education: {
    amount: number;
    projectsCount: number;
    beneficiaries: number;
  };
}

/**
 * Tribe members count by tier
 */
interface TribeMembersByTier {
  seedling: number;
  sapling: number;
  rooted: number;
  canopy: number;
  guardian: number;
}

/**
 * Global impact statistics
 */
export interface ImpactStats {
  totalDonated: number;
  donationsCount: number;
  bottlesDistributed: number;
  ngoPartnersCount: number;
  tribeMembersByTier: TribeMembersByTier;
  impactByCategory: ImpactByCategory;
  countriesReached: number;
  eventsHosted: number;
  volunteersEngaged: number;
  lastUpdated: Date;
}

/**
 * Hook that subscribes to real-time global impact statistics
 * Fetches data from Firestore stats/impact document
 *
 * @returns Object containing stats, loading state, and error
 *
 * @example
 * const { stats, loading, error } = useImpactStats();
 *
 * if (loading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *   <div>
 *     <p>Total Donated: €{stats.totalDonated.toLocaleString()}</p>
 *     <p>Bottles Distributed: {stats.bottlesDistributed.toLocaleString()}</p>
 *     <p>Countries Reached: {stats.countriesReached}</p>
 *   </div>
 * );
 */
export function useImpactStats() {
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const impactRef = doc(db, 'stats', 'impact');

    const unsubscribe = onSnapshot(
      impactRef,
      (snapshot) => {
        try {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setStats({
              totalDonated: data.totalDonated || 0,
              donationsCount: data.donationsCount || 0,
              bottlesDistributed: data.bottlesDistributed || 0,
              ngoPartnersCount: data.ngoPartnersCount || 0,
              tribeMembersByTier: data.tribeMembersByTier || {
                seedling: 0,
                sapling: 0,
                rooted: 0,
                canopy: 0,
                guardian: 0,
              },
              impactByCategory: data.impactByCategory || {
                water: { amount: 0, projectsCount: 0, beneficiaries: 0 },
                arts: { amount: 0, projectsCount: 0, beneficiaries: 0 },
                education: { amount: 0, projectsCount: 0, beneficiaries: 0 },
              },
              countriesReached: data.countriesReached || 0,
              eventsHosted: data.eventsHosted || 0,
              volunteersEngaged: data.volunteersEngaged || 0,
              lastUpdated: data.lastUpdated?.toDate() || new Date(),
            });
            setError(null);
          } else {
            // If document doesn't exist, set default values
            setStats({
              totalDonated: 0,
              donationsCount: 0,
              bottlesDistributed: 0,
              ngoPartnersCount: 0,
              tribeMembersByTier: {
                seedling: 0,
                sapling: 0,
                rooted: 0,
                canopy: 0,
                guardian: 0,
              },
              impactByCategory: {
                water: { amount: 0, projectsCount: 0, beneficiaries: 0 },
                arts: { amount: 0, projectsCount: 0, beneficiaries: 0 },
                education: { amount: 0, projectsCount: 0, beneficiaries: 0 },
              },
              countriesReached: 0,
              eventsHosted: 0,
              volunteersEngaged: 0,
              lastUpdated: new Date(),
            });
          }
          setLoading(false);
        } catch (err) {
          console.error('Error processing impact stats:', err);
          setError(err instanceof Error ? err.message : 'Failed to process impact stats');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error fetching impact stats:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { stats, loading, error };
}
