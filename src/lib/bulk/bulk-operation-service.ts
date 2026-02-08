// ============================================================================
// GRATIS.NGO — Bulk Operation Execution Engine
// ============================================================================

import { db } from '@/firebase';
import {
  doc, setDoc, getDoc, updateDoc, deleteDoc,
  collection, getDocs, query, where, writeBatch,
} from 'firebase/firestore';
import {
  BulkOperation, BulkOperationType, BulkEntityType,
  BulkResults, BulkProgress, BulkError,
  BULK_OPERATION_CONFIGS,
} from '@/types/bulk-operations';

const BULK_OPS_COL = 'bulk_operations';

// ── Create & Execute ─────────────────────────────────────────────────────────

export async function createBulkOperation(params: {
  type: BulkOperationType;
  entityType: BulkEntityType;
  targetIds: string[];
  params: Record<string, any>;
  createdBy: string;
}): Promise<BulkOperation> {
  const config = BULK_OPERATION_CONFIGS[params.type];

  const id = `bulk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const op: BulkOperation = {
    id,
    type: params.type,
    entityType: params.entityType,
    targetIds: params.targetIds,
    params: params.params,
    status: 'pending',
    progress: {
      total: params.targetIds.length,
      processed: 0,
      succeeded: 0,
      failed: 0,
      percentage: 0,
    },
    results: {
      affectedCount: 0,
      successIds: [],
      failedIds: [],
    },
    errors: [],
    undoAvailable: config.allowUndo,
    createdBy: params.createdBy,
    createdAt: new Date().toISOString(),
    undoExpiry: config.allowUndo
      ? new Date(Date.now() + 86400000).toISOString()
      : undefined,
  };

  await setDoc(doc(db, BULK_OPS_COL, id), op);
  return op;
}

export async function executeBulkOperation(opId: string): Promise<BulkResults> {
  const op = await getBulkOperation(opId);
  if (!op) throw new Error('Operation not found');

  await updateDoc(doc(db, BULK_OPS_COL, opId), { status: 'processing' });

  const results: BulkResults = {
    affectedCount: 0,
    successIds: [],
    failedIds: [],
    previousValues: [],
  };

  const errors: BulkError[] = [];
  const batch = writeBatch(db);
  let batchCount = 0;

  for (let i = 0; i < op.targetIds.length; i++) {
    const targetId = op.targetIds[i];

    try {
      const result = await processRecord(
        op.entityType,
        targetId,
        op.type,
        op.params
      );

      results.successIds.push(targetId);
      results.affectedCount += 1;

      if (result.previousValue) {
        results.previousValues!.push(result.previousValue);
      }

      batchCount++;

      // Commit batch every 500 operations
      if (batchCount >= 500) {
        await batch.commit();
        batchCount = 0;
      }
    } catch (error: any) {
      results.failedIds.push(targetId);
      errors.push({
        targetId,
        message: error.message,
        code: error.code,
      });
    }

    // Update progress
    const progress: BulkProgress = {
      total: op.targetIds.length,
      processed: i + 1,
      succeeded: results.successIds.length,
      failed: results.failedIds.length,
      percentage: Math.round(((i + 1) / op.targetIds.length) * 100),
    };

    await updateDoc(doc(db, BULK_OPS_COL, opId), { progress, errors });
  }

  // Commit remaining batch
  if (batchCount > 0) {
    await batch.commit();
  }

  // Finalize
  await updateDoc(doc(db, BULK_OPS_COL, opId), {
    status: 'completed',
    results,
    completedAt: new Date().toISOString(),
  });

  return results;
}

// ── Process Single Record ────────────────────────────────────────────────────

async function processRecord(
  entityType: BulkEntityType,
  targetId: string,
  operationType: BulkOperationType,
  params: Record<string, any>
): Promise<{ previousValue?: Record<string, any> }> {
  const docRef = doc(db, entityType, targetId);
  const snap = await getDoc(docRef);

  if (!snap.exists()) {
    throw new Error('Record not found');
  }

  const currentData = snap.data();

  switch (operationType) {
    case 'update':
      await updateDoc(docRef, {
        ...params.updates,
        updatedAt: new Date().toISOString(),
      });
      return { previousValue: currentData };

    case 'delete':
      await deleteDoc(docRef);
      return { previousValue: currentData };

    case 'archive':
      await updateDoc(docRef, {
        archived: true,
        archivedAt: new Date().toISOString(),
      });
      return { previousValue: { archived: currentData.archived } };

    case 'restore':
      await updateDoc(docRef, {
        archived: false,
        archivedAt: null,
        restoredAt: new Date().toISOString(),
      });
      return { previousValue: currentData };

    case 'tag':
      const currentTags = currentData.tags || [];
      const newTags = [...new Set([...currentTags, ...params.tags])];
      await updateDoc(docRef, { tags: newTags });
      return { previousValue: { tags: currentTags } };

    case 'untag':
      const tagsToRemove = params.tags || [];
      const filteredTags = (currentData.tags || []).filter(
        (t: string) => !tagsToRemove.includes(t)
      );
      await updateDoc(docRef, { tags: filteredTags });
      return { previousValue: { tags: currentData.tags } };

    case 'assign':
      await updateDoc(docRef, {
        assignedTo: params.userId,
        assignedAt: new Date().toISOString(),
      });
      return { previousValue: { assignedTo: currentData.assignedTo } };

    case 'duplicate':
      const newId = `${entityType}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      await setDoc(doc(db, entityType, newId), {
        ...currentData,
        id: newId,
        createdAt: new Date().toISOString(),
        duplicatedFrom: targetId,
      });
      return {};

    default:
      throw new Error(`Unsupported operation: ${operationType}`);
  }
}

// ── Undo ─────────────────────────────────────────────────────────────────────

export async function undoBulkOperation(opId: string): Promise<void> {
  const op = await getBulkOperation(opId);
  if (!op) throw new Error('Operation not found');
  if (!op.undoAvailable) throw new Error('Undo not available for this operation');
  if (op.undoExpiry && new Date(op.undoExpiry) < new Date()) {
    throw new Error('Undo period has expired');
  }

  // Restore previous values (simplified - full implementation would restore all fields)
  for (let i = 0; i < op.results.successIds.length; i++) {
    const targetId = op.results.successIds[i];
    const previousValue = op.results.previousValues?.[i];

    if (previousValue) {
      await updateDoc(doc(db, op.entityType, targetId), previousValue);
    }
  }

  await updateDoc(doc(db, BULK_OPS_COL, opId), {
    status: 'undone',
    undoAvailable: false,
  });
}

// ── Query ────────────────────────────────────────────────────────────────────

export async function getBulkOperation(opId: string): Promise<BulkOperation | null> {
  const snap = await getDoc(doc(db, BULK_OPS_COL, opId));
  return snap.exists() ? (snap.data() as BulkOperation) : null;
}

export async function listBulkOperations(userId?: string): Promise<BulkOperation[]> {
  let q = query(collection(db, BULK_OPS_COL));
  if (userId) q = query(q, where('createdBy', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as BulkOperation).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
