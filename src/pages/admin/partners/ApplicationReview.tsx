/**
 * Admin: Application Review Detail
 *
 * Detailed view for reviewing a single partner application.
 * Part 6 - Section 26: Application API & Verification
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Building2,
  User,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import type { PartnerApplication } from "@/types/partner";

// Mock data - same as in ApplicationsList
const MOCK_APPLICATION: PartnerApplication = {
  id: "1",
  organizationName: "Clean Water Foundation",
  organizationType: "ngo",
  registrationNumber: "NL-12345",
  taxId: "TAX-67890",
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
  operatingCountries: ["Netherlands", "Kenya", "Uganda", "Tanzania"],
  mission:
    "Providing access to clean water and sanitation in underserved communities across Africa and Europe",
  description:
    "Clean Water Foundation works with local communities to build sustainable water infrastructure, implement sanitation programs, and provide education on water hygiene. Since 2015, we have served over 50.000 beneficiaries across multiple countries, partnering with local governments and international organizations to create lasting impact.",
  focusAreas: ["clean_water", "sanitation", "education"],
  beneficiariesServed: 50000,
  annualBudget: "500k-1m",
  staffCount: 15,
  volunteerCount: 50,
  documents: {
    registrationCertificate: "https://example.com/docs/reg-cert.pdf",
    taxExemptionCertificate: "https://example.com/docs/tax-exempt.pdf",
    annualReport: "https://example.com/docs/annual-report-2023.pdf",
    financialStatements: "https://example.com/docs/financials-2023.pdf",
  },
  references: [
    {
      name: "Dr. James Wilson",
      organization: "Global Health Initiative",
      email: "james.wilson@globalhealth.org",
      phone: "+44 20 1234 5678",
      relationship: "Partner Organization",
    },
    {
      name: "Maria Garcia",
      organization: "European Development Fund",
      email: "maria.garcia@edf.eu",
      phone: "+32 2 123 4567",
      relationship: "Funding Agency",
    },
  ],
  partnershipGoals:
    "We are seeking to expand our reach through the GRATIS platform by connecting with more donors who share our vision of universal access to clean water. Our goals include increasing our annual funding by 30%, launching 5 new water projects in underserved regions, and building awareness of water scarcity issues among European donors.",
  expectedProjects: 5,
  preferredStartDate: new Date("2024-02-01"),
  status: "under_review",
  submittedAt: new Date("2024-01-15"),
  reviewedAt: new Date("2024-01-16"),
  verification: {
    documentsVerified: true,
    referencesChecked: true,
    backgroundCheckPassed: true,
  },
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-16"),
};

export default function AdminApplicationReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application] = useState<PartnerApplication>(MOCK_APPLICATION);
  const [reviewNotes, setReviewNotes] = useState("");
  const [verificationChecks, setVerificationChecks] = useState({
    documents: application.verification.documentsVerified,
    references: application.verification.referencesChecked,
    registration: application.verification.backgroundCheckPassed,
    taxStatus: false,
  });

  const handleApprove = () => {
    // In real app, this would update Firebase
    toast.success("Application approved successfully");
    navigate("/admin/partners/applications");
  };

  const handleReject = () => {
    if (!reviewNotes) {
      toast.error("Please provide rejection reason");
      return;
    }
    // In real app, this would update Firebase
    toast.success("Application rejected");
    navigate("/admin/partners/applications");
  };

  const handleRequestDocuments = () => {
    // In real app, this would send email and update status
    toast.success("Document request sent to applicant");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/partners/applications")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Applications
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {application.organizationName}
            </h1>
            <div className="flex items-center gap-3">
              <Badge variant="default">
                {application.status.replace("_", " ")}
              </Badge>
              <Badge variant="outline">
                {application.organizationType.toUpperCase()}
              </Badge>
              <span className="text-sm text-gray-600">
                Submitted: {application.submittedAt.toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRequestDocuments}>
              Request Documents
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button onClick={handleApprove}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="references">References</TabsTrigger>
              <TabsTrigger value="verification">Verification</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Organization Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Legal Name
                      </span>
                      <p>{application.organizationName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Type
                      </span>
                      <p className="capitalize">
                        {application.organizationType}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Registration Number
                      </span>
                      <p>{application.registrationNumber}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Tax ID
                      </span>
                      <p>{application.taxId || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Year Founded
                      </span>
                      <p>{application.yearFounded}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Website
                      </span>
                      <a
                        href={application.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        Visit Site <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Primary Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Name
                      </span>
                      <p>
                        {application.primaryContact.firstName}{" "}
                        {application.primaryContact.lastName}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Position
                      </span>
                      <p>{application.primaryContact.position}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Email
                      </span>
                      <a
                        href={`mailto:${application.primaryContact.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {application.primaryContact.email}
                      </a>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Phone
                      </span>
                      <a
                        href={`tel:${application.primaryContact.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {application.primaryContact.phone}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Headquarters
                    </span>
                    <p>
                      {application.headquarters.street}
                      <br />
                      {application.headquarters.postalCode}{" "}
                      {application.headquarters.city}
                      <br />
                      {application.headquarters.country}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Operating Countries
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {application.operatingCountries.map((country) => (
                        <Badge key={country} variant="secondary">
                          {country}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Mission & Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Mission
                    </span>
                    <p className="mt-1">{application.mission}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Description
                    </span>
                    <p className="mt-1">{application.description}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Focus Areas
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {application.focusAreas.map((area) => (
                        <Badge key={area} variant="secondary">
                          {area.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Beneficiaries
                      </span>
                      <p className="text-xl font-semibold">
                        {application.beneficiariesServed.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Annual Budget
                      </span>
                      <p className="text-xl font-semibold">
                        {application.annualBudget}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Staff
                      </span>
                      <p className="text-xl font-semibold">
                        {application.staffCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Partnership Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{application.partnershipGoals}</p>
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Expected Projects (Year 1)
                      </span>
                      <p className="text-xl font-semibold">
                        {application.expectedProjects}
                      </p>
                    </div>
                    {application.preferredStartDate && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Preferred Start Date
                        </span>
                        <p className="text-xl font-semibold">
                          {application.preferredStartDate.toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Submitted Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(application.documents || {}).map(
                    ([key, url]) => {
                      const docUrl = Array.isArray(url) ? url[0] : url;
                      if (!docUrl) return null;

                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </p>
                            <p className="text-sm text-gray-500">
                              PDF Document
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={docUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View
                              </a>
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      );
                    },
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* References Tab */}
            <TabsContent value="references" className="space-y-4">
              {application.references.map((ref, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>Reference {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Name
                        </span>
                        <p>{ref.name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Organization
                        </span>
                        <p>{ref.organization}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Email
                        </span>
                        <a
                          href={`mailto:${ref.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {ref.email}
                        </a>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Phone
                        </span>
                        <p>{ref.phone}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-sm font-medium text-gray-600">
                          Relationship
                        </span>
                        <p>{ref.relationship}</p>
                      </div>
                    </div>
                    <div className="pt-3">
                      <Button variant="outline" size="sm">
                        Contact Reference
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Verification Tab */}
            <TabsContent value="verification">
              <Card>
                <CardHeader>
                  <CardTitle>Verification Checklist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="check-documents"
                        checked={verificationChecks.documents}
                        onCheckedChange={(checked) =>
                          setVerificationChecks((prev) => ({
                            ...prev,
                            documents: checked as boolean,
                          }))
                        }
                      />
                      <label
                        htmlFor="check-documents"
                        className="text-sm font-medium"
                      >
                        All required documents submitted and verified
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="check-references"
                        checked={verificationChecks.references}
                        onCheckedChange={(checked) =>
                          setVerificationChecks((prev) => ({
                            ...prev,
                            references: checked as boolean,
                          }))
                        }
                      />
                      <label
                        htmlFor="check-references"
                        className="text-sm font-medium"
                      >
                        References contacted and verified
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="check-registration"
                        checked={verificationChecks.registration}
                        onCheckedChange={(checked) =>
                          setVerificationChecks((prev) => ({
                            ...prev,
                            registration: checked as boolean,
                          }))
                        }
                      />
                      <label
                        htmlFor="check-registration"
                        className="text-sm font-medium"
                      >
                        Organization registration verified with authorities
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="check-tax"
                        checked={verificationChecks.taxStatus}
                        onCheckedChange={(checked) =>
                          setVerificationChecks((prev) => ({
                            ...prev,
                            taxStatus: checked as boolean,
                          }))
                        }
                      />
                      <label
                        htmlFor="check-tax"
                        className="text-sm font-medium"
                      >
                        Tax-exempt status confirmed (if applicable)
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">
                      Verification Progress
                    </p>
                    <div className="flex gap-2">
                      {Object.values(verificationChecks).filter(Boolean)
                        .length === 4 ? (
                        <Badge variant="default">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Complete
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          {
                            Object.values(verificationChecks).filter(Boolean)
                              .length
                          }{" "}
                          of 4 Complete
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add notes about this application..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={8}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Send Email to Applicant
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Schedule Interview
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Export Application PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
