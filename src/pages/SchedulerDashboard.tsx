// src/pages/SchedulerDashboard.tsx
// Admin dashboard for scheduled tasks and cron jobs

import { useState } from "react";
import {
  Calendar,
  Play,
  Pause,
  Trash2,
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle2,
  Plus,
  History,
} from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ScheduledJob, JobRun } from "@/types/scheduler";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

// Mock data
const mockJobs: ScheduledJob[] = [
  {
    id: "job_1",
    name: "Daily Email Digest",
    handler: "sendEmailDigest",
    schedule: "0 9 * * *",
    enabled: true,
    lastRun: new Date(Date.now() - 3600000).toISOString(),
    nextRun: new Date(Date.now() + 82800000).toISOString(),
    metadata: { type: "email", recipients: "subscribers" },
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "job_2",
    name: "Database Backup",
    handler: "backupDatabase",
    schedule: "0 2 * * *",
    enabled: true,
    lastRun: new Date(Date.now() - 7200000).toISOString(),
    nextRun: new Date(Date.now() + 61200000).toISOString(),
    retryPolicy: {
      maxAttempts: 3,
      backoffMs: 60000,
    },
    metadata: { target: "production", retention: "30d" },
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "job_3",
    name: "Generate Reports",
    handler: "generateMonthlyReports",
    schedule: "0 0 1 * *",
    enabled: false,
    lastRun: new Date(Date.now() - 86400000 * 5).toISOString(),
    nextRun: new Date(Date.now() + 86400000 * 25).toISOString(),
    metadata: { format: "pdf", distribution: "managers" },
    createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

const mockJobRuns: JobRun[] = [
  {
    id: "run_1",
    jobId: "job_1",
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 3598000).toISOString(),
    status: "completed",
    duration: 2000,
    output: "Sent 1,234 emails successfully",
  },
  {
    id: "run_2",
    jobId: "job_2",
    startedAt: new Date(Date.now() - 7200000).toISOString(),
    completedAt: new Date(Date.now() - 7080000).toISOString(),
    status: "completed",
    duration: 120000,
    output: "Backup completed: 2.4GB",
  },
  {
    id: "run_3",
    jobId: "job_1",
    startedAt: new Date(Date.now() - 90000000).toISOString(),
    completedAt: new Date(Date.now() - 89999000).toISOString(),
    status: "failed",
    duration: 1000,
    error: "SMTP connection timeout",
    attempt: 3,
  },
];

export default function SchedulerDashboard() {
  const [jobs, setJobs] = useState<ScheduledJob[]>(mockJobs);
  const [jobRuns] = useState<JobRun[]>(mockJobRuns);
  const [selectedJob, setSelectedJob] = useState<ScheduledJob | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter((j) => j.enabled).length,
    failedToday: jobRuns.filter((r) => r.status === "failed").length,
    avgDuration: Math.round(
      jobRuns
        .filter((r) => r.duration)
        .reduce((sum, r) => sum + (r.duration || 0), 0) /
        jobRuns.filter((r) => r.duration).length,
    ),
  };

  const handleToggleJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, enabled: !j.enabled } : j)),
    );
    toast.success("Job status updated");
  };

  const handleRunNow = (job: ScheduledJob) => {
    toast.loading("Starting job...", { id: job.id });
    setTimeout(() => {
      toast.success(`Job "${job.name}" started`, { id: job.id });
    }, 1000);
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    toast.success("Job deleted");
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Job created successfully");
    setCreateDialogOpen(false);
  };

  const getStatusBadge = (status: JobRun["status"]) => {
    const variants = {
      completed: {
        variant: "default" as const,
        icon: CheckCircle2,
        color: "text-green-500",
      },
      failed: {
        variant: "destructive" as const,
        icon: AlertCircle,
        color: "text-red-500",
      },
      running: {
        variant: "secondary" as const,
        icon: RefreshCw,
        color: "text-blue-500",
      },
    };
    const { variant, icon: Icon, color } = variants[status];
    return (
      <Badge variant={variant} className="flex items-center gap-1 w-fit">
        <Icon className={cn("h-3 w-3", color)} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Scheduled Tasks</h1>
          <p className="text-muted-foreground">
            Manage automated jobs and cron schedules
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <form onSubmit={handleCreateJob}>
              <DialogHeader>
                <DialogTitle>Create Scheduled Job</DialogTitle>
                <DialogDescription>
                  Define a new automated task with cron schedule
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Job Name</Label>
                  <Input
                    id="name"
                    placeholder="Daily Report Generation"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="handler">Handler Function</Label>
                  <Input
                    id="handler"
                    placeholder="generateDailyReport"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="schedule">Cron Schedule</Label>
                  <Input id="schedule" placeholder="0 9 * * *" required />
                  <p className="text-xs text-muted-foreground">
                    Example: "0 9 * * *" = Every day at 9:00 AM
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="metadata">Metadata (JSON)</Label>
                  <Textarea
                    id="metadata"
                    placeholder='{"key": "value"}'
                    className="font-mono text-sm"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="retryPolicy">Retry Policy</Label>
                  <Select defaultValue="3">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No retries</SelectItem>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Job</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Today</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failedToday}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgDuration}ms</div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Jobs</CardTitle>
          <CardDescription>Manage and monitor automated tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{job.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {job.handler}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {job.schedule}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant={job.enabled ? "default" : "secondary"}>
                      {job.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {job.lastRun
                      ? formatDistanceToNow(new Date(job.lastRun), {
                          addSuffix: true,
                        })
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDistanceToNow(new Date(job.nextRun), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleJob(job.id)}
                        title={job.enabled ? "Disable" : "Enable"}
                      >
                        {job.enabled ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRunNow(job)}
                        title="Run Now"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedJob(job)}
                        title="View History"
                      >
                        <History className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteJob(job.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Job History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Job Runs</CardTitle>
          <CardDescription>Execution history and logs</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {jobRuns.map((run) => {
                const job = jobs.find((j) => j.id === run.jobId);
                return (
                  <div
                    key={run.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{job?.name}</span>
                        {getStatusBadge(run.status)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {run.output || run.error}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(run.startedAt), {
                          addSuffix: true,
                        })}{" "}
                        • Duration: {run.duration}ms
                        {run.attempt &&
                          run.attempt > 1 &&
                          ` • Attempt ${run.attempt}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
