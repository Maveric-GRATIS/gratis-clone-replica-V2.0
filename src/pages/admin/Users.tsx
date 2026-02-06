import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Shield, Ban, Check, Users as UsersIcon, Mail } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/firebase';
import { collection, getDocs, doc, updateDoc, orderBy, query } from 'firebase/firestore';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface User {
  id: string;
  email: string;
  displayName?: string;
  role?: string;
  emailVerified?: boolean;
  createdAt?: { seconds: number; nanoseconds: number };
  lastLogin?: { seconds: number; nanoseconds: number };
  status?: 'active' | 'banned' | 'pending';
}

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const { data: users, isLoading } = useQuery<User[], Error>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as User);
    }
  });

  const updateUserRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role });

      // Also update user_roles collection
      const roleRef = doc(db, 'user_roles', userId);
      await updateDoc(roleRef, { role, updatedAt: new Date() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User role updated successfully');
    },
    onError: () => {
      toast.error('Failed to update user role');
    }
  });

  const updateUserStatus = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: 'active' | 'banned' }) => {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { status, updatedAt: new Date() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User status updated');
    },
    onError: () => {
      toast.error('Failed to update user status');
    }
  });

  const filteredUsers = users?.filter(user => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users?.length || 0,
    admins: users?.filter(u => u.role === 'admin').length || 0,
    customers: users?.filter(u => u.role === 'customer').length || 0,
    marketing: users?.filter(u => u.role === 'marketing').length || 0,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Users</h1>
            <p className="text-muted-foreground">Manage user accounts and roles</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Administrators</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.admins}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.customers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Marketing</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.marketing}</div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>View and manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Loading users...</p>
            ) : filteredUsers?.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No users found</p>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.displayName || 'No name'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {user.email}
                            {user.emailVerified && (
                              <Check className="h-3 w-3 text-green-600" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.role || 'customer'}
                            onValueChange={(role) => updateUserRole.mutate({ userId: user.id, role })}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="customer">Customer</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'banned' ? 'destructive' : 'default'}>
                            {user.status || 'active'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.createdAt
                            ? format(new Date(user.createdAt.seconds * 1000), 'MMM dd, yyyy')
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {user.lastLogin
                            ? format(new Date(user.lastLogin.seconds * 1000), 'MMM dd, yyyy')
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            {user.status !== 'banned' ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateUserStatus.mutate({ userId: user.id, status: 'banned' })}
                                title="Ban user"
                              >
                                <Ban className="h-4 w-4 text-red-600" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateUserStatus.mutate({ userId: user.id, status: 'active' })}
                                title="Unban user"
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                          </div>
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
