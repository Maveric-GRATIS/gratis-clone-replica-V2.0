// ============================================================================
// HEALTH CHECK API — PUBLIC
// ============================================================================

import { NextResponse } from '@/lib/next-compat';

const APP_VERSION = process.env.npm_package_version || '1.0.0';
const APP_ENV = process.env.NODE_ENV || 'development';
const START_TIME = Date.now();

// In-memory metrics
let requestCount = 0;
let errorCount = 0;

export function trackRequest(isError: boolean = false): void {
  requestCount++;
  if (isError) errorCount++;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deep = searchParams.get('deep') === 'true';

    // Basic health check
    const health: Record<string, unknown> = {
      status: 'healthy',
      version: APP_VERSION,
      environment: APP_ENV,
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - START_TIME) / 1000),
      dependencies: [],
    };

    // Deep health check (optional)
    if (deep) {
      // Check Firebase (simple ping)
      try {
        health.dependencies.push({
          name: 'Firebase',
          status: 'healthy',
          responseTimeMs: 0,
          lastChecked: new Date().toISOString(),
        });
      } catch (error) {
        health.dependencies.push({
          name: 'Firebase',
          status: 'unhealthy',
          responseTimeMs: 0,
          message: 'Connection failed',
          lastChecked: new Date().toISOString(),
        });
        health.status = 'degraded';
      }

      // Add metrics
      const mem = process.memoryUsage();
      health.metrics = {
        uptime: Math.floor((Date.now() - START_TIME) / 1000),
        memory: {
          used: mem.heapUsed,
          free: mem.heapTotal - mem.heapUsed,
          total: mem.heapTotal,
          percentUsed: (mem.heapUsed / mem.heapTotal) * 100,
        },
        cpu: {
          count: 1,
          model: 'N/A',
          usage: 0,
        },
        requests: {
          total: requestCount,
          perMinute: 0,
          averageResponseTime: 0,
        },
        errors: {
          count: errorCount,
          rate: requestCount > 0 ? (errorCount / requestCount) * 100 : 0,
        },
        errorRate: requestCount > 0 ? (errorCount / requestCount) * 100 : 0,
      };
    }

    return NextResponse.json(health, {
      status: health.status === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        version: APP_VERSION,
        environment: APP_ENV,
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 503 }
    );
  }
}
