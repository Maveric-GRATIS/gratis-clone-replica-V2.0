// src/types/scheduler.ts
// Scheduled task and cron job types

export type JobStatus = 'active' | 'paused' | 'disabled' | 'completed';
export type RunStatus = 'pending' | 'running' | 'success' | 'failed' | 'timeout' | 'skipped';

export interface ScheduledJob {
  id: string;
  name: string;
  description: string;
  handler: string; // Function path: 'jobs/cleanup-expired-sessions'
  schedule: string; // Cron expression: '0 */6 * * *'
  timezone: string;
  status: JobStatus;
  config: Record<string, unknown>;
  retryPolicy: RetryPolicy;
  timeout: number; // seconds
  lastRunAt?: string;
  lastRunStatus?: RunStatus;
  nextRunAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RetryPolicy {
  maxRetries: number;
  backoffMs: number;
  backoffMultiplier: number;
  maxBackoffMs: number;
}

export interface JobRun {
  id: string;
  jobId: string;
  jobName: string;
  status: RunStatus;
  startedAt: string;
  completedAt?: string;
  duration?: number; // ms
  output?: string;
  error?: string;
  retryCount: number;
  triggeredBy: 'schedule' | 'manual' | 'retry';
}

export interface JobMetrics {
  jobId: string;
  totalRuns: number;
  successCount: number;
  failureCount: number;
  avgDurationMs: number;
  lastSevenDays: {
    date: string;
    runs: number;
    successes: number;
    failures: number;
  }[];
}
