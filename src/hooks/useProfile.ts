
import { useState, useEffect, useCallback } from 'react';
import { db } from '@/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';

interface Profile {
  id: string; // This will be the UID
  user_id: string;
  email: string;
  display_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  phone?: string | null;
  address?: string | null;
  company?: string | null;
  website?: string | null;
  preferences?: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    eventUpdates?: boolean;
    newsletter?: boolean;
    language?: string;
    timezone?: string;
  };
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
        // Create a default profile if it doesn't exist
        const defaultProfile = {
          user_id: user.uid,
          email: user.email || '',
          display_name: user.displayName || user.email?.split('@')[0] || '',
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        };
        await setDoc(profileRef, defaultProfile);
        // Fetch again to get the created profile with timestamps
        const newProfileSnap = await getDoc(profileRef);
        setProfile({ id: newProfileSnap.id, ...newProfileSnap.data() } as Profile);
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

      // Use setDoc with merge to create if doesn't exist
      await setDoc(profileRef, updatePayload, { merge: true });

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
