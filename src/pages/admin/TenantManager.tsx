import { useState } from "react";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Settings,
  Users,
  Database,
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

interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  status: "active" | "suspended" | "trial";
  plan: "free" | "starter" | "business" | "enterprise";
  userCount: number;
  storage: number; // in MB
  createdAt: string;
  settings: {
    customBranding: boolean;
    apiAccess: boolean;
    webhooks: boolean;
    analytics: boolean;
  };
}

const mockTenants: Tenant[] = [
  {
    id: "tenant_1",
    name: "GRATIS Main",
    slug: "gratis-main",
    domain: "gratis.ngo",
    status: "active",
    plan: "enterprise",
    userCount: 1543,
    storage: 15234,
    createdAt: "2023-01-15",
    settings: {
      customBranding: true,
      apiAccess: true,
      webhooks: true,
      analytics: true,
    },
  },
  {
    id: "tenant_2",
    name: "Partner NGO Netherlands",
    slug: "partner-nl",
    domain: "partner-nl.gratis.ngo",
    status: "active",
    plan: "business",
    userCount: 234,
    storage: 5420,
    createdAt: "2023-06-20",
    settings: {
      customBranding: true,
      apiAccess: true,
      webhooks: false,
      analytics: true,
    },
  },
  {
    id: "tenant_3",
    name: "Demo Organization",
    slug: "demo-org",
    status: "trial",
    plan: "starter",
    userCount: 12,
    storage: 234,
    createdAt: "2024-01-10",
    settings: {
      customBranding: false,
      apiAccess: false,
      webhooks: false,
      analytics: true,
    },
  },
];

