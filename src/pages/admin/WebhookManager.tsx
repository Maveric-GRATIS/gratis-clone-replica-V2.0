import { useState } from "react";
import {
  Webhook,
  Plus,
  Play,
  Pause,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Code,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  secret: string;
  createdAt: string;
  lastTriggered?: string;
  successCount: number;
  failureCount: number;
}

interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  status: "success" | "failure" | "pending";
  responseCode?: number;
  timestamp: string;
  duration: number;
}

const mockWebhooks: WebhookConfig[] = [
  {
    id: "wh_1",
    name: "Slack Notifications",
    url: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX",
    events: ["donation.created", "subscription.cancelled"],
    active: true,
    secret: "whsec_" + Math.random().toString(36).substring(2, 15),
    createdAt: "2024-01-15",
    lastTriggered: "2024-02-08T10:30:00Z",
    successCount: 1543,
    failureCount: 12,
  },
  {
    id: "wh_2",
    name: "CRM Integration",
    url: "https://api.crm.example.com/webhooks/gratis",
    events: ["user.created", "donation.created", "event.registered"],
    active: true,
    secret: "whsec_" + Math.random().toString(36).substring(2, 15),
    createdAt: "2023-11-20",
    lastTriggered: "2024-02-08T09:15:00Z",
    successCount: 3421,
    failureCount: 45,
  },
  {
    id: "wh_3",
    name: "Analytics Tracker",
    url: "https://analytics.example.com/ingest",
    events: ["*"],
    active: false,
    secret: "whsec_" + Math.random().toString(36).substring(2, 15),
    createdAt: "2024-02-01",
    successCount: 234,
    failureCount: 5,
  },
];

const mockDeliveries: WebhookDelivery[] = [
  {
    id: "del_1",
    webhookId: "wh_1",
    event: "donation.created",
    status: "success",
    responseCode: 200,
    timestamp: "2024-02-08T10:30:00Z",
    duration: 234,
  },
  {
    id: "del_2",
    webhookId: "wh_2",
    event: "user.created",
    status: "success",
    responseCode: 200,
    timestamp: "2024-02-08T09:15:00Z",
    duration: 156,
  },
  {
    id: "del_3",
    webhookId: "wh_1",
    event: "subscription.cancelled",
    status: "failure",
    responseCode: 500,
    timestamp: "2024-02-07T18:45:00Z",
    duration: 5023,
  },
];

const availableEvents = [
  "donation.created",
  "donation.updated",
  "subscription.created",
  "subscription.cancelled",
  "user.created",
  "user.updated",
  "event.created",
  "event.registered",
  "partner.approved",
  "project.created",
];

