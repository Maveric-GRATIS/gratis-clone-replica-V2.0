// src/pages/admin/ModerationQueue.tsx
// Admin moderation queue dashboard

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Flag,
  Eye,
  Trash2,
  TrendingUp,
  Search,
  Filter,
} from "lucide-react";
import { ModerationService } from "@/lib/moderation/moderation-service";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type {
  ModerationItem,
  ModerationAction,
  ModerationStatus,
} from "@/types/moderation";

export default function ModerationQueue() {
  const { user } = useAuth();
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [filterStatus, setFilterStatus] = useState<ModerationStatus | "all">(
    "pending",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    pending: 0,
    flagged: 0,
    approved: 0,
    rejected: 0,
    autoApproved: 0,
  });

  useEffect(() => {
    loadQueue();
  }, [filterStatus]);

  const loadQueue = async () => {
    setLoading(true);
    try {
      const statusFilter = filterStatus === "all" ? undefined : filterStatus;
      const data = await ModerationService.getQueueItems(statusFilter, 100);
      setItems(data);

      // Calculate stats
      const pending = data.filter((i) => i.status === "pending").length;
      const flagged = data.filter((i) => i.status === "flagged").length;
      const approved = data.filter((i) => i.status === "approved").length;
      const rejected = data.filter((i) => i.status === "rejected").length;
      const autoApproved = data.filter(
        (i) => i.status === "auto_approved",
      ).length;

      setStats({ pending, flagged, approved, rejected, autoApproved });
    } catch (error) {
      console.error("Failed to load moderation queue:", error);
      toast.error("Failed to load moderation queue");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (action: ModerationAction) => {
    if (!selectedItem || !user) return;

    try {
      await ModerationService.review(
        selectedItem.id,
        action,
        user.uid,
        reviewNote,
      );
      toast.success(`Content ${action}d successfully`);
      setSelectedItem(null);
      setReviewNote("");
      loadQueue();
    } catch (error) {
      console.error("Failed to review content:", error);
      toast.error("Failed to review content");
    }
  };

  const getStatusBadge = (status: ModerationStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "flagged":
        return (
          <Badge className="bg-red-500">
            <Flag className="w-3 h-3 mr-1" />
            Flagged
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case "auto_approved":
        return (
          <Badge className="bg-blue-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Auto-Approved
          </Badge>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 0.3) return "text-green-600";
    if (score < 0.7) return "text-amber-600";
    return "text-red-600";
  };

  const filteredItems = items.filter(
    (item) =>
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authorName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Content Moderation Queue</h1>
          <p className="text-muted-foreground">
            Review and moderate user-generated content
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Review
              </CardTitle>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting moderation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Flagged</CardTitle>
              <Flag className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.flagged}</div>
              <p className="text-xs text-muted-foreground">User reports</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Manually reviewed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground">Violations found</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Auto-Approved
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.autoApproved}</div>
              <p className="text-xs text-muted-foreground">AI verified</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Moderation Queue</CardTitle>
                <CardDescription>
                  Filter and review content items
                </CardDescription>
              </div>
              <Button onClick={loadQueue} variant="outline" size="sm">
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search content or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={filterStatus}
                onValueChange={(value) =>
                  setFilterStatus(value as ModerationStatus | "all")
                }
              >
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="auto_approved">Auto-Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Queue Table */}
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading queue...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No items found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Content</th>
                      <th className="pb-3 font-medium">Type</th>
                      <th className="pb-3 font-medium">Author</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Score</th>
                      <th className="pb-3 font-medium">Flags</th>
                      <th className="pb-3 font-medium">Created</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="text-sm">
                        <td className="py-3 max-w-md">
                          <div className="line-clamp-2">{item.content}</div>
                        </td>
                        <td className="py-3">
                          <Badge variant="outline">{item.contentType}</Badge>
                        </td>
                        <td className="py-3">{item.authorName}</td>
                        <td className="py-3">{getStatusBadge(item.status)}</td>
                        <td className="py-3">
                          {item.autoScore ? (
                            <span
                              className={`font-medium ${getScoreColor(item.autoScore.overall)}`}
                            >
                              {(item.autoScore.overall * 100).toFixed(0)}%
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-3">
                          {item.flags.length > 0 ? (
                            <Badge variant="destructive">
                              {item.flags.length}
                            </Badge>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          <Button
                            onClick={() => setSelectedItem(item)}
                            variant="outline"
                            size="sm"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Review Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Review Content</DialogTitle>
            <DialogDescription>
              Decide whether to approve or reject this content
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              {/* Content */}
              <div>
                <label className="text-sm font-medium">Content</label>
                <div className="mt-1 p-3 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedItem.content}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedItem.contentType}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Author</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedItem.authorName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedItem.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Created</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedItem.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Auto Score */}
              {selectedItem.autoScore && (
                <div>
                  <label className="text-sm font-medium">AI Analysis</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Overall Risk Score</span>
                      <span
                        className={`font-bold ${getScoreColor(selectedItem.autoScore.overall)}`}
                      >
                        {(selectedItem.autoScore.overall * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="space-y-1">
                      {Object.entries(selectedItem.autoScore.categories).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center gap-2 text-xs"
                          >
                            <span className="w-24 capitalize">
                              {key.replace("_", " ")}
                            </span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-500"
                                style={{ width: `${value * 100}%` }}
                              />
                            </div>
                            <span className="w-12 text-right">
                              {(value * 100).toFixed(0)}%
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2 border-t">
                      <span>AI Decision</span>
                      <Badge>
                        {selectedItem.autoScore.autoDecision} (
                        {(selectedItem.autoScore.confidence * 100).toFixed(0)}%
                        confidence)
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Flags */}
              {selectedItem.flags.length > 0 && (
                <div>
                  <label className="text-sm font-medium">
                    User Reports ({selectedItem.flags.length})
                  </label>
                  <div className="mt-2 space-y-2">
                    {selectedItem.flags.map((flag) => (
                      <div
                        key={flag.id}
                        className="p-3 bg-muted rounded-lg text-sm"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">
                            {flag.reporterName}
                          </span>
                          <Badge variant="outline">{flag.reason}</Badge>
                        </div>
                        {flag.details && (
                          <p className="text-muted-foreground">
                            {flag.details}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(flag.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Note */}
              <div>
                <label className="text-sm font-medium">
                  Review Note (Optional)
                </label>
                <Textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Add internal notes about this review..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              onClick={() => handleReview("approve")}
              className="bg-green-600"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button
              onClick={() => handleReview("reject")}
              variant="destructive"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button onClick={() => handleReview("flag")} variant="outline">
              <Flag className="w-4 h-4 mr-2" />
              Flag for Escalation
            </Button>
            <Button onClick={() => handleReview("delete")} variant="outline">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
