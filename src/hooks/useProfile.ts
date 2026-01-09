
import { useState, useEffect, useCallback } from 'react';
import { db } from '@/firebase';
import { doc, getDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

interface Profile {
  id: string; // This will be the UID
  user_id: string;
  email: string;
  display_name?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const profileRef = doc(db, 'profiles', user.uid);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        setProfile({ id: profileSnap.id, ...profileSnap.data() } as Profile);
      } else {
        // Handle case where profile doesn't exist yet, maybe create it?
        // For now, just setting it to null as per original logic for not found.
        setProfile(null);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProfile = async (updates: Partial<Omit<Profile, 'id' | 'email' | 'created_at' | 'updated_at'>>) => {
    if (!user) {
      const err = new Error('User not authenticated.');
      setError(err.message);
      return { data: null, error: err };
    }

    setLoading(true);
    setError(null);

    try {
      const profileRef = doc(db, 'profiles', user.uid);
      const updatePayload = {
        ...updates,
        updated_at: serverTimestamp(),
      };

      await updateDoc(profileRef, updatePayload);

      // Refetch the profile to get the updated data
      await fetchProfile(); 
      // Optimistically update the local state to avoid a re-render flash
      setProfile(prevProfile => prevProfile ? { ...prevProfile, ...updates } : null);
      
      // Since updateDoc doesn't return the doc, we return the updates
      return { data: { ...profile, ...updates }, error: null };
    } catch (err: any) {
      setError(err.message);
      return { data: null, error: err };
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
  }, [user, fetchProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
};
