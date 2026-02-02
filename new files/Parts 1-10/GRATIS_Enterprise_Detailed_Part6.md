# GRATIS.NGO Enterprise Development Prompts - PART 6
## NGO Partner System: Applications, Verification & Partner Dashboard (Sections 25-30)
### Total Estimated Size: ~55,000 tokens | Complexity: HIGH

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 25: NGO/PARTNER APPLICATION SYSTEM
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 25.1: Create Partner Types & Application Schema

```
Create the complete type definitions and database schema for NGO partner applications.

### FILE: src/types/partner.ts
// =============================================================================
// PARTNER & NGO TYPES
// =============================================================================

import type { Timestamp } from 'firebase/firestore';

export type PartnerType = 
  | 'ngo'           // Non-profit organization
  | 'charity'       // Registered charity
  | 'foundation'    // Private/public foundation
  | 'social_enterprise' // Social enterprise
  | 'corporate'     // Corporate partner (CSR)
  | 'government'    // Government agency
  | 'educational';  // Educational institution

export type PartnerStatus = 
  | 'pending'       // Application submitted
  | 'under_review'  // Being reviewed by team
  | 'documents_required' // Additional docs needed
  | 'approved'      // Approved partner
  | 'rejected'      // Application rejected
  | 'suspended'     // Temporarily suspended
  | 'terminated';   // Partnership ended

export type PartnerTier = 
  | 'bronze'        // Basic partner (0-10 projects)
  | 'silver'        // Active partner (11-25 projects)
  | 'gold'          // Premium partner (26-50 projects)
  | 'platinum';     // Elite partner (50+ projects)

export type FocusArea =
  | 'clean_water'
  | 'sanitation'
  | 'education'
  | 'healthcare'
  | 'food_security'
  | 'environment'
  | 'disaster_relief'
  | 'poverty_reduction'
  | 'gender_equality'
  | 'youth_development';

export interface PartnerApplication {
  id: string;
  
  // Organization Details
  organizationName: string;
  organizationType: PartnerType;
  registrationNumber: string;
  taxId?: string;
  yearFounded: number;
  website: string;
  
  // Contact Information
  primaryContact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
  };
  
  // Address
  headquarters: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  operatingCountries: string[];
  
  // Organization Profile
  mission: string;
  description: string;
  focusAreas: FocusArea[];
  beneficiariesServed: number;
  annualBudget: string; // Range: <100k, 100k-500k, 500k-1M, 1M-5M, 5M+
  staffCount: number;
  volunteerCount?: number;
  
  // Documents
  documents: {
    registrationCertificate?: string; // URL
    taxExemptionCertificate?: string;
    annualReport?: string;
    financialStatements?: string;
    boardResolution?: string;
    additionalDocs?: string[];
  };
  
  // References
  references: {
    name: string;
    organization: string;
    email: string;
    phone?: string;
    relationship: string;
  }[];
  
  // Partnership Goals
  partnershipGoals: string;
  expectedProjects: number;
  preferredStartDate?: Timestamp;
  
  // Application Status
  status: PartnerStatus;
  submittedAt: Timestamp;
  reviewedAt?: Timestamp;
  reviewedBy?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  
  // Verification
  verification: {
    documentsVerified: boolean;
    referencesChecked: boolean;
    backgroundCheckPassed: boolean;
    siteVisitCompleted?: boolean;
    verifiedAt?: Timestamp;
    verifiedBy?: string;
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Partner {
  id: string;
  applicationId: string;
  
  // Core Info (from application)
  organizationName: string;
  organizationType: PartnerType;
  slug: string;
  logo?: string;
  coverImage?: string;
  
  // Status & Tier
  status: PartnerStatus;
  tier: PartnerTier;
  tierUpdatedAt: Timestamp;
  
  // Contact
  primaryContact: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  teamMembers: PartnerTeamMember[];
  
  // Profile
  mission: string;
  description: string;
  website: string;
  focusAreas: FocusArea[];
  operatingCountries: string[];
  
  // Social
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  
  // Stats
  stats: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalFundsRaised: number;
    totalBeneficiaries: number;
    impactScore: number;
    rating: number;
    reviewCount: number;
  };
  
  // Settings
  settings: {
    publicProfile: boolean;
    showOnPartnerPage: boolean;
    allowDirectDonations: boolean;
    notificationPreferences: {
      email: boolean;
      projectUpdates: boolean;
      donationAlerts: boolean;
      monthlyReports: boolean;
    };
  };
  
  // Financial
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string; // Encrypted
    routingNumber: string; // Encrypted
    swiftCode?: string;
  };
  stripeConnectId?: string;
  payoutSchedule: 'weekly' | 'biweekly' | 'monthly';
  
  // Agreement
  agreementSignedAt: Timestamp;
  agreementVersion: string;
  
  approvedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PartnerTeamMember {
  id: string;
  oduserId: string;
  partnerId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  permissions: PartnerPermission[];
  invitedAt: Timestamp;
  acceptedAt?: Timestamp;
  status: 'pending' | 'active' | 'suspended';
}

export type PartnerPermission =
  | 'manage_team'
  | 'manage_projects'
  | 'manage_finances'
  | 'view_analytics'
  | 'manage_settings'
  | 'post_updates'
  | 'respond_donors';

export interface PartnerProject {
  id: string;
  partnerId: string;
  
  // Project Details
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  
  // Categorization
  category: FocusArea;
  tags: string[];
  
  // Location
  location: {
    country: string;
    region?: string;
    city?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Media
  coverImage: string;
  gallery: string[];
  videoUrl?: string;
  
  // Funding
  fundingGoal: number;
  currentFunding: number;
  currency: string;
  donorCount: number;
  
  // Timeline
  startDate: Timestamp;
  endDate?: Timestamp;
  milestones: ProjectMilestone[];
  
  // Impact
  targetBeneficiaries: number;
  actualBeneficiaries: number;
  impactMetrics: {
    metric: string;
    target: number;
    current: number;
    unit: string;
  }[];
  
  // Status
  status: 'draft' | 'pending_approval' | 'active' | 'funded' | 'in_progress' | 'completed' | 'cancelled';
  visibility: 'public' | 'private' | 'unlisted';
  featured: boolean;
  
  // Verification
  verified: boolean;
  verifiedAt?: Timestamp;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: Timestamp;
  completedAt?: Timestamp;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  evidence?: string[];
}

### FILE: src/app/(public)/partners/apply/page.tsx
import { Metadata } from 'next';
import { PartnerApplicationForm } from '@/components/partners/PartnerApplicationForm';

export const metadata: Metadata = {
  title: 'Become a Partner | GRATIS.NGO',
  description: 'Apply to become a GRATIS.NGO partner and amplify your impact.',
};

export default function PartnerApplicationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Partner With Us
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join our network of NGOs and organizations making a difference. 
            Together, we can create lasting impact.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Partner Organizations</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">€10M+</div>
              <div className="text-gray-600">Funds Distributed</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">2M+</div>
              <div className="text-gray-600">Lives Impacted</div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <PartnerApplicationForm />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Partner Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '💰', title: 'Funding Access', desc: 'Tap into our donor network and crowdfunding platform' },
              { icon: '📊', title: 'Analytics Dashboard', desc: 'Track donations, impact metrics, and project progress' },
              { icon: '🌍', title: 'Global Visibility', desc: 'Showcase your projects to millions of supporters' },
              { icon: '🤝', title: 'Network', desc: 'Connect with other NGOs and corporate partners' },
            ].map((benefit) => (
              <div key={benefit.title} className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

### FILE: src/components/partners/PartnerApplicationForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/shared/Icons';
import { FileUpload } from '@/components/shared/FileUpload';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Form validation schema
const applicationSchema = z.object({
  // Step 1: Organization Details
  organizationName: z.string().min(2, 'Organization name is required').max(100),
  organizationType: z.enum(['ngo', 'charity', 'foundation', 'social_enterprise', 'corporate', 'government', 'educational']),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  taxId: z.string().optional(),
  yearFounded: z.number().min(1800).max(new Date().getFullYear()),
  website: z.string().url('Please enter a valid URL'),
  
  // Step 2: Contact Information
  primaryContact: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    position: z.string().min(1, 'Position is required'),
  }),
  
  // Step 3: Address
  headquarters: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().optional(),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(2, 'Country is required'),
  }),
  operatingCountries: z.array(z.string()).min(1, 'Select at least one operating country'),
  
  // Step 4: Organization Profile
  mission: z.string().min(50, 'Mission statement must be at least 50 characters').max(500),
  description: z.string().min(100, 'Description must be at least 100 characters').max(2000),
  focusAreas: z.array(z.string()).min(1, 'Select at least one focus area'),
  beneficiariesServed: z.number().min(0),
  annualBudget: z.enum(['<100k', '100k-500k', '500k-1M', '1M-5M', '5M+']),
  staffCount: z.number().min(1),
  volunteerCount: z.number().optional(),
  
  // Step 5: Documents
  documents: z.object({
    registrationCertificate: z.string().optional(),
    taxExemptionCertificate: z.string().optional(),
    annualReport: z.string().optional(),
    financialStatements: z.string().optional(),
  }),
  
  // Step 6: References
  references: z.array(z.object({
    name: z.string().min(1),
    organization: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    relationship: z.string().min(1),
  })).min(2, 'At least 2 references are required'),
  
  // Step 7: Partnership Goals
  partnershipGoals: z.string().min(50, 'Please describe your partnership goals'),
  expectedProjects: z.number().min(1),
  
  // Agreement
  agreeToTerms: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
  agreeToCodeOfConduct: z.boolean().refine((val) => val === true, 'You must agree to the code of conduct'),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const STEPS = [
  { id: 1, title: 'Organization', icon: Icons.building },
  { id: 2, title: 'Contact', icon: Icons.user },
  { id: 3, title: 'Location', icon: Icons.mapPin },
  { id: 4, title: 'Profile', icon: Icons.fileText },
  { id: 5, title: 'Documents', icon: Icons.upload },
  { id: 6, title: 'References', icon: Icons.users },
  { id: 7, title: 'Goals', icon: Icons.target },
  { id: 8, title: 'Review', icon: Icons.checkCircle },
];

const ORGANIZATION_TYPES = [
  { value: 'ngo', label: 'Non-Profit Organization (NGO)' },
  { value: 'charity', label: 'Registered Charity' },
  { value: 'foundation', label: 'Foundation' },
  { value: 'social_enterprise', label: 'Social Enterprise' },
  { value: 'corporate', label: 'Corporate (CSR Program)' },
  { value: 'government', label: 'Government Agency' },
  { value: 'educational', label: 'Educational Institution' },
];

const FOCUS_AREAS = [
  { value: 'clean_water', label: 'Clean Water Access' },
  { value: 'sanitation', label: 'Sanitation & Hygiene' },
  { value: 'education', label: 'Education' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'food_security', label: 'Food Security' },
  { value: 'environment', label: 'Environment & Climate' },
  { value: 'disaster_relief', label: 'Disaster Relief' },
  { value: 'poverty_reduction', label: 'Poverty Reduction' },
  { value: 'gender_equality', label: 'Gender Equality' },
  { value: 'youth_development', label: 'Youth Development' },
];

const COUNTRIES = [
  'Netherlands', 'Germany', 'Belgium', 'France', 'United Kingdom', 'Spain', 'Italy',
  'Poland', 'Sweden', 'Austria', 'Switzerland', 'Portugal', 'Ireland', 'Denmark',
  'Finland', 'Norway', 'Greece', 'Czech Republic', 'Romania', 'Hungary',
  // Add more countries as needed
];

export function PartnerApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [references, setReferences] = useState([
    { name: '', organization: '', email: '', phone: '', relationship: '' },
    { name: '', organization: '', email: '', phone: '', relationship: '' },
  ]);

  const methods = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      organizationType: 'ngo',
      focusAreas: [],
      operatingCountries: [],
      references: references,
      agreeToTerms: false,
      agreeToCodeOfConduct: false,
    },
    mode: 'onChange',
  });

  const { register, handleSubmit, watch, setValue, formState: { errors }, trigger } = methods;

  const validateStep = async () => {
    let fieldsToValidate: (keyof ApplicationFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['organizationName', 'organizationType', 'registrationNumber', 'yearFounded', 'website'];
        break;
      case 2:
        fieldsToValidate = ['primaryContact'];
        break;
      case 3:
        fieldsToValidate = ['headquarters', 'operatingCountries'];
        break;
      case 4:
        fieldsToValidate = ['mission', 'description', 'focusAreas', 'beneficiariesServed', 'annualBudget', 'staffCount'];
        break;
      case 5:
        // Documents are optional
        return true;
      case 6:
        fieldsToValidate = ['references'];
        break;
      case 7:
        fieldsToValidate = ['partnershipGoals', 'expectedProjects'];
        break;
    }
    
    return await trigger(fieldsToValidate);
  };

  const nextStep = async () => {
    const isValid = await validateStep();
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/partners/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      const result = await response.json();
      
      toast.success('Application submitted successfully!');
      
      // Redirect to confirmation page
      window.location.href = `/partners/apply/confirmation?id=${result.applicationId}`;
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                        isCompleted ? 'bg-green-500 text-white' :
                        isActive ? 'bg-blue-600 text-white' :
                        'bg-gray-200 text-gray-500'
                      )}
                    >
                      {isCompleted ? (
                        <Icons.check className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={cn(
                      'text-xs mt-2 hidden md:block',
                      isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
                    )}>
                      {step.title}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={cn(
                      'flex-1 h-1 mx-2',
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    )} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              Step {currentStep}: {STEPS[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Step 1: Organization Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="organizationName">Organization Name *</Label>
                        <Input
                          id="organizationName"
                          {...register('organizationName')}
                          placeholder="Enter your organization name"
                        />
                        {errors.organizationName && (
                          <p className="text-red-500 text-sm mt-1">{errors.organizationName.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="organizationType">Organization Type *</Label>
                        <Select
                          onValueChange={(value) => setValue('organizationType', value as any)}
                          defaultValue={watch('organizationType')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
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
                        <Label htmlFor="registrationNumber">Registration Number *</Label>
                        <Input
                          id="registrationNumber"
                          {...register('registrationNumber')}
                          placeholder="e.g., NGO-2024-12345"
                        />
                        {errors.registrationNumber && (
                          <p className="text-red-500 text-sm mt-1">{errors.registrationNumber.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="taxId">Tax ID (optional)</Label>
                        <Input
                          id="taxId"
                          {...register('taxId')}
                          placeholder="Tax identification number"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="yearFounded">Year Founded *</Label>
                        <Input
                          id="yearFounded"
                          type="number"
                          {...register('yearFounded', { valueAsNumber: true })}
                          placeholder="e.g., 2010"
                        />
                        {errors.yearFounded && (
                          <p className="text-red-500 text-sm mt-1">{errors.yearFounded.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="website">Website *</Label>
                        <Input
                          id="website"
                          {...register('website')}
                          placeholder="https://www.example.org"
                        />
                        {errors.website && (
                          <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Contact Information */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <p className="text-gray-600 mb-4">
                      Please provide details of the primary contact person for this partnership.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>First Name *</Label>
                        <Input {...register('primaryContact.firstName')} placeholder="First name" />
                        {errors.primaryContact?.firstName && (
                          <p className="text-red-500 text-sm mt-1">{errors.primaryContact.firstName.message}</p>
                        )}
                      </div>
                      <div>
                        <Label>Last Name *</Label>
                        <Input {...register('primaryContact.lastName')} placeholder="Last name" />
                      </div>
                      <div>
                        <Label>Email *</Label>
                        <Input type="email" {...register('primaryContact.email')} placeholder="email@organization.org" />
                      </div>
                      <div>
                        <Label>Phone *</Label>
                        <Input {...register('primaryContact.phone')} placeholder="+31 6 12345678" />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Position/Title *</Label>
                        <Input {...register('primaryContact.position')} placeholder="e.g., Executive Director" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Location */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-4">Headquarters Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label>Street Address *</Label>
                          <Input {...register('headquarters.street')} placeholder="Street address" />
                        </div>
                        <div>
                          <Label>City *</Label>
                          <Input {...register('headquarters.city')} placeholder="City" />
                        </div>
                        <div>
                          <Label>State/Province</Label>
                          <Input {...register('headquarters.state')} placeholder="State/Province" />
                        </div>
                        <div>
                          <Label>Postal Code *</Label>
                          <Input {...register('headquarters.postalCode')} placeholder="Postal code" />
                        </div>
                        <div>
                          <Label>Country *</Label>
                          <Select onValueChange={(value) => setValue('headquarters.country', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              {COUNTRIES.map((country) => (
                                <SelectItem key={country} value={country}>{country}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-4">Operating Countries *</h3>
                      <p className="text-sm text-gray-500 mb-4">Select all countries where your organization operates.</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {COUNTRIES.map((country) => (
                          <label key={country} className="flex items-center space-x-2 cursor-pointer">
                            <Checkbox
                              checked={watch('operatingCountries')?.includes(country)}
                              onCheckedChange={(checked) => {
                                const current = watch('operatingCountries') || [];
                                if (checked) {
                                  setValue('operatingCountries', [...current, country]);
                                } else {
                                  setValue('operatingCountries', current.filter((c) => c !== country));
                                }
                              }}
                            />
                            <span className="text-sm">{country}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Organization Profile */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <Label>Mission Statement *</Label>
                      <Textarea
                        {...register('mission')}
                        placeholder="Describe your organization's mission (50-500 characters)"
                        rows={3}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {watch('mission')?.length || 0}/500 characters
                      </p>
                    </div>
                    
                    <div>
                      <Label>Organization Description *</Label>
                      <Textarea
                        {...register('description')}
                        placeholder="Provide a detailed description of your organization (100-2000 characters)"
                        rows={5}
                      />
                    </div>
                    
                    <div>
                      <Label>Focus Areas *</Label>
                      <p className="text-sm text-gray-500 mb-3">Select all areas your organization focuses on.</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {FOCUS_AREAS.map((area) => (
                          <label key={area.value} className="flex items-center space-x-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                            <Checkbox
                              checked={watch('focusAreas')?.includes(area.value)}
                              onCheckedChange={(checked) => {
                                const current = watch('focusAreas') || [];
                                if (checked) {
                                  setValue('focusAreas', [...current, area.value]);
                                } else {
                                  setValue('focusAreas', current.filter((a) => a !== area.value));
                                }
                              }}
                            />
                            <span className="text-sm">{area.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Beneficiaries Served (annually) *</Label>
                        <Input
                          type="number"
                          {...register('beneficiariesServed', { valueAsNumber: true })}
                          placeholder="e.g., 50000"
                        />
                      </div>
                      <div>
                        <Label>Annual Budget *</Label>
                        <Select onValueChange={(value) => setValue('annualBudget', value as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="<100k">Less than €100,000</SelectItem>
                            <SelectItem value="100k-500k">€100,000 - €500,000</SelectItem>
                            <SelectItem value="500k-1M">€500,000 - €1,000,000</SelectItem>
                            <SelectItem value="1M-5M">€1,000,000 - €5,000,000</SelectItem>
                            <SelectItem value="5M+">More than €5,000,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Number of Staff *</Label>
                        <Input
                          type="number"
                          {...register('staffCount', { valueAsNumber: true })}
                          placeholder="e.g., 25"
                        />
                      </div>
                      <div>
                        <Label>Number of Volunteers</Label>
                        <Input
                          type="number"
                          {...register('volunteerCount', { valueAsNumber: true })}
                          placeholder="e.g., 100"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Documents */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <p className="text-gray-600">
                      Upload the following documents to verify your organization. All documents should be in PDF format.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Registration Certificate</Label>
                        <FileUpload
                          accept=".pdf"
                          maxSize={10 * 1024 * 1024}
                          onUpload={(url) => setValue('documents.registrationCertificate', url)}
                        />
                        <p className="text-xs text-gray-500 mt-1">Official registration document</p>
                      </div>
                      
                      <div>
                        <Label>Tax Exemption Certificate</Label>
                        <FileUpload
                          accept=".pdf"
                          maxSize={10 * 1024 * 1024}
                          onUpload={(url) => setValue('documents.taxExemptionCertificate', url)}
                        />
                        <p className="text-xs text-gray-500 mt-1">If applicable</p>
                      </div>
                      
                      <div>
                        <Label>Annual Report</Label>
                        <FileUpload
                          accept=".pdf"
                          maxSize={20 * 1024 * 1024}
                          onUpload={(url) => setValue('documents.annualReport', url)}
                        />
                        <p className="text-xs text-gray-500 mt-1">Most recent annual report</p>
                      </div>
                      
                      <div>
                        <Label>Financial Statements</Label>
                        <FileUpload
                          accept=".pdf"
                          maxSize={20 * 1024 * 1024}
                          onUpload={(url) => setValue('documents.financialStatements', url)}
                        />
                        <p className="text-xs text-gray-500 mt-1">Audited if available</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 6: References */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <p className="text-gray-600">
                      Please provide at least 2 professional references who can vouch for your organization.
                    </p>
                    
                    {references.map((ref, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">Reference {index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Full Name *</Label>
                              <Input
                                {...register(`references.${index}.name`)}
                                placeholder="Full name"
                              />
                            </div>
                            <div>
                              <Label>Organization *</Label>
                              <Input
                                {...register(`references.${index}.organization`)}
                                placeholder="Organization name"
                              />
                            </div>
                            <div>
                              <Label>Email *</Label>
                              <Input
                                type="email"
                                {...register(`references.${index}.email`)}
                                placeholder="email@example.com"
                              />
                            </div>
                            <div>
                              <Label>Phone</Label>
                              <Input
                                {...register(`references.${index}.phone`)}
                                placeholder="+31 6 12345678"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label>Relationship *</Label>
                              <Input
                                {...register(`references.${index}.relationship`)}
                                placeholder="e.g., Former partner organization, Grant provider"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setReferences([...references, { name: '', organization: '', email: '', phone: '', relationship: '' }])}
                    >
                      <Icons.plus className="w-4 h-4 mr-2" />
                      Add Another Reference
                    </Button>
                  </div>
                )}

                {/* Step 7: Partnership Goals */}
                {currentStep === 7 && (
                  <div className="space-y-6">
                    <div>
                      <Label>Partnership Goals *</Label>
                      <Textarea
                        {...register('partnershipGoals')}
                        placeholder="Describe what you hope to achieve through this partnership and how GRATIS.NGO can help your organization..."
                        rows={5}
                      />
                    </div>
                    
                    <div>
                      <Label>Expected Number of Projects (first year) *</Label>
                      <Input
                        type="number"
                        {...register('expectedProjects', { valueAsNumber: true })}
                        placeholder="e.g., 5"
                      />
                    </div>
                  </div>
                )}

                {/* Step 8: Review & Submit */}
                {currentStep === 8 && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-2">Review Your Application</h3>
                      <p className="text-sm text-blue-700">
                        Please review all the information you've provided before submitting. 
                        Once submitted, you'll receive a confirmation email and our team will 
                        review your application within 5-7 business days.
                      </p>
                    </div>
                    
                    {/* Summary sections */}
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Organization</h4>
                        <p className="text-gray-600">{watch('organizationName')}</p>
                        <p className="text-sm text-gray-500">{ORGANIZATION_TYPES.find((t) => t.value === watch('organizationType'))?.label}</p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Primary Contact</h4>
                        <p className="text-gray-600">{watch('primaryContact.firstName')} {watch('primaryContact.lastName')}</p>
                        <p className="text-sm text-gray-500">{watch('primaryContact.email')}</p>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Focus Areas</h4>
                        <div className="flex flex-wrap gap-2">
                          {watch('focusAreas')?.map((area) => (
                            <span key={area} className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                              {FOCUS_AREAS.find((f) => f.value === area)?.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Agreements */}
                    <div className="space-y-4 pt-6 border-t">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <Checkbox
                          {...register('agreeToTerms')}
                          onCheckedChange={(checked) => setValue('agreeToTerms', !!checked)}
                        />
                        <span className="text-sm">
                          I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and 
                          <a href="/privacy" className="text-blue-600 hover:underline"> Privacy Policy</a> *
                        </span>
                      </label>
                      
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <Checkbox
                          {...register('agreeToCodeOfConduct')}
                          onCheckedChange={(checked) => setValue('agreeToCodeOfConduct', !!checked)}
                        />
                        <span className="text-sm">
                          I agree to the <a href="/partner-code-of-conduct" className="text-blue-600 hover:underline">Partner Code of Conduct</a> 
                          and confirm that all information provided is accurate *
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <Icons.chevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < STEPS.length ? (
            <Button type="button" onClick={nextStep}>
              Next
              <Icons.chevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <Icons.send className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 26: PARTNER APPLICATION API & VERIFICATION
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 26.1: Create Partner Application API Routes

```
Create the API routes for partner application submission and admin review.

