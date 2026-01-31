/**
 * Firebase helper functions for the GRATIS platform
 * Provides convenient wrappers for common Firebase operations
 */

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  User,
  UserCredential,
  Unsubscribe,
} from 'firebase/auth';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  DocumentReference,
  CollectionReference,
  Query,
  QueryConstraint,
  DocumentData,
  Timestamp,
} from 'firebase/firestore';

import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTask,
} from 'firebase/storage';

import {
  logEvent,
  setUserId,
  setUserProperties,
} from 'firebase/analytics';

import { auth, db, storage, analytics } from '../firebase';

// ============================================================================
// AUTH HELPERS
// ============================================================================

// Auth providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');

export const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<UserCredential> {
  return signInWithPopup(auth, googleProvider);
}

/**
 * Sign in with Facebook
 */
export async function signInWithFacebook(): Promise<UserCredential> {
  return signInWithPopup(auth, facebookProvider);
}

/**
 * Sign in with Apple
 */
export async function signInWithApple(): Promise<UserCredential> {
  return signInWithPopup(auth, appleProvider);
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  return firebaseSignOut(auth);
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email);
}

/**
 * Send email verification to user
 */
export async function verifyEmail(user: User): Promise<void> {
  return sendEmailVerification(user);
}

/**
 * Subscribe to auth state changes
 */
export function subscribeToAuthState(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

// ============================================================================
// FIRESTORE HELPERS
// ============================================================================

/**
 * Get collection reference
 */
export function getCollection(collectionPath: string): CollectionReference<DocumentData> {
  return collection(db, collectionPath);
}

/**
 * Get document reference
 */
export function getDocument(collectionPath: string, docId: string): DocumentReference<DocumentData> {
  return doc(db, collectionPath, docId);
}

/**
 * Fetch a single document
 */
export async function fetchDocument<T>(collectionPath: string, docId: string): Promise<T | null> {
  const docRef = getDocument(collectionPath, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
}

/**
 * Fetch collection with optional query constraints
 */
export async function fetchCollection<T>(
  collectionPath: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const collectionRef = getCollection(collectionPath);
  const q = query(collectionRef, ...constraints);
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
}

/**
 * Create a new document
 */
export async function createDocument<T extends DocumentData>(
  collectionPath: string,
  data: T,
  docId?: string
): Promise<string> {
  if (docId) {
    const docRef = doc(db, collectionPath, docId);
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docId;
  } else {
    const collectionRef = collection(db, collectionPath);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }
}

/**
 * Update an existing document
 */
export async function updateDocument<T extends Partial<DocumentData>>(
  collectionPath: string,
  docId: string,
  data: T
): Promise<void> {
  const docRef = getDocument(collectionPath, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a document
 */
export async function deleteDocument(collectionPath: string, docId: string): Promise<void> {
  const docRef = getDocument(collectionPath, docId);
  await deleteDoc(docRef);
}

/**
 * Subscribe to real-time document updates
 */
export function subscribeToDocument<T>(
  collectionPath: string,
  docId: string,
  callback: (data: T | null) => void
): Unsubscribe {
  const docRef = getDocument(collectionPath, docId);

  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as T);
    } else {
      callback(null);
    }
  });
}

/**
 * Subscribe to real-time collection updates
 */
export function subscribeToCollection<T>(
  collectionPath: string,
  constraints: QueryConstraint[],
  callback: (data: T[]) => void
): Unsubscribe {
  const collectionRef = getCollection(collectionPath);
  const q = query(collectionRef, ...constraints);

  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
    callback(data);
  });
}

// ============================================================================
// STORAGE HELPERS
// ============================================================================

/**
 * Upload file to Firebase Storage
 * @param path - Storage path for the file
 * @param file - File to upload
 * @param onProgress - Optional progress callback (0-100)
 * @returns Download URL of uploaded file
 */
export async function uploadFile(
  path: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const storageRef = ref(storage, path);

  if (onProgress) {
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } else {
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }
}

/**
 * Delete file from Firebase Storage
 */
export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

// ============================================================================
// ANALYTICS HELPERS
// ============================================================================

/**
 * Track custom event
 */
export function trackEvent(eventName: string, params?: Record<string, any>): void {
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
}

/**
 * Set user ID for analytics
 */
export function setAnalyticsUserId(userId: string): void {
  if (analytics) {
    setUserId(analytics, userId);
  }
}

/**
 * Set user properties for analytics
 */
export function setAnalyticsUserProperties(properties: Record<string, any>): void {
  if (analytics) {
    setUserProperties(analytics, properties);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

// Export Firestore utilities
export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  serverTimestamp,
};

// Export types
export type {
  User,
  UserCredential,
  Unsubscribe,
  DocumentReference,
  CollectionReference,
  Query,
  QueryConstraint,
  DocumentData,
  UploadTask,
};
