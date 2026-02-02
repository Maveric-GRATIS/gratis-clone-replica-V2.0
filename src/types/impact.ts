// =============================================================================
// IMPACT PROJECT TYPES
// =============================================================================

/**
 * Impact project status
 */
export type ProjectStatus =
  | 'proposed'
  | 'voting'
  | 'approved'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

/**
 * Impact category
 */
export type ImpactCategory =
  | 'clean_water'
  | 'sanitation'
  | 'education'
  | 'reforestation'
  | 'food_security'
  | 'healthcare';

/**
 * Impact project
 */
export interface ImpactProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;

  // Categorization
  category: ImpactCategory;
  tags: string[];

  // Location
  location: {
    country: string;
    region: string;
    coordinates?: { lat: number; lng: number };
  };

  // Media
  coverImage: string;
  gallery: string[];
  videoUrl?: string;

  // Funding
  fundingGoal: number; // in cents
  fundingRaised: number;
  currency: string;
  donorCount: number;

  // Timeline
  startDate?: Date;
  endDate?: Date;
  estimatedCompletion?: Date;

  // Impact metrics
  impactMetrics: {
    metric: string;
    value: number;
    unit: string;
    icon: string;
  }[];

  // Beneficiaries
  beneficiaries: {
    count: number;
    description: string;
  };

  // Partner organization
  partner?: {
    id: string;
    name: string;
    logo: string;
    website?: string;
  };

  // Voting (for proposed projects)
  voting?: {
    startDate: Date;
    endDate: Date;
    votesFor: number;
    votesAgainst: number;
    voterCount: number;
    minTierToVote: string;
  };

  // Updates
  updates: ProjectUpdate[];

  // Milestones
  milestones: ProjectMilestone[];

  // Donors
  topDonors: TopDonor[];

  // Status
  status: ProjectStatus;
  isFeatured: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Project update
 */
export interface ProjectUpdate {
  id: string;
  projectId: string;
  title: string;
  content: string;
  images: string[];
  videoUrl?: string;
  milestone?: {
    name: string;
    completed: boolean;
  };
  createdAt: Date;
}

/**
 * Project milestone
 */
export interface ProjectMilestone {
  name: string;
  date: string;
  completed: boolean;
}

/**
 * Top donor
 */
export interface TopDonor {
  name: string;
  amount: number;
  avatar?: string;
  date: Date;
}

/**
 * User vote on project
 */
export interface ProjectVote {
  id: string;
  userId: string;
  projectId: string;
  vote: 'for' | 'against';
  weight: number; // Based on TRIBE tier
  createdAt: Date;
}

/**
 * Impact category configuration
 */
export interface ImpactCategoryConfig {
  label: string;
  icon: string;
  color: string;
  description: string;
}
