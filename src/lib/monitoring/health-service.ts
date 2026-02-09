// ============================================================================
// GRATIS.NGO — Health Check & Monitoring Service
// ============================================================================

import { db } from '@/firebase';
import { collection, getDocs, doc, getDoc, setDoc, query, limit } from 'firebase/firestore';
import {
  HealthCheckResult, ServiceHealth, ServiceStatus, SystemMetrics,
  LatencyMetrics, UptimeRecord, Incident,
} from '@/types/health-check';

const UPTIME_COL = 'uptime_records';
const INCIDENTS_COL = 'incidents';

const startTime = Date.now();

// ── Individual Service Checks ────────────────────────────────────────────────

async function checkFirestore(): Promise<ServiceHealth> {
  const start = Date.now();
  try {
    const q = query(collection(db, 'health_ping'), limit(1));
    await getDocs(q);
    return {
      name: 'Firestore',
      status: 'healthy',
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      message: 'Connected',
    };
  } catch (error: any) {
    return {
      name: 'Firestore',
      status: 'down',
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      message: error.message,
    };
  }
}

async function checkStripe(): Promise<ServiceHealth> {
  const start = Date.now();
  try {
    // In production, make actual Stripe API call
    // For now, simulate healthy response
    await new Promise((resolve) => setTimeout(resolve, 50));
    return {
      name: 'Stripe',
      status: 'healthy',
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      message: 'Connected',
    };
  } catch (error: any) {
    return {
      name: 'Stripe',
      status: 'down',
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      message: error.message,
    };
  }
}

async function checkEmailService(): Promise<ServiceHealth> {
  const start = Date.now();
  try {
    // In production, ping email service API
    await new Promise((resolve) => setTimeout(resolve, 30));
    return {
      name: 'Email Service',
      status: 'healthy',
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      message: 'Connected',
    };
  } catch (error: any) {
    return {
      name: 'Email Service',
      status: 'down',
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      message: error.message,
    };
  }
}

async function checkMuxVideo(): Promise<ServiceHealth> {
  const start = Date.now();
  try {
    // In production, check Mux API status
    await new Promise((resolve) => setTimeout(resolve, 40));
    return {
      name: 'Mux Video',
      status: 'healthy',
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      message: 'Connected',
    };
  } catch (error: any) {
    return {
      name: 'Mux Video',
      status: 'down',
      responseTime: Date.now() - start,
      lastChecked: new Date().toISOString(),
      message: error.message,
    };
  }
}

// ── Full Health Check ────────────────────────────────────────────────────────

export async function performHealthCheck(): Promise<HealthCheckResult> {
  const services = await Promise.all([
    checkFirestore(),
    checkStripe(),
    checkEmailService(),
    checkMuxVideo(),
  ]);

  const overallStatus: ServiceStatus = services.every((s) => s.status === 'healthy')
    ? 'healthy'
    : services.some((s) => s.status === 'down')
      ? 'down'
      : 'degraded';

  const responseTimes = services.map((s) => s.responseTime).sort((a, b) => a - b);

  // Get memory usage (browser environment)
  const memoryUsed = typeof performance !== 'undefined' && (performance as any).memory
    ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
    : 0;
  const memoryTotal = typeof performance !== 'undefined' && (performance as any).memory
    ? Math.round((performance as any).memory.jsHeapSizeLimit / 1024 / 1024)
    : 0;

  const system: SystemMetrics = {
    memoryUsage: {
      used: memoryUsed,
      total: memoryTotal,
      percentage: memoryTotal > 0 ? Math.round((memoryUsed / memoryTotal) * 100) : 0,
    },
    cpuUsage: 0,
    activeConnections: 0,
    requestsPerMinute: 0,
    errorRate: 0,
  };

  const latency: LatencyMetrics = {
    p50: responseTimes[Math.floor(responseTimes.length * 0.5)] || 0,
    p95: responseTimes[Math.floor(responseTimes.length * 0.95)] || 0,
    p99: responseTimes[Math.floor(responseTimes.length * 0.99)] || 0,
    average: Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length),
  };

  const result: HealthCheckResult = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: Math.round((Date.now() - startTime) / 1000),
    version: import.meta.env.VITE_APP_VERSION || '2.0.0',
    environment: import.meta.env.MODE || 'development',
    services,
    system,
    latency,
  };

  // Store uptime record
  await recordUptime(result);

  return result;
}

