/**
 * Admin: Application Review Detail
 * Reads real data from Firestore (partnerApplications or ngoApplications)
 * and provides working approve / reject / info-request actions.
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Building2,
  User,
  Globe,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  HelpCircle,
  RefreshCw,
  AlertCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { db } from "@/firebase";
import {
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { format } from "date-fns";

type AppStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "info_requested";
type ActionMode = "approve" | "reject" | "info";

const STATUS_CONFIG: Record<
  AppStatus,
  { label: string; className: string; icon: any }
> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
    icon: Clock,
  },
  under_review: {
    label: "Under Review",
    className: "bg-blue-500/20 text-blue-600 border-blue-500/30",
    icon: AlertCircle,
  },
  info_requested: {
    label: "Info Requested",
    className: "bg-purple-500/20 text-purple-600 border-purple-500/30",
    icon: HelpCircle,
  },
  approved: {
    label: "Approved",
    className: "bg-green-500/20 text-green-600 border-green-500/30",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-500/20 text-red-600 border-red-500/30",
    icon: XCircle,
  },
};

const ACTION_CONFIG: Record<
  ActionMode,
  { title: string; btnLabel: string; btnClass: string; newStatus: AppStatus }
> = {
  approve: {
    title: "Approve Application",
    btnLabel: "Approve & Send Email",
    btnClass: "bg-green-600 hover:bg-green-700 text-white",
    newStatus: "approved",
  },
  reject: {
    title: "Reject Application",
    btnLabel: "Reject & Send Email",
    btnClass: "bg-red-600 hover:bg-red-700 text-white",
    newStatus: "rejected",
  },
  info: {
    title: "Request More Information",
    btnLabel: "Send Request",
    btnClass: "bg-purple-600 hover:bg-purple-700 text-white",
    newStatus: "info_requested",
  },
};

const DEFAULT_MESSAGES: Record<ActionMode, string> = {
  approve: `Congratulations! We are pleased to inform you that your application has been approved.\n\nWelcome to the GRATIS partner network! Our team will reach out shortly to schedule an onboarding call and discuss next steps.\n\nThank you for joining us in making a difference.`,
  reject: `Thank you for your interest in partnering with GRATIS.\n\nAfter careful review, we have decided not to proceed with your application at this time. This decision does not reflect the quality of your organization, but rather our current priorities and capacity.\n\nWe wish you the best and hope to collaborate in the future.`,
  info: `Thank you for your application.\n\nTo complete our review, we need some additional information:\n\n- [Please specify the information needed]\n\nPlease reply directly to this email with your response. We look forward to hearing from you.`,
};

interface AppData {
  id: string;
  collectionType: "partner" | "ngo";
  organizationName: string;
  organizationType?: string;
  contactFirstName: string;
  contactLastName?: string;
  contactEmail: string;
  contactPhone?: string;
  country?: string;
  website?: string;
  mission?: string;
  focusAreas?: string[];
  status: AppStatus;
  createdAt: any;
  reviewNote?: string;
  reviewedAt?: any;
  uid?: string;
  raw: Record<string, any>;
}

function normalize(
  id: string,
  collectionType: "partner" | "ngo",
  data: Record<string, any>,
): AppData {
  if (collectionType === "partner") {
    return {
      id,
      collectionType,
      organizationName: data.organizationName ?? "â€”",
      organizationType: data.organizationType,
      contactFirstName: data.primaryContact?.firstName ?? "",
      contactLastName: data.primaryContact?.lastName ?? "",
      contactEmail: data.primaryContact?.email ?? "",
      contactPhone: data.primaryContact?.phone ?? "",
      focusAreas: data.focusAreas,
      status: data.status ?? "pending",
      createdAt: data.createdAt,
      reviewNote: data.reviewNote,
      reviewedAt: data.reviewedAt,
      uid: data.uid,
      raw: data,
    };
  }
  return {
    id,
    collectionType,
    organizationName: data.organizationName ?? "â€”",
    organizationType: "NGO",
    contactFirstName: data.contactName ?? "",
    contactEmail: data.contactEmail ?? "",
    contactPhone: data.contactPhone ?? "",
    country: data.country,
    website: data.website,
    mission: data.mission,
    status: data.status ?? "pending",
    createdAt: data.createdAt,
    reviewNote: data.reviewNote,
    reviewedAt: data.reviewedAt,
    uid: data.uid,
    raw: data,
  };
}

// â”€â”€ Action Dialog â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ActionDialog({
  open,
  onClose,
  mode,
  application,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  mode: ActionMode;
  application: AppData;
  onConfirm: (message: string) => Promise<void>;
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const cfg = ACTION_CONFIG[mode];

  useEffect(() => {
    setMessage(DEFAULT_MESSAGES[mode]);
  }, [mode]);

  const handleConfirm = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      await onConfirm(message);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{cfg.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="rounded-lg bg-muted/40 p-3 text-sm space-y-1">
            <p>
              <strong>To:</strong> {application.contactEmail}
            </p>
            <p>
              <strong>Organization:</strong> {application.organizationName}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email message:</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            className={cfg.btnClass}
            onClick={handleConfirm}
            disabled={loading || !message.trim()}
          >
            {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
            {cfg.btnLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function AdminApplicationReview() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const collectionType = (searchParams.get("type") ?? "partner") as
    | "partner"
    | "ngo";
  const collectionName =
    collectionType === "ngo" ? "ngoApplications" : "partnerApplications";

  const [application, setApplication] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<ActionMode>("approve");

  // Real-time Firestore listener
  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(
      doc(db, collectionName, id),
      (snap) => {
        if (!snap.exists()) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setApplication(
          normalize(
            snap.id,
            collectionType,
            snap.data() as Record<string, any>,
          ),
        );
        setLoading(false);
      },
      (err) => {
        console.error("ApplicationReview listener:", err);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [id, collectionName, collectionType]);

  const openDialog = (mode: ActionMode) => {
    setDialogMode(mode);
    setDialogOpen(true);
  };

  const handleAction = async (message: string) => {
    if (!application) return;
    const { newStatus } = ACTION_CONFIG[dialogMode];

    // 1. Update Firestore
    await updateDoc(doc(db, collectionName, application.id), {
      status: newStatus,
      reviewNote: message,
      reviewedAt: serverTimestamp(),
    });

    // 2. Send email via Cloud Function
    try {
      const fn = getFunctions();
      const sendApplicationActionEmail = httpsCallable(
        fn,
        "sendApplicationActionEmail",
      );
      await sendApplicationActionEmail({
        to: application.contactEmail,
        contactName: application.contactFirstName,
        organizationName: application.organizationName,
        action: dialogMode,
        message,
        applicationType: application.collectionType,
      });
    } catch (emailErr) {
      console.error("Email send error:", emailErr);
      toast.warning("Status updated, but email failed to send.");
      return;
    }

    const labels: Record<ActionMode, string> = {
      approve: "âœ… Application approved & email sent",
      reject: "âŒ Application rejected & email sent",
      info: "ðŸ“§ Information request sent",
    };
    toast.success(labels[dialogMode]);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (notFound || !application) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/partners/applications")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Applications
        </Button>
        <Card className="p-12 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-1">Application not found</h3>
          <p className="text-muted-foreground text-sm">
            This application may have been deleted or the URL is incorrect.
          </p>
        </Card>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[application.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = statusCfg.icon;
  const canAct =
    application.status !== "approved" && application.status !== "rejected";

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/admin/partners/applications")}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Applications
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {application.organizationName}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`text-sm px-3 py-1 rounded-full border font-medium inline-flex items-center gap-1 ${statusCfg.className}`}
            >
              <StatusIcon className="w-3 h-3" />
              {statusCfg.label}
            </span>
            <Badge variant="outline" className="uppercase text-xs">
              {application.collectionType === "ngo"
                ? "NGO"
                : (application.organizationType ?? "Partner")}
            </Badge>
            {application.createdAt?.seconds && (
              <span className="text-sm text-muted-foreground">
                Submitted:{" "}
                {format(
                  new Date(application.createdAt.seconds * 1000),
                  "d MMM yyyy",
                )}
              </span>
            )}
          </div>
        </div>

        {canAct && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => openDialog("info")}
              className="border-purple-500/50 text-purple-600"
            >
              <HelpCircle className="w-4 h-4 mr-2" /> Request Info
            </Button>
            <Button variant="destructive" onClick={() => openDialog("reject")}>
              <XCircle className="w-4 h-4 mr-2" /> Reject
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => openDialog("approve")}
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Approve
            </Button>
          </div>
        )}
        {!canAct && (
          <Badge className={`text-sm px-3 py-1 ${statusCfg.className}`}>
            {application.status === "approved"
              ? "Application Approved"
              : "Application Rejected"}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Contact info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" /> Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Name</p>
                <p>
                  {`${application.contactFirstName} ${application.contactLastName ?? ""}`.trim() ||
                    "â€”"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <a
                  href={`mailto:${application.contactEmail}`}
                  className="text-blue-600 hover:underline break-all"
                >
                  {application.contactEmail}
                </a>
              </div>
              {application.contactPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <a
                    href={`tel:${application.contactPhone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {application.contactPhone}
                  </a>
                </div>
              )}
              {application.country && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span>{application.country}</span>
                </div>
              )}
              {application.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <a
                    href={application.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {application.website}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Organization info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" /> Organization Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-muted-foreground">
                    Organization Name
                  </p>
                  <p>{application.organizationName}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Type</p>
                  <p className="capitalize">
                    {application.organizationType ?? "â€”"}
                  </p>
                </div>
              </div>

              {application.mission && (
                <div>
                  <p className="font-medium text-muted-foreground mb-1">
                    Mission
                  </p>
                  <p className="bg-muted/40 rounded-lg p-3">
                    {application.mission}
                  </p>
                </div>
              )}

              {application.focusAreas && application.focusAreas.length > 0 && (
                <div>
                  <p className="font-medium text-muted-foreground mb-2">
                    Focus Areas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {application.focusAreas.map((area) => (
                      <Badge key={area} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Previous review note */}
          {application.reviewNote && (
            <Card>
              <CardHeader>
                <CardTitle>Previous Review Note</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p className="bg-muted/40 rounded-lg p-3">
                  {application.reviewNote}
                </p>
                {application.reviewedAt?.seconds && (
                  <p className="text-muted-foreground text-xs">
                    {format(
                      new Date(application.reviewedAt.seconds * 1000),
                      "d MMM yyyy HH:mm",
                    )}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status card */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border font-medium text-xs ${statusCfg.className}`}
              >
                <StatusIcon className="w-3 h-3" />
                {statusCfg.label}
              </div>
              {application.createdAt?.seconds && (
                <div>
                  <p className="font-medium text-muted-foreground">Submitted</p>
                  <p>
                    {format(
                      new Date(application.createdAt.seconds * 1000),
                      "d MMM yyyy 'at' HH:mm",
                    )}
                  </p>
                </div>
              )}
              {application.reviewedAt?.seconds && (
                <div>
                  <p className="font-medium text-muted-foreground">
                    Last Reviewed
                  </p>
                  <p>
                    {format(
                      new Date(application.reviewedAt.seconds * 1000),
                      "d MMM yyyy 'at' HH:mm",
                    )}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          {canAct && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => openDialog("approve")}
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Approve
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-purple-500/50 text-purple-600 hover:bg-purple-500/10"
                  onClick={() => openDialog("info")}
                >
                  <HelpCircle className="w-4 h-4 mr-2" /> Request Info
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => openDialog("reject")}
                >
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Action Dialog */}
      {application && (
        <ActionDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          mode={dialogMode}
          application={application}
          onConfirm={handleAction}
        />
      )}
    </div>
  );
}
