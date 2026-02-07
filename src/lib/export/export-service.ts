// src/lib/export/export-service.ts
// Data export processing engine (Client-side for Vite/React)

import { db, storage } from '@/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  serverTimestamp,
  type WhereFilterOp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type {
  ExportRequest,
  ExportFilter,
  ExportFormat,
  ExportScope,
  ExportColumn,
} from '@/types/export';

// Column definitions per scope
const SCOPE_COLUMNS: Record<ExportScope, ExportColumn[]> = {
  donations: [
    { key: 'id', label: 'Donation ID', type: 'string' },
    { key: 'donorName', label: 'Donor Name', type: 'string' },
    { key: 'donorEmail', label: 'Donor Email', type: 'string' },
    { key: 'amount', label: 'Amount', type: 'currency' },
    { key: 'currency', label: 'Currency', type: 'string' },
    { key: 'projectName', label: 'Project', type: 'string' },
    { key: 'type', label: 'Type', type: 'string' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'paymentMethod', label: 'Payment Method', type: 'string' },
    { key: 'isRecurring', label: 'Recurring', type: 'boolean' },
    { key: 'createdAt', label: 'Date', type: 'date' },
  ],
  users: [
    { key: 'id', label: 'User ID', type: 'string' },
    { key: 'displayName', label: 'Name', type: 'string' },
    { key: 'email', label: 'Email', type: 'string' },
    { key: 'role', label: 'Role', type: 'string' },
    { key: 'bottleCount', label: 'Bottles', type: 'number' },
    { key: 'totalDonated', label: 'Total Donated', type: 'currency' },
    { key: 'isTribeMember', label: 'TRIBE Member', type: 'boolean' },
    { key: 'referralCount', label: 'Referrals', type: 'number' },
    { key: 'createdAt', label: 'Joined', type: 'date' },
    { key: 'lastActive', label: 'Last Active', type: 'date' },
  ],
  projects: [
    { key: 'id', label: 'Project ID', type: 'string' },
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'goalAmount', label: 'Goal', type: 'currency' },
    { key: 'currentAmount', label: 'Raised', type: 'currency' },
    { key: 'donorCount', label: 'Donors', type: 'number' },
    { key: 'category', label: 'Category', type: 'string' },
    { key: 'location', label: 'Location', type: 'string' },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'endDate', label: 'End Date', type: 'date' },
  ],
  events: [
    { key: 'id', label: 'Event ID', type: 'string' },
    { key: 'title', label: 'Title', type: 'string' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'endDate', label: 'End Date', type: 'date' },
    { key: 'location', label: 'Location', type: 'string' },
    { key: 'registrationCount', label: 'Registrations', type: 'number' },
    { key: 'attendeeCount', label: 'Attendees', type: 'number' },
    { key: 'bottlesCollected', label: 'Bottles Collected', type: 'number' },
  ],
  bottles: [
    { key: 'id', label: 'Bottle ID', type: 'string' },
    { key: 'userId', label: 'User ID', type: 'string' },
    { key: 'userName', label: 'User Name', type: 'string' },
    { key: 'count', label: 'Count', type: 'number' },
    { key: 'source', label: 'Source', type: 'string' },
    { key: 'verificationStatus', label: 'Verified', type: 'string' },
    { key: 'createdAt', label: 'Date', type: 'date' },
  ],
  partners: [
    { key: 'id', label: 'Partner ID', type: 'string' },
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'type', label: 'Type', type: 'string' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'totalDonations', label: 'Total Donations', type: 'currency' },
    { key: 'projectCount', label: 'Projects', type: 'number' },
    { key: 'joinedAt', label: 'Joined', type: 'date' },
  ],
  subscriptions: [
    { key: 'id', label: 'Subscription ID', type: 'string' },
    { key: 'userId', label: 'User ID', type: 'string' },
    { key: 'userEmail', label: 'Email', type: 'string' },
    { key: 'plan', label: 'Plan', type: 'string' },
    { key: 'status', label: 'Status', type: 'string' },
    { key: 'amount', label: 'Amount', type: 'currency' },
    { key: 'interval', label: 'Interval', type: 'string' },
    { key: 'startDate', label: 'Start Date', type: 'date' },
    { key: 'nextBillingDate', label: 'Next Billing', type: 'date' },
  ],
  audit_logs: [
    { key: 'id', label: 'Log ID', type: 'string' },
    { key: 'action', label: 'Action', type: 'string' },
    { key: 'userId', label: 'User ID', type: 'string' },
    { key: 'userEmail', label: 'Email', type: 'string' },
    { key: 'resource', label: 'Resource', type: 'string' },
    { key: 'resourceId', label: 'Resource ID', type: 'string' },
    { key: 'ipAddress', label: 'IP Address', type: 'string' },
    { key: 'createdAt', label: 'Timestamp', type: 'date' },
  ],
};

const COLLECTION_MAP: Record<ExportScope, string> = {
  donations: 'donations',
  users: 'users',
  projects: 'projects',
  events: 'events',
  bottles: 'bottle_submissions',
  partners: 'partners',
  subscriptions: 'subscriptions',
  audit_logs: 'audit_logs',
};

