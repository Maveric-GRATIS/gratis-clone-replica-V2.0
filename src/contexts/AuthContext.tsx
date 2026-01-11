import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "@/firebase";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
  DocumentData,
} from "firebase/firestore";

// Define a more detailed user type
export interface User extends FirebaseUser {
  role?: string;
  // you can add any other custom properties from your Firestore user document here
}

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
      try {
        if (firebaseUser) {
          try {
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const userData = userDoc.data() as DocumentData;
              setUser({ ...firebaseUser, ...userData } as User);
            } else {
              // If user exists in auth but not firestore, create the document.
              const { email, uid, displayName } = firebaseUser;
              const userPayload = {
                uid,
                email,
                displayName: displayName || "",
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                role: "customer",
              };
              await setDoc(userDocRef, userPayload);
              setUser({ ...firebaseUser, ...userPayload } as User);
            }
          } catch (firestoreError) {
            // If Firestore is not enabled or fails, just use Firebase Auth user
            console.warn(
              "Firestore not available, using auth user only:",
              firestoreError
            );
            setUser(firebaseUser as User);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      if (displayName) {
        await updateProfile(firebaseUser, { displayName });
      }

      // Try to create Firestore document, but don't fail if it doesn't work
      try {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userPayload = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: displayName || firebaseUser.displayName || "",
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          role: "customer",
        };
        await setDoc(userDocRef, userPayload);
        setUser({ ...firebaseUser, ...userPayload } as User);
      } catch (firestoreError) {
        console.warn(
          "Firestore creation failed, using auth user only:",
          firestoreError
        );
        setUser(firebaseUser as User);
      }

      return { error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Try to update Firestore, but don't fail if it doesn't work
      try {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        await updateDoc(userDocRef, {
          lastLogin: serverTimestamp(),
        });

        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser({ ...firebaseUser, ...userDoc.data() } as User);
        } else {
          setUser(firebaseUser as User);
        }
      } catch (firestoreError) {
        // If Firestore fails, just use Firebase Auth user
        console.warn(
          "Firestore update failed, using auth user only:",
          firestoreError
        );
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
