/**
 * Firebase Admin Helper Functions
 * Based on GRATIS Part 1 specifications
 * For use in Firebase Functions only
 */

import * as admin from 'firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

// Initialize admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();
const messaging = admin.messaging();

// ==================== USER MANAGEMENT ====================

export async function createUser(email: string, password: string, displayName?: string) {
  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
      emailVerified: false,
    });
    return userRecord;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    return await auth.getUserByEmail(email);
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

export async function getUserById(uid: string) {
  try {
    return await auth.getUser(uid);
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

export async function updateUser(
  uid: string,
  properties: {
    email?: string;
    displayName?: string;
    photoURL?: string;
    disabled?: boolean;
    emailVerified?: boolean;
  }
) {
  try {
    return await auth.updateUser(uid, properties);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function deleteUser(uid: string) {
  try {
    await auth.deleteUser(uid);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

export async function setCustomClaims(uid: string, claims: Record<string, unknown>) {
  try {
    await auth.setCustomUserClaims(uid, claims);
  } catch (error) {
    console.error('Error setting custom claims:', error);
    throw error;
  }
}

export async function verifyIdToken(idToken: string) {
  try {
    return await auth.verifyIdToken(idToken);
  } catch (error) {
    console.error('Error verifying ID token:', error);
    throw error;
  }
}

export async function createCustomToken(uid: string, claims?: Record<string, unknown>) {
  try {
    return await auth.createCustomToken(uid, claims);
  } catch (error) {
    console.error('Error creating custom token:', error);
    throw error;
  }
}

// ==================== FIRESTORE HELPERS ====================

export async function getDocument<T>(collection: string, docId: string): Promise<T | null> {
  try {
    const doc = await db.collection(collection).doc(docId).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() } as T;
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
}

export async function getCollection<T>(
  collection: string,
  filters?: { field: string; operator: FirebaseFirestore.WhereFilterOp; value: unknown }[],
  orderByField?: string,
  limitCount?: number
): Promise<T[]> {
  try {
    let query: FirebaseFirestore.Query = db.collection(collection);

    if (filters) {
      filters.forEach(({ field, operator, value }) => {
        query = query.where(field, operator, value);
      });
    }

    if (orderByField) {
      query = query.orderBy(orderByField);
    }

    if (limitCount) {
      query = query.limit(limitCount);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
  } catch (error) {
    console.error('Error getting collection:', error);
    throw error;
  }
}

export async function createDocument<T extends Record<string, unknown>>(
  collection: string,
  data: T,
  docId?: string
): Promise<string> {
  try {
    const timestamp = FieldValue.serverTimestamp();
    const docData = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    if (docId) {
      await db.collection(collection).doc(docId).set(docData);
      return docId;
    } else {
      const docRef = await db.collection(collection).add(docData);
      return docRef.id;
    }
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
}

export async function updateDocument<T extends Record<string, unknown>>(
  collection: string,
  docId: string,
  data: Partial<T>
): Promise<void> {
  try {
    await db
      .collection(collection)
      .doc(docId)
      .update({
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
}

export async function deleteDocument(collection: string, docId: string): Promise<void> {
  try {
    await db.collection(collection).doc(docId).delete();
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}

export async function batchWrite(
  operations: {
    type: 'set' | 'update' | 'delete';
    collection: string;
    docId: string;
    data?: Record<string, unknown>;
  }[]
): Promise<void> {
  try {
    const batch = db.batch();

    operations.forEach(({ type, collection, docId, data }) => {
      const docRef = db.collection(collection).doc(docId);

      if (type === 'set' && data) {
        batch.set(docRef, data);
      } else if (type === 'update' && data) {
        batch.update(docRef, data);
      } else if (type === 'delete') {
        batch.delete(docRef);
      }
    });

    await batch.commit();
  } catch (error) {
    console.error('Error in batch write:', error);
    throw error;
  }
}

// ==================== PUSH NOTIFICATIONS ====================

export async function sendPushNotification(options: {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}) {
  try {
    return await messaging.send({
      token: options.token,
      notification: {
        title: options.title,
        body: options.body,
        imageUrl: options.imageUrl,
      },
      data: options.data,
      webpush: {
        fcmOptions: {
          link: options.data?.link,
        },
      },
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
}

export async function sendMulticastNotification(options: {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
}) {
  try {
    return await messaging.sendEachForMulticast({
      tokens: options.tokens,
      notification: {
        title: options.title,
        body: options.body,
      },
      data: options.data,
    });
  } catch (error) {
    console.error('Error sending multicast notification:', error);
    throw error;
  }
}

export async function subscribeToTopic(tokens: string[], topic: string) {
  try {
    return await messaging.subscribeToTopic(tokens, topic);
  } catch (error) {
    console.error('Error subscribing to topic:', error);
    throw error;
  }
}

export async function unsubscribeFromTopic(tokens: string[], topic: string) {
  try {
    return await messaging.unsubscribeFromTopic(tokens, topic);
  } catch (error) {
    console.error('Error unsubscribing from topic:', error);
    throw error;
  }
}

export async function sendToTopic(options: {
  topic: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}) {
  try {
    return await messaging.send({
      topic: options.topic,
      notification: {
        title: options.title,
        body: options.body,
      },
      data: options.data,
    });
  } catch (error) {
    console.error('Error sending to topic:', error);
    throw error;
  }
}

// ==================== STORAGE HELPERS ====================

export async function uploadFileFromBuffer(
  buffer: Buffer,
  destination: string,
  metadata?: { contentType?: string; metadata?: Record<string, string> }
): Promise<string> {
  try {
    const bucket = storage.bucket();
    const file = bucket.file(destination);

    await file.save(buffer, {
      metadata: metadata,
      public: false,
    });

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    return url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function deleteFile(path: string): Promise<void> {
  try {
    const bucket = storage.bucket();
    await bucket.file(path).delete();
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

// ==================== EXPORTS ====================

export { admin, db, auth, storage, messaging, FieldValue, Timestamp };
