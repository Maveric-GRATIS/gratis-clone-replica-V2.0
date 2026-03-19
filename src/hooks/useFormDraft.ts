/**
 * useFormDraft — Universal form draft persistence hook
 *
 * Authenticated users  → Firestore `drafts/{uid}_{formId}`  (syncs across devices)
 * Unauthenticated users → localStorage `gratis_draft_{formId}` (this device only)
 *
 * Usage:
 *   const { draft, saveDraft, clearDraft, lastSaved, saving, hasDraft, loadingDraft }
 *     = useFormDraft<MyFormValues>('contact');
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, setDoc, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/hooks/useAuth';

export interface UseFormDraftReturn<T> {
  /** Persisted draft data, or null if none */
  draft:        T | null;
  /** Persist the current form values */
  saveDraft:    (values: T) => Promise<void>;
  /** Delete the draft — call after successful submission */
  clearDraft:   () => Promise<void>;
  /** When the draft was last saved */
  lastSaved:    Date | null;
  /** True while a save is in-flight */
  saving:       boolean;
  /** True if a draft document exists */
  hasDraft:     boolean;
  /** True while the initial load is in-progress */
  loadingDraft: boolean;
}

const COLL      = 'drafts';
const LS_PREFIX = 'gratis_draft_';

export function useFormDraft<T extends Record<string, unknown>>(
  formId: string,
): UseFormDraftReturn<T> {
  const { user } = useAuth();

  const [draft,        setDraft]        = useState<T | null>(null);
  const [lastSaved,    setLastSaved]    = useState<Date | null>(null);
  const [saving,       setSaving]       = useState(false);
  const [hasDraft,     setHasDraft]     = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(true);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const docId  = user ? `${user.uid}_${formId}` : null;
  const lsKey  = `${LS_PREFIX}${formId}`;

  // ── Load on mount / user change ──────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (mountedRef.current) setLoadingDraft(true);
      try {
        if (docId) {
          // Authenticated: Firestore first, fall back to localStorage
          const snap = await getDoc(doc(db, COLL, docId));
          if (!cancelled && mountedRef.current) {
            if (snap.exists()) {
              const d = snap.data();
              setDraft(d.values as T);
              setHasDraft(true);
              setLastSaved(d.savedAt?.toDate ? d.savedAt.toDate() : null);
            } else {
              // Migrate any localStorage draft saved while unauthenticated
              const raw = localStorage.getItem(lsKey);
              if (raw) {
                const parsed = JSON.parse(raw) as { values: T; savedAt: string };
                setDraft(parsed.values);
                setHasDraft(true);
                setLastSaved(new Date(parsed.savedAt));
              }
            }
          }
        } else {
          // Unauthenticated: localStorage only
          const raw = localStorage.getItem(lsKey);
          if (!cancelled && mountedRef.current && raw) {
            const parsed = JSON.parse(raw) as { values: T; savedAt: string };
            setDraft(parsed.values);
            setHasDraft(true);
            setLastSaved(new Date(parsed.savedAt));
          }
        }
      } catch (err) {
        console.warn(`useFormDraft[${formId}] load error`, err);
      } finally {
        if (!cancelled && mountedRef.current) setLoadingDraft(false);
      }
    })();

    return () => { cancelled = true; };
  }, [docId, formId]);

  // ── Save ─────────────────────────────────────────────────────────────────
  const saveDraft = useCallback(
    async (values: T) => {
      if (!mountedRef.current) return;
      setSaving(true);
      const now = new Date();
      try {
        if (docId) {
          await setDoc(
            doc(db, COLL, docId),
            { formId, uid: user!.uid, values, savedAt: serverTimestamp() },
            { merge: true },
          );
        } else {
          localStorage.setItem(lsKey, JSON.stringify({ values, savedAt: now.toISOString() }));
        }
        if (mountedRef.current) {
          setDraft(values);
          setHasDraft(true);
          setLastSaved(now);
        }
      } catch (err) {
        console.error(`useFormDraft[${formId}] save error`, err);
        throw err;
      } finally {
        if (mountedRef.current) setSaving(false);
      }
    },
    [docId, formId, lsKey],
  );

  // ── Clear ────────────────────────────────────────────────────────────────
  const clearDraft = useCallback(async () => {
    try {
      if (docId) await deleteDoc(doc(db, COLL, docId));
      localStorage.removeItem(lsKey);
      if (mountedRef.current) {
        setDraft(null);
        setHasDraft(false);
        setLastSaved(null);
      }
    } catch (err) {
      console.warn(`useFormDraft[${formId}] clear error`, err);
    }
  }, [docId, formId, lsKey]);

  return { draft, saveDraft, clearDraft, lastSaved, saving, hasDraft, loadingDraft };
}
