/**
 * Part 10 - Section 50: Tax Receipt Generation
 * Automated tax receipt generation and management
 */

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Download,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Plus,
  Settings,
} from "lucide-react";

// Mock data
const taxReceipts = [
  {
    id: "1",
    receiptNumber: "TR-2025-000123",
    donorName: "John Smith",
    donorEmail: "john@example.com",
    totalAmount: 500.0,
    currency: "EUR",
    taxYear: 2025,
    type: "single",
    status: "sent",
    issuedDate: "2025-01-15",
    sentDate: "2025-01-15",
    donationCount: 1,
  },
  {
    id: "2",
    receiptNumber: "TR-2025-000124",
    donorName: "Jane Doe",
    donorEmail: "jane@example.com",
    totalAmount: 1250.0,
    currency: "EUR",
    taxYear: 2025,
    type: "annual",
    status: "issued",
    issuedDate: "2026-01-05",
    donationCount: 12,
  },
  {
    id: "3",
    receiptNumber: "TR-2026-000001",
    donorName: "Bob Johnson",
    donorEmail: "bob@example.com",
    totalAmount: 250.0,
    currency: "EUR",
    taxYear: 2026,
    type: "single",
    status: "draft",
    issuedDate: "2026-02-01",
    donationCount: 1,
  },
];

const receiptTemplates = [
  {
    id: "1",
    name: "Netherlands Standard",
    country: "NL",
    language: "nl",
    isDefault: true,
  },
  {
    id: "2",
    name: "EU Generic",
    country: "EU",
    language: "en",
    isDefault: false,
  },
];

const receiptSettings = {
  organizationName: "GRATIS.NGO Foundation",
  registrationNumber: "NL123456789",
  taxExemptNumber: "RSIN 123456789",
  autoSendEnabled: true,
  autoSendThreshold: 50,
  receiptNumberPrefix: "TR",
};

export default function TaxReceipts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredReceipts = taxReceipts.filter((receipt) => {
    const matchesSearch =
      receipt.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || receipt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: taxReceipts.length,
    draft: taxReceipts.filter((r) => r.status === "draft").length,
    issued: taxReceipts.filter((r) => r.status === "issued").length,
    sent: taxReceipts.filter((r) => r.status === "sent").length,
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tax Receipts</h1>
          <p className="text-muted-foreground">
            Generate and manage donation tax receipts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Generate Receipt
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Receipts
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taxReceipts.length}</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €
              {taxReceipts
                .reduce((sum, r) => sum + r.totalAmount, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all receipts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent Receipts</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.sent}</div>
            <p className="text-xs text-muted-foreground">
              {((statusCounts.sent / statusCounts.all) * 100).toFixed(0)}% of
              total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statusCounts.draft + statusCounts.issued}
            </div>
            <p className="text-xs text-muted-foreground">Require action</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="receipts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Receipts Tab */}
        <TabsContent value="receipts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tax Receipts</CardTitle>
                  <CardDescription>
                    Manage donation tax receipts and delivery
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search receipts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-[250px]"
                    />
                  </div>
                  <select
                    className="px-3 py-2 border rounded-md text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="issued">Issued</option>
                    <option value="sent">Sent</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredReceipts.map((receipt) => (
                  <div
                    key={receipt.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          {receipt.receiptNumber}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {receipt.donorName} • {receipt.donorEmail}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {receipt.donationCount} donation
                          {receipt.donationCount > 1 ? "s" : ""} • Tax Year{" "}
                          {receipt.taxYear}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {receipt.currency} {receipt.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Issued: {receipt.issuedDate}
                        </div>
                      </div>

                      {receipt.status === "sent" && (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Sent
                        </Badge>
                      )}
                      {receipt.status === "issued" && (
                        <Badge variant="secondary">
                          <Clock className="mr-1 h-3 w-3" />
                          Issued
                        </Badge>
                      )}
                      {receipt.status === "draft" && (
                        <Badge variant="outline">
                          <FileText className="mr-1 h-3 w-3" />
                          Draft
                        </Badge>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        {receipt.status !== "sent" && (
                          <Button size="sm">
                            <Send className="mr-1 h-4 w-4" />
                            Send
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Receipt Templates</CardTitle>
                  <CardDescription>
                    Customize receipt layouts and content
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {receiptTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-semibold">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {template.country} • {template.language.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {template.isDefault && (
                        <Badge variant="default">Default</Badge>
                      )}
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Receipt Settings</CardTitle>
              <CardDescription>
                Configure organization details and automation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium">
                    Organization Name
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {receiptSettings.organizationName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Registration Number
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {receiptSettings.registrationNumber}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Tax Exempt Number
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {receiptSettings.taxExemptNumber}
                  </p>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Auto-send Receipts</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically send receipts for donations over €
                      {receiptSettings.autoSendThreshold}
                    </p>
                  </div>
                  <Badge
                    variant={
                      receiptSettings.autoSendEnabled ? "default" : "secondary"
                    }
                  >
                    {receiptSettings.autoSendEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
