import { useState } from "react";
import { Shield, Users, Key, Plus, Edit2, Trash2, Save } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  system: boolean;
}

interface Permission {
  id: string;
  name: string;
  category: string;
  description: string;
}

const mockRoles: Role[] = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full system access",
    permissions: ["*"],
    userCount: 3,
    system: true,
  },
  {
    id: "marketing",
    name: "Marketing Manager",
    description: "Manage content and campaigns",
    permissions: ["content.create", "content.edit", "campaigns.manage"],
    userCount: 5,
    system: true,
  },
  {
    id: "support",
    name: "Support Agent",
    description: "Handle user support requests",
    permissions: ["users.view", "tickets.manage"],
    userCount: 12,
    system: false,
  },
  {
    id: "partner",
    name: "Partner Manager",
    description: "Manage NGO partnerships",
    permissions: ["partners.view", "partners.edit", "projects.view"],
    userCount: 8,
    system: false,
  },
];

const mockPermissions: Permission[] = [
  {
    id: "users.view",
    name: "View Users",
    category: "Users",
    description: "View user accounts",
  },
  {
    id: "users.edit",
    name: "Edit Users",
    category: "Users",
    description: "Modify user accounts",
  },
  {
    id: "users.delete",
    name: "Delete Users",
    category: "Users",
    description: "Remove user accounts",
  },
  {
    id: "content.create",
    name: "Create Content",
    category: "Content",
    description: "Create blog posts and videos",
  },
  {
    id: "content.edit",
    name: "Edit Content",
    category: "Content",
    description: "Modify existing content",
  },
  {
    id: "content.delete",
    name: "Delete Content",
    category: "Content",
    description: "Remove content",
  },
  {
    id: "campaigns.manage",
    name: "Manage Campaigns",
    category: "Marketing",
    description: "Create and manage campaigns",
  },
  {
    id: "partners.view",
    name: "View Partners",
    category: "Partners",
    description: "View NGO partners",
  },
  {
    id: "partners.edit",
    name: "Edit Partners",
    category: "Partners",
    description: "Modify partner information",
  },
  {
    id: "projects.view",
    name: "View Projects",
    category: "Projects",
    description: "View impact projects",
  },
  {
    id: "donations.view",
    name: "View Donations",
    category: "Finance",
    description: "View donation data",
  },
  {
    id: "donations.refund",
    name: "Refund Donations",
    category: "Finance",
    description: "Process refunds",
  },
];

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Partial<Role>>({});

  const handleCreateRole = () => {
    setEditingRole({
      name: "",
      description: "",
      permissions: [],
      system: false,
    });
    setSelectedRole(null);
    setEditDialogOpen(true);
  };

  const handleEditRole = (role: Role) => {
    if (role.system) {
      toast.error("Cannot edit system roles");
      return;
    }
    setEditingRole(role);
    setSelectedRole(role);
    setEditDialogOpen(true);
  };

  const handleDeleteRole = (role: Role) => {
    if (role.system) {
      toast.error("Cannot delete system roles");
      return;
    }
    setSelectedRole(role);
    setDeleteDialogOpen(true);
  };

  const handleSaveRole = () => {
    if (!editingRole.name || !editingRole.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (selectedRole) {
      // Update existing role
      setRoles(
        roles.map((r) =>
          r.id === selectedRole.id ? { ...r, ...editingRole } : r,
        ),
      );
      toast.success("Role updated successfully");
    } else {
      // Create new role
      const newRole: Role = {
        id: `role_${Date.now()}`,
        name: editingRole.name!,
        description: editingRole.description!,
        permissions: editingRole.permissions || [],
        userCount: 0,
        system: false,
      };
      setRoles([...roles, newRole]);
      toast.success("Role created successfully");
    }

    setEditDialogOpen(false);
    setEditingRole({});
  };

  const handleConfirmDelete = () => {
    if (selectedRole) {
      setRoles(roles.filter((r) => r.id !== selectedRole.id));
      toast.success("Role deleted successfully");
    }
    setDeleteDialogOpen(false);
    setSelectedRole(null);
  };

  const togglePermission = (permissionId: string) => {
    const currentPermissions = editingRole.permissions || [];
    const hasPermission = currentPermissions.includes(permissionId);

    setEditingRole({
      ...editingRole,
      permissions: hasPermission
        ? currentPermissions.filter((p) => p !== permissionId)
        : [...currentPermissions, permissionId],
    });
  };

  const permissionsByCategory = mockPermissions.reduce(
    (acc, perm) => {
      if (!acc[perm.category]) acc[perm.category] = [];
      acc[perm.category].push(perm);
      return acc;
    },
    {} as Record<string, Permission[]>,
  );

  return (
    <div className="container mx-auto p-6 pt-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Role Management</h1>
            <p className="text-muted-foreground">
              Manage user roles and permissions (RBAC)
            </p>
          </div>
        </div>
        <Button onClick={handleCreateRole}>
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Roles</p>
                <p className="text-2xl font-bold">{roles.length}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">
                  {roles.reduce((sum, r) => sum + r.userCount, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Permissions</p>
                <p className="text-2xl font-bold">{mockPermissions.length}</p>
              </div>
              <Key className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="roles">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Roles</CardTitle>
              <CardDescription>
                Manage user roles and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {role.permissions.includes("*")
                            ? "All"
                            : role.permissions.length}
                        </Badge>
                      </TableCell>
                      <TableCell>{role.userCount}</TableCell>
                      <TableCell>
                        {role.system ? (
                          <Badge>System</Badge>
                        ) : (
                          <Badge variant="secondary">Custom</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditRole(role)}
                            disabled={role.system}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteRole(role)}
                            disabled={role.system}
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

        <TabsContent value="permissions" className="space-y-4">
          {Object.entries(permissionsByCategory).map(([category, perms]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category}</CardTitle>
                <CardDescription>{perms.length} permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {perms.map((perm) => (
                    <div
                      key={perm.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{perm.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {perm.description}
                        </p>
                        <code className="text-xs bg-muted px-2 py-1 rounded mt-1 inline-block">
                          {perm.id}
                        </code>
                      </div>
                      <Badge variant="outline">
                        {
                          roles.filter(
                            (r) =>
                              r.permissions.includes(perm.id) ||
                              r.permissions.includes("*"),
                          ).length
                        }{" "}
                        roles
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Edit Role Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedRole ? "Edit Role" : "Create Role"}
            </DialogTitle>
            <DialogDescription>
              {selectedRole
                ? "Modify role properties and permissions"
                : "Create a new custom role"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={editingRole.name || ""}
                onChange={(e) =>
                  setEditingRole({ ...editingRole, name: e.target.value })
                }
                placeholder="e.g. Content Manager"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={editingRole.description || ""}
                onChange={(e) =>
                  setEditingRole({
                    ...editingRole,
                    description: e.target.value,
                  })
                }
                placeholder="e.g. Manages blog posts and videos"
              />
            </div>

            <div>
              <Label>Permissions</Label>
              <div className="space-y-4 mt-2 border rounded-lg p-4 max-h-60 overflow-y-auto">
                {Object.entries(permissionsByCategory).map(
                  ([category, perms]) => (
                    <div key={category}>
                      <h4 className="font-medium mb-2">{category}</h4>
                      <div className="space-y-2 ml-4">
                        {perms.map((perm) => (
                          <div
                            key={perm.id}
                            className="flex items-center space-x-2"
                          >
                            <Switch
                              id={perm.id}
                              checked={(editingRole.permissions || []).includes(
                                perm.id,
                              )}
                              onCheckedChange={() => togglePermission(perm.id)}
                            />
                            <Label
                              htmlFor={perm.id}
                              className="flex-1 cursor-pointer"
                            >
                              <span className="font-medium">{perm.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({perm.id})
                              </span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRole}>
              <Save className="h-4 w-4 mr-2" />
              {selectedRole ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedRole?.name}"? This
              action cannot be undone.
              {selectedRole && selectedRole.userCount > 0 && (
                <div className="mt-2 text-red-500">
                  Warning: {selectedRole.userCount} users have this role and
                  will need reassignment.
                </div>
              )}
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
