// src/app/api/admin/scheduler/runs/route.ts
// Job Run History Endpoint

import { SchedulerService } from '@/lib/scheduler/scheduler-service';
import { auth } from '@/firebase';

// GET /api/admin/scheduler/runs?jobId=xxx - Get job run history
export async function GET(request: Request) {
  try {
    const user = auth.currentUser;
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const limitStr = searchParams.get('limit');
    const limit = limitStr ? parseInt(limitStr, 10) : 50;

    if (!jobId) {
      return new Response(JSON.stringify({ error: 'jobId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const runs = await SchedulerService.getJobRuns(jobId, limit);

    return new Response(JSON.stringify({
      success: true,
      data: runs,
      count: runs.length,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Failed to fetch job runs:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to fetch job runs' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
