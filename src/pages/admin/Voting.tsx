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
import { Badge } from "@/components/ui/badge";
import { Vote, Plus, BarChart2, Users, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface VotingPeriod {
  id: string;
  title: string;
  startDate: any;
  endDate: any;
  status: "active" | "upcoming" | "closed";
  totalVotes: number;
  candidates?: { id: string; name: string; votes: number }[];
}

export default function AdminVoting() {
  const { data: votingPeriods, isLoading } = useQuery<VotingPeriod[], Error>({
    queryKey: ["admin-voting-periods"],
    queryFn: async () => {
      const votingCollection = collection(db, "voting_periods");
      const q = query(votingCollection, orderBy("startDate", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as VotingPeriod,
      );
    },
  });

  const { data: votes } = useQuery({
    queryKey: ["admin-votes"],
    queryFn: async () => {
      const votesCollection = collection(db, "votes");
      const snapshot = await getDocs(votesCollection);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
  });

  const totalVotes = votes?.length || 0;
  const activeVoting =
    votingPeriods?.filter((v) => v.status === "active").length || 0;
  const uniqueVoters = new Set(votes?.map((v: any) => v.userId)).size;

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
            <Vote className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold">Voting Management</h1>
              <p className="text-muted-foreground">
                Manage NGO partner voting periods
              </p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Voting Period
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Votings
              </CardTitle>
              <Vote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeVoting}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVotes}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Unique Voters
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueVoters}</div>
              <p className="text-xs text-muted-foreground">Participated</p>
            </CardContent>
          </Card>
        </div>

        {/* Voting Periods */}
        <Card>
          <CardHeader>
            <CardTitle>Voting Periods</CardTitle>
            <CardDescription>
              All voting periods and their results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!votingPeriods || votingPeriods.length === 0 ? (
              <div className="text-center py-12">
                <Vote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  No voting periods found
                </p>
                <Button>Create First Voting Period</Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Votes</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {votingPeriods.map((period) => (
                    <TableRow key={period.id}>
                      <TableCell className="font-medium">
                        {period.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            period.status === "active"
                              ? "default"
                              : period.status === "upcoming"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {period.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{period.totalVotes || 0}</TableCell>
                      <TableCell>
                        {period.startDate?.toDate?.().toLocaleDateString() ||
                          "N/A"}
                      </TableCell>
                      <TableCell>
                        {period.endDate?.toDate?.().toLocaleDateString() ||
                          "N/A"}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View Results
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
