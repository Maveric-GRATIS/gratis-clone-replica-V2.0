// ============================================================================
// GRATIS.NGO — Data Import Service
// ============================================================================

import { db } from '@/firebase';
import { doc, setDoc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import {
  ImportJob, ImportJobStatus, ImportMapping, ImportOptions,
  ImportPreview, ImportError, ImportResults, ImportProgress,
  ImportEntityType, ImportTransform, ENTITY_FIELDS,
} from '@/types/data-import';

const IMPORT_JOBS_COL = 'import_jobs';

// ── Parse CSV ────────────────────────────────────────────────────────────────

export function parseCSV(text: string, delimiter = ','): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map((line) => {
    const values = line.split(delimiter).map((v) => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] || ''; });
    return row;
  });

  return { headers, rows };
}

// ── Parse JSON ───────────────────────────────────────────────────────────────

export function parseJSON(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const data = JSON.parse(text);
  const arr = Array.isArray(data) ? data : data.data || data.records || [data];
  if (arr.length === 0) return { headers: [], rows: [] };

  const headers = Object.keys(arr[0]);
  const rows = arr.map((item: any) => {
    const row: Record<string, string> = {};
    headers.forEach(h => { row[h] = String(item[h] || ''); });
    return row;
  });

  return { headers, rows };
}

// ── Apply Transform ──────────────────────────────────────────────────────────

export function applyTransform(value: string, transform: ImportTransform): any {
  if (!value && transform !== 'boolean_parse') return value;

  switch (transform) {
    case 'none':
      return value;
    case 'lowercase':
      return value.toLowerCase();
    case 'uppercase':
      return value.toUpperCase();
    case 'trim':
      return value.trim();
    case 'date_parse':
      return new Date(value).toISOString();
    case 'number_parse':
      return parseFloat(value) || 0;
    case 'currency_parse':
      return parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
    case 'boolean_parse':
      return ['true', '1', 'yes', 'y'].includes(value.toLowerCase());
    case 'email_normalize':
      return value.toLowerCase().trim();
    case 'phone_normalize':
      return value.replace(/[^0-9+]/g, '');
    case 'split_comma':
      return value.split(',').map(s => s.trim());
    default:
      return value;
  }
}

// ── Auto-Suggest Mappings ────────────────────────────────────────────────────

export function suggestMappings(headers: string[], entityType: ImportEntityType): ImportMapping[] {
  const fields = ENTITY_FIELDS[entityType];
  const mappings: ImportMapping[] = [];

  for (const field of fields) {
    const headerLower = headers.map((h) => h.toLowerCase().replace(/[_\s-]/g, ''));
    const fieldLower = field.name.toLowerCase().replace(/[_\s-]/g, '');

    // Find exact or close match
    const matchIndex = headerLower.findIndex((h) => {
      if (h === fieldLower) return true;
      if (h.includes(fieldLower) || fieldLower.includes(h)) return true;
      return false;
    });

    if (matchIndex !== -1) {
      mappings.push({
        sourceColumn: headers[matchIndex],
        targetField: field.name,
        required: field.required,
        transform: getDefaultTransform(field.name),
      });
    } else if (field.required) {
      // Add required fields even without match
      mappings.push({
        sourceColumn: '',
        targetField: field.name,
        required: true,
        transform: getDefaultTransform(field.name),
      });
    }
  }

  return mappings;
}

function getDefaultTransform(fieldName: string): ImportTransform {
  if (fieldName.includes('email')) return 'email_normalize';
  if (fieldName.includes('phone')) return 'phone_normalize';
  if (fieldName.includes('date') || fieldName.includes('Date')) return 'date_parse';
  if (['amount', 'totalDonated', 'goalAmount', 'ticketPrice'].includes(fieldName)) return 'currency_parse';
  if (['recurring'].includes(fieldName)) return 'boolean_parse';
  if (['tags', 'skills'].includes(fieldName)) return 'split_comma';
  return 'trim';
}

// ── Preview Import ───────────────────────────────────────────────────────────

export function previewImport(
  text: string,
  format: 'csv' | 'json',
  entityType: ImportEntityType,
  delimiter?: string
): ImportPreview {
  const { headers, rows } = format === 'csv' ? parseCSV(text, delimiter) : parseJSON(text);

  const suggestedMappings = suggestMappings(headers, entityType);

  const validationIssues: ImportError[] = [];
  const requiredFields = ENTITY_FIELDS[entityType].filter((f) => f.required);

  for (const field of requiredFields) {
    const mapped = suggestedMappings.find((m) => m.targetField === field.name);
    if (!mapped || !mapped.sourceColumn) {
      validationIssues.push({
        row: 0,
        column: field.name,
        message: `Required field "${field.label}" has no mapping`,
        severity: 'error',
      });
    }
  }

  // Check sample data quality
  const sampleRows = rows.slice(0, 5);
  for (let i = 0; i < Math.min(sampleRows.length, 3); i++) {
    for (const mapping of suggestedMappings) {
      if (mapping.required && !sampleRows[i][mapping.sourceColumn]) {
        validationIssues.push({
          row: i + 1,
          column: mapping.sourceColumn,
          message: `Required field is empty`,
          severity: 'warning',
        });
      }
    }
  }

  return {
    headers,
    sampleRows,
    totalRows: rows.length,
    detectedFormat: format,
    suggestedMappings,
    validationIssues,
  };
}

