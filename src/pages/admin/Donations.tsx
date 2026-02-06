import { useState } from 'react';
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Search, Download, TrendingUp, DollarSign, Users, Calendar } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { db } from '@/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { format } from 'date-fns';

interface Donation {
  id: string;
  amount: number;
  currency: string;
  donorName?: string;
  donorEmail?: string;
  status: 'pending' | 'completed' | 'failed';
  type: 'one-time' | 'monthly';
  createdAt: { seconds: number; nanoseconds: number };
}

export default function AdminDonations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: donations, isLoading } = useQuery<Donation[], Error>({
    queryKey: ['admin-donations'],
    queryFn: async () => {
      const donationsCollection = collection(db, 'donations');
      const q = query(donationsCollection, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Donation);
    }
  });

  const filteredDonations = donations?.filter(donation => {
    const matchesSearch =
      donation.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donorEmail?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: donations?.reduce((sum, d) => sum + (d.status === 'completed' ? d.amount : 0), 0) || 0,
    count: donations?.filter(d => d.status === 'completed').length || 0,
    pending: donations?.filter(d => d.status === 'pending').length || 0,
    monthly: donations?.filter(d => d.type === 'monthly').length || 0,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-pink-600" />
            <div>
              <h1 className="text-3xl font-bold">Donations Management</h1>
              <p className="text-muted-foreground">Track and manage all donations</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.count}</div>
              <p className="text-xs text-muted-foreground">Successful donations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting processing</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Donors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthly}</div>
              <p className="text-xs text-muted-foreground">Recurring donations</p>
            </CardContent>
          </Card>
        </div>

        {/* Donations Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Donations</CardTitle>
            <CardDescription>View and manage donation transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search donations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Loading donations...</p>
            ) : filteredDonations?.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No donations found</p>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDonations?.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell className="font-medium">
                          {donation.donorName || 'Anonymous'}
                        </TableCell>
                        <TableCell>{donation.donorEmail || '-'}</TableCell>
                        <TableCell className="font-semibold">
                          €{donation.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {donation.type === 'monthly' ? 'Monthly' : 'One-time'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            donation.status === 'completed' ? 'default' :
                            donation.status === 'pending' ? 'secondary' :
                            'destructive'
                          }>
                            {donation.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(donation.createdAt.seconds * 1000), 'MMM dd, yyyy HH:mm')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
