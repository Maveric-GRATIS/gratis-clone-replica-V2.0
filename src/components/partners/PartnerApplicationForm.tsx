/**
 * Partner Application Form Component
 *
 * Multi-step application form for NGOs to become partners.
 * Part 6 - Section 25: Partner Application System
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Building2,
  User,
  MapPin,
  FileText,
  Upload,
  Users,
  Target,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { db, functions } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import {
  ORGANIZATION_TYPES,
  FOCUS_AREAS,
  ANNUAL_BUDGET_RANGES,
} from "@/types/partner";
import type { PartnerApplication } from "@/types/partner";
import { useFormDraft } from "@/hooks/useFormDraft";
import { FormDraftBanner } from "@/components/forms/FormDraftBanner";
import { SaveDraftButton } from "@/components/forms/SaveDraftButton";

const STEPS = [
  { id: 1, title: "Organization", icon: Building2 },
  { id: 2, title: "Contact", icon: User },
  { id: 3, title: "Location", icon: MapPin },
  { id: 4, title: "Profile", icon: FileText },
  { id: 5, title: "Documents", icon: Upload },
  { id: 6, title: "References", icon: Users },
  { id: 7, title: "Goals", icon: Target },
  { id: 8, title: "Review", icon: CheckCircle },
];

const COUNTRIES = [
  "Netherlands",
  "Germany",
  "Belgium",
  "France",
  "United Kingdom",
  "Spain",
  "Italy",
  "Poland",
  "Sweden",
  "Austria",
  "Switzerland",
  "Portugal",
  "Ireland",
  "Denmark",
  "Finland",
  "Norway",
  "Greece",
  "Czech Republic",
  "Romania",
  "Hungary",
];

export function PartnerApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [formData, setFormData] = useState<Partial<PartnerApplication>>({
    organizationType: "ngo",
    focusAreas: [],
    operatingCountries: [],
    references: [
      { name: "", organization: "", email: "", phone: "", relationship: "" },
      { name: "", organization: "", email: "", phone: "", relationship: "" },
    ],
    documents: {},
  });

  const {
    draft,
    saveDraft,
    clearDraft,
    lastSaved,
    saving,
    hasDraft,
    loadingDraft,
  } = useFormDraft<Partial<PartnerApplication>>("partner-application");

  const handleRestoreDraft = () => {
    if (draft) {
      setFormData(draft);
      setDraftRestored(true);
      toast.success(
        "Concept hersteld — je kunt verder gaan waar je gebleven was",
      );
    }
  };

  const handleDiscardDraft = async () => {
    await clearDraft();
    setDraftRestored(false);
    toast.info("Concept verwijderd");
  };

  const handleSaveDraft = async () => {
    await saveDraft(formData as unknown as Partial<PartnerApplication>);
    toast.success(
      "Concept opgeslagen — je kunt dit formulier later verder invullen.",
    );
  };

  const updateFormData = (updates: Partial<PartnerApplication>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const updateNestedData = (path: string, value: any) => {
    setFormData((prev) => {
      const keys = path.split(".");
      const newData = { ...prev };
      let current: any = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (
          !formData.organizationName ||
          !formData.registrationNumber ||
          !formData.yearFounded ||
          !formData.website
        ) {
          toast.error("Please fill in all required fields");
          return false;
        }
        break;
      case 2:
        if (
          !formData.primaryContact?.firstName ||
          !formData.primaryContact?.lastName ||
          !formData.primaryContact?.email ||
          !formData.primaryContact?.phone
        ) {
          toast.error("Please fill in all contact information");
          return false;
        }
        break;
      case 3:
        if (
          !formData.headquarters?.street ||
          !formData.headquarters?.city ||
          !formData.headquarters?.postalCode ||
          !formData.headquarters?.country ||
          !formData.operatingCountries ||
          formData.operatingCountries.length === 0
        ) {
          toast.error("Please fill in all location information");
          return false;
        }
        break;
      case 4:
        if (
          !formData.mission ||
          formData.mission.length < 50 ||
          !formData.description ||
          formData.description.length < 100 ||
          !formData.focusAreas ||
          formData.focusAreas.length === 0 ||
          !formData.annualBudget ||
          !formData.staffCount
        ) {
          toast.error("Please complete your organization profile");
          return false;
        }
        break;
      case 6:
        const validRefs = formData.references?.filter(
          (ref) => ref.name && ref.organization && ref.email,
        );
        if (!validRefs || validRefs.length < 2) {
          toast.error("Please provide at least 2 references");
          return false;
        }
        break;
      case 7:
        if (
          !formData.partnershipGoals ||
          formData.partnershipGoals.length < 50 ||
          !formData.expectedProjects
        ) {
          toast.error("Please describe your partnership goals");
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep() && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      // Save application to Firestore
      await addDoc(collection(db, "partnerApplications"), {
        ...formData,
        status: "pending",
        submittedAt: serverTimestamp(),
        createdAt: new Date().toISOString(),
      });

      // Send email notification
      const sendPartnerNotification = httpsCallable(
        functions,
        "sendPartnerApplicationNotification",
      );
      await sendPartnerNotification(formData);

      toast.success("Application submitted successfully!");
      await clearDraft();
      // Redirect to confirmation page
      window.location.href = "/partners/apply/confirmation";
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {hasDraft && !loadingDraft && (
        <FormDraftBanner
          lastSaved={lastSaved}
          onRestore={handleRestoreDraft}
          onDiscard={handleDiscardDraft}
          restored={draftRestored}
        />
      )}

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isComplete = step.id < currentStep;

            return (
              <div key={step.id} className="flex-1 relative">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isActive
                        ? "bg-blue-600 border-blue-600 text-white"
                        : isComplete
                          ? "bg-green-500 border-green-500 text-white"
                          : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 hidden md:block ${
                      isActive || isComplete
                        ? "text-gray-900 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`absolute top-5 left-1/2 h-0.5 w-full ${
                      isComplete ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1].title} Information</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Step 1: Organization Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="orgName">Organization Name *</Label>
                <Input
                  id="orgName"
                  value={formData.organizationName || ""}
                  onChange={(e) =>
                    updateFormData({ organizationName: e.target.value })
                  }
                  placeholder="Enter your organization name"
                />
              </div>

              <div>
                <Label htmlFor="orgType">Organization Type *</Label>
                <Select
                  value={formData.organizationType}
                  onValueChange={(value: any) =>
                    updateFormData({ organizationType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORGANIZATION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="regNumber">Registration Number *</Label>
                <Input
                  id="regNumber"
                  value={formData.registrationNumber || ""}
                  onChange={(e) =>
                    updateFormData({ registrationNumber: e.target.value })
                  }
                  placeholder="Official registration number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taxId">Tax ID (Optional)</Label>
                  <Input
                    id="taxId"
                    value={formData.taxId || ""}
                    onChange={(e) => updateFormData({ taxId: e.target.value })}
                    placeholder="Tax identification number"
                  />
                </div>

                <div>
                  <Label htmlFor="yearFounded">Year Founded *</Label>
                  <Input
                    id="yearFounded"
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={formData.yearFounded || ""}
                    onChange={(e) =>
                      updateFormData({ yearFounded: parseInt(e.target.value) })
                    }
                    placeholder="YYYY"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website *</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website || ""}
                  onChange={(e) => updateFormData({ website: e.target.value })}
                  placeholder="https://www.example.org"
                />
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.primaryContact?.firstName || ""}
                    onChange={(e) =>
                      updateNestedData(
                        "primaryContact.firstName",
                        e.target.value,
                      )
                    }
                    placeholder="First name"
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.primaryContact?.lastName || ""}
                    onChange={(e) =>
                      updateNestedData(
                        "primaryContact.lastName",
                        e.target.value,
                      )
                    }
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.primaryContact?.email || ""}
                  onChange={(e) =>
                    updateNestedData("primaryContact.email", e.target.value)
                  }
                  placeholder="contact@organization.org"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.primaryContact?.phone || ""}
                  onChange={(e) =>
                    updateNestedData("primaryContact.phone", e.target.value)
                  }
                  placeholder="+31 20 123 4567"
                />
              </div>

              <div>
                <Label htmlFor="position">Position/Title *</Label>
                <Input
                  id="position"
                  value={formData.primaryContact?.position || ""}
                  onChange={(e) =>
                    updateNestedData("primaryContact.position", e.target.value)
                  }
                  placeholder="e.g., Executive Director, Program Manager"
                />
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  value={formData.headquarters?.street || ""}
                  onChange={(e) =>
                    updateNestedData("headquarters.street", e.target.value)
                  }
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.headquarters?.city || ""}
                    onChange={(e) =>
                      updateNestedData("headquarters.city", e.target.value)
                    }
                    placeholder="City"
                  />
                </div>

                <div>
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    value={formData.headquarters?.postalCode || ""}
                    onChange={(e) =>
                      updateNestedData(
                        "headquarters.postalCode",
                        e.target.value,
                      )
                    }
                    placeholder="Postal code"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={formData.headquarters?.country}
                  onValueChange={(value) =>
                    updateNestedData("headquarters.country", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Operating Countries * (Select at least one)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-48 overflow-y-auto border rounded-md p-3">
                  {COUNTRIES.map((country) => (
                    <div key={country} className="flex items-center space-x-2">
                      <Checkbox
                        id={`op-${country}`}
                        checked={formData.operatingCountries?.includes(country)}
                        onCheckedChange={(checked) => {
                          const current = formData.operatingCountries || [];
                          if (checked) {
                            updateFormData({
                              operatingCountries: [...current, country],
                            });
                          } else {
                            updateFormData({
                              operatingCountries: current.filter(
                                (c) => c !== country,
                              ),
                            });
                          }
                        }}
                      />
                      <label htmlFor={`op-${country}`} className="text-sm">
                        {country}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Organization Profile */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="mission">
                  Mission Statement * (min 50 characters)
                </Label>
                <Textarea
                  id="mission"
                  value={formData.mission || ""}
                  onChange={(e) => updateFormData({ mission: e.target.value })}
                  placeholder="Describe your organization's mission..."
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.mission?.length || 0} / 500 characters
                </p>
              </div>

              <div>
                <Label htmlFor="description">
                  Organization Description * (min 100 characters)
                </Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    updateFormData({ description: e.target.value })
                  }
                  placeholder="Provide a detailed description of your work, programs, and impact..."
                  rows={5}
                  maxLength={2000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description?.length || 0} / 2000 characters
                </p>
              </div>

              <div>
                <Label>Focus Areas * (Select at least one)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {FOCUS_AREAS.map((area) => (
                    <div
                      key={area.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`area-${area.value}`}
                        checked={formData.focusAreas?.includes(area.value)}
                        onCheckedChange={(checked) => {
                          const current = formData.focusAreas || [];
                          if (checked) {
                            updateFormData({
                              focusAreas: [...current, area.value] as any,
                            });
                          } else {
                            updateFormData({
                              focusAreas: current.filter(
                                (a) => a !== area.value,
                              ) as any,
                            });
                          }
                        }}
                      />
                      <label htmlFor={`area-${area.value}`} className="text-sm">
                        {area.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="beneficiaries">
                    Beneficiaries Served (Annual) *
                  </Label>
                  <Input
                    id="beneficiaries"
                    type="number"
                    min="0"
                    value={formData.beneficiariesServed || ""}
                    onChange={(e) =>
                      updateFormData({
                        beneficiariesServed: parseInt(e.target.value),
                      })
                    }
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="budget">Annual Budget *</Label>
                  <Select
                    value={formData.annualBudget}
                    onValueChange={(value) =>
                      updateFormData({ annualBudget: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      {ANNUAL_BUDGET_RANGES.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="staff">Staff Count *</Label>
                  <Input
                    id="staff"
                    type="number"
                    min="1"
                    value={formData.staffCount || ""}
                    onChange={(e) =>
                      updateFormData({ staffCount: parseInt(e.target.value) })
                    }
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="volunteers">Volunteer Count (Optional)</Label>
                  <Input
                    id="volunteers"
                    type="number"
                    min="0"
                    value={formData.volunteerCount || ""}
                    onChange={(e) =>
                      updateFormData({
                        volunteerCount: parseInt(e.target.value),
                      })
                    }
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Documents */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Upload supporting documents. All documents are optional but will
                speed up the review process.
              </p>

              <Card className="p-4 bg-gray-50">
                <Label className="font-semibold">
                  Registration Certificate
                </Label>
                <p className="text-sm text-gray-600 mb-2">
                  Official government registration document
                </p>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
              </Card>

              <Card className="p-4 bg-gray-50">
                <Label className="font-semibold">
                  Tax Exemption Certificate
                </Label>
                <p className="text-sm text-gray-600 mb-2">
                  Document proving tax-exempt status (if applicable)
                </p>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
              </Card>

              <Card className="p-4 bg-gray-50">
                <Label className="font-semibold">Annual Report</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Most recent annual report or impact report
                </p>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
              </Card>

              <Card className="p-4 bg-gray-50">
                <Label className="font-semibold">Financial Statements</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Latest audited financial statements
                </p>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
              </Card>
            </div>
          )}

          {/* Step 6: References */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <p className="text-sm text-gray-600">
                Provide at least 2 professional references from partner
                organizations or stakeholders.
              </p>

              {formData.references?.map((ref, index) => (
                <Card key={index} className="p-4">
                  <h4 className="font-semibold mb-3">Reference {index + 1}</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Name *</Label>
                        <Input
                          value={ref.name}
                          onChange={(e) => {
                            const newRefs = [...(formData.references || [])];
                            newRefs[index].name = e.target.value;
                            updateFormData({ references: newRefs });
                          }}
                          placeholder="Full name"
                        />
                      </div>

                      <div>
                        <Label>Organization *</Label>
                        <Input
                          value={ref.organization}
                          onChange={(e) => {
                            const newRefs = [...(formData.references || [])];
                            newRefs[index].organization = e.target.value;
                            updateFormData({ references: newRefs });
                          }}
                          placeholder="Organization name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          value={ref.email}
                          onChange={(e) => {
                            const newRefs = [...(formData.references || [])];
                            newRefs[index].email = e.target.value;
                            updateFormData({ references: newRefs });
                          }}
                          placeholder="email@example.com"
                        />
                      </div>

                      <div>
                        <Label>Phone (Optional)</Label>
                        <Input
                          type="tel"
                          value={ref.phone || ""}
                          onChange={(e) => {
                            const newRefs = [...(formData.references || [])];
                            newRefs[index].phone = e.target.value;
                            updateFormData({ references: newRefs });
                          }}
                          placeholder="+31 20 123 4567"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Relationship *</Label>
                      <Input
                        value={ref.relationship}
                        onChange={(e) => {
                          const newRefs = [...(formData.references || [])];
                          newRefs[index].relationship = e.target.value;
                          updateFormData({ references: newRefs });
                        }}
                        placeholder="e.g., Partner Organization, Funding Agency"
                      />
                    </div>
                  </div>
                </Card>
              ))}

              <Button
                variant="outline"
                onClick={() => {
                  const newRef = {
                    name: "",
                    organization: "",
                    email: "",
                    phone: "",
                    relationship: "",
                  };
                  updateFormData({
                    references: [...(formData.references || []), newRef],
                  });
                }}
              >
                + Add Another Reference
              </Button>
            </div>
          )}

          {/* Step 7: Partnership Goals */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="goals">
                  Partnership Goals * (min 50 characters)
                </Label>
                <Textarea
                  id="goals"
                  value={formData.partnershipGoals || ""}
                  onChange={(e) =>
                    updateFormData({ partnershipGoals: e.target.value })
                  }
                  placeholder="Describe what you hope to achieve through this partnership..."
                  rows={5}
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.partnershipGoals?.length || 0} / 1000 characters
                </p>
              </div>

              <div>
                <Label htmlFor="expectedProjects">
                  Expected Number of Projects (First Year) *
                </Label>
                <Input
                  id="expectedProjects"
                  type="number"
                  min="1"
                  value={formData.expectedProjects || ""}
                  onChange={(e) =>
                    updateFormData({
                      expectedProjects: parseInt(e.target.value),
                    })
                  }
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="startDate">
                  Preferred Start Date (Optional)
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={
                    formData.preferredStartDate
                      ? new Date(formData.preferredStartDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    updateFormData({
                      preferredStartDate: new Date(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* Step 8: Review & Submit */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Review Your Application
                </h3>
                <p className="text-sm text-blue-800">
                  Please review all information before submitting. You can use
                  the back button to make changes to any section.
                </p>
              </div>

              <div className="space-y-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Organization</h4>
                  <p className="text-sm text-gray-600">
                    {formData.organizationName}
                  </p>
                  <p className="text-sm text-gray-600">{formData.website}</p>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Contact</h4>
                  <p className="text-sm text-gray-600">
                    {formData.primaryContact?.firstName}{" "}
                    {formData.primaryContact?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formData.primaryContact?.email}
                  </p>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Focus Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.focusAreas?.map((area) => (
                      <span
                        key={area}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        {FOCUS_AREAS.find((a) => a.value === area)?.label}
                      </span>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" required />
                  <label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <a
                      href="/legal/terms"
                      className="text-blue-600 hover:underline"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/legal/privacy"
                      className="text-blue-600 hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="conduct" required />
                  <label htmlFor="conduct" className="text-sm">
                    I agree to the{" "}
                    <a
                      href="/legal/partner-code-of-conduct"
                      className="text-blue-600 hover:underline"
                    >
                      Partner Code of Conduct
                    </a>
                  </label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="accuracy" required />
                  <label htmlFor="accuracy" className="text-sm">
                    I certify that all information provided is accurate and
                    complete
                  </label>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <SaveDraftButton
          onSave={handleSaveDraft}
          lastSaved={lastSaved}
          saving={saving}
        />

        {currentStep < STEPS.length ? (
          <Button onClick={nextStep}>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        )}
      </div>
    </div>
  );
}
