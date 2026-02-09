import React from 'react';
import { ActivityTimeline } from '@/components/activity/ActivityTimeline';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ActivityDemo() {
  return (
    <div className="min-h-screen bg-[#0f172a] pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/part17-test">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Part 17
            </Button>
          </Link>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Activity Timeline Demo</h1>
          <p className="text-gray-400">
            Real-time activity stream with reactions, pinned entries, and advanced filtering.
          </p>
        </div>

        <ActivityTimeline />
      </div>
    </div>
  );
}
