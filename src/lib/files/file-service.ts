// ============================================================================
// GRATIS.NGO — File Management Service (Firebase Storage + Firestore)
// ============================================================================

import { db, storage } from '@/firebase';
import {
  ref, uploadBytesResumable, getDownloadURL, deleteObject,
  getMetadata as getStorageMetadata,
} from 'firebase/storage';
import {
  doc, setDoc, getDoc, updateDoc, deleteDoc, collection,
  query, where, getDocs, increment,
} from 'firebase/firestore';
import {
  StoredFile, FileMetadata, FileUploadParams, FileUploadProgress,
  FileQuota, FolderStructure, FileVersion,
  ALLOWED_FILE_TYPES, MAX_FILE_SIZES,
} from '@/types/file-management';

const FILES_COL = 'files';
const QUOTAS_COL = 'file_quotas';

// ── Helpers ──────────────────────────────────────────────────────────────────

function getFileCategory(mimeType: string): string {
  for (const [category, types] of Object.entries(ALLOWED_FILE_TYPES)) {
    if (types.includes(mimeType)) return category;
  }
  return 'default';
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function generateFileId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 255)
    .toLowerCase();
}

// ── Validation ───────────────────────────────────────────────────────────────

export function validateFile(file: File): { valid: boolean; error?: string } {
  const category = getFileCategory(file.type);
  const allAllowed = Object.values(ALLOWED_FILE_TYPES).flat();

  if (!allAllowed.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} is not allowed.` };
  }

  const maxSize = MAX_FILE_SIZES[category] || MAX_FILE_SIZES.default;
  if (file.size > maxSize) {
    return { valid: false, error: `File too large. Max size: ${formatBytes(maxSize)}.` };
  }

  return { valid: true };
}

// ── Upload ───────────────────────────────────────────────────────────────────

export async function uploadFile(
  params: FileUploadParams,
  userId: string,
  userName: string,
  userEmail: string,
  onProgress?: (progress: FileUploadProgress) => void
): Promise<StoredFile> {
  const { file, folder, tags, description, visibility } = params;

  // Validate
  const validation = validateFile(file);
  if (!validation.valid) throw new Error(validation.error);

  // Check quota
  const quota = await getQuota(userId);
  if (quota.used + file.size > quota.limit) {
    throw new Error(`Storage quota exceeded. Used: ${quota.usedFormatted} / ${quota.limitFormatted}`);
  }

  const fileId = generateFileId();
  const ext = file.name.split('.').pop() || '';
  const safeName = sanitizeFileName(file.name);
  const storagePath = folder
    ? `uploads/${userId}/${folder}/${fileId}_${safeName}`
    : `uploads/${userId}/${fileId}_${safeName}`;

  // Compute checksum (simplified - in production use crypto)
  const checksum = `sha256_${Date.now()}`;

  // Upload to Firebase Storage
  const storageRef = ref(storage, storagePath);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percentage = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        if (onProgress) {
          onProgress({
            fileId,
            fileName: file.name,
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            percentage,
            status: 'uploading',
          });
        }
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);

          const storedFile: StoredFile = {
            id: fileId,
            name: safeName,
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            extension: ext,
            bucket: 'default',
            path: storagePath,
            url,
            uploadedBy: {
              id: userId,
              name: userName,
              email: userEmail,
            },
            folder,
            tags,
            description,
            metadata: {
              checksum,
              virusScanStatus: 'pending',
            },
            access: {
              visibility: visibility || 'private',
            },
            versions: [],
            status: 'ready',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Save to Firestore
          await setDoc(doc(db, FILES_COL, fileId), storedFile);

          // Update quota
          await updateQuota(userId, file.size, 1);

          if (onProgress) {
            onProgress({
              fileId,
              fileName: file.name,
              bytesTransferred: file.size,
              totalBytes: file.size,
              percentage: 100,
              status: 'complete',
            });
          }

          resolve(storedFile);
        } catch (error: any) {
          reject(error);
        }
      }
    );
  });
}

// ── Read / Query ─────────────────────────────────────────────────────────────

export async function getFile(fileId: string): Promise<StoredFile | null> {
  const snap = await getDoc(doc(db, FILES_COL, fileId));
  return snap.exists() ? (snap.data() as StoredFile) : null;
}

export async function listFiles(params: {
  userId?: string;
  folder?: string;
  mimeType?: string;
  tags?: string[];
  status?: string;
  limit?: number;
}): Promise<StoredFile[]> {
  let q = query(collection(db, FILES_COL), where('status', '!=', 'deleted'));

  if (params.userId) {
    q = query(q, where('uploadedBy.id', '==', params.userId));
  }
  if (params.folder) {
    q = query(q, where('folder', '==', params.folder));
  }

  const snap = await getDocs(q);
  let results = snap.docs.map((d) => d.data() as StoredFile);

  if (params.mimeType) {
    results = results.filter((f) => f.mimeType.startsWith(params.mimeType!));
  }
  if (params.tags?.length) {
    results = results.filter((f) => params.tags!.some((t) => f.tags?.includes(t)));
  }

  results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return results.slice(0, params.limit || 100);
}

// ── Delete ───────────────────────────────────────────────────────────────────

export async function deleteFile(fileId: string, hardDelete = false): Promise<void> {
  const file = await getFile(fileId);
  if (!file) throw new Error('File not found');

  if (hardDelete) {
    // Delete from storage
    try {
      const storageRef = ref(storage, file.path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting from storage:', error);
    }

    // Delete versions
    for (const version of file.versions) {
      try {
        const versionRef = ref(storage, version.path);
        await deleteObject(versionRef);
      } catch (error) {
        console.error('Error deleting version:', error);
      }
    }

    // Delete from Firestore
    await deleteDoc(doc(db, FILES_COL, fileId));
  } else {
    // Soft delete
    await updateDoc(doc(db, FILES_COL, fileId), {
      status: 'deleted',
      deletedAt: new Date().toISOString(),
    });
  }

  // Update quota
  await updateQuota(file.uploadedBy.id, -file.size, -1);
}

// ── Quota Management ─────────────────────────────────────────────────────────

const DEFAULT_QUOTA_LIMIT = 5 * 1024 * 1024 * 1024; // 5GB
const DEFAULT_FILE_COUNT_LIMIT = 10_000;

export async function getQuota(userId: string): Promise<FileQuota> {
  const snap = await getDoc(doc(db, QUOTAS_COL, userId));
  if (snap.exists()) {
    const data = snap.data();
    return {
      used: data.used || 0,
      limit: data.limit || DEFAULT_QUOTA_LIMIT,
      fileCount: data.fileCount || 0,
      fileCountLimit: data.fileCountLimit || DEFAULT_FILE_COUNT_LIMIT,
      usedFormatted: formatBytes(data.used || 0),
      limitFormatted: formatBytes(data.limit || DEFAULT_QUOTA_LIMIT),
      percentUsed: Math.round(((data.used || 0) / (data.limit || DEFAULT_QUOTA_LIMIT)) * 100),
    };
  }

  // Initialize quota
  const quota = {
    used: 0,
    limit: DEFAULT_QUOTA_LIMIT,
    fileCount: 0,
    fileCountLimit: DEFAULT_FILE_COUNT_LIMIT,
  };
  await setDoc(doc(db, QUOTAS_COL, userId), quota);

  return {
    ...quota,
    usedFormatted: formatBytes(0),
    limitFormatted: formatBytes(DEFAULT_QUOTA_LIMIT),
    percentUsed: 0,
  };
}

async function updateQuota(userId: string, sizeChange: number, countChange: number): Promise<void> {
  const docRef = doc(db, QUOTAS_COL, userId);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    await updateDoc(docRef, {
      used: increment(sizeChange),
      fileCount: increment(countChange),
    });
  } else {
    await setDoc(docRef, {
      used: Math.max(0, sizeChange),
      limit: DEFAULT_QUOTA_LIMIT,
      fileCount: Math.max(0, countChange),
      fileCountLimit: DEFAULT_FILE_COUNT_LIMIT,
    });
  }
}

// ── Folder Structure ─────────────────────────────────────────────────────────

export async function getFolderStructure(userId: string): Promise<FolderStructure[]> {
  const files = await listFiles({ userId, limit: 10_000 });
  const folderMap = new Map<string, { fileCount: number; totalSize: number; updatedAt: string }>();

  for (const file of files) {
    const folder = file.folder || '(root)';
    const existing = folderMap.get(folder) || { fileCount: 0, totalSize: 0, updatedAt: file.updatedAt };
    existing.fileCount += 1;
    existing.totalSize += file.size;
    if (file.updatedAt > existing.updatedAt) existing.updatedAt = file.updatedAt;
    folderMap.set(folder, existing);
  }

  return Array.from(folderMap.entries()).map(([name, data]) => ({
    name,
    path: name,
    fileCount: data.fileCount,
    totalSize: data.totalSize,
    children: [],
    updatedAt: data.updatedAt,
  }));
}
