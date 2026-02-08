// ============================================================================
// GRATIS.NGO — Data Import API Routes
// ============================================================================

import { ImportJob, ImportPreview, ImportEntityType, ENTITY_FIELDS } from '@/types/data-import';

// Mock import jobs
const mockJobs: ImportJob[] = [
  {
    id: 'imp_001',
    entityType: 'contacts',
    format: 'csv',
    fileName: 'contacts_export.csv',
    fileSize: 524288,
    mappings: [
      { sourceColumn: 'Email', targetField: 'email', required: true },
      { sourceColumn: 'First Name', targetField: 'firstName', required: false },
      { sourceColumn: 'Last Name', targetField: 'lastName', required: false },
    ],
    options: {
      duplicateHandling: 'skip',
      duplicateField: 'email',
      batchSize: 50,
      dryRun: false,
      sendNotifications: true,
      skipEmptyRows: true,
      headerRow: 0,
    },
    status: 'completed',
    progress: {
      totalRows: 150,
      processedRows: 150,
      successCount: 145,
      errorCount: 5,
      skippedCount: 0,
      updatedCount: 0,
      percentage: 100,
      currentBatch: 3,
      totalBatches: 3,
    },
    results: {
      created: 145,
      updated: 0,
      skipped: 0,
      failed: 5,
      total: 150,
      duration: 5432,
      createdIds: [],
      updatedIds: [],
    },
    errors: [
      { row: 23, column: 'email', value: 'invalid-email', message: 'Invalid email format', severity: 'error' },
      { row: 45, column: 'email', value: '', message: 'Required field missing', severity: 'error' },
    ],
    createdBy: 'user123',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    startedAt: new Date(Date.now() - 3500000).toISOString(),
    completedAt: new Date(Date.now() - 3000000).toISOString(),
  },
];

// GET /api/import — List import jobs
export async function GET(req: Request) {
  const url = new URL(req.url);
  const jobId = url.searchParams.get('id');
  const userId = url.searchParams.get('userId');

  if (jobId) {
    const job = mockJobs.find(j => j.id === jobId);
    if (!job) return Response.json({ error: 'Job not found' }, { status: 404 });
    return Response.json({ job });
  }

  const jobs = userId ? mockJobs.filter(j => j.createdBy === userId) : mockJobs;
  return Response.json({ jobs });
}

// POST /api/import — Preview or execute import
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, entityType, format, data, delimiter } = body;

    if (action === 'preview') {
      // Mock preview
      const mockPreview: ImportPreview = {
        headers: ['Email', 'First Name', 'Last Name', 'Phone'],
        sampleRows: [
          { 'Email': 'john@example.com', 'First Name': 'John', 'Last Name': 'Doe', 'Phone': '123-456-7890' },
          { 'Email': 'jane@example.com', 'First Name': 'Jane', 'Last Name': 'Smith', 'Phone': '098-765-4321' },
          { 'Email': 'bob@example.com', 'First Name': 'Bob', 'Last Name': 'Johnson', 'Phone': '555-123-4567' },
        ],
        totalRows: 150,
        detectedFormat: format || 'csv',
        suggestedMappings: [
          { sourceColumn: 'Email', targetField: 'email', required: true, transform: 'email_normalize' },
          { sourceColumn: 'First Name', targetField: 'firstName', required: false, transform: 'trim' },
          { sourceColumn: 'Last Name', targetField: 'lastName', required: false, transform: 'trim' },
          { sourceColumn: 'Phone', targetField: 'phone', required: false, transform: 'phone_normalize' },
        ],
        validationIssues: [],
      };
      return Response.json({ preview: mockPreview });
    }

    if (action === 'execute') {
      // Create mock job
      const newJob: ImportJob = {
        id: `imp_${Date.now()}`,
        entityType: entityType || 'contacts',
        format: format || 'csv',
        fileName: body.fileName || 'import.csv',
        fileSize: body.fileSize || 0,
        mappings: body.mappings || [],
        options: body.options || {
          duplicateHandling: 'skip',
          batchSize: 50,
          dryRun: false,
          sendNotifications: false,
          skipEmptyRows: true,
          headerRow: 0,
        },
        status: 'pending',
        progress: {
          totalRows: 0,
          processedRows: 0,
          successCount: 0,
          errorCount: 0,
          skippedCount: 0,
          updatedCount: 0,
          percentage: 0,
          currentBatch: 0,
          totalBatches: 0,
        },
        results: {
          created: 0,
          updated: 0,
          skipped: 0,
          failed: 0,
          total: 0,
          duration: 0,
          createdIds: [],
          updatedIds: [],
        },
        errors: [],
        createdBy: body.userId || 'user123',
        createdAt: new Date().toISOString(),
      };

      return Response.json({ success: true, job: newJob });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
