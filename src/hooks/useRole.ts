
import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';

type UserRole = 'customer' | 'admin' | 'marketing';

export const useRole = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Guard against setState after unmount
    let mounted = true;

    const fetchRoles = async () => {
      if (!user) {
        if (mounted) {
          setRoles([]);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const rolesRef = collection(db, 'user_roles');
        const q = query(rolesRef, where('user_id', '==', user.uid));
        const querySnapshot = await getDocs(q);

        if (mounted) {
          const userRoles = querySnapshot.docs.map(doc => doc.data().role as UserRole);
          setRoles(userRoles);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message);
          setRoles([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRoles();

    // Cleanup: prevent setState on unmounted component
    return () => { mounted = false; };
  }, [user]);

  const hasRole = (role: UserRole) => roles.includes(role);
  const isAdmin = hasRole('admin');
  const isMarketing = hasRole('marketing');
  const isCustomer = hasRole('customer');

  return {
    roles,
    loading,
    error,
    hasRole,
    isAdmin,
    isMarketing,
    isCustomer
  };
};
