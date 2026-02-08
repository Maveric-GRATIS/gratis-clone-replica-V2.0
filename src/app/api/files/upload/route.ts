// ============================================================================
// GRATIS.NGO — File Upload API Route (Server-Side)
// ============================================================================

import { db, storage } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, updateDoc, increment } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const userId = formData.get('userId') as string;
    const userName = formData.get('userName') as string;
    const userEmail = formData.get('userEmail') as string;
    const folder = formData.get('folder') as string | null;
    const tagsStr = formData.get('tags') as string | null;
    const description = formData.get('description') as string | null;
    const visibility = (formData.get('visibility') as string) || 'private';

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate size (50MB max for this endpoint)
    if (file.size > 50 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'File too large. Max: 50MB' }), {
        status: 413,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const fileId = `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const ext = file.name.split('.').pop() || '';
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
    const storagePath = folder
      ? `uploads/${userId}/${folder}/${fileId}_${safeName}`
      : `uploads/${userId}/${fileId}_${safeName}`;

    const buffer = await file.arrayBuffer();
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, buffer, { contentType: file.type });
    const url = await getDownloadURL(storageRef);

    const storedFile = {
      id: fileId,
      name: safeName,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      extension: ext,
      bucket: 'default',
      path: storagePath,
      url,
      uploadedBy: { id: userId, name: userName, email: userEmail },
      folder: folder || undefined,
      tags: tagsStr ? tagsStr.split(',').map((t) => t.trim()) : [],
      description: description || undefined,
      metadata: { virusScanStatus: 'pending' },
      access: { visibility },
      versions: [{
        versionId: `v1_${fileId}`,
        size: file.size,
        path: storagePath,
        url,
        uploadedBy: userId,
        createdAt: new Date().toISOString(),
      }],
      status: 'ready',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'files', fileId), storedFile);

    // Update quota
    const quotaRef = doc(db, 'file_quotas', userId);
    await updateDoc(quotaRef, {
      used: increment(file.size),
      fileCount: increment(1),
    }).catch(async () => {
      // Initialize quota if it doesn't exist
      await setDoc(quotaRef, { used: file.size, fileCount: 1, limit: 5 * 1024 * 1024 * 1024 });
    });

    return new Response(JSON.stringify({ success: true, file: storedFile }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
