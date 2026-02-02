/**
 * Partner & NGO Types
 *
 * Type definitions for NGO partners, applications, and projects.
 * Part 6 - Section 25: Partner Application System
 */

export type PartnerType =
  | 'ngo'                 // Non-profit organization
  | 'charity'             // Registered charity
  | 'foundation'          // Private/public foundation
  | 'social_enterprise'   // Social enterprise
  | 'corporate'           // Corporate partner (CSR)
  | 'government'          // Government agency
  | 'educational';        // Educational institution

export type PartnerStatus =
  | 'pending'             // Application submitted
  | 'under_review'        // Being reviewed by team
  | 'documents_required'  // Additional docs needed
  | 'approved'            // Approved partner
  | 'rejected'            // Application rejected
  | 'suspended'           // Temporarily suspended
  | 'terminated';         // Partnership ended

export type PartnerTier =
  | 'bronze'              // Basic partner (0-10 projects)
  | 'silver'              // Active partner (11-25 projects)
  | 'gold'                // Premium partner (26-50 projects)
  | 'platinum';           // Elite partner (50+ projects)

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
  preferredStartDate?: Date;

  // Application Status
  status: PartnerStatus;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewNotes?: string;
  rejectionReason?: string;

  // Verification
  verification: {
    documentsVerified: boolean;
    referencesChecked: boolean;
    backgroundCheckPassed: boolean;
    siteVisitCompleted?: boolean;
    verifiedAt?: Date;
    verifiedBy?: string;
  };

  createdAt: Date;
  updatedAt: Date;
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
  tierUpdatedAt: Date;

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
  agreementSignedAt: Date;
  agreementVersion: string;

  approvedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartnerTeamMember {
  id: string;
  userId: string;
  partnerId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  permissions: PartnerPermission[];
  invitedAt: Date;
  acceptedAt?: Date;
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
  startDate: Date;
  endDate?: Date;
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
  verifiedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completedAt?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  evidence?: string[];
}

// Constants for forms and filters
export const ORGANIZATION_TYPES: { value: PartnerType; label: string }[] = [
  { value: 'ngo', label: 'Non-Profit Organization (NGO)' },
  { value: 'charity', label: 'Registered Charity' },
  { value: 'foundation', label: 'Foundation' },
  { value: 'social_enterprise', label: 'Social Enterprise' },
  { value: 'corporate', label: 'Corporate (CSR Program)' },
  { value: 'government', label: 'Government Agency' },
  { value: 'educational', label: 'Educational Institution' },
];

export const FOCUS_AREAS: { value: FocusArea; label: string }[] = [
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

export const ANNUAL_BUDGET_RANGES = [
  { value: '<100k', label: 'Under €100,000' },
  { value: '100k-500k', label: '€100,000 - €500,000' },
  { value: '500k-1M', label: '€500,000 - €1,000,000' },
  { value: '1M-5M', label: '€1,000,000 - €5,000,000' },
  { value: '5M+', label: 'Over €5,000,000' },
];

export const TIER_BENEFITS: Record<PartnerTier, { projects: string; features: string[] }> = {
  bronze: {
    projects: '0-10 projects',
    features: ['Basic dashboard', 'Project management', 'Monthly reports'],
  },
  silver: {
    projects: '11-25 projects',
    features: ['Advanced analytics', 'Priority support', 'Featured projects'],
  },
  gold: {
    projects: '26-50 projects',
    features: ['Custom branding', 'API access', 'Dedicated account manager'],
  },
  platinum: {
    projects: '50+ projects',
    features: ['White-label options', 'Custom integrations', 'Strategic partnership'],
  },
};