// ── Execute Import ───────────────────────────────────────────────────────────

export async function executeImport(
  jobId: string,
  rows: Record<string, string>[],
  mappings: ImportMapping[],
  options: ImportOptions,
  entityType: ImportEntityType
): Promise<ImportResults> {
  const startTime = Date.now();
  const results: ImportResults = {
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    total: rows.length,
    duration: 0,
    createdIds: [],
    updatedIds: [],
  };

  const errors: ImportError[] = [];
  const batchSize = options.batchSize || 50;
  const totalBatches = Math.ceil(rows.length / batchSize);

  for (let batch = 0; batch < totalBatches; batch++) {
    const batchRows = rows.slice(batch * batchSize, (batch + 1) * batchSize);

    for (let i = 0; i < batchRows.length; i++) {
      const rowIndex = batch * batchSize + i;
      const row = batchRows[i];

      try {
        // Transform row data according to mappings
        const transformedData: Record<string, any> = {};
        for (const mapping of mappings) {
          if (!mapping.sourceColumn) continue;
          const value = row[mapping.sourceColumn];
          transformedData[mapping.targetField] = mapping.transform
            ? applyTransform(value, mapping.transform)
            : value;
        }

        // Validate required fields
        const requiredFields = mappings.filter(m => m.required);
        for (const field of requiredFields) {
          if (!transformedData[field.targetField]) {
            throw new Error(`Required field "${field.targetField}" is missing`);
          }
        }

        if (options.dryRun) {
          results.created += 1;
          continue;
        }

        // Check for duplicates
        if (options.duplicateHandling !== 'create_new' && options.duplicateField) {
          const duplicateValue = transformedData[options.duplicateField];
          if (duplicateValue) {
            const existingQuery = query(
              collection(db, entityType),
              where(options.duplicateField, '==', duplicateValue)
            );
            const existingSnap = await getDocs(existingQuery);

            if (!existingSnap.empty) {
              if (options.duplicateHandling === 'skip') {
                results.skipped += 1;
                continue;
              } else if (options.duplicateHandling === 'update') {
                const existingId = existingSnap.docs[0].id;
                await updateDoc(doc(db, entityType, existingId), {
                  ...transformedData,
                  updatedAt: new Date().toISOString(),
                });
                results.updated += 1;
                results.updatedIds.push(existingId);
                continue;
              }
            }
          }
        }

        // Create new record
        const newId = `${entityType}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        await setDoc(doc(db, entityType, newId), {
          ...transformedData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        results.created += 1;
        results.createdIds.push(newId);
      } catch (error: any) {
        results.failed += 1;
        errors.push({
          row: rowIndex + 1,
          message: error.message,
          severity: 'error',
        });
      }
    }

    // Update progress
    await updateDoc(doc(db, IMPORT_JOBS_COL, jobId), {
      'progress.processedRows': (batch + 1) * batchSize,
      'progress.successCount': results.created + results.updated,
      'progress.errorCount': results.failed,
      'progress.skippedCount': results.skipped,
      'progress.percentage': Math.round(((batch + 1) / totalBatches) * 100),
      'progress.currentBatch': batch + 1,
      errors,
    });
  }

  results.duration = Date.now() - startTime;

  // Finalize job
  await updateDoc(doc(db, IMPORT_JOBS_COL, jobId), {
    status: (results.failed > 0 && results.created === 0 ? 'failed' : 'completed') as ImportJobStatus,
    results,
    errors,
    completedAt: new Date().toISOString(),
  });

  return results;
}

// ── Job CRUD ─────────────────────────────────────────────────────────────────

export async function createImportJob(params: {
  entityType: ImportEntityType;
  format: 'csv' | 'json';
  fileName: string;
  fileSize: number;
  mappings: ImportMapping[];
  options: ImportOptions;
  createdBy: string;
}): Promise<ImportJob> {
  const id = `imp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const job: ImportJob = {
    id,
    entityType: params.entityType,
    format: params.format,
    fileName: params.fileName,
    fileSize: params.fileSize,
    mappings: params.mappings,
    options: params.options,
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
    createdBy: params.createdBy,
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, IMPORT_JOBS_COL, id), job);
  return job;
}

export async function getImportJob(jobId: string): Promise<ImportJob | null> {
  const snap = await getDoc(doc(db, IMPORT_JOBS_COL, jobId));
  return snap.exists() ? (snap.data() as ImportJob) : null;
}

export async function listImportJobs(userId?: string): Promise<ImportJob[]> {
  let q = query(collection(db, IMPORT_JOBS_COL));
  if (userId) q = query(q, where('createdBy', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as ImportJob).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
