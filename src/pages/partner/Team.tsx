/**
 * Partner Team Management Page
 *
 * Manage team members and their roles.
 * Part 6 - Partner Dashboard
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Mail,
  MoreVertical,
  Shield,
  User,
  UserCheck,
} from "lucide-react";

// Mock team data
const MOCK_TEAM_MEMBERS = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@cleanwater.org",
    role: "admin",
    permissions: [
      "manage_team",
      "manage_projects",
      "manage_finances",
      "view_analytics",
    ],
    status: "active",
    joinedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@cleanwater.org",
    role: "manager",
    permissions: ["manage_projects", "view_analytics", "post_updates"],
    status: "active",
    joinedAt: new Date("2024-01-05"),
  },
  {
    id: "3",
    name: "Emma Davis",
    email: "emma@cleanwater.org",
    role: "member",
    permissions: ["post_updates", "respond_donors"],
    status: "active",
    joinedAt: new Date("2024-01-10"),
  },
];

const ROLE_CONFIG = {
  admin: { label: "Admin", color: "bg-red-100 text-red-800", icon: Shield },
  manager: {
    label: "Manager",
    color: "bg-blue-100 text-blue-800",
    icon: UserCheck,
  },
  member: { label: "Member", color: "bg-gray-100 text-gray-800", icon: User },
};

export default function PartnerTeam() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team</h1>
          <p className="text-gray-600">
            Manage your team members and permissions
          </p>
        </div>
        <Button>
          <Plus className="w-5 h-5 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{MOCK_TEAM_MEMBERS.length}</p>
              <p className="text-sm text-gray-600">Total Members</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {MOCK_TEAM_MEMBERS.filter((m) => m.status === "active").length}
              </p>
              <p className="text-sm text-gray-600">Active Members</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {MOCK_TEAM_MEMBERS.filter((m) => m.role === "admin").length}
              </p>
              <p className="text-sm text-gray-600">Admins</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search team members..." className="pl-10" />
        </div>
      </Card>

      {/* Team Members List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {MOCK_TEAM_MEMBERS.map((member) => {
          const roleConfig =
            ROLE_CONFIG[member.role as keyof typeof ROLE_CONFIG];
          const RoleIcon = roleConfig.icon;

          return (
            <Card key={member.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1">
                        {member.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {member.email}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={roleConfig.color}>
                          <RoleIcon className="w-3 h-3 mr-1" />
                          {roleConfig.label}
                        </Badge>
                        <Badge variant="outline">{member.status}</Badge>
                      </div>

                      <div>
                        <p className="text-xs text-gray-600 mb-1">
                          Permissions:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {member.permissions.map((perm) => (
                            <Badge
                              key={perm}
                              variant="secondary"
                              className="text-xs"
                            >
                              {perm.replace(/_/g, " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 mt-3">
                        Joined: {member.joinedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