export class ExportService {
  /**
   * Create and process an export request
   */
  static async createExport(params: {
    scope: ExportScope;
    format: ExportFormat;
    filters?: ExportFilter[];
    columns?: string[];
    dateRange?: { start: string; end: string };
    requestedBy: string;
  }): Promise<ExportRequest> {
    const exportReq: ExportRequest = {
      id: '',
      scope: params.scope,
      format: params.format,
      filters: params.filters || [],
      columns: params.columns,
      dateRange: params.dateRange,
      requestedBy: params.requestedBy,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const ref = doc(collection(db, 'exports'));
    exportReq.id = ref.id;

    await setDoc(ref, {
      ...exportReq,
      createdAt: serverTimestamp(),
    });

    // Process asynchronously
    this.processExport(ref.id).catch((error) => {
      console.error(`Export ${ref.id} failed:`, error);
      updateDoc(ref, {
        status: 'failed',
        error: error.message,
      });
    });

    return exportReq;
  }

  /**
   * Get export status and download URL
   */
  static async getExport(exportId: string): Promise<ExportRequest | null> {
    const docRef = doc(db, 'exports', exportId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as ExportRequest;
  }

  /**
   * Get available columns for a scope
   */
  static getColumns(scope: ExportScope): ExportColumn[] {
    return SCOPE_COLUMNS[scope] || [];
  }

  /**
   * Get recent exports for a user
   */
  static async getUserExports(userId: string, limitCount = 20): Promise<ExportRequest[]> {
    const q = query(
      collection(db, 'exports'),
      where('requestedBy', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ExportRequest[];
  }

  /**
   * Process the export (query data, format, upload)
   */
  private static async processExport(exportId: string): Promise<void> {
    const docRef = doc(db, 'exports', exportId);
    await updateDoc(docRef, { status: 'processing' });

    const exportDoc = await getDoc(docRef);
    const exportReq = { id: exportDoc.id, ...exportDoc.data() } as ExportRequest;

    // Fetch data
    const data = await this.fetchData(exportReq);

    // Filter columns
    const columns = exportReq.columns?.length
      ? SCOPE_COLUMNS[exportReq.scope].filter((c) =>
          exportReq.columns!.includes(c.key)
        )
      : SCOPE_COLUMNS[exportReq.scope];

    // Format output
    let content: Blob;
    let contentType: string;
    let extension: string;

    switch (exportReq.format) {
      case 'csv':
        content = new Blob([this.toCSV(data, columns)], { type: 'text/csv' });
        contentType = 'text/csv';
        extension = 'csv';
        break;
      case 'json':
        content = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json',
        });
        contentType = 'application/json';
        extension = 'json';
        break;
      case 'xlsx':
        // For now, fall back to CSV (would need xlsx library)
        content = new Blob([this.toCSV(data, columns)], { type: 'text/csv' });
        contentType = 'text/csv';
        extension = 'csv';
        break;
      default:
        content = new Blob([this.toCSV(data, columns)], { type: 'text/csv' });
        contentType = 'text/csv';
        extension = 'csv';
    }

    // Upload to storage
    const fileName = `exports/${exportReq.scope}_${exportId}_${Date.now()}.${extension}`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, content, {
      contentType,
    });

    const url = await getDownloadURL(storageRef);

    await updateDoc(docRef, {
      status: 'completed',
      fileUrl: url,
      fileSize: content.size,
      rowCount: data.length,
      completedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  /**
   * Fetch data from Firestore based on scope and filters
   */
  private static async fetchData(
    exportReq: ExportRequest
  ): Promise<Record<string, unknown>[]> {
    const collectionName = COLLECTION_MAP[exportReq.scope];
    let q = query(collection(db, collectionName));

    // Apply date range
    if (exportReq.dateRange) {
      q = query(
        q,
        where('createdAt', '>=', exportReq.dateRange.start),
        where('createdAt', '<=', exportReq.dateRange.end)
      );
    }

    // Apply filters (Firestore has limits on compound queries)
    // Only apply first filter to avoid index requirements
    if (exportReq.filters.length > 0) {
      const filter = exportReq.filters[0];
      const op = this.mapOperator(filter.operator);
      if (op) {
        q = query(q, where(filter.field, op, filter.value));
      }
    }

    // Add ordering
    q = query(q, orderBy('createdAt', 'desc'));

    // Limit to prevent memory issues (max 10k)
    q = query(q, limit(10000));

    const snapshot = await getDocs(q);
    const results: Record<string, unknown>[] = [];

    snapshot.docs.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    return results;
  }

  /**
   * Convert data to CSV
   */
  private static toCSV(
    data: Record<string, unknown>[],
    columns: ExportColumn[]
  ): string {
    if (data.length === 0) return columns.map((c) => c.label).join(',');

    const header = columns.map((c) => `"${c.label}"`).join(',');
    const rows = data.map((row) =>
      columns
        .map((col) => {
          const value = row[col.key];
          if (value === null || value === undefined) return '';
          if (col.type === 'date' && value) {
            try {
              // Handle Firestore Timestamp objects
              if (typeof value === 'object' && 'toDate' in value) {
                return `"${(value as any).toDate().toISOString()}"`;
              }
              return `"${new Date(value as string).toISOString()}"`;
            } catch {
              return `"${value}"`;
            }
          }
          if (col.type === 'currency') {
            return Number(value || 0).toFixed(2);
          }
          if (typeof value === 'string') {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return String(value);
        })
        .join(',')
    );

    return [header, ...rows].join('\n');
  }

  /**
   * Map export filter operator to Firestore operator
   */
  private static mapOperator(
    op: ExportFilter['operator']
  ): WhereFilterOp | null {
    const map: Record<string, WhereFilterOp> = {
      eq: '==',
      neq: '!=',
      gt: '>',
      gte: '>=',
      lt: '<',
      lte: '<=',
      in: 'in',
      contains: '==', // Firestore doesn't have native contains, use array-contains for arrays
    };
    return map[op] || null;
  }

  /**
   * Download export file directly (trigger browser download)
   */
  static async downloadExport(exportReq: ExportRequest): Promise<void> {
    if (!exportReq.fileUrl) {
      throw new Error('Export file not available');
    }

    // Fetch the file
    const response = await fetch(exportReq.fileUrl);
    const blob = await response.blob();

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${exportReq.scope}_export_${exportReq.id}.${exportReq.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
