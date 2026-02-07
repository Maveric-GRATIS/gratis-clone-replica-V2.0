// src/pages/admin/MFASettings.tsx
// Admin page for MFA management and user overview

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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Users,
  CheckCircle,
  XCircle,
  Search,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { db } from "@/firebase";
import {
  collection,
  query,
  getDocs,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import type { MFAConfig } from "@/types/mfa";

interface MFAStats {
  totalUsers: number;
  mfaEnabled: number;
  mfaPending: number;
  mfaDisabled: number;
  enabledPercentage: number;
}

interface UserMFAInfo {
  userId: string;
  email: string;
  displayName: string;
  status: string;
  methods: string[];
  lastVerified?: string;
  createdAt: string;
}

export default function MFASettings() {
  const [stats, setStats] = useState<MFAStats>({
    totalUsers: 0,
    mfaEnabled: 0,
    mfaPending: 0,
    mfaDisabled: 0,
    enabledPercentage: 0,
  });
  const [users, setUsers] = useState<UserMFAInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load MFA configs
      const mfaConfigsRef = collection(db, "mfa_configs");
      const mfaSnapshot = await getDocs(query(mfaConfigsRef, limit(100)));

      const mfaConfigs = mfaSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (MFAConfig & { id: string })[];

      // Load users
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(query(usersRef, limit(100)));

      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Combine data
      const userMFAList: UserMFAInfo[] = usersData.map((user: any) => {
        const mfaConfig = mfaConfigs.find((c) => c.userId === user.id);
        return {
          userId: user.id,
          email: user.email || "N/A",
          displayName: user.displayName || user.email || "Unknown",
          status: mfaConfig?.status || "disabled",
          methods: mfaConfig?.methods.map((m) => m.method) || [],
          lastVerified: mfaConfig?.lastVerifiedAt,
          createdAt: user.createdAt || new Date().toISOString(),
        };
      });

      setUsers(userMFAList);

      // Calculate stats
      const totalUsers = usersData.length;
      const mfaEnabled = mfaConfigs.filter(
        (c) => c.status === "enabled",
      ).length;
      const mfaPending = mfaConfigs.filter(
        (c) => c.status === "pending_setup",
      ).length;
      const mfaDisabled = totalUsers - mfaEnabled - mfaPending;
      const enabledPercentage =
        totalUsers > 0 ? (mfaEnabled / totalUsers) * 100 : 0;

      setStats({
        totalUsers,
        mfaEnabled,
        mfaPending,
        mfaDisabled,
        enabledPercentage,
      });
    } catch (error) {
      console.error("Failed to load MFA data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "enabled":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Enabled
          </Badge>
        );
      case "pending_setup":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <XCircle className="w-3 h-3 mr-1" />
            Disabled
          </Badge>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">MFA Settings</h1>
          <p className="text-muted-foreground">
            Manage two-factor authentication across the platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">MFA Enabled</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.mfaEnabled}</div>
              <p className="text-xs text-muted-foreground">
                {stats.enabledPercentage.toFixed(1)}% adoption rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Setup
              </CardTitle>
              <Clock className="w-4 h-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.mfaPending}</div>
              <p className="text-xs text-muted-foreground">
                In-progress setups
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Not Protected
              </CardTitle>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.mfaDisabled}</div>
              <p className="text-xs text-muted-foreground">Without MFA</p>
            </CardContent>
          </Card>
        </div>

        {/* Adoption Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              MFA Adoption
            </CardTitle>
            <CardDescription>
              Current distribution of two-factor authentication across users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Enabled ({stats.mfaEnabled})</span>
                  <span className="font-medium text-green-600">
                    {stats.enabledPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${stats.enabledPercentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Pending ({stats.mfaPending})</span>
                  <span className="font-medium text-amber-600">
                    {stats.totalUsers > 0
                      ? ((stats.mfaPending / stats.totalUsers) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500"
                    style={{
                      width: `${stats.totalUsers > 0 ? (stats.mfaPending / stats.totalUsers) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Disabled ({stats.mfaDisabled})</span>
                  <span className="font-medium text-red-600">
                    {stats.totalUsers > 0
                      ? ((stats.mfaDisabled / stats.totalUsers) * 100).toFixed(
                          1,
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{
                      width: `${stats.totalUsers > 0 ? (stats.mfaDisabled / stats.totalUsers) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>User MFA Status</CardTitle>
                <CardDescription>
                  View and manage user authentication settings
                </CardDescription>
              </div>
              <Button onClick={loadData} variant="outline" size="sm">
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">User</th>
                      <th className="pb-3 font-medium">Email</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Methods</th>
                      <th className="pb-3 font-medium">Last Verified</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-8 text-center text-muted-foreground"
                        >
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.userId} className="text-sm">
                          <td className="py-3">
                            <div className="font-medium">
                              {user.displayName}
                            </div>
                          </td>
                          <td className="py-3 text-muted-foreground">
                            {user.email}
                          </td>
                          <td className="py-3">
                            {getStatusBadge(user.status)}
                          </td>
                          <td className="py-3">
                            {user.methods.length > 0 ? (
                              <div className="flex gap-1">
                                {user.methods.map((method, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {method.toUpperCase()}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="py-3 text-muted-foreground">
                            {user.lastVerified
                              ? new Date(user.lastVerified).toLocaleDateString()
                              : "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
