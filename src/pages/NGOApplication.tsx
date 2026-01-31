import { useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Users,
  Globe,
  Heart,
  ChevronRight,
  ChevronLeft,
  Mail,
  Phone,
  Building2,
  MapPin,
  Link as LinkIcon,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

type ApplicationStep = 1 | 2 | 3 | 4;

export default function NGOApplication() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<ApplicationStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    // Step 1: Organization Info
    organizationName: "",
    registrationNumber: "",
    yearFounded: "",
    country: "",
    city: "",
    website: "",
    category: "",

    // Step 2: Contact Info
    contactName: "",
    contactTitle: "",
    contactEmail: "",
    contactPhone: "",
    secondaryContactName: "",
    secondaryContactEmail: "",

    // Step 3: Mission & Impact
    mission: "",
    beneficiaries: "",
    annualBudget: "",
    fundingModel: "",
    projectDescription: "",
    expectedImpact: "",

    // Step 4: Eligibility & Documents
    taxExempt: false,
    registered: false,
    transparent: false,
    directBeneficiary: false,
    noConflicts: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState<{
    registration: File | null;
    financials: File | null;
    references: File | null;
  }>({
    registration: null,
    financials: null,
    references: null,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (
    field: "registration" | "financials" | "references",
    file: File,
  ) => {
    setUploadedFiles((prev) => ({ ...prev, [field]: file }));
    toast.success(`${file.name} uploaded successfully`);
  };

  const validateStep = (step: ApplicationStep): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.organizationName &&
          formData.registrationNumber &&
          formData.country &&
          formData.category
        );
      case 2:
        return !!(
          formData.contactName &&
          formData.contactEmail &&
          formData.contactPhone
        );
      case 3:
        return !!(
          formData.mission &&
          formData.beneficiaries &&
          formData.projectDescription
        );
      case 4:
        return (
          formData.taxExempt &&
          formData.registered &&
          formData.transparent &&
          formData.directBeneficiary &&
          formData.noConflicts &&
          !!uploadedFiles.registration &&
          !!uploadedFiles.financials
        );
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      toast.error("Please complete all required fields");
      return;
    }
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as ApplicationStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as ApplicationStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(4)) {
      toast.error(
        "Please complete all required fields and accept eligibility criteria",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Upload files to Firebase Storage
      // TODO: Submit application to Firestore
      // TODO: Send email notification to admin

      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(
        "Application submitted successfully! We'll review it within 5-7 business days.",
      );

      // Reset form
      setFormData({
        organizationName: "",
        registrationNumber: "",
        yearFounded: "",
        country: "",
        city: "",
        website: "",
        category: "",
        contactName: "",
        contactTitle: "",
        contactEmail: "",
        contactPhone: "",
        secondaryContactName: "",
        secondaryContactEmail: "",
        mission: "",
        beneficiaries: "",
        annualBudget: "",
        fundingModel: "",
        projectDescription: "",
        expectedImpact: "",
        taxExempt: false,
        registered: false,
        transparent: false,
        directBeneficiary: false,
        noConflicts: false,
      });
      setUploadedFiles({
        registration: null,
        financials: null,
        references: null,
      });
      setCurrentStep(1);
    } catch (error) {
      toast.error("Submission failed. Please try again or contact support.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>NGO Partner Application — GRATIS</title>
        <meta
          name="description"
          content="Apply to become a verified NGO partner. Receive funding from GRATIS beverage sales for your water, arts, or education programs."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        <div className="relative max-w-4xl mx-auto text-center">
          <Badge className="mb-4">NGO Partnership</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Become a GRATIS Partner
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            Join our network of verified NGOs and receive transparent funding
            from every beverage sold. We fund impactful projects in water
            access, arts programs, and education initiatives.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>Transparent Funding</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              <span>Quarterly Disbursements</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[hsl(var(--brand-blue))]" />
              <span>No Application Fee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">
                Step {currentStep} of 4
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />

            <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
              <div
                className={`flex items-center gap-1 ${currentStep >= 1 ? "text-primary font-semibold" : "text-muted-foreground"}`}
              >
                <Building2 className="h-3 w-3" />
                <span className="hidden sm:inline">Organization</span>
              </div>
              <div
                className={`flex items-center gap-1 ${currentStep >= 2 ? "text-primary font-semibold" : "text-muted-foreground"}`}
              >
                <Users className="h-3 w-3" />
                <span className="hidden sm:inline">Contact</span>
              </div>
              <div
                className={`flex items-center gap-1 ${currentStep >= 3 ? "text-primary font-semibold" : "text-muted-foreground"}`}
              >
                <Heart className="h-3 w-3" />
                <span className="hidden sm:inline">Mission</span>
              </div>
              <div
                className={`flex items-center gap-1 ${currentStep >= 4 ? "text-primary font-semibold" : "text-muted-foreground"}`}
              >
                <FileText className="h-3 w-3" />
                <span className="hidden sm:inline">Documents</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="container py-12">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Step 1: Organization Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      Organization Information
                    </CardTitle>
                    <CardDescription>
                      Tell us about your organization
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">Organization Name *</Label>
                    <Input
                      id="org-name"
                      value={formData.organizationName}
                      onChange={(e) =>
                        handleInputChange("organizationName", e.target.value)
                      }
                      placeholder="e.g., Water for All Foundation"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-number">Registration Number *</Label>
                    <Input
                      id="reg-number"
                      value={formData.registrationNumber}
                      onChange={(e) =>
                        handleInputChange("registrationNumber", e.target.value)
                      }
                      placeholder="Official registration/charity number"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year-founded">Year Founded</Label>
                    <Input
                      id="year-founded"
                      type="number"
                      min="1900"
                      max="2026"
                      value={formData.yearFounded}
                      onChange={(e) =>
                        handleInputChange("yearFounded", e.target.value)
                      }
                      placeholder="e.g., 2015"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Primary Focus Area *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="water">
                          Water Access & Sanitation
                        </SelectItem>
                        <SelectItem value="arts">
                          Arts & Cultural Programs
                        </SelectItem>
                        <SelectItem value="education">
                          Education & Youth Development
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      placeholder="e.g., Netherlands"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City/Region</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      placeholder="e.g., Amsterdam"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    placeholder="https://your-organization.org"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      Contact Information
                    </CardTitle>
                    <CardDescription>
                      Primary contact person for this application
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Primary Contact</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Full Name *</Label>
                      <Input
                        id="contact-name"
                        value={formData.contactName}
                        onChange={(e) =>
                          handleInputChange("contactName", e.target.value)
                        }
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-title">Job Title</Label>
                      <Input
                        id="contact-title"
                        value={formData.contactTitle}
                        onChange={(e) =>
                          handleInputChange("contactTitle", e.target.value)
                        }
                        placeholder="e.g., Executive Director"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Email Address *</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) =>
                          handleInputChange("contactEmail", e.target.value)
                        }
                        placeholder="john@organization.org"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">Phone Number *</Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) =>
                          handleInputChange("contactPhone", e.target.value)
                        }
                        placeholder="+31 20 123 4567"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6 space-y-4">
                  <h3 className="font-semibold text-lg">
                    Secondary Contact (Optional)
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="secondary-name">Full Name</Label>
                      <Input
                        id="secondary-name"
                        value={formData.secondaryContactName}
                        onChange={(e) =>
                          handleInputChange(
                            "secondaryContactName",
                            e.target.value,
                          )
                        }
                        placeholder="Jane Smith"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondary-email">Email Address</Label>
                      <Input
                        id="secondary-email"
                        type="email"
                        value={formData.secondaryContactEmail}
                        onChange={(e) =>
                          handleInputChange(
                            "secondaryContactEmail",
                            e.target.value,
                          )
                        }
                        placeholder="jane@organization.org"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Mission & Impact */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-full bg-[hsl(var(--brand-blue))]/10 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-[hsl(var(--brand-blue))]" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Mission & Impact</CardTitle>
                    <CardDescription>
                      Describe your organization's work and impact
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="mission">
                    Organization Mission Statement *
                  </Label>
                  <Textarea
                    id="mission"
                    value={formData.mission}
                    onChange={(e) =>
                      handleInputChange("mission", e.target.value)
                    }
                    placeholder="Describe your organization's mission and core values..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="beneficiaries">
                      Annual Beneficiaries *
                    </Label>
                    <Input
                      id="beneficiaries"
                      value={formData.beneficiaries}
                      onChange={(e) =>
                        handleInputChange("beneficiaries", e.target.value)
                      }
                      placeholder="e.g., 5,000 people"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="annual-budget">Annual Budget (EUR)</Label>
                    <Input
                      id="annual-budget"
                      value={formData.annualBudget}
                      onChange={(e) =>
                        handleInputChange("annualBudget", e.target.value)
                      }
                      placeholder="e.g., €150,000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="funding-model">Current Funding Model</Label>
                  <Textarea
                    id="funding-model"
                    value={formData.fundingModel}
                    onChange={(e) =>
                      handleInputChange("fundingModel", e.target.value)
                    }
                    placeholder="Describe your current funding sources (e.g., grants, donations, corporate partnerships)..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-description">
                    Project Description *
                  </Label>
                  <Textarea
                    id="project-description"
                    value={formData.projectDescription}
                    onChange={(e) =>
                      handleInputChange("projectDescription", e.target.value)
                    }
                    placeholder="Describe the specific project(s) GRATIS funding would support..."
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expected-impact">
                    Expected Impact from GRATIS Funding
                  </Label>
                  <Textarea
                    id="expected-impact"
                    value={formData.expectedImpact}
                    onChange={(e) =>
                      handleInputChange("expectedImpact", e.target.value)
                    }
                    placeholder="How would GRATIS funding amplify your impact?"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Eligibility & Documents */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">
                        Eligibility Criteria
                      </CardTitle>
                      <CardDescription>
                        Please confirm your organization meets these
                        requirements
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="tax-exempt"
                      checked={formData.taxExempt}
                      onCheckedChange={(checked) =>
                        handleInputChange("taxExempt", checked as boolean)
                      }
                      required
                    />
                    <Label
                      htmlFor="tax-exempt"
                      className="font-normal cursor-pointer"
                    >
                      <div className="font-semibold">Tax-Exempt Status</div>
                      <div className="text-sm text-muted-foreground">
                        Organization holds recognized tax-exempt or charity
                        status in your country
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="registered"
                      checked={formData.registered}
                      onCheckedChange={(checked) =>
                        handleInputChange("registered", checked as boolean)
                      }
                      required
                    />
                    <Label
                      htmlFor="registered"
                      className="font-normal cursor-pointer"
                    >
                      <div className="font-semibold">Legally Registered</div>
                      <div className="text-sm text-muted-foreground">
                        Organization is legally registered for at least 1 year
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="transparent"
                      checked={formData.transparent}
                      onCheckedChange={(checked) =>
                        handleInputChange("transparent", checked as boolean)
                      }
                      required
                    />
                    <Label
                      htmlFor="transparent"
                      className="font-normal cursor-pointer"
                    >
                      <div className="font-semibold">
                        Financial Transparency
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Willing to provide financial statements and impact
                        reports quarterly
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="direct-beneficiary"
                      checked={formData.directBeneficiary}
                      onCheckedChange={(checked) =>
                        handleInputChange(
                          "directBeneficiary",
                          checked as boolean,
                        )
                      }
                      required
                    />
                    <Label
                      htmlFor="direct-beneficiary"
                      className="font-normal cursor-pointer"
                    >
                      <div className="font-semibold">
                        Direct Service Provider
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Organization directly serves beneficiaries (not solely
                        grantmaking)
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="no-conflicts"
                      checked={formData.noConflicts}
                      onCheckedChange={(checked) =>
                        handleInputChange("noConflicts", checked as boolean)
                      }
                      required
                    />
                    <Label
                      htmlFor="no-conflicts"
                      className="font-normal cursor-pointer"
                    >
                      <div className="font-semibold">
                        No Conflicts of Interest
                      </div>
                      <div className="text-sm text-muted-foreground">
                        No political, religious, or commercial conflicts that
                        contradict GRATIS values
                      </div>
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Required Documents</CardTitle>
                  <CardDescription>
                    Upload verification documents (PDF, max 5MB each)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Registration Document */}
                  <div className="space-y-2">
                    <Label>Official Registration Certificate *</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="registration-upload"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload("registration", e.target.files[0]);
                          }
                        }}
                      />
                      <Label
                        htmlFor="registration-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        {uploadedFiles.registration ? (
                          <>
                            <CheckCircle2 className="h-8 w-8 text-primary" />
                            <span className="text-sm font-semibold">
                              {uploadedFiles.registration.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Click to replace
                            </span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <span className="text-sm font-semibold">
                              Upload Registration Document
                            </span>
                            <span className="text-xs text-muted-foreground">
                              PDF, max 5MB
                            </span>
                          </>
                        )}
                      </Label>
                    </div>
                  </div>

                  {/* Financial Statements */}
                  <div className="space-y-2">
                    <Label>Recent Financial Statements *</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="financials-upload"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload("financials", e.target.files[0]);
                          }
                        }}
                      />
                      <Label
                        htmlFor="financials-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        {uploadedFiles.financials ? (
                          <>
                            <CheckCircle2 className="h-8 w-8 text-primary" />
                            <span className="text-sm font-semibold">
                              {uploadedFiles.financials.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Click to replace
                            </span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <span className="text-sm font-semibold">
                              Upload Financial Statements
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Last fiscal year, PDF max 5MB
                            </span>
                          </>
                        )}
                      </Label>
                    </div>
                  </div>

                  {/* References (Optional) */}
                  <div className="space-y-2">
                    <Label>Reference Letters (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="references-upload"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload("references", e.target.files[0]);
                          }
                        }}
                      />
                      <Label
                        htmlFor="references-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        {uploadedFiles.references ? (
                          <>
                            <CheckCircle2 className="h-8 w-8 text-primary" />
                            <span className="text-sm font-semibold">
                              {uploadedFiles.references.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Click to replace
                            </span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <span className="text-sm font-semibold">
                              Upload Reference Letters
                            </span>
                            <span className="text-xs text-muted-foreground">
                              From partners or beneficiaries, PDF max 5MB
                            </span>
                          </>
                        )}
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-accent/10 border-accent/20">
                <CardContent className="pt-6 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <div className="text-sm space-y-2">
                    <p className="font-semibold">Review Process</p>
                    <p className="text-muted-foreground">
                      Applications are reviewed within 5-7 business days. Our
                      team will contact you via email for any additional
                      information. Approved partners receive funding
                      distributions quarterly, starting the quarter after
                      approval.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button type="button" onClick={nextStep}>
                Next Step
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting || !validateStep(4)}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </div>
        </form>
      </section>

      {/* Contact Section */}
      <section className="container py-12 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Questions About the Application?</CardTitle>
            <CardDescription>
              Our partnerships team is here to help
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <a
                    href="mailto:partners@gratis.ngo"
                    className="font-semibold text-primary hover:text-primary/80"
                  >
                    partners@gratis.ngo
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <a
                    href="tel:+31201234567"
                    className="font-semibold text-primary hover:text-primary/80"
                  >
                    +31 20 123 4567
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