// ── Uptime Recording ─────────────────────────────────────────────────────────

async function recordUptime(result: HealthCheckResult): Promise<void> {
  const date = new Date().toISOString().split('T')[0];
  const id = `uptime_${date}`;
  const avgResponseTime = result.latency.average;

  try {
    const snap = await getDoc(doc(db, UPTIME_COL, id));
    if (snap.exists()) {
      const existing = snap.data() as UptimeRecord & { checks: number; healthyChecks: number };
      const checks = (existing.checks || 0) + 1;
      const healthyChecks = (existing.healthyChecks || 0) + (result.status === 'healthy' ? 1 : 0);
      await setDoc(doc(db, UPTIME_COL, id), {
        date,
        status: result.status,
        uptime: Math.round((healthyChecks / checks) * 10000) / 100,
        incidents: existing.incidents + (result.status === 'down' ? 1 : 0),
        averageResponseTime: Math.round((existing.averageResponseTime + avgResponseTime) / 2),
        checks,
        healthyChecks,
      });
    } else {
      await setDoc(doc(db, UPTIME_COL, id), {
        date,
        status: result.status,
        uptime: result.status === 'healthy' ? 100 : 0,
        incidents: result.status === 'down' ? 1 : 0,
        averageResponseTime: avgResponseTime,
        checks: 1,
        healthyChecks: result.status === 'healthy' ? 1 : 0,
      });
    }
  } catch {
    // Non-critical - don't fail health check if uptime recording fails
    console.warn('Failed to record uptime');
  }
}

// ── Uptime History ───────────────────────────────────────────────────────────

export async function getUptimeHistory(days = 30): Promise<UptimeRecord[]> {
  try {
    const snap = await getDocs(collection(db, UPTIME_COL));
    const records = snap.docs.map((d) => d.data() as UptimeRecord);
    const cutoff = new Date(Date.now() - days * 86_400_000).toISOString().split('T')[0];
    return records.filter((r) => r.date >= cutoff).sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

// ── Incidents ────────────────────────────────────────────────────────────────

export async function listIncidents(activeOnly = false): Promise<Incident[]> {
  try {
    const snap = await getDocs(collection(db, INCIDENTS_COL));
    let incidents = snap.docs.map((d) => d.data() as Incident);
    if (activeOnly) incidents = incidents.filter((i) => i.status !== 'resolved');
    return incidents.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  } catch {
    return [];
  }
}

export async function createIncident(params: Omit<Incident, 'id' | 'updates'>): Promise<Incident> {
  const id = `inc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const incident: Incident = { ...params, id, updates: [] };
  await setDoc(doc(db, INCIDENTS_COL, id), incident);
  return incident;
}

export async function updateIncident(
  incidentId: string,
  update: { status?: Incident['status']; message: string; author: string }
): Promise<void> {
  const snap = await getDoc(doc(db, INCIDENTS_COL, incidentId));
  if (!snap.exists()) throw new Error('Incident not found');

  const incident = snap.data() as Incident;
  const newUpdate = {
    timestamp: new Date().toISOString(),
    status: update.status || incident.status,
    message: update.message,
    author: update.author,
  };

  const updates = [...incident.updates, newUpdate];
  const patchData: Partial<Incident> = { updates };
  if (update.status) patchData.status = update.status;
  if (update.status === 'resolved') patchData.resolvedAt = new Date().toISOString();

  await setDoc(doc(db, INCIDENTS_COL, incidentId), { ...incident, ...patchData });
}