### FILE: src/app/api/partners/apply/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { sendEmail } from '@/lib/email/service';

const applicationSchema = z.object({
  organizationName: z.string().min(2).max(100),
  organizationType: z.enum(['ngo', 'charity', 'foundation', 'social_enterprise', 'corporate', 'government', 'educational']),
  registrationNumber: z.string().min(1),
  taxId: z.string().optional(),
  yearFounded: z.number().min(1800).max(new Date().getFullYear()),
  website: z.string().url(),
  primaryContact: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(10),
    position: z.string().min(1),
  }),
  headquarters: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().optional(),
    postalCode: z.string().min(1),
    country: z.string().min(2),
  }),
  operatingCountries: z.array(z.string()).min(1),
  mission: z.string().min(50).max(500),
  description: z.string().min(100).max(2000),
  focusAreas: z.array(z.string()).min(1),
  beneficiariesServed: z.number().min(0),
  annualBudget: z.enum(['<100k', '100k-500k', '500k-1M', '1M-5M', '5M+']),
  staffCount: z.number().min(1),
  volunteerCount: z.number().optional(),
  documents: z.object({
    registrationCertificate: z.string().optional(),
    taxExemptionCertificate: z.string().optional(),
    annualReport: z.string().optional(),
    financialStatements: z.string().optional(),
  }),
  references: z.array(z.object({
    name: z.string().min(1),
    organization: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    relationship: z.string().min(1),
  })).min(2),
  partnershipGoals: z.string().min(50),
  expectedProjects: z.number().min(1),
  agreeToTerms: z.boolean().refine((v) => v === true),
  agreeToCodeOfConduct: z.boolean().refine((v) => v === true),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = applicationSchema.parse(body);

    // Check for existing application with same email or registration number
    const existingEmail = await db.collection('partnerApplications')
      .where('primaryContact.email', '==', validatedData.primaryContact.email)
      .where('status', 'in', ['pending', 'under_review', 'approved'])
      .limit(1)
      .get();

    if (!existingEmail.empty) {
      return NextResponse.json(
        { error: 'An application with this email already exists' },
        { status: 400 }
      );
    }

    const existingReg = await db.collection('partnerApplications')
      .where('registrationNumber', '==', validatedData.registrationNumber)
      .where('status', 'in', ['pending', 'under_review', 'approved'])
      .limit(1)
      .get();

    if (!existingReg.empty) {
      return NextResponse.json(
        { error: 'An application with this registration number already exists' },
        { status: 400 }
      );
    }

    // Create application
    const applicationId = nanoid(12);
    const application = {
      id: applicationId,
      ...validatedData,
      status: 'pending',
      verification: {
        documentsVerified: false,
        referencesChecked: false,
        backgroundCheckPassed: false,
      },
      submittedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('partnerApplications').doc(applicationId).set(application);

    // Send confirmation email to applicant
    await sendEmail({
      to: validatedData.primaryContact.email,
      template: 'partner-application-received',
      data: {
        organizationName: validatedData.organizationName,
        contactName: validatedData.primaryContact.firstName,
        applicationId,
      },
    });

    // Send notification to admin
    await db.collection('adminNotifications').add({
      type: 'new_partner_application',
      applicationId,
      organizationName: validatedData.organizationName,
      createdAt: new Date(),
      read: false,
    });

    return NextResponse.json({
      success: true,
      applicationId,
      message: 'Application submitted successfully',
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

### FILE: src/app/api/partners/applications/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { db } from '@/lib/firebase/admin';

// GET /api/partners/applications/[id] - Get application details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applicationDoc = await db.collection('partnerApplications').doc(params.id).get();

    if (!applicationDoc.exists) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ application: { id: applicationDoc.id, ...applicationDoc.data() } });
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/partners/applications/[id] - Update application status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, reviewNotes, rejectionReason } = body;

    const applicationRef = db.collection('partnerApplications').doc(params.id);
    const applicationDoc = await applicationRef.get();

    if (!applicationDoc.exists) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const updateData: any = {
      status,
      reviewedAt: new Date(),
      reviewedBy: session.user.id,
      updatedAt: new Date(),
    };

    if (reviewNotes) updateData.reviewNotes = reviewNotes;
    if (rejectionReason) updateData.rejectionReason = rejectionReason;

    await applicationRef.update(updateData);

    const applicationData = applicationDoc.data();

    // If approved, create partner record
    if (status === 'approved') {
      await createPartnerFromApplication(params.id, applicationData);
    }

    // Send email notification
    await sendStatusUpdateEmail(applicationData, status, rejectionReason);

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function createPartnerFromApplication(applicationId: string, applicationData: any) {
  const { nanoid } = await import('nanoid');
  const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const partnerId = nanoid(12);
  const slug = slugify(applicationData.organizationName);

  // Create user account for primary contact if doesn't exist
  let userId = null;
  const existingUser = await db.collection('users')
    .where('email', '==', applicationData.primaryContact.email)
    .limit(1)
    .get();

  if (existingUser.empty) {
    // Create new user
    const newUserId = nanoid(12);
    await db.collection('users').doc(newUserId).set({
      id: newUserId,
      email: applicationData.primaryContact.email,
      firstName: applicationData.primaryContact.firstName,
      lastName: applicationData.primaryContact.lastName,
      role: 'partner',
      partnerId,
      createdAt: new Date(),
    });
    userId = newUserId;
  } else {
    userId = existingUser.docs[0].id;
    await existingUser.docs[0].ref.update({
      role: 'partner',
      partnerId,
    });
  }

  // Create partner record
  const partner = {
    id: partnerId,
    applicationId,
    organizationName: applicationData.organizationName,
    organizationType: applicationData.organizationType,
    slug,
    status: 'approved',
    tier: 'bronze',
    tierUpdatedAt: new Date(),
    primaryContact: {
      userId,
      ...applicationData.primaryContact,
    },
    teamMembers: [{
      id: nanoid(8),
      userId,
      partnerId,
      firstName: applicationData.primaryContact.firstName,
      lastName: applicationData.primaryContact.lastName,
      email: applicationData.primaryContact.email,
      role: 'admin',
      permissions: ['manage_team', 'manage_projects', 'manage_finances', 'view_analytics', 'manage_settings', 'post_updates', 'respond_donors'],
      invitedAt: new Date(),
      acceptedAt: new Date(),
      status: 'active',
    }],
    mission: applicationData.mission,
    description: applicationData.description,
    website: applicationData.website,
    focusAreas: applicationData.focusAreas,
    operatingCountries: applicationData.operatingCountries,
    stats: {
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      totalFundsRaised: 0,
      totalBeneficiaries: 0,
      impactScore: 0,
      rating: 0,
      reviewCount: 0,
    },
    settings: {
      publicProfile: true,
      showOnPartnerPage: true,
      allowDirectDonations: true,
      notificationPreferences: {
        email: true,
        projectUpdates: true,
        donationAlerts: true,
        monthlyReports: true,
      },
    },
    payoutSchedule: 'monthly',
    agreementSignedAt: new Date(),
    agreementVersion: '1.0',
    approvedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.collection('partners').doc(partnerId).set(partner);

  return partnerId;
}

async function sendStatusUpdateEmail(applicationData: any, status: string, rejectionReason?: string) {
  const { sendEmail } = await import('@/lib/email/service');

  const templates: Record<string, string> = {
    under_review: 'partner-application-under-review',
    documents_required: 'partner-application-documents-required',
    approved: 'partner-application-approved',
    rejected: 'partner-application-rejected',
  };

  if (templates[status]) {
    await sendEmail({
      to: applicationData.primaryContact.email,
      template: templates[status],
      data: {
        organizationName: applicationData.organizationName,
        contactName: applicationData.primaryContact.firstName,
        rejectionReason,
      },
    });
  }
}

### FILE: src/app/api/admin/partners/applications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { db } from '@/lib/firebase/admin';

// GET /api/admin/partners/applications - List all applications (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let query = db.collection('partnerApplications').orderBy('submittedAt', 'desc');

    if (status) {
      query = query.where('status', '==', status);
    }
    if (type) {
      query = query.where('organizationType', '==', type);
    }

    const snapshot = await query.limit(limit).offset((page - 1) * limit).get();

    const applications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get counts by status
    const statusCounts = {
      pending: 0,
      under_review: 0,
      documents_required: 0,
      approved: 0,
      rejected: 0,
    };

    const countSnapshot = await db.collection('partnerApplications').get();
    countSnapshot.docs.forEach((doc) => {
      const s = doc.data().status;
      if (statusCounts.hasOwnProperty(s)) {
        statusCounts[s as keyof typeof statusCounts]++;
      }
    });

    return NextResponse.json({
      applications,
      statusCounts,
      pagination: {
        page,
        limit,
        total: countSnapshot.size,
        totalPages: Math.ceil(countSnapshot.size / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 27: PARTNER DASHBOARD
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 27.1: Create Partner Dashboard Layout & Overview

```
Create the complete partner dashboard with overview, projects, analytics, and settings.

### FILE: src/app/partner/layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth/session';
import { PartnerSidebar } from '@/components/partner/PartnerSidebar';
import { PartnerHeader } from '@/components/partner/PartnerHeader';

export default async function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect('/login?callbackUrl=/partner');
  }

  if (session.user.role !== 'partner') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PartnerSidebar />
      <div className="lg:pl-64">
        <PartnerHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

### FILE: src/components/partner/PartnerSidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Overview', href: '/partner', icon: Icons.home },
  { name: 'Projects', href: '/partner/projects', icon: Icons.folderOpen },
  { name: 'Donations', href: '/partner/donations', icon: Icons.heart },
  { name: 'Analytics', href: '/partner/analytics', icon: Icons.barChart },
  { name: 'Team', href: '/partner/team', icon: Icons.users },
  { name: 'Payouts', href: '/partner/payouts', icon: Icons.wallet },
  { name: 'Messages', href: '/partner/messages', icon: Icons.mail },
  { name: 'Settings', href: '/partner/settings', icon: Icons.settings },
];

export function PartnerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r hidden lg:block">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/partner" className="flex items-center space-x-2">
          <Icons.logo className="h-8 w-8 text-blue-600" />
          <span className="font-bold text-xl">Partner Portal</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/partner' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Partner Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Icons.building className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Organization Name</p>
            <p className="text-xs text-gray-500">Bronze Partner</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

### FILE: src/app/partner/page.tsx
import { Suspense } from 'react';
import { PartnerOverview } from '@/components/partner/PartnerOverview';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function PartnerDashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PartnerOverview />
    </Suspense>
  );
}

### FILE: src/components/partner/PartnerOverview.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Icons } from '@/components/shared/Icons';
import { formatCurrency, formatNumber } from '@/lib/utils';
import Link from 'next/link';

interface PartnerStats {
  totalFundsRaised: number;
  thisMonthFunds: number;
  activeProjects: number;
  totalDonors: number;
  totalBeneficiaries: number;
  impactScore: number;
  tier: string;
  nextTierProgress: number;
}

interface RecentDonation {
  id: string;
  donorName: string;
  amount: number;
  projectName: string;
  createdAt: string;
  isAnonymous: boolean;
}

interface ActiveProject {
  id: string;
  title: string;
  fundingGoal: number;
  currentFunding: number;
  donorCount: number;
  daysLeft: number;
}

export function PartnerOverview() {
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([]);
  const [activeProjects, setActiveProjects] = useState<ActiveProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/partner/dashboard');
      const data = await response.json();
      setStats(data.stats);
      setRecentDonations(data.recentDonations);
      setActiveProjects(data.activeProjects);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  const tierColors = {
    bronze: 'bg-orange-100 text-orange-800',
    silver: 'bg-gray-100 text-gray-800',
    gold: 'bg-yellow-100 text-yellow-800',
    platinum: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partner Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your impact.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={tierColors[stats?.tier as keyof typeof tierColors] || tierColors.bronze}>
            {stats?.tier?.charAt(0).toUpperCase()}{stats?.tier?.slice(1)} Partner
          </Badge>
          <Button asChild>
            <Link href="/partner/projects/new">
              <Icons.plus className="w-4 h-4 mr-2" />
              New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Funds Raised</p>
                <p className="text-2xl font-bold">{formatCurrency(stats?.totalFundsRaised || 0)}</p>
                <p className="text-xs text-green-600 mt-1">
                  +{formatCurrency(stats?.thisMonthFunds || 0)} this month
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Icons.dollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Projects</p>
                <p className="text-2xl font-bold">{stats?.activeProjects || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Currently fundraising</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Icons.folderOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Donors</p>
                <p className="text-2xl font-bold">{formatNumber(stats?.totalDonors || 0)}</p>
                <p className="text-xs text-gray-500 mt-1">Unique supporters</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                <Icons.heart className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Beneficiaries</p>
                <p className="text-2xl font-bold">{formatNumber(stats?.totalBeneficiaries || 0)}</p>
                <p className="text-xs text-gray-500 mt-1">Lives impacted</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Icons.users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Partner Tier Progress</h3>
              <p className="text-sm text-gray-500">Complete more projects to unlock the next tier</p>
            </div>
            <Badge variant="outline">
              {stats?.activeProjects || 0} / 10 projects to Silver
            </Badge>
          </div>
          <Progress value={stats?.nextTierProgress || 0} className="h-3" />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Bronze</span>
            <span>Silver (11+ projects)</span>
            <span>Gold (26+)</span>
            <span>Platinum (50+)</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Projects</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/partner/projects">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeProjects.length === 0 ? (
                <div className="text-center py-8">
                  <Icons.folderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No active projects</p>
                  <Button size="sm" className="mt-4" asChild>
                    <Link href="/partner/projects/new">Create Your First Project</Link>
                  </Button>
                </div>
              ) : (
                activeProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{project.title}</h4>
                      <Badge variant="outline">{project.daysLeft} days left</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          {formatCurrency(project.currentFunding)} raised
                        </span>
                        <span className="text-gray-500">
                          {formatCurrency(project.fundingGoal)} goal
                        </span>
                      </div>
                      <Progress 
                        value={(project.currentFunding / project.fundingGoal) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500">
                        {project.donorCount} donors
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Donations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Donations</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/partner/donations">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDonations.length === 0 ? (
                <div className="text-center py-8">
                  <Icons.heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No donations yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Share your projects to start receiving donations
                  </p>
                </div>
              ) : (
                recentDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                        <Icons.heart className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {donation.isAnonymous ? 'Anonymous' : donation.donorName}
                        </p>
                        <p className="text-xs text-gray-500">{donation.projectName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        +{formatCurrency(donation.amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col" asChild>
              <Link href="/partner/projects/new">
                <Icons.plus className="w-6 h-6 mb-2" />
                <span>New Project</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col" asChild>
              <Link href="/partner/team/invite">
                <Icons.userPlus className="w-6 h-6 mb-2" />
                <span>Invite Team</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col" asChild>
              <Link href="/partner/analytics">
                <Icons.barChart className="w-6 h-6 mb-2" />
                <span>View Analytics</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col" asChild>
              <Link href="/partner/settings">
                <Icons.settings className="w-6 h-6 mb-2" />
                <span>Settings</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

### FILE: src/app/partner/projects/page.tsx
import { Suspense } from 'react';
import { PartnerProjectsList } from '@/components/partner/PartnerProjectsList';

export default function PartnerProjectsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PartnerProjectsList />
    </Suspense>
  );
}

### FILE: src/components/partner/PartnerProjectsList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Icons } from '@/components/shared/Icons';
import { formatCurrency } from '@/lib/utils';
import type { PartnerProject } from '@/types/partner';

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  pending_approval: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  funded: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

export function PartnerProjectsList() {
  const [projects, setProjects] = useState<PartnerProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [filter]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      
      const response = await fetch(`/api/partner/projects?${params}`);
      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === 'active').length,
    completed: projects.filter((p) => p.status === 'completed').length,
    totalRaised: projects.reduce((sum, p) => sum + p.currentFunding, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage your impact projects</p>
        </div>
        <Button asChild>
          <Link href="/partner/projects/new">
            <Icons.plus className="w-4 h-4 mr-2" />
            Create Project
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Projects</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Raised</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalRaised)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
            <SelectItem value="pending_approval">Pending Approval</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="funded">Funded</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects List */}
      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Icons.folderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-4">
              {search ? 'Try adjusting your search' : 'Create your first project to get started'}
            </p>
            {!search && (
              <Button asChild>
                <Link href="/partner/projects/new">Create Project</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-24 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                    {project.coverImage ? (
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icons.image className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold truncate">{project.title}</h3>
                      <Badge className={statusColors[project.status]}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {project.shortDescription}
                    </p>

                    {/* Funding Progress */}
                    {project.status === 'active' && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{formatCurrency(project.currentFunding)}</span>
                          <span className="text-gray-500">
                            {Math.round((project.currentFunding / project.fundingGoal) * 100)}%
                          </span>
                        </div>
                        <Progress
                          value={(project.currentFunding / project.fundingGoal) * 100}
                          className="h-2"
                        />
                        <p className="text-xs text-gray-500">
                          {project.donorCount} donors • Goal: {formatCurrency(project.fundingGoal)}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/partner/projects/${project.id}`}>
                          <Icons.eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/partner/projects/${project.id}/edit`}>
                          <Icons.edit className="w-4 h-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      {project.status === 'active' && (
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/partner/projects/${project.id}/update`}>
                            <Icons.megaphone className="w-4 h-4 mr-1" />
                            Post Update
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 28: PARTNER PROJECT CREATION & MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 28.1: Create Project Creation Form

```
Create the project creation and editing forms for partners.

### FILE: src/app/partner/projects/new/page.tsx
import { Suspense } from 'next';
import { ProjectForm } from '@/components/partner/ProjectForm';

export default function NewProjectPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectForm />
      </Suspense>
    </div>
  );
}

### FILE: src/components/partner/ProjectForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icons } from '@/components/shared/Icons';
import { FileUpload } from '@/components/shared/FileUpload';
import { toast } from 'sonner';

const projectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  shortDescription: z.string().min(50).max(200),
  description: z.string().min(200, 'Description must be at least 200 characters'),
  category: z.enum(['clean_water', 'sanitation', 'education', 'healthcare', 'food_security', 'environment', 'disaster_relief', 'poverty_reduction', 'gender_equality', 'youth_development']),
  location: z.object({
    country: z.string().min(1),
    region: z.string().optional(),
    city: z.string().optional(),
  }),
  fundingGoal: z.number().min(100, 'Minimum goal is €100').max(1000000),
  targetBeneficiaries: z.number().min(1),
  startDate: z.string(),
  endDate: z.string().optional(),
  coverImage: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData>;
  projectId?: string;
}

const CATEGORIES = [
  { value: 'clean_water', label: 'Clean Water Access' },
  { value: 'sanitation', label: 'Sanitation & Hygiene' },
  { value: 'education', label: 'Education' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'food_security', label: 'Food Security' },
  { value: 'environment', label: 'Environment & Climate' },
  { value: 'disaster_relief', label: 'Disaster Relief' },
  { value: 'poverty_reduction', label: 'Poverty Reduction' },
  { value: 'gender_equality', label: 'Gender Equality' },
  { value: 'youth_development', label: 'Youth Development' },
];

export function ProjectForm({ initialData, projectId }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: ProjectFormData, asDraft = false) => {
    setIsSubmitting(true);

    try {
      const endpoint = projectId
        ? `/api/partner/projects/${projectId}`
        : '/api/partner/projects';
      
      const method = projectId ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          coverImage,
          status: asDraft ? 'draft' : 'pending_approval',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save project');
      }

      const result = await response.json();

      toast.success(
        asDraft
          ? 'Project saved as draft'
          : 'Project submitted for approval'
      );

      router.push(`/partner/projects/${result.project.id}`);
    } catch (error) {
      toast.error('Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data, false))}>
      <div className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Give your project a compelling title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="shortDescription">Short Description *</Label>
              <Textarea
                id="shortDescription"
                {...register('shortDescription')}
                placeholder="Brief summary (shown in listings)"
                rows={2}
              />
              <p className="text-xs text-gray-500 mt-1">
                {watch('shortDescription')?.length || 0}/200 characters
              </p>
            </div>

            <div>
              <Label htmlFor="description">Full Description *</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe your project in detail..."
                rows={8}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label>Category *</Label>
              <Select onValueChange={(value) => setValue('category', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Project Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Country *</Label>
                <Input {...register('location.country')} placeholder="Country" />
              </div>
              <div>
                <Label>Region</Label>
                <Input {...register('location.region')} placeholder="Region/State" />
              </div>
              <div>
                <Label>City</Label>
                <Input {...register('location.city')} placeholder="City" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Funding & Impact */}
        <Card>
          <CardHeader>
            <CardTitle>Funding & Impact Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Funding Goal (€) *</Label>
                <Input
                  type="number"
                  {...register('fundingGoal', { valueAsNumber: true })}
                  placeholder="10000"
                />
                {errors.fundingGoal && (
                  <p className="text-red-500 text-sm mt-1">{errors.fundingGoal.message}</p>
                )}
              </div>
              <div>
                <Label>Target Beneficiaries *</Label>
                <Input
                  type="number"
                  {...register('targetBeneficiaries', { valueAsNumber: true })}
                  placeholder="1000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Start Date *</Label>
                <Input type="date" {...register('startDate')} />
              </div>
              <div>
                <Label>End Date (optional)</Label>
                <Input type="date" {...register('endDate')} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card>
          <CardHeader>
            <CardTitle>Project Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Cover Image</Label>
              <FileUpload
                accept="image/*"
                maxSize={5 * 1024 * 1024}
                onUpload={(url) => setCoverImage(url)}
                currentImage={coverImage}
              />
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 1200x630px, max 5MB
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleSubmit((data) => onSubmit(data, true))}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit for Approval'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

### FILE: src/app/api/partner/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { db } from '@/lib/firebase/admin';
import { z } from 'zod';
import { nanoid } from 'nanoid';

const createProjectSchema = z.object({
  title: z.string().min(5).max(100),
  shortDescription: z.string().min(50).max(200),
  description: z.string().min(200),
  category: z.string(),
  location: z.object({
    country: z.string(),
    region: z.string().optional(),
    city: z.string().optional(),
  }),
  fundingGoal: z.number().min(100),
  targetBeneficiaries: z.number().min(1),
  startDate: z.string(),
  endDate: z.string().optional(),
  coverImage: z.string().optional(),
  status: z.enum(['draft', 'pending_approval']).default('draft'),
});

// GET /api/partner/projects - List partner's projects
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== 'partner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = db.collection('partnerProjects')
      .where('partnerId', '==', session.user.partnerId)
      .orderBy('createdAt', 'desc');

    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();
    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/partner/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== 'partner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createProjectSchema.parse(body);

    const projectId = nanoid(12);
    const slug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const project = {
      id: projectId,
      partnerId: session.user.partnerId,
      ...validatedData,
      slug: `${slug}-${projectId.slice(0, 6)}`,
      currentFunding: 0,
      donorCount: 0,
      actualBeneficiaries: 0,
      impactMetrics: [],
      gallery: [],
      milestones: [],
      visibility: 'public',
      featured: false,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('partnerProjects').doc(projectId).set(project);

    // If submitted for approval, notify admin
    if (validatedData.status === 'pending_approval') {
      await db.collection('adminNotifications').add({
        type: 'project_pending_approval',
        projectId,
        partnerId: session.user.partnerId,
        projectTitle: validatedData.title,
        createdAt: new Date(),
        read: false,
      });
    }

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 29: PARTNER ANALYTICS & PAYOUTS
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 29.1: Create Partner Analytics Dashboard

```
Create comprehensive analytics for partners.

### FILE: src/app/partner/analytics/page.tsx
import { Suspense } from 'react';
import { PartnerAnalytics } from '@/components/partner/PartnerAnalytics';

export default function PartnerAnalyticsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PartnerAnalytics />
    </Suspense>
  );
}

### FILE: src/components/partner/PartnerAnalytics.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icons } from '@/components/shared/Icons';
import { formatCurrency, formatNumber } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function PartnerAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/partner/analytics?range=${timeRange}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your fundraising performance and impact</p>
        </div>
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Icons.download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Raised</p>
                <p className="text-2xl font-bold">{formatCurrency(data?.totalRaised || 0)}</p>
                <p className={`text-xs mt-1 ${data?.raisedChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {data?.raisedChange >= 0 ? '+' : ''}{data?.raisedChange}% vs prev period
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Icons.dollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Donations</p>
                <p className="text-2xl font-bold">{formatNumber(data?.donationCount || 0)}</p>
                <p className={`text-xs mt-1 ${data?.donationChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {data?.donationChange >= 0 ? '+' : ''}{data?.donationChange}% vs prev period
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                <Icons.heart className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. Donation</p>
                <p className="text-2xl font-bold">{formatCurrency(data?.avgDonation || 0)}</p>
                <p className="text-xs text-gray-500 mt-1">Per transaction</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Icons.trendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unique Donors</p>
                <p className="text-2xl font-bold">{formatNumber(data?.uniqueDonors || 0)}</p>
                <p className={`text-xs mt-1 ${data?.donorChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {data?.donorChange >= 0 ? '+' : ''}{data?.donorChange}% vs prev period
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Icons.users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Donation Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.donationTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Donations by Project */}
        <Card>
          <CardHeader>
            <CardTitle>Donations by Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.byProject || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="amount" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Donor Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Donation Size Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.donationDistribution || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {(data?.donationDistribution || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Donors by Country</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(data?.byCountry || []).map((country: any, index: number) => (
                <div key={country.name} className="flex items-center gap-4">
                  <span className="w-8 text-center text-lg">{country.flag}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{country.name}</span>
                      <span className="text-sm text-gray-500">
                        {formatCurrency(country.amount)} ({country.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${country.percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

### FILE: src/app/partner/payouts/page.tsx
import { Suspense } from 'react';
import { PartnerPayouts } from '@/components/partner/PartnerPayouts';

export default function PartnerPayoutsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PartnerPayouts />
    </Suspense>
  );
}

### FILE: src/components/partner/PartnerPayouts.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/shared/Icons';
import { formatCurrency } from '@/lib/utils';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';

interface Payout {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  reference: string;
}

export function PartnerPayouts() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [balance, setBalance] = useState({ available: 0, pending: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const response = await fetch('/api/partner/payouts');
      const data = await response.json();
      setPayouts(data.payouts);
      setBalance(data.balance);
    } catch (error) {
      console.error('Failed to fetch payouts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
          <p className="text-gray-600">Manage your earnings and bank transfers</p>
        </div>
        <Button>
          <Icons.settings className="w-4 h-4 mr-2" />
          Payout Settings
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Available Balance</p>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(balance.available)}</p>
            <p className="text-xs text-gray-500 mt-2">Ready for payout</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{formatCurrency(balance.pending)}</p>
            <p className="text-xs text-gray-500 mt-2">Processing donations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Next Payout</p>
            <p className="text-lg font-semibold">February 1, 2026</p>
            <p className="text-xs text-gray-500 mt-2">Monthly schedule</p>
          </CardContent>
        </Card>
      </div>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          {payouts.length === 0 ? (
            <div className="text-center py-12">
              <Icons.wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No payouts yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell className="font-mono text-sm">{payout.reference}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(payout.amount)}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[payout.status]}>
                        {payout.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(payout.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {payout.completedAt
                        ? new Date(payout.completedAt).toLocaleDateString()
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 30: PLATFORM COMPLETION CHECKLIST
# ═══════════════════════════════════════════════════════════════════════════════

## WHAT'S NEEDED TO MAKE THE PLATFORM WORK

### INFRASTRUCTURE REQUIREMENTS

```markdown
## 1. Core Infrastructure Setup

### Firebase/Google Cloud
- [ ] Create Firebase project
- [ ] Enable Authentication (Email, Google, Apple)
- [ ] Setup Firestore database with security rules
- [ ] Configure Firebase Storage for uploads
- [ ] Setup Cloud Functions for serverless operations
- [ ] Enable Firebase Cloud Messaging for push notifications

### Stripe Integration
- [ ] Create Stripe account (production)
- [ ] Configure Stripe Connect for partner payouts
- [ ] Setup subscription products & prices
- [ ] Configure webhook endpoints
- [ ] Enable fraud protection (Radar)

### Email Service
- [ ] Setup Resend/SendGrid account
- [ ] Configure domain authentication (SPF, DKIM)
- [ ] Create email templates
- [ ] Setup transactional email flows

### CDN & Media
- [ ] Configure Mux for video hosting
- [ ] Setup Cloudflare for CDN
- [ ] Configure image optimization

### Deployment
- [ ] Setup Vercel project
- [ ] Configure environment variables
- [ ] Setup custom domain
- [ ] Enable analytics
- [ ] Configure cron jobs

## 2. Database Collections Required

- users
- partnerApplications
- partners
- partnerProjects
- orders
- donations
- subscriptions
- notifications
- events
- eventRegistrations
- bottles
- referrals
- activityFeed
- impactProjects
- content (CMS)
- adminNotifications
- auditLogs
- jobs (background)

## 3. API Routes Summary

### Public
- POST /api/auth/[...nextauth]
- POST /api/partners/apply
- GET /api/bottles
- GET /api/events
- GET /api/projects

### User
- GET/POST /api/orders
- POST /api/donations
- GET /api/notifications
- POST /api/subscriptions

### Partner
- GET /api/partner/dashboard
- GET/POST /api/partner/projects
- GET /api/partner/donations
- GET /api/partner/analytics
- GET /api/partner/payouts
- GET/PATCH /api/partner/settings
- POST /api/partner/team/invite

### Admin
- GET /api/admin/partners/applications
- PATCH /api/admin/partners/applications/[id]
- GET /api/admin/users
- GET /api/admin/analytics
- POST /api/admin/content

## 4. Security Checklist

- [ ] HTTPS everywhere
- [ ] Rate limiting on all API routes
- [ ] Input validation (Zod schemas)
- [ ] XSS prevention (DOMPurify)
- [ ] CSRF protection
- [ ] SQL injection prevention
- [ ] Secure headers (CSP, etc.)
- [ ] Encryption for sensitive data
- [ ] RBAC implementation
- [ ] Audit logging
- [ ] Regular security audits

## 5. Testing Requirements

- [ ] Unit tests (Jest) - 70% coverage
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] Load testing
- [ ] Security testing
- [ ] Accessibility testing

## 6. Launch Checklist

### Pre-Launch
- [ ] All features tested
- [ ] Performance optimized
- [ ] SEO configured
- [ ] Legal pages (Terms, Privacy)
- [ ] Cookie consent
- [ ] GDPR compliance
- [ ] Accessibility audit

### Launch
- [ ] Production deployment
- [ ] DNS configuration
- [ ] SSL certificates
- [ ] Monitoring setup
- [ ] Error tracking (Sentry)
- [ ] Analytics enabled

### Post-Launch
- [ ] Monitor for errors
- [ ] Track user feedback
- [ ] Performance monitoring
- [ ] Regular backups
- [ ] Incident response plan
```

---

## SUMMARY

### Part 6 Complete Coverage:

**Section 25**: NGO/Partner Application System
- Complete type definitions for partners, applications, projects
- Multi-step application form (8 steps)
- Document upload support
- Public application page

**Section 26**: Partner Verification & API
- Application submission API
- Admin review endpoints
- Automated partner creation on approval
- Email notifications for status changes

**Section 27**: Partner Dashboard
- Sidebar navigation (8 sections)
- Overview with stats, projects, donations
- Tier progress tracking
- Quick actions

**Section 28**: Partner Project Management
- Project creation form
- Project listing with filters
- Draft/submission workflow
- Project API endpoints

**Section 29**: Partner Analytics & Payouts
- Comprehensive analytics dashboard
- Charts: donation trend, by project, distribution
- Payout management
- Balance tracking

**Section 30**: Platform Completion Checklist
- Infrastructure requirements
- Database collections
- API routes summary
- Security checklist
- Testing requirements
- Launch checklist

---

## COMPLETE SYSTEM SUMMARY (Parts 1-6)

| Part | Sections | Focus | Est. Size |
|------|----------|-------|-----------|
| 1 | 1-5 | Foundation (Firebase, Auth, Schema) | ~72KB |
| 2 | 6-10 | Core Features (Homepage, Dashboard, Bottles, Events, Video) | ~159KB |
| 3 | 11-13 | Community (Social, TRIBE, Donations) | ~69KB |
| 4 | 14-18 | Admin (Impact, Referrals, Admin Panel, CMS, Analytics) | ~128KB |
| 5 | 19-24 | Infrastructure (API, Testing, Security, Notifications, Deployment) | ~49KB |
| 6 | 25-30 | Partner System (Applications, Dashboard, Analytics, Checklist) | ~55KB |

**Total: ~532KB of production-ready code across 30 sections**
