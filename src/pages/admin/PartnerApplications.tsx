import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import {
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Eye,
} from "lucide-react";
import { format } from "date-fns";

type AppStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "info_requested";

interface NormalizedApplication {
  id: string;
  collectionType: "partner" | "ngo";
  organizationName: string;
  organizationType?: string;
  contactName: string;
  contactEmail: string;
  status: AppStatus;
  createdAt: any;
  mission?: string;
  country?: string;
  focusAreas?: string[];
}

const STATUS_CONFIG: Record<
  AppStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: any;
  }
> = {
  pending: { label: "Pending", variant: "secondary", icon: Clock },
  under_review: {
    label: "Under Review",
    variant: "default",
    icon: AlertCircle,
  },
  info_requested: {
    label: "Info Requested",
    variant: "outline",
    icon: AlertCircle,
  },
  approved: { label: "Approved", variant: "default", icon: CheckCircle },
  rejected: { label: "Rejected", variant: "destructive", icon: XCircle },
};

export default function AdminPartnerApplications() {
  const [applications, setApplications] = useState<NormalizedApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    let partnerDocs: NormalizedApplication[] = [];
    let ngoDocs: NormalizedApplication[] = [];
    let loaded = 0;

    const merge = () => {
      const combined = [...partnerDocs, ...ngoDocs].sort((a, b) => {
        const ta = a.createdAt?.seconds ?? 0;
        const tb = b.createdAt?.seconds ?? 0;
        return tb - ta;
      });
      setApplications(combined);
      if (loaded < 2) {
        loaded++;
      }
      if (loaded === 2) setLoading(false);
    };

    const unsubPartner = onSnapshot(
      query(
        collection(db, "partnerApplications"),
        orderBy("createdAt", "desc"),
      ),
      (snap) => {
        partnerDocs = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            collectionType: "partner",
            organizationName: data.organizationName ?? "—",
            organizationType: data.organizationType,
            contactName:
              `${data.primaryContact?.firstName ?? ""} ${data.primaryContact?.lastName ?? ""}`.trim(),
            contactEmail: data.primaryContact?.email ?? data.email ?? "",
            status: data.status ?? "pending",
            createdAt: data.createdAt,
            focusAreas: data.focusAreas,
          } as NormalizedApplication;
        });
        merge();
      },
      (err) => {
        console.error("partnerApplications:", err);
        setLoading(false);
      },
    );

    const unsubNgo = onSnapshot(
      query(collection(db, "ngoApplications"), orderBy("createdAt", "desc")),
      (snap) => {
        ngoDocs = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            collectionType: "ngo",
            organizationName: data.organizationName ?? "—",
            organizationType: "NGO",
            contactName: data.contactName ?? "",
            contactEmail: data.contactEmail ?? data.email ?? "",
            status: data.status ?? "pending",
            createdAt: data.createdAt,
            mission: data.mission,
            country: data.country,
          } as NormalizedApplication;
        });
        merge();
      },
      (err) => {
        console.error("ngoApplications:", err);
        setLoading(false);
      },
    );

    return () => {
      unsubPartner();
      unsubNgo();
    };
  }, []);

  const filtered = applications.filter((app) => {
    const matchesSearch =
      !searchQuery ||
      app.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.contactEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesType =
      typeFilter === "all" || app.collectionType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    under_review: applications.filter((a) => a.status === "under_review")
      .length,
    approved: applications.filter((a) => a.status === "approved").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Partner Applications</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage partner and NGO applications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total", value: stats.total, color: "" },
            {
              label: "Pending",
              value: stats.pending,
              color: "text-yellow-600",
            },
            {
              label: "Under Review",
              value: stats.under_review,
              color: "text-blue-600",
            },
            {
              label: "Approved",
              value: stats.approved,
              color: "text-green-600",
            },
          ].map(({ label, value, color }) => (
            <Card key={label} className="p-4">
              <div className={`text-2xl font-bold ${color}`}>
                {loading ? "—" : value}
              </div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="info_requested">Info Requested</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-36">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
                <SelectItem value="ngo">NGO</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            [1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))
          ) : filtered.length === 0 ? (
            <Card className="p-12 text-center">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1">
                No applications found
              </h3>
              <p className="text-muted-foreground text-sm">
                Try adjusting your search or filters
              </p>
            </Card>
          ) : (
            filtered.map((app) => {
              const cfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.pending;
              const StatusIcon = cfg.icon;
              return (
                <Card
                  key={app.id}
                  className="p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-semibold truncate">
                            {app.organizationName}
                          </span>
                          <Badge variant={cfg.variant} className="text-xs">
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {cfg.label}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs uppercase"
                          >
                            {app.collectionType === "ngo"
                              ? "NGO"
                              : (app.organizationType ?? "Partner")}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 text-sm text-muted-foreground">
                          <span>Contact: {app.contactName || "—"}</span>
                          <span className="truncate">
                            Email: {app.contactEmail}
                          </span>
                          <span>
                            Submitted:{" "}
                            {app.createdAt?.seconds
                              ? format(
                                  new Date(app.createdAt.seconds * 1000),
                                  "d MMM yyyy",
                                )
                              : "—"}
                          </span>
                        </div>
                        {app.mission && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {app.mission}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button asChild size="sm" className="flex-shrink-0">
                      <Link
                        to={`/admin/partners/applications/${app.id}?type=${app.collectionType}`}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
