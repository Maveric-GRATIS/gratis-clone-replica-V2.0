import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash, Eye, EyeOff } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '@/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Campaign {
  id: string;
  title: string;
  start_date: string | null;
  end_date: string | null;
  active: boolean;
  created_at: string;
}

export default function AdminCampaigns() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['admin-campaigns'],
    queryFn: async () => {
      const q = query(collection(db, 'campaigns'), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      const campaigns: Campaign[] = [];
      querySnapshot.forEach((doc) => {
        campaigns.push({ id: doc.id, ...doc.data() } as Campaign);
      });
      return campaigns;
    }
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const campaignRef = doc(db, 'campaigns', id);
      await updateDoc(campaignRef, { active: !active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
      toast.success('Campaign status updated');
    },
    onError: () => {
      toast.error('Failed to update campaign status');
    }
  });

  const deleteCampaign = useMutation({
    mutationFn: async (id: string) => {
      const campaignRef = doc(db, 'campaigns', id);
      await deleteDoc(campaignRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
      toast.success('Campaign deleted');
    },
    onError: () => {
      toast.error('Failed to delete campaign');
    }
  });

  const filteredCampaigns = campaigns?.filter(campaign =>
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Marketing Campaigns</h1>
            <p className="text-muted-foreground">Manage promotional campaigns and partnerships</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
            <CardDescription>
              Track and manage all marketing initiatives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Loading campaigns...</p>
            ) : filteredCampaigns?.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No campaigns found</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns?.map((campaign) => {
                    const now = new Date();
                    const startDate = campaign.start_date ? new Date(campaign.start_date) : null;
                    const endDate = campaign.end_date ? new Date(campaign.end_date) : null;
                    
                    let statusBadge = 'Scheduled';
                    if (campaign.active && startDate && startDate <= now && (!endDate || endDate >= now)) {
                      statusBadge = 'Active';
                    } else if (endDate && endDate < now) {
                      statusBadge = 'Ended';
                    }
                    
                    return (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.title}</TableCell>
                        <TableCell>
                          {startDate ? format(startDate, 'MMM dd, yyyy') : 'Not set'}
                        </TableCell>
                        <TableCell>
                          {endDate ? format(endDate, 'MMM dd, yyyy') : 'Ongoing'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusBadge === 'Active' ? 'default' : 'secondary'}>
                            {statusBadge}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleActive.mutate({ id: campaign.id, active: campaign.active })}
                            >
                              {campaign.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteCampaign.mutate(campaign.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
