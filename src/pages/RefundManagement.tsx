import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  FileText,
  Clock,
} from "lucide-react";

export default function RefundManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  const refunds = [
    {
      id: "ref_123",
      paymentId: "pay_456",
      donationId: "don_789",
      amount: 50,
      currency: "EUR",
      reason: "donor_request",
      reasonNote: "Donor requested refund due to duplicate payment",
      status: "succeeded",
      initiatedBy: "Admin User",
      createdAt: "2024-06-14",
      completedAt: "2024-06-14",
    },
    {
      id: "ref_124",
      paymentId: "pay_457",
      donationId: "don_790",
      amount: 100,
      currency: "EUR",
      reason: "project_canceled",
      reasonNote: "Project was canceled before completion",
      status: "pending",
      initiatedBy: "Admin User",
      createdAt: "2024-06-15",
    },
    {
      id: "ref_125",
      paymentId: "pay_458",
      donationId: "don_791",
      amount: 25,
      currency: "EUR",
      reason: "duplicate",
      status: "succeeded",
      initiatedBy: "System",
      createdAt: "2024-06-10",
      completedAt: "2024-06-10",
    },
  ];

  const disputes = [
    {
      id: "disp_123",
      paymentId: "pay_500",
      amount: 250,
      currency: "EUR",
      reason: "fraudulent",
      status: "needs_response",
      evidenceDueBy: "2024-06-25",
      evidenceSubmitted: false,
      createdAt: "2024-06-15",
    },
    {
      id: "disp_124",
      paymentId: "pay_501",
      amount: 100,
      currency: "EUR",
      reason: "unrecognized",
      status: "under_review",
      evidenceDueBy: "2024-06-20",
      evidenceSubmitted: true,
      createdAt: "2024-06-10",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "succeeded":
      case "won":
        return "bg-green-600";
      case "pending":
      case "under_review":
        return "bg-yellow-600";
      case "failed":
      case "lost":
        return "bg-red-600";
      case "needs_response":
        return "bg-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      donor_request: "Donor Request",
      duplicate: "Duplicate Payment",
      fraudulent: "Fraudulent",
      project_canceled: "Project Canceled",
      other: "Other",
    };
    return labels[reason] || reason;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Refund & Dispute Management</h1>
          <p className="text-muted-foreground">
            Process refunds and handle payment disputes
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{refunds.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refund Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{refunds.reduce((sum, r) => sum + r.amount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total refunded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Disputes
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                disputes.filter(
                  (d) => d.status !== "won" && d.status !== "lost",
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Disputes won</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="refunds" className="space-y-4">
        <TabsList>
          <TabsTrigger value="refunds">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refunds
          </TabsTrigger>
          <TabsTrigger value="disputes">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Disputes
          </TabsTrigger>
          <TabsTrigger value="new-refund">
            <FileText className="w-4 h-4 mr-2" />
            New Refund
          </TabsTrigger>
        </TabsList>

        {/* Refunds Tab */}
        <TabsContent value="refunds" className="space-y-4">
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by donation ID, payment ID, or donor email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Refunds List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Refunds</CardTitle>
              <CardDescription>All refund transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {refunds.map((refund) => (
                  <div
                    key={refund.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">
                            €{refund.amount} {refund.currency}
                          </p>
                          <Badge variant="outline">
                            {getReasonLabel(refund.reason)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Donation: {refund.donationId} • Payment:{" "}
                          {refund.paymentId}
                        </p>
                        {refund.reasonNote && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Note: {refund.reasonNote}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Initiated by {refund.initiatedBy} • {refund.createdAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(refund.status)}>
                        {refund.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Disputes Tab */}
        <TabsContent value="disputes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Disputes</CardTitle>
              <CardDescription>
                Chargebacks and disputes requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {disputes.map((dispute) => {
                  const needsAction =
                    dispute.status === "needs_response" &&
                    !dispute.evidenceSubmitted;

                  return (
                    <div
                      key={dispute.id}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                        needsAction
                          ? "border-orange-200 bg-orange-50/50"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            needsAction ? "bg-orange-100" : "bg-red-50"
                          }`}
                        >
                          <AlertTriangle
                            className={`w-6 h-6 ${
                              needsAction ? "text-orange-600" : "text-red-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">
                              €{dispute.amount} {dispute.currency}
                            </p>
                            <Badge variant="outline">{dispute.reason}</Badge>
                            {needsAction && (
                              <Badge
                                variant="destructive"
                                className="animate-pulse"
                              >
                                Action Required
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Payment: {dispute.paymentId}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span
                              className={`flex items-center gap-1 ${
                                dispute.evidenceSubmitted
                                  ? "text-green-600"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {dispute.evidenceSubmitted ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <Clock className="w-4 h-4" />
                              )}
                              Evidence{" "}
                              {dispute.evidenceSubmitted
                                ? "submitted"
                                : "pending"}
                            </span>
                            <span className="text-muted-foreground">
                              Due: {dispute.evidenceDueBy}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(dispute.status)}>
                          {dispute.status.replace("_", " ")}
                        </Badge>
                        <Button
                          variant={needsAction ? "default" : "ghost"}
                          size="sm"
                        >
                          {needsAction ? "Submit Evidence" : "View Details"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* New Refund Tab */}
        <TabsContent value="new-refund" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Process New Refund</CardTitle>
              <CardDescription>
                Issue a refund for a donation or payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-id">Payment ID *</Label>
                    <Input
                      id="payment-id"
                      placeholder="pay_123456789"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the Stripe payment intent ID
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Refund Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="50.00"
                      step="0.01"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave empty for full refund
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason *</Label>
                  <Select>
                    <SelectTrigger id="reason">
                      <SelectValue placeholder="Select refund reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="donor_request">
                        Donor Request
                      </SelectItem>
                      <SelectItem value="duplicate">
                        Duplicate Payment
                      </SelectItem>
                      <SelectItem value="fraudulent">Fraudulent</SelectItem>
                      <SelectItem value="project_canceled">
                        Project Canceled
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason-note">Detailed Note</Label>
                  <Textarea
                    id="reason-note"
                    placeholder="Provide additional context for this refund..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    This note will be logged in the audit trail
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-yellow-800 mb-1">
                        Important Information
                      </p>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>
                          • Refunds are processed immediately and cannot be
                          undone
                        </li>
                        <li>• The donor will receive an email notification</li>
                        <li>
                          • Refunds typically appear in 5-10 business days
                        </li>
                        <li>• Tax receipts will be updated automatically</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Process Refund
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