export default function TenantManager() {
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Partial<Tenant>>({});

  const handleCreateTenant = () => {
    setEditingTenant({
      name: "",
      slug: "",
      status: "trial",
      plan: "starter",
      userCount: 0,
      storage: 0,
      settings: {
        customBranding: false,
        apiAccess: false,
        webhooks: false,
        analytics: true,
      },
    });
    setSelectedTenant(null);
    setEditDialogOpen(true);
  };

  const handleEditTenant = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setSelectedTenant(tenant);
    setEditDialogOpen(true);
  };

  const handleDeleteTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setDeleteDialogOpen(true);
  };

  const handleSaveTenant = () => {
    if (!editingTenant.name || !editingTenant.slug) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (selectedTenant) {
      setTenants(
        tenants.map((t) =>
          t.id === selectedTenant.id
            ? ({ ...t, ...editingTenant } as Tenant)
            : t,
        ),
      );
      toast.success("Tenant updated successfully");
    } else {
      const newTenant: Tenant = {
        id: `tenant_${Date.now()}`,
        name: editingTenant.name!,
        slug: editingTenant.slug!,
        status: editingTenant.status || "trial",
        plan: editingTenant.plan || "starter",
        userCount: 0,
        storage: 0,
        createdAt: new Date().toISOString().split("T")[0],
        settings: editingTenant.settings || {
          customBranding: false,
          apiAccess: false,
          webhooks: false,
          analytics: true,
        },
      };
      setTenants([...tenants, newTenant]);
      toast.success("Tenant created successfully");
    }

    setEditDialogOpen(false);
    setEditingTenant({});
  };

  const handleConfirmDelete = () => {
    if (selectedTenant) {
      setTenants(tenants.filter((t) => t.id !== selectedTenant.id));
      toast.success("Tenant deleted successfully");
    }
    setDeleteDialogOpen(false);
    setSelectedTenant(null);
  };

  const getStatusBadge = (status: Tenant["status"]) => {
    const variants = {
      active: "bg-green-500",
      suspended: "bg-red-500",
      trial: "bg-yellow-500",
    };
    return <Badge className={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const getPlanBadge = (plan: Tenant["plan"]) => {
    const variants = {
      free: "secondary",
      starter: "outline",
      business: "default",
      enterprise: "bg-purple-500",
    };
    return <Badge variant={variants[plan] as any}>{plan.toUpperCase()}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 pt-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500 rounded-xl">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Tenant Management</h1>
            <p className="text-muted-foreground">
              Manage multi-tenant organizations and configurations
            </p>
          </div>
        </div>
        <Button onClick={handleCreateTenant}>
          <Plus className="h-4 w-4 mr-2" />
          Create Tenant
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tenants</p>
                <p className="text-2xl font-bold">{tenants.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-500">
                  {tenants.filter((t) => t.status === "active").length}
                </p>
              </div>
              <Settings className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">
                  {tenants.reduce((sum, t) => sum + t.userCount, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold">
                  {(
                    tenants.reduce((sum, t) => sum + t.storage, 0) / 1024
                  ).toFixed(1)}{" "}
                  GB
                </p>
              </div>
              <Database className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tenants Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tenants</CardTitle>
          <CardDescription>
            Manage organization tenants and their configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell className="font-medium">{tenant.name}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {tenant.slug}
                    </code>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {tenant.domain || "-"}
                  </TableCell>
                  <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                  <TableCell>{getPlanBadge(tenant.plan)}</TableCell>
                  <TableCell>{tenant.userCount.toLocaleString()}</TableCell>
                  <TableCell>{(tenant.storage / 1024).toFixed(2)} GB</TableCell>
                  <TableCell>
                    {new Date(tenant.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditTenant(tenant)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteTenant(tenant)}
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

      {/* Edit Tenant Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedTenant ? "Edit Tenant" : "Create Tenant"}
            </DialogTitle>
            <DialogDescription>
              {selectedTenant
                ? "Modify tenant configuration"
                : "Create a new organization tenant"}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div>
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  value={editingTenant.name || ""}
                  onChange={(e) =>
                    setEditingTenant({ ...editingTenant, name: e.target.value })
                  }
                  placeholder="e.g. Partner NGO"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={editingTenant.slug || ""}
                  onChange={(e) =>
                    setEditingTenant({
                      ...editingTenant,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    })
                  }
                  placeholder="e.g. partner-ngo"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Used in URLs: {editingTenant.slug || "slug"}.gratis.ngo
                </p>
              </div>

              <div>
                <Label htmlFor="domain">Custom Domain (Optional)</Label>
                <Input
                  id="domain"
                  value={editingTenant.domain || ""}
                  onChange={(e) =>
                    setEditingTenant({
                      ...editingTenant,
                      domain: e.target.value,
                    })
                  }
                  placeholder="e.g. partner.org"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="w-full border rounded-md p-2"
                    value={editingTenant.status}
                    onChange={(e) =>
                      setEditingTenant({
                        ...editingTenant,
                        status: e.target.value as any,
                      })
                    }
                  >
                    <option value="trial">Trial</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="plan">Plan</Label>
                  <select
                    id="plan"
                    className="w-full border rounded-md p-2"
                    value={editingTenant.plan}
                    onChange={(e) =>
                      setEditingTenant({
                        ...editingTenant,
                        plan: e.target.value as any,
                      })
                    }
                  >
                    <option value="free">Free</option>
                    <option value="starter">Starter</option>
                    <option value="business">Business</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Custom Branding</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow custom logo and colors
                    </p>
                  </div>
                  <Switch
                    checked={editingTenant.settings?.customBranding}
                    onCheckedChange={(checked) =>
                      setEditingTenant({
                        ...editingTenant,
                        settings: {
                          ...editingTenant.settings!,
                          customBranding: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>API Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable REST API access
                    </p>
                  </div>
                  <Switch
                    checked={editingTenant.settings?.apiAccess}
                    onCheckedChange={(checked) =>
                      setEditingTenant({
                        ...editingTenant,
                        settings: {
                          ...editingTenant.settings!,
                          apiAccess: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Webhooks</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable webhook integrations
                    </p>
                  </div>
                  <Switch
                    checked={editingTenant.settings?.webhooks}
                    onCheckedChange={(checked) =>
                      setEditingTenant({
                        ...editingTenant,
                        settings: {
                          ...editingTenant.settings!,
                          webhooks: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Advanced Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Access to detailed analytics
                    </p>
                  </div>
                  <Switch
                    checked={editingTenant.settings?.analytics}
                    onCheckedChange={(checked) =>
                      setEditingTenant({
                        ...editingTenant,
                        settings: {
                          ...editingTenant.settings!,
                          analytics: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTenant}>
              {selectedTenant ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tenant</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedTenant?.name}"? This
              will permanently remove:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>{selectedTenant?.userCount} user accounts</li>
                <li>
                  {(selectedTenant?.storage || 0 / 1024).toFixed(2)} GB of data
                </li>
                <li>All tenant configurations</li>
              </ul>
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 font-medium">
                  ⚠️ This action cannot be undone!
                </p>
              </div>
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
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
