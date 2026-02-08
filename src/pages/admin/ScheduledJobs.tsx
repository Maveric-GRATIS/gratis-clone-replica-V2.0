// ScheduledJobs.tsx - Cron Job Management Dashboard

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Clock,
  Play,
  Pause,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { schedulerService } from "@/lib/scheduler/scheduler-service";
import type { ScheduledJob, JobRun } from "@/types/scheduler";
import { useToast } from "@/hooks/use-toast";

export default function ScheduledJobs() {
  const [jobs, setJobs] = useState<ScheduledJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<ScheduledJob | null>(null);
  const [jobRuns, setJobRuns] = useState<JobRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (selectedJob?.id) {
      loadJobRuns(selectedJob.id);
    }
  }, [selectedJob]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      // Mock data - Scheduler service not fully implemented yet
      const mockJobs: ScheduledJob[] = [];
      setJobs(mockJobs);
    } catch (error) {
      console.error("Failed to load jobs:", error);
      toast({
        title: "Error",
        description: "Failed to load scheduled jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadJobRuns = async (jobId: string) => {
    try {
      // Mock data - Job runs not implemented yet
      const mockRuns: JobRun[] = [];
      setJobRuns(mockRuns);
    } catch (error) {
      console.error("Failed to load job runs:", error);
    }
  };

  const handleExecuteJob = async (jobId: string, jobName: string) => {
    setExecuting(jobId);
    try {
      // Mock implementation - job execution to be completed
      toast({
        title: "Success",
        description: `"${jobName}" executed successfully (mock)`,
      });
      await loadJobs();
      if (selectedJob?.id === jobId) {
        await loadJobRuns(jobId);
      }
    } catch (error) {
      console.error("Failed to execute job:", error);
      toast({
        title: "Error",
        description: "Failed to execute job",
        variant: "destructive",
      });
    } finally {
      setExecuting(null);
    }
  };

  const handleToggleJob = async (job: ScheduledJob) => {
    try {
      const newStatus = job.status === "active" ? "paused" : "active";
      // Mock implementation - toggle functionality to be completed
      toast({
        title: "Success",
        description: `Job ${newStatus} (mock)`,
      });
      await loadJobs();
    } catch (error) {
      console.error("Failed to toggle job:", error);
      toast({
        title: "Error",
        description: "Failed to update job status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200";
      case "disabled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "";
    }
  };

  const getRunStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "failure":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "running":
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Clock className="w-8 h-8" />
              Scheduled Jobs
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage cron jobs and scheduled tasks
            </p>
          </div>
          <Button onClick={loadJobs} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Jobs</CardDescription>
              <CardTitle className="text-3xl">{jobs.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active</CardDescription>
              <CardTitle className="text-3xl">
                {jobs.filter((j) => j.status === "active").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Paused</CardDescription>
              <CardTitle className="text-3xl">
                {jobs.filter((j) => j.status === "paused").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Success Rate</CardDescription>
              <CardTitle className="text-3xl">
                {jobs.length > 0
                  ? Math.round(
                      (jobs.filter((j) => j.lastRunStatus === "success")
                        .length /
                        jobs.length) *
                        100,
                    )
                  : 0}
                %
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Jobs List */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Jobs</CardTitle>
            <CardDescription>View and manage automated tasks</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading jobs...
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No scheduled jobs configured
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 border rounded-lg space-y-3 hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{job.name}</h3>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                          {job.lastRunStatus && (
                            <div className="flex items-center gap-1">
                              {getRunStatusIcon(job.lastRunStatus)}
                              <span className="text-xs text-muted-foreground">
                                {job.lastRunStatus}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {job.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExecuteJob(job.id!, job.name);
                          }}
                          disabled={executing === job.id}
                        >
                          {executing === job.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleJob(job);
                          }}
                        >
                          {job.status === "active" ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-muted px-2 py-1 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {job.schedule}
                      </span>
                      {job.lastRunAt && (
                        <span className="bg-muted px-2 py-1 rounded">
                          Last: {new Date(job.lastRunAt).toLocaleString()}
                        </span>
                      )}
                      {job.nextRunAt && (
                        <span className="bg-muted px-2 py-1 rounded">
                          Next: {new Date(job.nextRunAt).toLocaleString()}
                        </span>
                      )}
                      {false && (
                        <span className="bg-muted px-2 py-1 rounded">
                          Duration: N/A
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Job Details Dialog */}
        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {selectedJob?.name}
              </DialogTitle>
              <DialogDescription>{selectedJob?.description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Job Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Handler
                  </Label>
                  <p className="text-sm font-mono">{selectedJob?.handler}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Schedule
                  </Label>
                  <p className="text-sm font-mono">{selectedJob?.schedule}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Status
                  </Label>
                  <Badge className={getStatusColor(selectedJob?.status || "")}>
                    {selectedJob?.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Timeout
                  </Label>
                  <p className="text-sm">{selectedJob?.timeout || 300000}ms</p>
                </div>
              </div>

              {/* Recent Runs */}
              <div>
                <h4 className="font-semibold mb-3">Recent Runs</h4>
                {jobRuns.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No runs yet
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {jobRuns.map((run) => (
                      <div
                        key={run.id}
                        className="flex items-center gap-3 p-3 border rounded"
                      >
                        {getRunStatusIcon(run.status)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-mono">
                              {new Date(run.startedAt!).toLocaleString()}
                            </span>
                            {run.duration && (
                              <span className="text-muted-foreground">
                                {formatDuration(run.duration)}
                              </span>
                            )}
                          </div>
                          {run.error && (
                            <p className="text-xs text-red-600 mt-1">
                              {run.error}
                            </p>
                          )}
                          {run.output && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {JSON.stringify(run.output).substring(0, 100)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedJob(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

function Label({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`font-medium ${className}`}>{children}</div>;
}
