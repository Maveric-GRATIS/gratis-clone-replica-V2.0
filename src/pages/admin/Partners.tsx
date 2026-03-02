import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { toast } from "sonner";
import { format } from "date-fns";
import { PartnerDialog } from "@/components/admin/PartnerDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Partner {
  id: string;
  organizationName?: string;
  email?: string;
  country?: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  tier?: "bronze" | "silver" | "gold" | "platinum";
  projectsCount?: number;
  createdAt?: { seconds: number; nanoseconds: number };
}

export default function AdminPartners() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<string | null>(null);

  const {
    data: partners,
    isLoading,
    error,
  } = useQuery<Partner[], Error>({
    queryKey: ["admin-partners"],
    queryFn: async () => {
      console.log("🔍 Fetching partners...");
      try {
        const partnersCollection = collection(db, "partners");
        // Try with orderBy first, fall back to unordered if it fails
        try {
          const q = query(partnersCollection, orderBy("createdAt", "desc"));
          const snapshot = await getDocs(q);
          const data = snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as Partner,
          );
          console.log("✅ Partners fetched successfully:", data.length);
          return data;
        } catch (orderError: any) {
          // If orderBy fails (no index), fetch without ordering
          console.warn(
            "⚠️ OrderBy failed, fetching without ordering:",
            orderError.message,
          );
          const snapshot = await getDocs(partnersCollection);
          const data = snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as Partner,
          );
          console.log("✅ Partners fetched (unordered):", data.length);
          return data;
        }
      } catch (error) {
        console.error("❌ Error fetching partners:", error);
        throw error;
      }
    },
  });

  const updatePartnerStatus = useMutation({
    mutationFn: async ({
      partnerId,
      status,
    }: {
      partnerId: string;
      status: Partner["status"];
    }) => {
      const partnerRef = doc(db, "partners", partnerId);
      await updateDoc(partnerRef, { status, updatedAt: new Date() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-partners"] });
      toast.success("Partner status updated");
    },
    onError: () => {
      toast.error("Failed to update partner status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (partnerId: string) => {
      const partnerRef = doc(db, "partners", partnerId);
      await deleteDoc(partnerRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-partners"] });
      toast.success("Partner deleted successfully");
      setDeleteDialogOpen(false);
      setPartnerToDelete(null);
    },
    onError: (error: Error) => {
      toast.error("Failed to delete partner: " + error.message);
    },
  });

  const handleCreate = () => {
    setSelectedPartner(null);
    setDialogOpen(true);
  };

  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner);
    setDialogOpen(true);
  };

  const handleDelete = (partnerId: string) => {
    setPartnerToDelete(partnerId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (partnerToDelete) {
      deleteMutation.mutate(partnerToDelete);
    }
  };

  const filteredPartners = partners?.filter((partner) => {
    const matchesSearch =
      partner.organizationName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      partner.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || partner.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: partners?.length || 0,
    approved: partners?.filter((p) => p.status === "approved").length || 0,
    pending: partners?.filter((p) => p.status === "pending").length || 0,
    rejected: partners?.filter((p) => p.status === "rejected").length || 0,
  };

  const getStatusIcon = (status: Partner["status"]) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTierColor = (tier?: Partner["tier"]) => {
    switch (tier) {
      case "platinum":
        return "bg-purple-100 text-purple-800";
      case "gold":
        return "bg-yellow-100 text-yellow-800";
      case "silver":
        return "bg-gray-100 text-gray-800";
      case "bronze":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Debug logging
  console.log("🎯 Partners Page State:", { 
    isLoading, 
    hasError: !!error, 
    errorMessage: error?.message,
    partnersCount: partners?.length,
    filteredCount: filteredPartners?.length 
  });

  return (
    <AdminLayout>
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-destructive font-semibold">
            Error loading partners: {error.message}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            If this is a Firestore index error, the indexes are being built.
            Please wait a few minutes and refresh.
          </p>
        </div>
      )}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">NGO Partners</h1>
              <p className="text-muted-foreground">
                Manage partner organizations
              </p>
            </div>
          </div>
          <Button className="gap-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Add Partner
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Partners
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.approved}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.rejected}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Partners Table */}
        <Card>
          <CardHeader>
            <CardTitle>Partner Organizations</CardTitle>
            <CardDescription>View and manage NGO partnerships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search partners..."
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
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">
                Loading partners...
              </p>
            ) : filteredPartners?.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No partners found
              </p>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organization</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Projects</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPartners?.map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell className="font-medium">
                          {partner.organizationName || "-"}
                        </TableCell>
                        <TableCell>{partner.email || "-"}</TableCell>
                        <TableCell>{partner.country || "-"}</TableCell>
                        <TableCell>
                          {partner.tier && (
                            <Badge
                              variant="outline"
                              className={getTierColor(partner.tier)}
                            >
                              {partner.tier}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{partner.projectsCount || 0}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(partner.status)}
                            <Badge
                              variant={
                                partner.status === "approved"
                                  ? "default"
                                  : partner.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {partner.status || "unknown"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {partner.createdAt?.seconds
                            ? format(
                                new Date(partner.createdAt.seconds * 1000),
                                "MMM dd, yyyy",
                              )
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            {partner.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    updatePartnerStatus.mutate({
                                      partnerId: partner.id,
                                      status: "approved",
                                    })
                                  }
                                  title="Approve"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    updatePartnerStatus.mutate({
                                      partnerId: partner.id,
                                      status: "rejected",
                                    })
                                  }
                                  title="Reject"
                                >
                                  <XCircle className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Edit"
                              onClick={() => handleEdit(partner)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Delete"
                              onClick={() => handleDelete(partner.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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

      <PartnerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        partner={selectedPartner}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              partner from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
