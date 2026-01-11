import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export interface FirestoreUser {
  id: string;
  uid: string;
  email: string;
  displayName?: string;
  role?: string;
  createdAt?: any;
  lastLogin?: any;
  phone?: string;
}

export const useUsers = (limitCount?: number) => {
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const usersRef = collection(db, 'users');
        let q = query(usersRef, orderBy('createdAt', 'desc'));

        if (limitCount) {
          q = query(q, limit(limitCount));
        }

        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FirestoreUser[];

        setUsers(usersData);
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [limitCount]);

  return { users, loading, error };
};
