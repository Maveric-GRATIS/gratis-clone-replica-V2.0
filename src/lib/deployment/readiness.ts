/**
 * Production Readiness Check Service
 * Health checks for production deployments
 */

import { db } from '@/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export type CheckStatus = 'pass' | 'warn' | 'fail';

export interface ReadinessCheck {
  name: string;
  status: CheckStatus;
  latencyMs: number;
  message: string;
  critical: boolean;
  details?: Record<string, unknown>;
}

export interface ReadinessReport {
  ready: boolean;
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  checks: ReadinessCheck[];
  summary: {
    total: number;
    passed: number;
    warnings: number;
    failures: number;
    criticalFailures: number;
  };
}

const startTime = Date.now();

/**
 * Run all readiness checks
 */
export async function runReadinessChecks(): Promise<ReadinessReport> {
  const checks = await Promise.allSettled([
    checkFirestore(),
    checkFirebaseAuth(),
    checkMemory(),
    checkEnvVars(),
  ]);

  const results: ReadinessCheck[] = checks.map((result, index) => {
    if (result.status === 'fulfilled') return result.value;

    const names = ['Firestore', 'Firebase Auth', 'Memory', 'Environment'];

    return {
      name: names[index] || `Check ${index}`,
      status: 'fail' as CheckStatus,
      latencyMs: 0,
      message: result.reason?.message || 'Check failed unexpectedly',
      critical: index < 2, // First 2 are critical
    };
  });

  const summary = {
    total: results.length,
    passed: results.filter((c) => c.status === 'pass').length,
    warnings: results.filter((c) => c.status === 'warn').length,
    failures: results.filter((c) => c.status === 'fail').length,
    criticalFailures: results.filter((c) => c.status === 'fail' && c.critical).length,
  };

  const ready = summary.criticalFailures === 0;
  const status =
    summary.criticalFailures > 0
      ? 'unhealthy'
      : summary.failures > 0 || summary.warnings > 1
      ? 'degraded'
      : 'healthy';

  return {
    ready,
    status,
    timestamp: new Date().toISOString(),
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.MODE || 'development',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    checks: results,
    summary,
  };
}

/**
 * Simple liveness check (is app running?)
 */
export function isAlive(): boolean {
  return true;
}

/**
 * Quick readiness check (can accept traffic?)
 */
export async function isReady(): Promise<boolean> {
  try {
    // Quick Firestore connectivity check
    const start = Date.now();
    const q = query(collection(db, 'users'), limit(1));
    await getDocs(q);
    const latency = Date.now() - start;

    // Fail if response time >5s
    return latency < 5000;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Individual Checks
// ---------------------------------------------------------------------------

async function checkFirestore(): Promise<ReadinessCheck> {
  const start = Date.now();
  try {
    const q = query(collection(db, 'users'), limit(1));
    await getDocs(q);
    const latency = Date.now() - start;

    return {
      name: 'Firestore',
      status: latency > 2000 ? 'warn' : 'pass',
      latencyMs: latency,
      message: latency > 2000 ? 'High latency detected' : 'Connected',
      critical: true,
      details: { latency },
    };
  } catch (error) {
    return {
      name: 'Firestore',
      status: 'fail',
      latencyMs: Date.now() - start,
      message: error instanceof Error ? error.message : 'Connection failed',
      critical: true,
    };
  }
}

async function checkFirebaseAuth(): Promise<ReadinessCheck> {
  const start = Date.now();
  try {
    // Check if Firebase Auth is configured
    const hasAuth = !!import.meta.env.VITE_FIREBASE_API_KEY;
    const latency = Date.now() - start;

    if (!hasAuth) {
      return {
        name: 'Firebase Auth',
        status: 'fail',
        latencyMs: latency,
        message: 'Firebase Auth not configured',
        critical: true,
      };
    }

    return {
      name: 'Firebase Auth',
      status: 'pass',
      latencyMs: latency,
      message: 'Configured',
      critical: true,
    };
  } catch (error) {
    return {
      name: 'Firebase Auth',
      status: 'fail',
      latencyMs: Date.now() - start,
      message: error instanceof Error ? error.message : 'Auth check failed',
      critical: true,
    };
  }
}

async function checkMemory(): Promise<ReadinessCheck> {
  const start = Date.now();

  try {
    // Check if performance API is available
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / 1024 / 1024;
      const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;
      const percentUsed = (usedMB / limitMB) * 100;

      return {
        name: 'Memory',
        status: percentUsed > 90 ? 'warn' : 'pass',
        latencyMs: Date.now() - start,
        message: `${usedMB.toFixed(0)}MB / ${limitMB.toFixed(0)}MB (${percentUsed.toFixed(1)}%)`,
        critical: false,
        details: {
          usedMB: Math.round(usedMB),
          limitMB: Math.round(limitMB),
          percentUsed: Math.round(percentUsed),
        },
      };
    }

    return {
      name: 'Memory',
      status: 'pass',
      latencyMs: Date.now() - start,
      message: 'Memory monitoring not available',
      critical: false,
    };
  } catch (error) {
    return {
      name: 'Memory',
      status: 'warn',
      latencyMs: Date.now() - start,
      message: 'Memory check failed',
      critical: false,
    };
  }
}

async function checkEnvVars(): Promise<ReadinessCheck> {
  const start = Date.now();
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  const missing = required.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    return {
      name: 'Environment Variables',
      status: 'fail',
      latencyMs: Date.now() - start,
      message: `Missing ${missing.length} required variables`,
      critical: true,
      details: { missing },
    };
  }

  return {
    name: 'Environment Variables',
    status: 'pass',
    latencyMs: Date.now() - start,
    message: `All ${required.length} required variables present`,
    critical: true,
    details: { count: required.length },
  };
}

/**
 * Get system health summary
 */
export async function getHealthSummary() {
  const report = await runReadinessChecks();

  return {
    status: report.status,
    ready: report.ready,
    timestamp: report.timestamp,
    uptime: report.uptime,
    version: report.version,
    environment: report.environment,
    checks: {
      total: report.summary.total,
      passed: report.summary.passed,
      failed: report.summary.failures,
      warnings: report.summary.warnings,
    },
  };
}