export default function WebhookManager() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(mockWebhooks);
  const [deliveries] = useState<WebhookDelivery[]>(mockDeliveries);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookConfig | null>(
    null,
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<Partial<WebhookConfig>>(
    {},
  );

  const handleCreateWebhook = () => {
    setEditingWebhook({
      name: "",
      url: "",
      events: [],
      active: true,
      secret: "whsec_" + Math.random().toString(36).substring(2, 15),
    });
    setSelectedWebhook(null);
    setEditDialogOpen(true);
  };

  const handleEditWebhook = (webhook: WebhookConfig) => {
    setEditingWebhook(webhook);
    setSelectedWebhook(webhook);
    setEditDialogOpen(true);
  };

  const handleDeleteWebhook = (webhook: WebhookConfig) => {
    setSelectedWebhook(webhook);
    setDeleteDialogOpen(true);
  };

  const handleTestWebhook = (webhook: WebhookConfig) => {
    setSelectedWebhook(webhook);
    setTestDialogOpen(true);
  };

  const handleSaveWebhook = () => {
    if (
      !editingWebhook.name ||
      !editingWebhook.url ||
      !editingWebhook.events ||
      editingWebhook.events.length === 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (selectedWebhook) {
      setWebhooks(
        webhooks.map((w) =>
          w.id === selectedWebhook.id
            ? ({ ...w, ...editingWebhook } as WebhookConfig)
            : w,
        ),
      );
      toast.success("Webhook updated successfully");
    } else {
      const newWebhook: WebhookConfig = {
        id: `wh_${Date.now()}`,
        name: editingWebhook.name!,
        url: editingWebhook.url!,
        events: editingWebhook.events!,
        active: editingWebhook.active !== false,
        secret:
          editingWebhook.secret ||
          "whsec_" + Math.random().toString(36).substring(2, 15),
        createdAt: new Date().toISOString().split("T")[0],
        successCount: 0,
        failureCount: 0,
      };
      setWebhooks([...webhooks, newWebhook]);
      toast.success("Webhook created successfully");
    }

    setEditDialogOpen(false);
    setEditingWebhook({});
  };

  const handleConfirmDelete = () => {
    if (selectedWebhook) {
      setWebhooks(webhooks.filter((w) => w.id !== selectedWebhook.id));
      toast.success("Webhook deleted successfully");
    }
    setDeleteDialogOpen(false);
    setSelectedWebhook(null);
  };

  const handleToggleWebhook = (webhook: WebhookConfig) => {
    setWebhooks(
      webhooks.map((w) =>
        w.id === webhook.id ? { ...w, active: !w.active } : w,
      ),
    );
    toast.success(`Webhook ${webhook.active ? "disabled" : "enabled"}`);
  };

  const handleSendTestEvent = () => {
    toast.loading("Sending test event...");
    setTimeout(() => {
      toast.success("Test event sent successfully!");
      setTestDialogOpen(false);
    }, 1500);
  };

  const toggleEvent = (event: string) => {
    const currentEvents = editingWebhook.events || [];
    const hasEvent = currentEvents.includes(event);

    setEditingWebhook({
      ...editingWebhook,
      events: hasEvent
        ? currentEvents.filter((e) => e !== event)
        : [...currentEvents, event],
    });
  };

  const getStatusBadge = (status: WebhookDelivery["status"]) => {
    const variants = {
      success: "bg-green-500",
      failure: "bg-red-500",
      pending: "bg-yellow-500",
    };
    return <Badge className={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 pt-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-500 rounded-xl">
            <Webhook className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Webhook Management</h1>
            <p className="text-muted-foreground">
              Configure and monitor webhook integrations
            </p>
          </div>
        </div>
        <Button onClick={handleCreateWebhook}>
          <Plus className="h-4 w-4 mr-2" />
          Create Webhook
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Webhooks</p>
                <p className="text-2xl font-bold">{webhooks.length}</p>
              </div>
              <Webhook className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-500">
                  {webhooks.filter((w) => w.active).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-500">
                  {webhooks.reduce((sum, w) => sum + w.successCount, 0) > 0
                    ? Math.round(
                        (webhooks.reduce((sum, w) => sum + w.successCount, 0) /
                          webhooks.reduce(
                            (sum, w) => sum + w.successCount + w.failureCount,
                            0,
                          )) *
                          100,
                      )
                    : 100}
                  %
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed Today</p>
                <p className="text-2xl font-bold text-red-500">
                  {deliveries.filter((d) => d.status === "failure").length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="webhooks">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="deliveries">Recent Deliveries</TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configured Webhooks</CardTitle>
              <CardDescription>
                Manage webhook endpoints and their configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Success</TableHead>
                    <TableHead>Failures</TableHead>
                    <TableHead>Last Triggered</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhooks.map((webhook) => (
                    <TableRow key={webhook.id}>
                      <TableCell className="font-medium">
                        {webhook.name}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm font-mono">
                        {webhook.url}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {webhook.events.includes("*")
                            ? "All Events"
                            : `${webhook.events.length} events`}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {webhook.active ? (
                          <Badge className="bg-green-500">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-green-600">
                        {webhook.successCount}
                      </TableCell>
                      <TableCell className="text-red-600">
                        {webhook.failureCount}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {webhook.lastTriggered
                          ? new Date(webhook.lastTriggered).toLocaleString()
                          : "Never"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleWebhook(webhook)}
                            title={webhook.active ? "Disable" : "Enable"}
                          >
                            {webhook.active ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleTestWebhook(webhook)}
                            title="Test"
                          >
                            <Code className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditWebhook(webhook)}
                          >
                            <Code className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteWebhook(webhook)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliveries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Deliveries</CardTitle>
              <CardDescription>
                View webhook delivery attempts and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Webhook</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Response Code</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map((delivery) => {
                    const webhook = webhooks.find(
                      (w) => w.id === delivery.webhookId,
                    );
                    return (
                      <TableRow key={delivery.id}>
                        <TableCell className="font-mono text-sm">
                          {new Date(delivery.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>{webhook?.name || "Unknown"}</TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {delivery.event}
                          </code>
                        </TableCell>
                        <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                        <TableCell>
                          {delivery.responseCode && (
                            <Badge
                              variant={
                                delivery.status === "success"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {delivery.responseCode}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {delivery.duration}ms
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Webhook Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedWebhook ? "Edit Webhook" : "Create Webhook"}
            </DialogTitle>
            <DialogDescription>
              {selectedWebhook
                ? "Modify webhook configuration"
                : "Configure a new webhook endpoint"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editingWebhook.name || ""}
                onChange={(e) =>
                  setEditingWebhook({ ...editingWebhook, name: e.target.value })
                }
                placeholder="e.g. Slack Notifications"
              />
            </div>

            <div>
              <Label htmlFor="url">Endpoint URL</Label>
              <Input
                id="url"
                value={editingWebhook.url || ""}
                onChange={(e) =>
                  setEditingWebhook({ ...editingWebhook, url: e.target.value })
                }
                placeholder="https://example.com/webhooks/gratis"
              />
            </div>

            <div>
              <Label htmlFor="secret">Signing Secret</Label>
              <Input
                id="secret"
                value={editingWebhook.secret || ""}
                onChange={(e) =>
                  setEditingWebhook({
                    ...editingWebhook,
                    secret: e.target.value,
                  })
                }
                placeholder="whsec_..."
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Used to verify webhook signatures
              </p>
            </div>

            <div>
              <Label>Events to Subscribe</Label>
              <div className="grid grid-cols-2 gap-2 mt-2 border rounded-lg p-4 max-h-48 overflow-y-auto">
                {availableEvents.map((event) => (
                  <div key={event} className="flex items-center space-x-2">
                    <Switch
                      id={event}
                      checked={(editingWebhook.events || []).includes(event)}
                      onCheckedChange={() => toggleEvent(event)}
                    />
                    <Label
                      htmlFor={event}
                      className="cursor-pointer font-mono text-sm"
                    >
                      {event}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={editingWebhook.active !== false}
                onCheckedChange={(checked) =>
                  setEditingWebhook({ ...editingWebhook, active: checked })
                }
              />
              <Label htmlFor="active">Enable webhook</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveWebhook}>
              {selectedWebhook ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Webhook Dialog */}
      <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Webhook</DialogTitle>
            <DialogDescription>
              Send a test event to "{selectedWebhook?.name}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Test Event</Label>
              <select className="w-full border rounded-md p-2 mt-1">
                {availableEvents.map((event) => (
                  <option key={event} value={event}>
                    {event}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Sample Payload</Label>
              <Textarea
                readOnly
                rows={6}
                className="font-mono text-xs"
                value={JSON.stringify(
                  {
                    event: "donation.created",
                    timestamp: new Date().toISOString(),
                    data: {
                      id: "don_test_123",
                      amount: 50.0,
                      currency: "EUR",
                    },
                  },
                  null,
                  2,
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTestDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendTestEvent}>
              <Code className="h-4 w-4 mr-2" />
              Send Test Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Webhook</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedWebhook?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
