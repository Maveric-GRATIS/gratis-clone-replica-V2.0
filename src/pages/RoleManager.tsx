import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Shield,
  Users,
  Lock,
  Plus,
  Edit,
  Trash2,
  Check,
  Search,
  Crown,
  Award,
  UserCheck,
} from "lucide-react";

export default function RoleManager() {
  const [searchQuery, setSearchQuery] = useState("");

  const roles = [
    {
      id: "super_admin",
      name: "Super Admin",
      description: "Full system access with all permissions",
      permissions: ["*:*"], // All permissions
      isSystemRole: true,
      userCount: 2,
      hierarchy: 100,
      icon: Crown,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      id: "admin",
      name: "Admin",
      description: "Administrative access to most platform features",
      permissions: [
        "users:read",
        "users:update",
        "donations:read",
        "donations:export",
        "projects:manage",
        "analytics:read",
        "content:manage",
      ],
      isSystemRole: true,
      userCount: 8,
      hierarchy: 80,
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "moderator",
      name: "Moderator",
      description: "Content moderation and user management",
      permissions: [
        "users:read",
        "content:read",
        "content:update",
        "content:approve",
        "social:manage",
        "events:manage",
      ],
      isSystemRole: true,
      userCount: 15,
      hierarchy: 60,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "partner_admin",
      name: "Partner Admin",
      description: "Manage partner organization and projects",
      permissions: [
        "projects:create",
        "projects:read",
        "projects:update",
        "donations:read",
        "events:manage",
        "reports:read",
      ],
      isSystemRole: true,
      userCount: 34,
      hierarchy: 50,
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "member",
      name: "Member",
      description: "Standard platform member with basic permissions",
      permissions: [
        "projects:read",
        "donations:create",
        "events:read",
        "social:create",
        "social:read",
      ],
      isSystemRole: true,
      userCount: 1245,
      hierarchy: 10,
      icon: Users,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ];

  const resources = [
    "donations",
    "users",
    "projects",
    "partners",
    "events",
    "content",
    "campaigns",
    "analytics",
    "settings",
    "roles",
    "subscriptions",
    "payments",
  ];

  const actions = [
    "create",
    "read",
    "update",
    "delete",
    "export",
    "approve",
    "manage",
  ];

  const usersWithRoles = [
    {
      userId: "user_1",
      email: "admin@gratis.ngo",
      name: "Admin User",
      role: "super_admin",
      assignedAt: "2024-01-15",
      assignedBy: "System",
    },
    {
      userId: "user_2",
      email: "mod@gratis.ngo",
      name: "Moderator User",
      role: "moderator",
      assignedAt: "2024-02-20",
      assignedBy: "admin@gratis.ngo",
    },
    {
      userId: "user_3",
      email: "partner@example.com",
      name: "Partner User",
      role: "partner_admin",
      assignedAt: "2024-03-10",
      assignedBy: "admin@gratis.ngo",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            Role & Permission Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage user roles and access control
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Custom Role
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">
              {roles.filter((r) => !r.isSystemRole).length} custom
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roles.reduce((sum, r) => sum + r.userCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">With assigned roles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resources</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resources.length}</div>
            <p className="text-xs text-muted-foreground">Protected resources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {resources.length * actions.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Available permissions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="roles">
            <Shield className="w-4 h-4 mr-2" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            User Assignments
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Lock className="w-4 h-4 mr-2" />
            Permission Matrix
          </TabsTrigger>
        </TabsList>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <Card
                  key={role.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-lg ${role.bgColor} flex items-center justify-center`}
                        >
                          <Icon className={`w-6 h-6 ${role.color}`} />
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {role.name}
                            {role.isSystemRole && (
                              <Badge variant="outline" className="text-xs">
                                System
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>{role.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Hierarchy Level
                      </span>
                      <Badge variant="secondary">{role.hierarchy}</Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Assigned Users
                      </span>
                      <Badge variant="secondary">{role.userCount}</Badge>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 5).map((perm, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {perm}
                          </Badge>
                        ))}
                        {role.permissions.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{role.permissions.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        disabled={role.isSystemRole}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* User Assignments Tab */}
        <TabsContent value="users" className="space-y-4">
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by email or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>User Role Assignments</CardTitle>
              <CardDescription>Manage user access levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {usersWithRoles.map((user) => {
                  const role = roles.find((r) => r.id === user.role);
                  const RoleIcon = role?.icon || Users;

                  return (
                    <div
                      key={user.userId}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`w-12 h-12 rounded-lg ${role?.bgColor || "bg-gray-50"} flex items-center justify-center`}
                        >
                          <RoleIcon
                            className={`w-6 h-6 ${role?.color || "text-gray-600"}`}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Assigned {user.assignedAt} by {user.assignedBy}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          className={
                            role?.color
                              .replace("text-", "bg-")
                              .replace(
                                "600",
                                "100 text-" + role.color.split("-")[1] + "-700",
                              ) || ""
                          }
                        >
                          {role?.name || user.role}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          Change Role
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permission Matrix Tab */}
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>
                Complete overview of resource permissions by action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Resource</th>
                      {actions.map((action) => (
                        <th
                          key={action}
                          className="text-center p-2 font-medium capitalize"
                        >
                          {action}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map((resource, idx) => (
                      <tr
                        key={resource}
                        className={idx % 2 === 0 ? "bg-muted/50" : ""}
                      >
                        <td className="p-2 font-medium capitalize">
                          {resource}
                        </td>
                        {actions.map((action) => (
                          <td key={action} className="text-center p-2">
                            <div className="flex justify-center">
                              <div
                                className="w-4 h-4 rounded-full bg-green-500"
                                title={`${resource}:${action}`}
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 rounded-lg bg-muted/50 border">
                <p className="text-sm font-medium mb-2">Legend:</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500" />
                    <span>Permission available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-300" />
                    <span>Not applicable</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
