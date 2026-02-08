// src/app/api/admin/scheduler/execute/route.ts
// Manual Job Execution Endpoint

import { SchedulerService } from '@/lib/scheduler/scheduler-service';
import { auth } from '@/firebase';

// POST /api/admin/scheduler/execute?jobId=xxx - Execute job manually
export async function POST(request: Request) {
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

    if (!jobId) {
      return new Response(JSON.stringify({ error: 'jobId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const runId = await SchedulerService.executeJob(jobId, 'manual');

    return new Response(JSON.stringify({
      success: true,
      data: { runId },
      message: 'Job executed successfully',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Failed to execute job:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to execute job' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
