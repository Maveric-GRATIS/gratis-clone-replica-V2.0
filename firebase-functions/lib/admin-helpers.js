"use strict";
/**
 * Firebase Admin Helper Functions
 * Based on GRATIS Part 1 specifications
 * For use in Firebase Functions only
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timestamp = exports.FieldValue = exports.messaging = exports.storage = exports.auth = exports.db = exports.admin = void 0;
exports.createUser = createUser;
exports.getUserByEmail = getUserByEmail;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.setCustomClaims = setCustomClaims;
exports.verifyIdToken = verifyIdToken;
exports.createCustomToken = createCustomToken;
exports.getDocument = getDocument;
exports.getCollection = getCollection;
exports.createDocument = createDocument;
exports.updateDocument = updateDocument;
exports.deleteDocument = deleteDocument;
exports.batchWrite = batchWrite;
exports.sendPushNotification = sendPushNotification;
exports.sendMulticastNotification = sendMulticastNotification;
exports.subscribeToTopic = subscribeToTopic;
exports.unsubscribeFromTopic = unsubscribeFromTopic;
exports.sendToTopic = sendToTopic;
exports.uploadFileFromBuffer = uploadFileFromBuffer;
exports.deleteFile = deleteFile;
const admin = __importStar(require("firebase-admin"));
exports.admin = admin;
const firestore_1 = require("firebase-admin/firestore");
Object.defineProperty(exports, "FieldValue", { enumerable: true, get: function () { return firestore_1.FieldValue; } });
Object.defineProperty(exports, "Timestamp", { enumerable: true, get: function () { return firestore_1.Timestamp; } });
// Initialize admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
exports.db = db;
const auth = admin.auth();
exports.auth = auth;
const storage = admin.storage();
exports.storage = storage;
const messaging = admin.messaging();
exports.messaging = messaging;
// ==================== USER MANAGEMENT ====================
async function createUser(email, password, displayName) {
    try {
        const userRecord = await auth.createUser({
            email,
            password,
            displayName,
            emailVerified: false,
        });
        return userRecord;
    }
    catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}
async function getUserByEmail(email) {
    try {
        return await auth.getUserByEmail(email);
    }
    catch (error) {
        console.error('Error getting user by email:', error);
        return null;
    }
}
async function getUserById(uid) {
    try {
        return await auth.getUser(uid);
    }
    catch (error) {
        console.error('Error getting user by ID:', error);
        return null;
    }
}
async function updateUser(uid, properties) {
    try {
        return await auth.updateUser(uid, properties);
    }
    catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}
async function deleteUser(uid) {
    try {
        await auth.deleteUser(uid);
    }
    catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}
async function setCustomClaims(uid, claims) {
    try {
        await auth.setCustomUserClaims(uid, claims);
    }
    catch (error) {
        console.error('Error setting custom claims:', error);
        throw error;
    }
}
async function verifyIdToken(idToken) {
    try {
        return await auth.verifyIdToken(idToken);
    }
    catch (error) {
        console.error('Error verifying ID token:', error);
        throw error;
    }
}
async function createCustomToken(uid, claims) {
    try {
        return await auth.createCustomToken(uid, claims);
    }
    catch (error) {
        console.error('Error creating custom token:', error);
        throw error;
    }
}
// ==================== FIRESTORE HELPERS ====================
async function getDocument(collection, docId) {
    try {
        const doc = await db.collection(collection).doc(docId).get();
        if (!doc.exists) {
            return null;
        }
        return Object.assign({ id: doc.id }, doc.data());
    }
    catch (error) {
        console.error('Error getting document:', error);
        throw error;
    }
}
async function getCollection(collection, filters, orderByField, limitCount) {
    try {
        let query = db.collection(collection);
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
        return snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
    }
    catch (error) {
        console.error('Error getting collection:', error);
        throw error;
    }
}
async function createDocument(collection, data, docId) {
    try {
        const timestamp = firestore_1.FieldValue.serverTimestamp();
        const docData = Object.assign(Object.assign({}, data), { createdAt: timestamp, updatedAt: timestamp });
        if (docId) {
            await db.collection(collection).doc(docId).set(docData);
            return docId;
        }
        else {
            const docRef = await db.collection(collection).add(docData);
            return docRef.id;
        }
    }
    catch (error) {
        console.error('Error creating document:', error);
        throw error;
    }
}
async function updateDocument(collection, docId, data) {
    try {
        await db
            .collection(collection)
            .doc(docId)
            .update(Object.assign(Object.assign({}, data), { updatedAt: firestore_1.FieldValue.serverTimestamp() }));
    }
    catch (error) {
        console.error('Error updating document:', error);
        throw error;
    }
}
async function deleteDocument(collection, docId) {
    try {
        await db.collection(collection).doc(docId).delete();
    }
    catch (error) {
        console.error('Error deleting document:', error);
        throw error;
    }
}
async function batchWrite(operations) {
    try {
        const batch = db.batch();
        operations.forEach(({ type, collection, docId, data }) => {
            const docRef = db.collection(collection).doc(docId);
            if (type === 'set' && data) {
                batch.set(docRef, data);
            }
            else if (type === 'update' && data) {
                batch.update(docRef, data);
            }
            else if (type === 'delete') {
                batch.delete(docRef);
            }
        });
        await batch.commit();
    }
    catch (error) {
        console.error('Error in batch write:', error);
        throw error;
    }
}
// ==================== PUSH NOTIFICATIONS ====================
async function sendPushNotification(options) {
    var _a;
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
                    link: (_a = options.data) === null || _a === void 0 ? void 0 : _a.link,
                },
            },
        });
    }
    catch (error) {
        console.error('Error sending push notification:', error);
        throw error;
    }
}
async function sendMulticastNotification(options) {
    try {
        return await messaging.sendEachForMulticast({
            tokens: options.tokens,
            notification: {
                title: options.title,
                body: options.body,
            },
            data: options.data,
        });
    }
    catch (error) {
        console.error('Error sending multicast notification:', error);
        throw error;
    }
}
async function subscribeToTopic(tokens, topic) {
    try {
        return await messaging.subscribeToTopic(tokens, topic);
    }
    catch (error) {
        console.error('Error subscribing to topic:', error);
        throw error;
    }
}
async function unsubscribeFromTopic(tokens, topic) {
    try {
        return await messaging.unsubscribeFromTopic(tokens, topic);
    }
    catch (error) {
        console.error('Error unsubscribing from topic:', error);
        throw error;
    }
}
async function sendToTopic(options) {
    try {
        return await messaging.send({
            topic: options.topic,
            notification: {
                title: options.title,
                body: options.body,
            },
            data: options.data,
        });
    }
    catch (error) {
        console.error('Error sending to topic:', error);
        throw error;
    }
}
// ==================== STORAGE HELPERS ====================
async function uploadFileFromBuffer(buffer, destination, metadata) {
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
    }
    catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}
async function deleteFile(path) {
    try {
        const bucket = storage.bucket();
        await bucket.file(path).delete();
    }
    catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
}
//# sourceMappingURL=admin-helpers.js.map