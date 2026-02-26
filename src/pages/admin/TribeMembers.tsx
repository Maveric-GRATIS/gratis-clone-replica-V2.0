import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Crown, Search, Mail, User, Calendar, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface TribeMember {
  id: string;
  email: string;
  displayName?: string;
  tier?: "starter" | "core" | "impact" | "movement";
  status: "active" | "cancelled" | "past_due";
  createdAt: any;
  subscription?: {
    currentPeriodEnd?: any;
    amount?: number;
  };
}

export default function AdminTribeMembers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");

  const { data: subscriptions, isLoading } = useQuery<TribeMember[], Error>({
    queryKey: ["admin-tribe-members"],
    queryFn: async () => {
      const subsCollection = collection(db, "subscriptions");
      const q = query(subsCollection, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const subData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Get user details for each subscription
      const membersWithDetails = await Promise.all(
        subData.map(async (sub: any) => {
          if (sub.userId) {
            const usersCollection = collection(db, "users");
            const userQuery = query(
              usersCollection,
              where("__name__", "==", sub.userId),
            );
            const userSnap = await getDocs(userQuery);

            if (!userSnap.empty) {
              const userData = userSnap.docs[0].data();
              return {
                ...sub,
                email: userData.email,
                displayName: userData.displayName,
              };
            }
          }
          return sub;
        }),
      );

      return membersWithDetails as TribeMember[];
    },
  });

  const filteredMembers = subscriptions?.filter((member) => {
    const matchesSearch =
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.displayName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTier = tierFilter === "all" || member.tier === tierFilter;

    return matchesSearch && matchesTier;
  });

  const stats = {
    total: subscriptions?.filter((s) => s.status === "active").length || 0,
    starter:
      subscriptions?.filter(
        (s) => s.tier === "starter" && s.status === "active",
      ).length || 0,
    core:
      subscriptions?.filter((s) => s.tier === "core" && s.status === "active")
        .length || 0,
    impact:
      subscriptions?.filter((s) => s.tier === "impact" && s.status === "active")
        .length || 0,
    movement:
      subscriptions?.filter(
        (s) => s.tier === "movement" && s.status === "active",
      ).length || 0,
    mrr:
      subscriptions
        ?.filter((s) => s.status === "active")
        .reduce((sum, s) => sum + (s.subscription?.amount || 0), 0) || 0,
  };

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case "movement":
        return "default";
      case "impact":
        return "default";
      case "core":
        return "secondary";
      case "starter":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "past_due":
        return "destructive";
      case "cancelled":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="h-8 w-8 text-yellow-600" />
            <div>
              <h1 className="text-3xl font-bold">TRIBE Members</h1>
              <p className="text-muted-foreground">
                Manage premium memberships
              </p>
            </div>
          </div>
          <Button className="gap-2">
            <Mail className="h-4 w-4" />
            Email All Members
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Members
              </CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All tiers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Starter</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.starter}</div>
              <p className="text-xs text-muted-foreground">€4.99/month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Core</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.core}</div>
              <p className="text-xs text-muted-foreground">€9.99/month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Impact</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.impact}</div>
              <p className="text-xs text-muted-foreground">€24.99/month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">MRR</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                €{(stats.mrr / 100).toFixed(0)}
              </div>
              <p className="text-xs text-muted-foreground">Monthly recurring</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="core">Core</SelectItem>
                  <SelectItem value="impact">Impact</SelectItem>
                  <SelectItem value="movement">Movement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {!filteredMembers || filteredMembers.length === 0 ? (
              <div className="text-center py-12">
                <Crown className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No TRIBE members found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Next Payment</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {member.displayName || "Unknown"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTierColor(member.tier)}>
                          {member.tier || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {member.createdAt?.toDate
                          ? format(member.createdAt.toDate(), "MMM dd, yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {member.subscription?.currentPeriodEnd?.toDate
                          ? format(
                              member.subscription.currentPeriodEnd.toDate(),
                              "MMM dd, yyyy",
                            )
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        €{((member.subscription?.amount || 0) / 100).toFixed(2)}
                        /mo
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
