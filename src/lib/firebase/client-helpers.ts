/**
 * Firebase Client Helper Functions
 * Based on GRATIS Part 1 specifications
 */

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
  startAfter,
  endBefore,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  writeBatch,
  runTransaction,
  DocumentReference,
  CollectionReference,
  Query,
  QueryConstraint,
  DocumentData,
  QuerySnapshot,
  Unsubscribe,
} from 'firebase/firestore';
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
  User,
  UserCredential,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTask,
} from 'firebase/storage';
import { auth, db, storage } from '@/firebase';

// ==================== AUTH PROVIDERS ====================

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');

export const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

// ==================== AUTH FUNCTIONS ====================

export async function signInWithGoogle(): Promise<UserCredential> {
  return signInWithPopup(auth, googleProvider);
}

export async function signInWithFacebook(): Promise<UserCredential> {
  return signInWithPopup(auth, facebookProvider);
}

export async function signInWithApple(): Promise<UserCredential> {
  return signInWithPopup(auth, appleProvider);
}

export async function signInWithEmail(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpWithEmail(email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signOut(): Promise<void> {
  return firebaseSignOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email);
}

export async function verifyEmail(user: User): Promise<void> {
  return sendEmailVerification(user);
}

export function subscribeToAuthState(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

// ==================== FIRESTORE HELPER FUNCTIONS ====================

export function getCollection(collectionPath: string): CollectionReference<DocumentData> {
  return collection(db, collectionPath);
}

export function getDocument(collectionPath: string, docId: string): DocumentReference<DocumentData> {
  return doc(db, collectionPath, docId);
}

export async function fetchDocument<T>(collectionPath: string, docId: string): Promise<T | null> {
  const docRef = getDocument(collectionPath, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
}

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

export async function deleteDocument(collectionPath: string, docId: string): Promise<void> {
  const docRef = getDocument(collectionPath, docId);
  await deleteDoc(docRef);
}

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

// ==================== STORAGE HELPER FUNCTIONS ====================

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

export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

// ==================== BATCH OPERATIONS ====================

export async function batchWrite(operations: {
  type: 'set' | 'update' | 'delete';
  path: string;
  docId: string;
  data?: DocumentData;
}[]): Promise<void> {
  const batch = writeBatch(db);

  operations.forEach(({ type, path, docId, data }) => {
    const docRef = doc(db, path, docId);

    if (type === 'set' && data) {
      batch.set(docRef, data);
    } else if (type === 'update' && data) {
      batch.update(docRef, data);
    } else if (type === 'delete') {
      batch.delete(docRef);
    }
  });

  await batch.commit();
}

// ==================== EXPORTS ====================

export {
  // Firestore utilities
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
  startAfter,
  endBefore,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  writeBatch,
  runTransaction,
};
