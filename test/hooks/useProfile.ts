import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  display_name?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  created_at: any; 
  updated_at: any;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const q = query(collection(db, "profiles"), where("user_id", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const profileDoc = querySnapshot.docs[0];
        setProfile({ id: profileDoc.id, ...profileDoc.data() } as Profile);
      } else {
        setProfile(null);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const profileRef = doc(db, "profiles", profile.id);
      await updateDoc(profileRef, {
        ...updates,
        updated_at: serverTimestamp()
      });
      // Re-fetch profile to get updated data
      await fetchProfile();
      return { data: profile, error: null };
    } catch (err: any) {
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile
  };
};
