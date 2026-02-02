/**
 * Admin: Partner Applications List
 *
 * Admin page to view and filter partner applications.
 * Part 6 - Section 26: Application API & Verification
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Eye,
  Filter,
  Download,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import type { PartnerApplication } from "@/types/partner";

const STATUS_CONFIG = {
  pending: { label: "Pending", variant: "secondary" as const, icon: Clock },
  under_review: {
    label: "Under Review",
    variant: "default" as const,
    icon: AlertCircle,
  },
  documents_required: {
    label: "Docs Required",
    variant: "outline" as const,
    icon: AlertCircle,
  },
  approved: {
    label: "Approved",
    variant: "default" as const,
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    variant: "destructive" as const,
    icon: XCircle,
  },
};

// Mock data - in real app, this would come from Firebase
const MOCK_APPLICATIONS: PartnerApplication[] = [
  {
    id: "1",
    organizationName: "Clean Water Foundation",
    organizationType: "ngo",
    registrationNumber: "NL-12345",
    yearFounded: 2015,
    website: "https://cleanwaterfoundation.org",
    primaryContact: {
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@cleanwater.org",
      phone: "+31 20 123 4567",
      position: "Executive Director",
    },
    headquarters: {
      street: "Museumplein 1",
      city: "Amsterdam",
      postalCode: "1071 DJ",
      country: "Netherlands",
    },
    operatingCountries: ["Netherlands", "Kenya", "Uganda"],
    mission:
      "Providing access to clean water and sanitation in underserved communities",
    description:
      "We work with local communities to build sustainable water infrastructure...",
    focusAreas: ["clean_water", "sanitation"],
    beneficiariesServed: 50000,
    annualBudget: "500k-1m",
    staffCount: 15,
    volunteerCount: 50,
    documents: {},
    references: [],
    partnershipGoals:
      "Expand our reach and increase funding for water projects",
    expectedProjects: 5,
    status: "pending",
    submittedAt: new Date("2024-01-15"),
    reviewedAt: undefined,
    verification: {
      documentsVerified: false,
      referencesChecked: false,
      backgroundCheckPassed: false,
    },
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    organizationName: "Education for All Initiative",
    organizationType: "charity",
    registrationNumber: "NL-67890",
    yearFounded: 2010,
    website: "https://educationforall.org",
    primaryContact: {
      firstName: "Michael",
      lastName: "Chen",
      email: "michael@educationforall.org",
      phone: "+31 20 987 6543",
      position: "Program Director",
    },
    headquarters: {
      street: "Damrak 123",
      city: "Amsterdam",
      postalCode: "1012 LP",
      country: "Netherlands",
    },
    operatingCountries: ["Netherlands", "India", "Bangladesh"],
    mission: "Ensuring every child has access to quality education",
    description:
      "We build schools and provide educational materials in rural communities...",
    focusAreas: ["education", "youth_development"],
    beneficiariesServed: 120000,
    annualBudget: "1m-5m",
    staffCount: 35,
    documents: {},
    references: [],
    partnershipGoals:
      "Create more educational programs and reach underserved regions",
    expectedProjects: 8,
    status: "under_review",
    submittedAt: new Date("2024-01-10"),
    reviewedAt: new Date("2024-01-12"),
    verification: {
      documentsVerified: true,
      referencesChecked: true,
      backgroundCheckPassed: true,
    },
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-12"),
  },
];

export default function AdminApplicationsList() {
  const [applications, setApplications] =
    useState<PartnerApplication[]>(MOCK_APPLICATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.primaryContact.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesType =
      typeFilter === "all" || app.organizationType === typeFilter;

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
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Partner Applications</h1>
        <p className="text-gray-600">Review and manage partner applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Applications</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.pending}
          </div>
          <div className="text-sm text-gray-600">Pending Review</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {stats.under_review}
          </div>
          <div className="text-sm text-gray-600">Under Review</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {stats.approved}
          </div>
          <div className="text-sm text-gray-600">Approved</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by organization name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="documents_required">Docs Required</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="ngo">NGO</SelectItem>
              <SelectItem value="charity">Charity</SelectItem>
              <SelectItem value="foundation">Foundation</SelectItem>
              <SelectItem value="social_enterprise">
                Social Enterprise
              </SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card className="p-12 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No applications found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </Card>
        ) : (
          filteredApplications.map((app) => {
            const statusConfig =
              STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG];
            const StatusIcon = statusConfig?.icon || Clock;

            return (
              <Card
                key={app.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">
                            {app.organizationName}
                          </h3>
                          <Badge variant={statusConfig?.variant || "secondary"}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig?.label || app.status}
                          </Badge>
                          <Badge variant="outline">
                            {app.organizationType.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Contact:</span>
                            <br />
                            {app.primaryContact.firstName}{" "}
                            {app.primaryContact.lastName}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span>
                            <br />
                            {app.primaryContact.email}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span>
                            <br />
                            {app.headquarters.city}, {app.headquarters.country}
                          </div>
                          <div>
                            <span className="font-medium">Submitted:</span>
                            <br />
                            {app.submittedAt.toLocaleDateString()}
                          </div>
                        </div>

                        <p className="text-gray-600 line-clamp-2">
                          {app.mission}
                        </p>

                        {/* Verification Status */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge
                            variant={
                              app.verification.documentsVerified
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {app.verification.documentsVerified ? "✓" : "○"}{" "}
                            Documents
                          </Badge>
                          <Badge
                            variant={
                              app.verification.referencesChecked
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {app.verification.referencesChecked ? "✓" : "○"}{" "}
                            References
                          </Badge>
                          <Badge
                            variant={
                              app.verification.backgroundCheckPassed
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {app.verification.backgroundCheckPassed ? "✓" : "○"}{" "}
                            Background
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 ml-4">
                    <Button asChild>
                      <Link to={`/admin/partners/applications/${app.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
