// src/hooks/useExport.ts
// React hook for data export operations

import { useState, useEffect, useCallback } from 'react';
import { ExportService } from '@/lib/export/export-service';
import { useAuth } from '@/hooks/useAuth';
import type { ExportRequest, ExportScope, ExportFormat, ExportFilter } from '@/types/export';

interface UseExportOptions {
  autoLoad?: boolean;
}

interface UseExportResult {
  exports: ExportRequest[];
  loading: boolean;
  error: Error | null;
  createExport: (params: {
    scope: ExportScope;
    format: ExportFormat;
    filters?: ExportFilter[];
    columns?: string[];
    dateRange?: { start: string; end: string };
  }) => Promise<ExportRequest>;
  getExport: (exportId: string) => Promise<ExportRequest | null>;
  downloadExport: (exportReq: ExportRequest) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useExport(options: UseExportOptions = {}): UseExportResult {
  const { autoLoad = true } = options;
  const { user } = useAuth();
  const [exports, setExports] = useState<ExportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadExports = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await ExportService.getUserExports(user.uid, 20);
      setExports(data);
    } catch (err) {
      console.error('Failed to load exports:', err);
      setError(err instanceof Error ? err : new Error('Failed to load exports'));
      setExports([]);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (autoLoad) {
      loadExports();
    } else {
      setLoading(false);
    }
  }, [autoLoad, loadExports]);

  const createExport = useCallback(
    async (params: {
      scope: ExportScope;
      format: ExportFormat;
      filters?: ExportFilter[];
      columns?: string[];
      dateRange?: { start: string; end: string };
    }): Promise<ExportRequest> => {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      try {
        const exportReq = await ExportService.createExport({
          ...params,
          requestedBy: user.uid,
        });

        // Add to local state
        setExports((prev) => [exportReq, ...prev]);

        return exportReq;
      } catch (err) {
        console.error('Failed to create export:', err);
        throw err;
      }
    },
    [user?.uid]
  );

  const getExport = useCallback(async (exportId: string): Promise<ExportRequest | null> => {
    try {
      return await ExportService.getExport(exportId);
    } catch (err) {
      console.error('Failed to get export:', err);
      throw err;
    }
  }, []);

  const downloadExport = useCallback(async (exportReq: ExportRequest): Promise<void> => {
    try {
      await ExportService.downloadExport(exportReq);
    } catch (err) {
      console.error('Failed to download export:', err);
      throw err;
    }
  }, []);

  return {
    exports,
    loading,
    error,
    createExport,
    getExport,
    downloadExport,
    refresh: loadExports,
  };
}

/**
 * Hook to get available columns for a scope
 */
export function useExportColumns(scope: ExportScope) {
  return ExportService.getColumns(scope);
}

/**
 * Hook to track a specific export's status
 */
export function useExportStatus(exportId: string | null) {
  const [exportReq, setExportReq] = useState<ExportRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    if (!exportId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await ExportService.getExport(exportId);
      setExportReq(data);
    } catch (err) {
      console.error('Failed to get export status:', err);
      setError(err instanceof Error ? err : new Error('Failed to get export status'));
    } finally {
      setLoading(false);
    }
  }, [exportId]);

  useEffect(() => {
    refresh();

    // Poll for status updates if export is processing
    if (exportReq?.status === 'processing' || exportReq?.status === 'pending') {
      const interval = setInterval(refresh, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [exportId, exportReq?.status, refresh]);

  return {
    exportReq,
    loading,
    error,
    refresh,
  };
}
