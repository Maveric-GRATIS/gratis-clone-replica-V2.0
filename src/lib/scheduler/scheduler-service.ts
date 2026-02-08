// src/lib/scheduler/scheduler-service.ts
// Cron job scheduler with execution tracking (client-side implementation)

import type { ScheduledJob, JobRun, RunStatus } from '@/types/scheduler';
import { db } from '@/firebase';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { getJobHandler } from './job-registry';

export class SchedulerService {
  /**
   * Execute a scheduled job
   */
  static async executeJob(
    jobId: string,
    triggeredBy: JobRun['triggeredBy'] = 'manual'
  ): Promise<JobRun> {
    const jobRef = doc(db, 'scheduled_jobs', jobId);
    const jobDoc = await getDoc(jobRef);

    if (!jobDoc.exists()) throw new Error(`Job ${jobId} not found`);
    const job = jobDoc.data() as ScheduledJob;

    if (job.status !== 'active' && triggeredBy === 'schedule') {
      throw new Error(`Job ${jobId} is not active`);
    }

    // Create run record
    const now = new Date().toISOString();
    const run: Omit<JobRun, 'id'> = {
      jobId,
      jobName: job.name,
      status: 'running',
      startedAt: now,
      retryCount: 0,
      triggeredBy,
    };

    const runRef = await addDoc(collection(db, 'job_runs'), run);
    const runId = runRef.id;

    // Update job last run
    await updateDoc(jobRef, {
      lastRunAt: now,
      lastRunStatus: 'running',
    });

    try {
      // Get handler
      const handler = getJobHandler(job.handler);
      if (!handler) {
        throw new Error(`Handler not found: ${job.handler}`);
      }

      // Execute with timeout
      const output = await this.withTimeout(
        handler(job.config),
        job.timeout * 1000
      );

      const completedAt = new Date().toISOString();
      const duration =
        new Date(completedAt).getTime() - new Date(run.startedAt).getTime();

      // Update run
      await updateDoc(runRef, {
        status: 'success',
        completedAt,
        duration,
        output: output.slice(0, 5000), // Limit output size
      });

      // Update job
      await updateDoc(jobRef, {
        lastRunStatus: 'success',
        nextRunAt: this.calculateNextRunTime(job.schedule),
      });

      return {
        id: runId,
        ...run,
        status: 'success',
        completedAt,
        duration,
        output,
      };
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'Unknown error';
      const completedAt = new Date().toISOString();
      const duration =
        new Date(completedAt).getTime() - new Date(run.startedAt).getTime();

      await updateDoc(runRef, {
        status: 'failed',
        completedAt,
        duration,
        error: errorMsg.slice(0, 5000),
      });

      await updateDoc(jobRef, { lastRunStatus: 'failed' });

      // Note: Retry logic would be handled by a backend service in production

      return {
        id: runId,
        ...run,
        status: 'failed',
        completedAt,
        duration,
        error: errorMsg,
      };
    }
  }

  /**
   * Get all scheduled jobs
   */
  static async listJobs(): Promise<ScheduledJob[]> {
    const q = query(collection(db, 'scheduled_jobs'), orderBy('name'));
    const snap = await getDocs(q);

    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ScheduledJob));
  }

  /**
   * Get recent runs for a job
   */
  static async getJobRuns(jobId: string, limitCount = 20): Promise<JobRun[]> {
    const q = query(
      collection(db, 'job_runs'),
      where('jobId', '==', jobId),
      orderBy('startedAt', 'desc'),
      limit(limitCount)
    );
    const snap = await getDocs(q);

    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as JobRun));
  }

  /**
   * Create or update a scheduled job
   */
  static async upsertJob(
    job: Omit<ScheduledJob, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<string> {
    const now = new Date().toISOString();

    if (job.id) {
      await updateDoc(doc(db, 'scheduled_jobs', job.id), {
        ...job,
        updatedAt: now,
      });
      return job.id;
    }

    const ref = await addDoc(collection(db, 'scheduled_jobs'), {
      ...job,
      nextRunAt: this.calculateNextRunTime(job.schedule),
      createdAt: now,
      updatedAt: now,
    });
    return ref.id;
  }

  /**
   * Toggle job active/paused
   */
  static async toggleJob(
    jobId: string,
    status: 'active' | 'paused'
  ): Promise<void> {
    await updateDoc(doc(db, 'scheduled_jobs', jobId), {
      status,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Delete a scheduled job
   */
  static async deleteJob(jobId: string): Promise<void> {
    await updateDoc(doc(db, 'scheduled_jobs', jobId), {
      status: 'disabled',
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Get job statistics
   */
  static async getJobStats(jobId: string): Promise<{
    totalRuns: number;
    successCount: number;
    failureCount: number;
    avgDuration: number;
  }> {
    const q = query(
      collection(db, 'job_runs'),
      where('jobId', '==', jobId),
      orderBy('startedAt', 'desc'),
      limit(100)
    );
    const snap = await getDocs(q);

    let successCount = 0;
    let failureCount = 0;
    let totalDuration = 0;
    let durationCount = 0;

    snap.docs.forEach((doc) => {
      const run = doc.data() as JobRun;
      if (run.status === 'success') successCount++;
      if (run.status === 'failed') failureCount++;
      if (run.duration) {
        totalDuration += run.duration;
        durationCount++;
      }
    });

    return {
      totalRuns: snap.size,
      successCount,
      failureCount,
      avgDuration: durationCount > 0 ? totalDuration / durationCount : 0,
    };
  }

  // -- Private helpers --

  private static async withTimeout<T>(
    promise: Promise<T>,
    ms: number
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Job timed out after ${ms}ms`)), ms)
      ),
    ]);
  }

  private static calculateNextRunTime(cronExpr: string): string {
    // Simplified cron parser for common patterns
    // In production, use a library like 'cron-parser'
    const parts = cronExpr.split(' ');
    if (parts.length < 5) {
      // Default to 1 hour from now
      return new Date(Date.now() + 3600000).toISOString();
    }

    const minute = parts[0];
    const hour = parts[1];
    const now = new Date();
    const next = new Date(now);

    // Handle */N patterns
    if (minute.startsWith('*/')) {
      const interval = parseInt(minute.slice(2));
      const nextMinute =
        Math.ceil((now.getMinutes() + 1) / interval) * interval;
      if (nextMinute >= 60) {
        next.setHours(next.getHours() + 1);
        next.setMinutes(nextMinute - 60);
      } else {
        next.setMinutes(nextMinute);
      }
    } else if (hour.startsWith('*/')) {
      const interval = parseInt(hour.slice(2));
      const nextHour = Math.ceil((now.getHours() + 1) / interval) * interval;
      next.setHours(nextHour % 24);
      next.setMinutes(parseInt(minute) || 0);
      if (next <= now) next.setDate(next.getDate() + 1);
    } else {
      // Specific time
      next.setHours(parseInt(hour) || 0);
      next.setMinutes(parseInt(minute) || 0);
      if (next <= now) next.setDate(next.getDate() + 1);
    }

    next.setSeconds(0);
    next.setMilliseconds(0);
    return next.toISOString();
  }
}

// Export singleton instance
export const schedulerService = new SchedulerService();
