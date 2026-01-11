<<<<<<< HEAD
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
=======
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
>>>>>>> 2fca900 (database connecten)
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
<<<<<<< HEAD
  updateProfile,
} from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
=======
  updateProfile
} from 'firebase/auth';
import { auth, db } from '@/firebase';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc, DocumentData } from 'firebase/firestore';

// Define a more detailed user type
export interface User extends FirebaseUser {
  role?: string;
  // you can add any other custom properties from your Firestore user document here
}
>>>>>>> 2fca900 (database connecten)

interface AuthContextType {
  user: User | null;
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data() as DocumentData;
          setUser({ ...firebaseUser, ...userData } as User);
        } else {
          // If user exists in auth but not firestore, create the document.
          // This can happen with social logins or if the doc was deleted.
          const { email, uid, displayName } = firebaseUser;
          const userPayload = {
            uid,
            email,
            displayName: displayName || '',
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            role: 'customer',
          };
          await setDoc(userDocRef, userPayload);
          setUser({ ...firebaseUser, ...userPayload } as User);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    try {
<<<<<<< HEAD
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user && displayName) {
        await updateProfile(user, { displayName });
      }
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          displayName: displayName || "",
          email: user.email,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
=======
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      if (displayName) {
        await updateProfile(firebaseUser, { displayName });
>>>>>>> 2fca900 (database connecten)
      }

      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userPayload = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: displayName || firebaseUser.displayName || '',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        role: 'customer',
      };
      await setDoc(userDocRef, userPayload);

      setUser({ ...firebaseUser, ...userPayload } as User);

      return { error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userDocRef, {
        lastLogin: serverTimestamp(),
      });

      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUser({ ...firebaseUser, ...userDoc.data() } as User);
      } else {
         // This case should ideally not happen if signUp is correct and robust
         setUser(firebaseUser as User);
      }

      return { error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      return { error: null };
    } catch (error) {
      console.error("Sign out error:", error);
      return { error };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
