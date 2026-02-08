// ============================================================================
// GRATIS.NGO — File Management API Routes
// ============================================================================

import { StoredFile, FileQuota } from '@/types/file-management';

// Mock data for demonstration
const mockQuota: FileQuota = {
  used: 1024 * 1024 * 250, // 250MB
  limit: 1024 * 1024 * 1024 * 5, // 5GB
  fileCount: 45,
  fileCountLimit: 1000,
  usedFormatted: '250 MB',
  limitFormatted: '5 GB',
  percentUsed: 5,
};

const mockFiles: StoredFile[] = [
  {
    id: 'file_1',
    name: 'annual_report_2024.pdf',
    originalName: 'Annual Report 2024.pdf',
    mimeType: 'application/pdf',
    size: 5242880, // 5MB
    extension: 'pdf',
    bucket: 'gratis-uploads',
    path: '/uploads/user123/annual_report_2024.pdf',
    url: 'https://storage.example.com/annual_report_2024.pdf',
    uploadedBy: {
      id: 'user123',
      name: 'Admin User',
      email: 'admin@gratis.ngo',
    },
    folder: 'documents',
    tags: ['annual', 'report', '2024'],
    description: 'Annual organization report for 2024',
    metadata: {
      pages: 45,
      checksum: 'abc123def456',
      virusScanStatus: 'clean',
      virusScannedAt: new Date().toISOString(),
    },
    access: {
      visibility: 'private',
      allowedRoles: ['admin', 'staff'],
    },
    versions: [],
    status: 'ready',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'file_2',
    name: 'event_photo_001.jpg',
    originalName: 'Event Photo 001.jpg',
    mimeType: 'image/jpeg',
    size: 2097152, // 2MB
    extension: 'jpg',
    bucket: 'gratis-uploads',
    path: '/uploads/user123/event_photo_001.jpg',
    url: 'https://storage.example.com/event_photo_001.jpg',
    thumbnailUrl: 'https://storage.example.com/event_photo_001_thumb.jpg',
    uploadedBy: {
      id: 'user123',
      name: 'Admin User',
      email: 'admin@gratis.ngo',
    },
    folder: 'photos',
    tags: ['event', '2024', 'community'],
    metadata: {
      width: 1920,
      height: 1080,
      checksum: 'xyz789abc123',
      virusScanStatus: 'clean',
      virusScannedAt: new Date().toISOString(),
    },
    access: {
      visibility: 'public',
    },
    versions: [],
    status: 'ready',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

// GET /api/files — List files or get single file
export async function GET(req: Request) {
  const url = new URL(req.url);
  const fileId = url.searchParams.get('id');
  const action = url.searchParams.get('action');
  const userId = url.searchParams.get('userId') || '';

  if (fileId) {
    const file = mockFiles.find(f => f.id === fileId);
    if (!file) return Response.json({ error: 'File not found' }, { status: 404 });
    return Response.json({ file });
  }

  if (action === 'quota') {
    if (!userId) return Response.json({ error: 'userId required' }, { status: 400 });
    return Response.json({ quota: mockQuota });
  }

  if (action === 'folders') {
    if (!userId) return Response.json({ error: 'userId required' }, { status: 400 });
    const folders = [
      { name: 'documents', path: 'documents', fileCount: 15, totalSize: 78643200, children: [], updatedAt: new Date().toISOString() },
      { name: 'photos', path: 'photos', fileCount: 30, totalSize: 62914560, children: [], updatedAt: new Date().toISOString() },
    ];
    return Response.json({ folders });
  }

  return Response.json({ files: mockFiles, total: mockFiles.length });
}

// POST /api/files/upload — Upload new file
export async function POST(req: Request) {
  // Mock upload response
  const mockUploadedFile: StoredFile = {
    id: `file_${Date.now()}`,
    name: 'new_file.pdf',
    originalName: 'New File.pdf',
    mimeType: 'application/pdf',
    size: 1048576,
    extension: 'pdf',
    bucket: 'gratis-uploads',
    path: '/uploads/user123/new_file.pdf',
    url: 'https://storage.example.com/new_file.pdf',
    uploadedBy: {
      id: 'user123',
      name: 'Admin User',
      email: 'admin@gratis.ngo',
    },
    metadata: {
      checksum: 'new123abc456',
      virusScanStatus: 'pending',
    },
    access: {
      visibility: 'private',
    },
    versions: [],
    status: 'ready',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return Response.json({ success: true, file: mockUploadedFile });
}

// DELETE /api/files — Delete a file
export async function DELETE(req: Request) {
  const body = await req.json();
  const { fileId } = body;

  if (!fileId) return Response.json({ error: 'fileId required' }, { status: 400 });

  return Response.json({ success: true, fileId });
}
