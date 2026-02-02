# GRATIS.NGO Enterprise Development Prompts - PART 4
## Impact Projects, Referrals, Admin Panel & Analytics (Sections 14-18)
### Total Estimated Size: ~40,000 tokens | Complexity: HIGH

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 14: IMPACT PROJECTS & VOTING SYSTEM
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 14.1: Create Impact Projects Listing & Detail Pages

```
Create the complete impact projects system with listings, details, and progress tracking.

### FILE: src/types/impact.ts
// =============================================================================
// IMPACT PROJECT TYPES
// =============================================================================

import type { Timestamp } from 'firebase/firestore';

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
  startDate?: Timestamp;
  endDate?: Timestamp;
  estimatedCompletion?: Timestamp;
  
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
    startDate: Timestamp;
    endDate: Timestamp;
    votesFor: number;
    votesAgainst: number;
    voterCount: number;
    minTierToVote: string;
  };
  
  // Updates
  updates: ProjectUpdate[];
  
  // Status
  status: ProjectStatus;
  isFeatured: boolean;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Project update/milestone
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
  createdAt: Timestamp;
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
  createdAt: Timestamp;
}

### FILE: src/app/(dashboard)/impact/page.tsx
import { Metadata } from 'next';
import { ImpactProjectsListing } from '@/components/impact/ImpactProjectsListing';

export const metadata: Metadata = {
  title: 'Impact Projects | GRATIS.NGO',
  description: 'Explore and support our global impact projects',
};

export default function ImpactPage() {
  return <ImpactProjectsListing />;
}

### FILE: src/components/impact/ImpactProjectsListing.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/shared/Icons';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
import { IMPACT_CATEGORIES } from '@/config/constants';
import type { ImpactProject, ProjectStatus, ImpactCategory } from '@/types/impact';

// Mock projects data
const mockProjects: ImpactProject[] = [
  {
    id: '1',
    title: 'Clean Water Wells in Kenya',
    slug: 'clean-water-wells-kenya',
    description: 'Building sustainable water wells in rural Kenyan communities...',
    shortDescription: 'Providing clean water access to 5,000+ people in rural Kenya',
    category: 'clean_water',
    tags: ['water', 'kenya', 'wells', 'community'],
    location: { country: 'Kenya', region: 'Turkana County' },
    coverImage: '/images/projects/kenya-water.jpg',
    gallery: [],
    fundingGoal: 5000000, // €50,000
    fundingRaised: 3750000, // €37,500
    currency: 'EUR',
    donorCount: 342,
    impactMetrics: [
      { metric: 'Water Access', value: 5000, unit: 'people', icon: 'droplets' },
      { metric: 'Wells Built', value: 8, unit: 'wells', icon: 'building' },
      { metric: 'Communities', value: 12, unit: 'villages', icon: 'home' },
    ],
    beneficiaries: { count: 5000, description: 'Rural community members' },
    partner: { id: 'p1', name: 'WaterAid Kenya', logo: '/images/partners/wateraid.png' },
    updates: [],
    status: 'in_progress',
    isFeatured: true,
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '2',
    title: 'Reforestation Initiative - Amazon',
    slug: 'amazon-reforestation',
    description: 'Planting native trees to restore Amazon rainforest...',
    shortDescription: 'Planting 100,000 trees to restore the Amazon rainforest',
    category: 'reforestation',
    tags: ['trees', 'amazon', 'brazil', 'climate'],
    location: { country: 'Brazil', region: 'Amazonas' },
    coverImage: '/images/projects/amazon-trees.jpg',
    gallery: [],
    fundingGoal: 10000000, // €100,000
    fundingRaised: 2500000, // €25,000
    currency: 'EUR',
    donorCount: 189,
    impactMetrics: [
      { metric: 'Trees Planted', value: 25000, unit: 'trees', icon: 'leaf' },
      { metric: 'CO2 Offset', value: 500, unit: 'tons/year', icon: 'wind' },
      { metric: 'Area Restored', value: 50, unit: 'hectares', icon: 'map' },
    ],
    beneficiaries: { count: 200, description: 'Local indigenous families' },
    updates: [],
    status: 'in_progress',
    isFeatured: true,
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '3',
    title: 'School Sanitation Project - India',
    slug: 'india-school-sanitation',
    description: 'Building toilet facilities in rural Indian schools...',
    shortDescription: 'Building sanitation facilities in 50 schools across rural India',
    category: 'sanitation',
    tags: ['sanitation', 'schools', 'india', 'education'],
    location: { country: 'India', region: 'Rajasthan' },
    coverImage: '/images/projects/india-sanitation.jpg',
    gallery: [],
    fundingGoal: 7500000,
    fundingRaised: 7500000,
    currency: 'EUR',
    donorCount: 456,
    impactMetrics: [
      { metric: 'Schools', value: 50, unit: 'schools', icon: 'school' },
      { metric: 'Students', value: 15000, unit: 'children', icon: 'users' },
      { metric: 'Toilets Built', value: 200, unit: 'facilities', icon: 'building' },
    ],
    beneficiaries: { count: 15000, description: 'School children' },
    updates: [],
    status: 'completed',
    isFeatured: false,
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
  {
    id: '4',
    title: 'Community Health Center - Ghana',
    slug: 'ghana-health-center',
    description: 'Building a community health center...',
    shortDescription: 'Proposed: Build a health center serving 10,000+ community members',
    category: 'healthcare',
    tags: ['health', 'ghana', 'community', 'clinic'],
    location: { country: 'Ghana', region: 'Northern Region' },
    coverImage: '/images/projects/ghana-health.jpg',
    gallery: [],
    fundingGoal: 15000000,
    fundingRaised: 0,
    currency: 'EUR',
    donorCount: 0,
    impactMetrics: [
      { metric: 'People Served', value: 10000, unit: 'people', icon: 'heart' },
      { metric: 'Medical Staff', value: 25, unit: 'staff', icon: 'users' },
    ],
    beneficiaries: { count: 10000, description: 'Community members' },
    voting: {
      startDate: new Date() as any,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) as any,
      votesFor: 234,
      votesAgainst: 12,
      voterCount: 246,
      minTierToVote: 'supporter',
    },
    updates: [],
    status: 'voting',
    isFeatured: false,
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  },
];

const statusConfig: Record<ProjectStatus, { label: string; color: string; icon: React.ElementType }> = {
  proposed: { label: 'Proposed', color: 'bg-gray-100 text-gray-700', icon: Icons.lightbulb },
  voting: { label: 'Voting', color: 'bg-purple-100 text-purple-700', icon: Icons.vote },
  approved: { label: 'Approved', color: 'bg-blue-100 text-blue-700', icon: Icons.checkCircle },
  in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700', icon: Icons.clock },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700', icon: Icons.check },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: Icons.x },
};

export function ImpactProjectsListing() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let projects = [...mockProjects];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      projects = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.location.country.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      projects = projects.filter((p) => p.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      projects = projects.filter((p) => p.status === selectedStatus);
    }

    // Sort
    switch (sortBy) {
      case 'featured':
        projects.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
      case 'funding':
        projects.sort((a, b) => b.fundingRaised - a.fundingRaised);
        break;
      case 'donors':
        projects.sort((a, b) => b.donorCount - a.donorCount);
        break;
      case 'newest':
        projects.sort((a, b) => (b.createdAt as any) - (a.createdAt as any));
        break;
    }

    return projects;
  }, [searchQuery, selectedCategory, selectedStatus, sortBy]);

  // Stats
  const stats = useMemo(() => ({
    totalProjects: mockProjects.length,
    totalRaised: mockProjects.reduce((sum, p) => sum + p.fundingRaised, 0),
    totalDonors: mockProjects.reduce((sum, p) => sum + p.donorCount, 0),
    completedProjects: mockProjects.filter((p) => p.status === 'completed').length,
  }), []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Impact Projects</h1>
        <p className="text-muted-foreground">
          Explore and support projects making a real difference worldwide
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icons.globe className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalProjects}</p>
                <p className="text-xs text-muted-foreground">Active Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Icons.euro className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRaised, 'EUR')}</p>
                <p className="text-xs text-muted-foreground">Total Raised</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Icons.users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatNumber(stats.totalDonors)}</p>
                <p className="text-xs text-muted-foreground">Total Donors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Icons.check className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completedProjects}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(IMPACT_CATEGORIES).map(([key, cat]) => (
                  <SelectItem key={key} value={key}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="funding">Most Funded</SelectItem>
                <SelectItem value="donors">Most Donors</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Icons.globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No projects found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or check back later
          </p>
        </div>
      )}
    </div>
  );
}

// Project Card Component
function ProjectCard({ project }: { project: ImpactProject }) {
  const status = statusConfig[project.status];
  const fundingProgress = (project.fundingRaised / project.fundingGoal) * 100;
  const category = IMPACT_CATEGORIES[project.category as keyof typeof IMPACT_CATEGORIES];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Link href={`/impact/${project.slug}`}>
        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
          {/* Cover Image */}
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Status Badge */}
            <Badge className={cn('absolute top-3 left-3', status.color)}>
              <status.icon className="mr-1 h-3 w-3" />
              {status.label}
            </Badge>

            {/* Featured Badge */}
            {project.isFeatured && (
              <Badge className="absolute top-3 right-3 bg-yellow-500">
                <Icons.star className="mr-1 h-3 w-3" />
                Featured
              </Badge>
            )}

            {/* Location */}
            <div className="absolute bottom-3 left-3 text-white text-sm flex items-center gap-1">
              <Icons.mapPin className="h-4 w-4" />
              {project.location.country}
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-4 flex-1 flex flex-col">
            {/* Category */}
            <Badge variant="outline" className={cn('w-fit mb-2', category?.color)}>
              {category?.label}
            </Badge>

            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-gratis-blue-600 transition-colors">
              {project.title}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
              {project.shortDescription}
            </p>

            {/* Impact Metrics */}
            <div className="flex gap-4 mt-4 text-sm">
              {project.impactMetrics.slice(0, 2).map((metric, i) => (
                <div key={i} className="flex items-center gap-1 text-muted-foreground">
                  <span className="font-medium text-foreground">{formatNumber(metric.value)}</span>
                  <span>{metric.unit}</span>
                </div>
              ))}
            </div>

            {/* Voting Section (for voting projects) */}
            {project.status === 'voting' && project.voting && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-purple-700">Community Vote</span>
                  <span className="text-muted-foreground">{project.voting.voterCount} votes</span>
                </div>
                <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500"
                    style={{
                      width: `${(project.voting.votesFor / (project.voting.votesFor + project.voting.votesAgainst)) * 100}%`,
                    }}
                  />
                  <div className="bg-red-500 flex-1" />
                </div>
                <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                  <span>{project.voting.votesFor} for</span>
                  <span>{project.voting.votesAgainst} against</span>
                </div>
              </div>
            )}

            {/* Funding Progress (for non-voting projects) */}
            {project.status !== 'voting' && project.status !== 'proposed' && (
              <div className="mt-auto pt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-semibold">
                    {formatCurrency(project.fundingRaised, project.currency)}
                  </span>
                  <span className="text-muted-foreground">
                    of {formatCurrency(project.fundingGoal, project.currency)}
                  </span>
                </div>
                <Progress value={Math.min(fundingProgress, 100)} className="h-2" />
                <div className="flex justify-between text-xs mt-2 text-muted-foreground">
                  <span>{Math.round(fundingProgress)}% funded</span>
                  <span>{project.donorCount} donors</span>
                </div>
              </div>
            )}
          </CardContent>

          {/* CTA */}
          <CardFooter className="p-4 pt-0">
            <Button className="w-full" variant={project.status === 'voting' ? 'secondary' : 'default'}>
              {project.status === 'voting' ? (
                <>
                  <Icons.vote className="mr-2 h-4 w-4" />
                  Vote Now
                </>
              ) : project.status === 'completed' ? (
                <>
                  <Icons.eye className="mr-2 h-4 w-4" />
                  View Results
                </>
              ) : (
                <>
                  <Icons.heart className="mr-2 h-4 w-4" />
                  Support Project
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}

### FILE: src/app/(dashboard)/impact/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectDetail } from '@/components/impact/ProjectDetail';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Impact Project | GRATIS.NGO`,
    description: 'Support this impact project',
  };
}

export default function ProjectPage({ params }: PageProps) {
  return <ProjectDetail slug={params.slug} />;
}

### FILE: src/components/impact/ProjectDetail.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format, formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Icons } from '@/components/shared/Icons';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
import { useAuth } from '@/lib/auth/AuthContext';
import { IMPACT_CATEGORIES } from '@/config/constants';

interface ProjectDetailProps {
  slug: string;
}

export function ProjectDetail({ slug }: ProjectDetailProps) {
  const { user } = useAuth();
  const [showDonateDialog, setShowDonateDialog] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Mock project data
  const project = {
    id: '1',
    title: 'Clean Water Wells in Kenya',
    slug: 'clean-water-wells-kenya',
    description: `
      This project aims to build sustainable water wells in rural Kenyan communities 
      that currently lack access to clean water. Each well serves approximately 500-1000 
      people and is built with community involvement to ensure long-term maintenance.

      ## The Challenge

      Over 2.2 billion people worldwide lack access to safely managed drinking water. 
      In rural Kenya, many communities must walk hours to collect water from unsafe sources, 
      leading to waterborne diseases and lost productivity.

      ## Our Solution

      We partner with local organizations to:
      - Survey communities and identify optimal well locations
      - Drill boreholes with solar-powered pumps
      - Train local water committees for maintenance
      - Monitor water quality and pump function remotely

      ## Expected Outcomes

      - 5,000+ people gaining clean water access
      - 80% reduction in waterborne disease
      - 4+ hours saved daily per household
      - Improved school attendance rates
    `,
    shortDescription: 'Providing clean water access to 5,000+ people in rural Kenya',
    category: 'clean_water',
    tags: ['water', 'kenya', 'wells', 'community'],
    location: {
      country: 'Kenya',
      region: 'Turkana County',
      coordinates: { lat: 3.1, lng: 35.5 },
    },
    coverImage: '/images/projects/kenya-water.jpg',
    gallery: [
      '/images/projects/kenya-1.jpg',
      '/images/projects/kenya-2.jpg',
      '/images/projects/kenya-3.jpg',
      '/images/projects/kenya-4.jpg',
    ],
    videoUrl: 'https://youtube.com/watch?v=...',
    fundingGoal: 5000000,
    fundingRaised: 3750000,
    currency: 'EUR',
    donorCount: 342,
    startDate: new Date('2025-06-01'),
    estimatedCompletion: new Date('2026-06-01'),
    impactMetrics: [
      { metric: 'Water Access', value: 5000, unit: 'people', icon: 'droplets' },
      { metric: 'Wells Built', value: 8, unit: 'of 12', icon: 'building' },
      { metric: 'Communities', value: 12, unit: 'villages', icon: 'home' },
      { metric: 'Water Quality', value: 99, unit: '%', icon: 'sparkles' },
    ],
    beneficiaries: { count: 5000, description: 'Rural community members' },
    partner: {
      id: 'p1',
      name: 'WaterAid Kenya',
      logo: '/images/partners/wateraid.png',
      website: 'https://wateraid.org',
      description: 'WaterAid is an international nonprofit focused on water, sanitation, and hygiene.',
    },
    milestones: [
      { name: 'Community Assessment', completed: true, date: '2025-06-15' },
      { name: 'Site Surveys', completed: true, date: '2025-07-01' },
      { name: 'First 4 Wells Drilled', completed: true, date: '2025-09-15' },
      { name: 'Solar Pumps Installed', completed: true, date: '2025-10-01' },
      { name: 'Remaining 8 Wells', completed: false, date: '2026-03-01' },
      { name: 'Project Completion', completed: false, date: '2026-06-01' },
    ],
    updates: [
      {
        id: 'u1',
        title: 'Fourth Well Completed!',
        content: 'We are excited to announce the completion of our fourth well in Lodwar village...',
        images: ['/images/updates/well-4.jpg'],
        createdAt: new Date('2025-10-15'),
      },
      {
        id: 'u2',
        title: 'Solar Pumps Arrived',
        content: 'The solar-powered pumps have arrived and installation begins next week...',
        images: [],
        createdAt: new Date('2025-09-28'),
      },
    ],
    topDonors: [
      { name: 'Anonymous', amount: 50000, avatar: null },
      { name: 'Sarah van der Berg', amount: 25000, avatar: '/images/avatars/sarah.jpg' },
      { name: 'Marcus Schmidt', amount: 15000, avatar: '/images/avatars/marcus.jpg' },
    ],
    status: 'in_progress',
    isFeatured: true,
  };

  const fundingProgress = (project.fundingRaised / project.fundingGoal) * 100;
  const category = IMPACT_CATEGORIES[project.category as keyof typeof IMPACT_CATEGORIES];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Link */}
      <Link
        href="/impact"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <Icons.arrowLeft className="mr-2 h-4 w-4" />
        Back to Projects
      </Link>

      {/* Hero Section */}
      <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-8">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <Badge className={cn('mb-4', category?.bgColor, category?.color)}>
            {category?.label}
          </Badge>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            {project.title}
          </h1>
          <div className="flex items-center gap-4 text-white/90">
            <span className="flex items-center gap-1">
              <Icons.mapPin className="h-4 w-4" />
              {project.location.region}, {project.location.country}
            </span>
            <span className="flex items-center gap-1">
              <Icons.users className="h-4 w-4" />
              {formatNumber(project.donorCount)} donors
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Impact Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {project.impactMetrics.map((metric, i) => (
              <Card key={i}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{formatNumber(metric.value)}</p>
                  <p className="text-xs text-muted-foreground">{metric.unit}</p>
                  <p className="text-sm font-medium mt-1">{metric.metric}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="about">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="updates">Updates ({project.updates.length})</TabsTrigger>
              <TabsTrigger value="gallery">Gallery ({project.gallery.length})</TabsTrigger>
              <TabsTrigger value="donors">Top Donors</TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent value="about" className="mt-6">
              <Card>
                <CardContent className="p-6 prose prose-sm max-w-none">
                  {project.description.split('\n').map((paragraph, i) => {
                    if (paragraph.startsWith('## ')) {
                      return <h3 key={i} className="text-lg font-semibold mt-6 mb-3">{paragraph.replace('## ', '')}</h3>;
                    }
                    if (paragraph.startsWith('- ')) {
                      return <li key={i} className="ml-4">{paragraph.replace('- ', '')}</li>;
                    }
                    if (paragraph.trim()) {
                      return <p key={i} className="text-muted-foreground mb-4">{paragraph}</p>;
                    }
                    return null;
                  })}
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Project Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.milestones.map((milestone, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                            milestone.completed ? 'bg-green-100' : 'bg-gray-100'
                          )}
                        >
                          {milestone.completed ? (
                            <Icons.check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Icons.clock className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{milestone.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {milestone.completed ? 'Completed' : 'Expected'}: {milestone.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Updates Tab */}
            <TabsContent value="updates" className="mt-6 space-y-4">
              {project.updates.map((update) => (
                <Card key={update.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Icons.calendar className="h-4 w-4" />
                      {format(update.createdAt, 'MMMM d, yyyy')}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{update.title}</h3>
                    <p className="text-muted-foreground">{update.content}</p>
                    {update.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {update.images.map((img, i) => (
                          <div key={i} className="relative aspect-video rounded-lg overflow-hidden">
                            <Image src={img} alt="" fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="mt-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {project.gallery.map((image, i) => (
                  <div
                    key={i}
                    className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image src={image} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Donors Tab */}
            <TabsContent value="donors" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {project.topDonors.map((donor, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 font-bold text-sm">
                          {i + 1}
                        </div>
                        <Avatar>
                          <AvatarImage src={donor.avatar || undefined} />
                          <AvatarFallback>{donor.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{donor.name}</p>
                        </div>
                        <p className="font-semibold">
                          {formatCurrency(donor.amount, 'EUR')}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Funding Card */}
          <Card className="sticky top-24">
            <CardContent className="p-6">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-3xl font-bold">
                    {formatCurrency(project.fundingRaised, project.currency)}
                  </span>
                  <span className="text-muted-foreground">
                    of {formatCurrency(project.fundingGoal, project.currency)}
                  </span>
                </div>
                <Progress value={Math.min(fundingProgress, 100)} className="h-3" />
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-muted-foreground">{Math.round(fundingProgress)}% funded</span>
                  <span className="text-muted-foreground">{project.donorCount} donors</span>
                </div>
              </div>

              {/* Donate Button */}
              <Button className="w-full mb-4" size="lg" onClick={() => setShowDonateDialog(true)}>
                <Icons.heart className="mr-2 h-5 w-5" />
                Support This Project
              </Button>

              {/* Share */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" size="sm">
                  <Icons.share className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="icon" className="w-10">
                  <Icons.bookmark className="h-4 w-4" />
                </Button>
              </div>

              <Separator className="my-6" />

              {/* Partner */}
              {project.partner && (
                <div>
                  <p className="text-sm font-medium mb-3">Implementing Partner</p>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Image
                      src={project.partner.logo}
                      alt={project.partner.name}
                      width={48}
                      height={48}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{project.partner.name}</p>
                      <a
                        href={project.partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gratis-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <Separator className="my-6" />

              {/* Timeline */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Started</span>
                  <span>{format(project.startDate, 'MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Completion</span>
                  <span>{format(project.estimatedCompletion, 'MMM d, yyyy')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 15: REFERRAL SYSTEM
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 15.1: Create Referral System with Tracking & Rewards

```
Create the complete referral system with unique codes, tracking, and reward distribution.

### FILE: src/types/referral.ts
// =============================================================================
// REFERRAL TYPES
// =============================================================================

import type { Timestamp } from 'firebase/firestore';

/**
 * Referral status
 */
export type ReferralStatus = 'pending' | 'registered' | 'qualified' | 'rewarded' | 'expired';

/**
 * Referral record
 */
export interface Referral {
  id: string;
  referrerId: string;
  referrerCode: string;
  
  // Referred user
  referredUserId?: string;
  referredEmail: string;
  referredName?: string;
  
  // Status tracking
  status: ReferralStatus;
  clickCount: number;
  
  // Qualification criteria
  qualificationCriteria: {
    hasOrdered: boolean;
    hasJoinedTribe: boolean;
    hasDonated: boolean;
    minimumSpend?: number;
    spentAmount: number;
  };
  
  // Rewards
  referrerReward?: {
    type: 'bottle' | 'discount' | 'donation_credit';
    value: number;
    claimed: boolean;
    claimedAt?: Timestamp;
  };
  referredReward?: {
    type: 'bottle' | 'discount' | 'donation_credit';
    value: number;
    claimed: boolean;
    claimedAt?: Timestamp;
  };
  
  // Timestamps
  invitedAt: Timestamp;
  registeredAt?: Timestamp;
  qualifiedAt?: Timestamp;
  rewardedAt?: Timestamp;
  expiresAt: Timestamp;
}

/**
 * User referral stats
 */
export interface ReferralStats {
  totalReferrals: number;
  pendingReferrals: number;
  qualifiedReferrals: number;
  rewardedReferrals: number;
  totalRewardsEarned: number;
  currentStreak: number;
  bestStreak: number;
}

### FILE: src/app/(dashboard)/referrals/page.tsx
import { Metadata } from 'next';
import { ReferralDashboard } from '@/components/referrals/ReferralDashboard';

export const metadata: Metadata = {
  title: 'Referrals | GRATIS.NGO',
  description: 'Invite friends and earn rewards',
};

export default function ReferralsPage() {
  return <ReferralDashboard />;
}

### FILE: src/components/referrals/ReferralDashboard.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Icons } from '@/components/shared/Icons';
import { cn, formatNumber, formatCurrency } from '@/lib/utils';
import { useAuth } from '@/lib/auth/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import type { Referral, ReferralStats, ReferralStatus } from '@/types/referral';

// Status configurations
const statusConfig: Record<ReferralStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'bg-gray-100 text-gray-700', icon: Icons.clock },
  registered: { label: 'Registered', color: 'bg-blue-100 text-blue-700', icon: Icons.userCheck },
  qualified: { label: 'Qualified', color: 'bg-yellow-100 text-yellow-700', icon: Icons.star },
  rewarded: { label: 'Rewarded', color: 'bg-green-100 text-green-700', icon: Icons.gift },
  expired: { label: 'Expired', color: 'bg-red-100 text-red-700', icon: Icons.clock },
};

// Reward tiers
const rewardTiers = [
  { referrals: 1, reward: 'Free Bottle', icon: '🍶', unlocked: true },
  { referrals: 5, reward: '€10 Shop Credit', icon: '💰', unlocked: true },
  { referrals: 10, reward: 'Limited Edition Bottle', icon: '⭐', unlocked: false },
  { referrals: 25, reward: 'TRIBE Supporter Month', icon: '👑', unlocked: false },
  { referrals: 50, reward: 'VIP Event Access', icon: '🎉', unlocked: false },
  { referrals: 100, reward: 'Legend Status', icon: '🏆', unlocked: false },
];

export function ReferralDashboard() {
  const { user } = useAuth();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmails, setInviteEmails] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock data
  const referralCode = user?.referralCode || 'SARAH2026';
  const referralLink = `https://gratis.ngo/join?ref=${referralCode}`;
  
  const stats: ReferralStats = {
    totalReferrals: 12,
    pendingReferrals: 3,
    qualifiedReferrals: 7,
    rewardedReferrals: 5,
    totalRewardsEarned: 5000, // €50
    currentStreak: 3,
    bestStreak: 5,
  };

  const referrals: Referral[] = [
    {
      id: 'r1',
      referrerId: user?.id || '',
      referrerCode: referralCode,
      referredUserId: 'u2',
      referredEmail: 'jan@example.com',
      referredName: 'Jan de Vries',
      status: 'rewarded',
      clickCount: 3,
      qualificationCriteria: {
        hasOrdered: true,
        hasJoinedTribe: true,
        hasDonated: false,
        spentAmount: 2500,
      },
      referrerReward: { type: 'bottle', value: 1, claimed: true },
      referredReward: { type: 'discount', value: 1000, claimed: true },
      invitedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) as any,
      registeredAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) as any,
      qualifiedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) as any,
      rewardedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) as any,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) as any,
    },
    {
      id: 'r2',
      referrerId: user?.id || '',
      referrerCode: referralCode,
      referredUserId: 'u3',
      referredEmail: 'emma@example.com',
      referredName: 'Emma Laurent',
      status: 'qualified',
      clickCount: 1,
      qualificationCriteria: {
        hasOrdered: true,
        hasJoinedTribe: false,
        hasDonated: false,
        spentAmount: 0,
      },
      referrerReward: { type: 'bottle', value: 1, claimed: false },
      referredReward: { type: 'discount', value: 1000, claimed: true },
      invitedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) as any,
      registeredAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) as any,
      qualifiedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) as any,
      expiresAt: new Date(Date.now() + 76 * 24 * 60 * 60 * 1000) as any,
    },
    {
      id: 'r3',
      referrerId: user?.id || '',
      referrerCode: referralCode,
      referredEmail: 'thomas@example.com',
      status: 'pending',
      clickCount: 0,
      qualificationCriteria: {
        hasOrdered: false,
        hasJoinedTribe: false,
        hasDonated: false,
        spentAmount: 0,
      },
      invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) as any,
      expiresAt: new Date(Date.now() + 88 * 24 * 60 * 60 * 1000) as any,
    },
  ];

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvites = async () => {
    setIsSending(true);
    // API call would go here
    await new Promise((r) => setTimeout(r, 1500));
    setIsSending(false);
    setShowInviteDialog(false);
    setInviteEmails('');
  };

  // Calculate progress to next tier
  const currentTierIndex = rewardTiers.findIndex((t) => stats.qualifiedReferrals < t.referrals);
  const currentTier = currentTierIndex > 0 ? rewardTiers[currentTierIndex - 1] : null;
  const nextTier = rewardTiers[currentTierIndex] || rewardTiers[rewardTiers.length - 1];
  const progressToNext = currentTier 
    ? ((stats.qualifiedReferrals - currentTier.referrals) / (nextTier.referrals - currentTier.referrals)) * 100
    : (stats.qualifiedReferrals / nextTier.referrals) * 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold">Referral Program</h1>
          <p className="text-muted-foreground">
            Invite friends and earn rewards together
          </p>
        </div>
        <Button onClick={() => setShowInviteDialog(true)}>
          <Icons.userPlus className="mr-2 h-4 w-4" />
          Invite Friends
        </Button>
      </div>

      {/* Referral Link Card */}
      <Card className="bg-gradient-to-r from-gratis-blue-50 to-gratis-green-50">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Your Referral Link</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Share this link with friends. When they sign up and order their first bottle,
                you both get rewards!
              </p>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={referralLink}
                    readOnly
                    className="pr-20 bg-white"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <Icons.check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Icons.copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Icons.facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Icons.twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Icons.linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Icons.whatsapp className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Icons.mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Referral Code */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-muted-foreground">
              Your referral code: <span className="font-mono font-bold text-foreground">{referralCode}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icons.users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalReferrals}</p>
                <p className="text-xs text-muted-foreground">Total Referrals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Icons.clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingReferrals}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Icons.checkCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.qualifiedReferrals}</p>
                <p className="text-xs text-muted-foreground">Qualified</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Icons.gift className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRewardsEarned, 'EUR')}</p>
                <p className="text-xs text-muted-foreground">Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress to Next Tier */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.trophy className="h-5 w-5 text-yellow-500" />
            Reward Tiers
          </CardTitle>
          <CardDescription>
            {stats.qualifiedReferrals} qualified referrals - {nextTier.referrals - stats.qualifiedReferrals} more to unlock {nextTier.reward}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>{currentTier?.reward || 'Start'}</span>
              <span>{nextTier.reward}</span>
            </div>
            <Progress value={progressToNext} className="h-3" />
          </div>

          {/* Tier Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {rewardTiers.map((tier, i) => {
              const isUnlocked = stats.qualifiedReferrals >= tier.referrals;
              return (
                <div
                  key={i}
                  className={cn(
                    'text-center p-4 rounded-lg border-2 transition-colors',
                    isUnlocked
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  )}
                >
                  <span className="text-2xl">{tier.icon}</span>
                  <p className="font-medium text-sm mt-2">{tier.referrals} referrals</p>
                  <p className="text-xs text-muted-foreground">{tier.reward}</p>
                  {isUnlocked && (
                    <Badge className="mt-2 bg-green-500">Unlocked</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Referrals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All ({referrals.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({referrals.filter(r => r.status === 'pending').length})</TabsTrigger>
              <TabsTrigger value="qualified">Qualified ({referrals.filter(r => r.status === 'qualified').length})</TabsTrigger>
              <TabsTrigger value="rewarded">Rewarded ({referrals.filter(r => r.status === 'rewarded').length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Friend</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Invited</TableHead>
                    <TableHead>Reward</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.map((referral) => {
                    const status = statusConfig[referral.status];
                    const progress = referral.qualificationCriteria;
                    const progressCount = [progress.hasOrdered, progress.hasJoinedTribe, progress.hasDonated].filter(Boolean).length;
                    
                    return (
                      <TableRow key={referral.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {referral.referredName?.[0] || referral.referredEmail[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {referral.referredName || 'Invited'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {referral.referredEmail}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={status.color}>
                            <status.icon className="mr-1 h-3 w-3" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <div
                              className={cn(
                                'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                                progress.hasOrdered ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                              )}
                              title="First Order"
                            >
                              {progress.hasOrdered ? <Icons.check className="h-3 w-3" /> : '1'}
                            </div>
                            <div
                              className={cn(
                                'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                                progress.hasJoinedTribe ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                              )}
                              title="Joined TRIBE"
                            >
                              {progress.hasJoinedTribe ? <Icons.check className="h-3 w-3" /> : '2'}
                            </div>
                            <div
                              className={cn(
                                'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                                progress.hasDonated ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                              )}
                              title="Made Donation"
                            >
                              {progress.hasDonated ? <Icons.check className="h-3 w-3" /> : '3'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatDistanceToNow(referral.invitedAt as Date, { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          {referral.referrerReward ? (
                            referral.referrerReward.claimed ? (
                              <Badge variant="outline" className="text-green-600">
                                <Icons.check className="mr-1 h-3 w-3" />
                                Claimed
                              </Badge>
                            ) : (
                              <Button size="sm" variant="outline">
                                Claim
                              </Button>
                            )
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Share Your Link', description: 'Send your unique referral link to friends', icon: Icons.share },
              { step: 2, title: 'Friend Signs Up', description: 'They create an account using your link', icon: Icons.userPlus },
              { step: 3, title: 'They Order', description: 'When they order their first bottle, you both qualify', icon: Icons.package },
              { step: 4, title: 'Get Rewards', description: 'You both receive your rewards automatically', icon: Icons.gift },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gratis-blue-100 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-6 w-6 text-gratis-blue-600" />
                </div>
                <h4 className="font-semibold mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Friends</DialogTitle>
            <DialogDescription>
              Enter email addresses to send referral invitations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Email Addresses</Label>
              <textarea
                className="w-full min-h-[100px] p-3 border rounded-lg text-sm"
                placeholder="Enter email addresses, one per line or separated by commas"
                value={inviteEmails}
                onChange={(e) => setInviteEmails(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You can invite up to 10 friends at once
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendInvites} disabled={!inviteEmails.trim() || isSending}>
              {isSending ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Icons.send className="mr-2 h-4 w-4" />
                  Send Invitations
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 16: ADMIN PANEL - DASHBOARD & USER MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 16.1: Create Admin Dashboard & User Management

```
Create the admin panel with dashboard overview and user management.

### FILE: src/app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getServerSession } from '@/lib/auth/session';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  
  // Check admin access
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

### FILE: src/components/admin/AdminSidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/shared/Icons';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Icons.layoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Icons.users },
  { name: 'Orders', href: '/admin/orders', icon: Icons.package },
  { name: 'Bottles', href: '/admin/bottles', icon: Icons.droplets },
  { name: 'Events', href: '/admin/events', icon: Icons.calendar },
  { name: 'Projects', href: '/admin/projects', icon: Icons.globe },
  { name: 'Donations', href: '/admin/donations', icon: Icons.heart },
  { name: 'Content', href: '/admin/content', icon: Icons.fileText },
  { name: 'Videos', href: '/admin/videos', icon: Icons.video },
  { name: 'Analytics', href: '/admin/analytics', icon: Icons.barChart },
  { name: 'Settings', href: '/admin/settings', icon: Icons.settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 hidden lg:block">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-2">
          <Icons.logo className="h-8 w-8 text-white" />
          <span className="font-bold text-white">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Back to Site */}
      <div className="p-4 border-t border-gray-800">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"
        >
          <Icons.arrowLeft className="h-4 w-4" />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}

### FILE: src/app/admin/page.tsx
import { Metadata } from 'next';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard | GRATIS.NGO',
};

export default function AdminPage() {
  return <AdminDashboard />;
}

### FILE: src/components/admin/AdminDashboard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Icons } from '@/components/shared/Icons';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';

// Mock data
const stats = {
  totalUsers: 15420,
  usersGrowth: 12.5,
  activeSubscriptions: 3240,
  subscriptionsGrowth: 8.3,
  monthlyRevenue: 4580000, // €45,800
  revenueGrowth: 15.2,
  totalDonations: 12350000, // €123,500
  donationsGrowth: 22.1,
  ordersToday: 156,
  ordersPending: 23,
  eventsThisMonth: 8,
  projectsActive: 12,
};

const recentOrders = [
  { id: 'ORD-001', user: 'Jan de Vries', amount: 0, status: 'processing', time: '5 min ago' },
  { id: 'ORD-002', user: 'Emma Laurent', amount: 2500, status: 'shipped', time: '12 min ago' },
  { id: 'ORD-003', user: 'Marcus Schmidt', amount: 0, status: 'delivered', time: '25 min ago' },
];

const recentUsers = [
  { name: 'Sarah van der Berg', email: 'sarah@example.com', tier: 'champion', joined: '2 hours ago' },
  { name: 'Thomas Bakker', email: 'thomas@example.com', tier: 'supporter', joined: '4 hours ago' },
  { name: 'Lisa Jansen', email: 'lisa@example.com', tier: 'free', joined: '6 hours ago' },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of GRATIS.NGO platform activity
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={formatNumber(stats.totalUsers)}
          change={stats.usersGrowth}
          icon={Icons.users}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />
        <StatsCard
          title="TRIBE Members"
          value={formatNumber(stats.activeSubscriptions)}
          change={stats.subscriptionsGrowth}
          icon={Icons.crown}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
        <StatsCard
          title="Monthly Revenue"
          value={formatCurrency(stats.monthlyRevenue, 'EUR')}
          change={stats.revenueGrowth}
          icon={Icons.euro}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
        <StatsCard
          title="Total Donations"
          value={formatCurrency(stats.totalDonations, 'EUR')}
          change={stats.donationsGrowth}
          icon={Icons.heart}
          iconColor="text-red-600"
          iconBg="bg-red-100"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link href="/admin/bottles/new">
                  <Icons.plus className="h-5 w-5" />
                  <span>Add Bottle Design</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link href="/admin/events/new">
                  <Icons.calendar className="h-5 w-5" />
                  <span>Create Event</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link href="/admin/content/new">
                  <Icons.fileText className="h-5 w-5" />
                  <span>New Content</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link href="/admin/projects/new">
                  <Icons.globe className="h-5 w-5" />
                  <span>Add Project</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Orders Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.ordersToday}</div>
            <p className="text-sm text-muted-foreground">
              {stats.ordersPending} pending processing
            </p>
            <Progress value={(stats.ordersToday - stats.ordersPending) / stats.ordersToday * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.projectsActive}</div>
            <p className="text-sm text-muted-foreground">
              {stats.eventsThisMonth} events this month
            </p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link href="/admin/projects">View all →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/orders">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icons.package className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.user}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={cn(
                        order.status === 'delivered' && 'border-green-500 text-green-600',
                        order.status === 'shipped' && 'border-blue-500 text-blue-600',
                        order.status === 'processing' && 'border-yellow-500 text-yellow-600'
                      )}
                    >
                      {order.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{order.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>New Users</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/users">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={cn(
                        user.tier === 'legend' && 'border-amber-500 text-amber-600',
                        user.tier === 'champion' && 'border-purple-500 text-purple-600',
                        user.tier === 'supporter' && 'border-blue-500 text-blue-600',
                        user.tier === 'free' && 'border-gray-300 text-gray-600'
                      )}
                    >
                      {user.tier}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{user.joined}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { name: 'API', status: 'operational', uptime: '99.99%' },
              { name: 'Database', status: 'operational', uptime: '99.95%' },
              { name: 'Payments', status: 'operational', uptime: '100%' },
              { name: 'Email', status: 'operational', uptime: '99.9%' },
              { name: 'CDN', status: 'operational', uptime: '100%' },
            ].map((service) => (
              <div key={service.name} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">{service.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {service.uptime} uptime
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
  iconBg,
}: {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}) {
  const isPositive = change >= 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className={cn('p-2 rounded-lg', iconBg)}>
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
          <div className={cn(
            'flex items-center text-sm',
            isPositive ? 'text-green-600' : 'text-red-600'
          )}>
            {isPositive ? (
              <Icons.trendingUp className="h-4 w-4 mr-1" />
            ) : (
              <Icons.trendingDown className="h-4 w-4 mr-1" />
            )}
            {Math.abs(change)}%
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

### FILE: src/app/admin/users/page.tsx
import { Metadata } from 'next';
import { UserManagement } from '@/components/admin/UserManagement';

export const metadata: Metadata = {
  title: 'User Management | Admin | GRATIS.NGO',
};

export default function UsersPage() {
  return <UserManagement />;
}

### FILE: src/components/admin/UserManagement.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Icons } from '@/components/shared/Icons';
import { cn, formatNumber, formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

// Mock users data
const mockUsers = [
  {
    id: 'u1',
    firstName: 'Sarah',
    lastName: 'van der Berg',
    email: 'sarah@example.com',
    avatar: '/images/avatars/sarah.jpg',
    tier: 'champion',
    role: 'user',
    status: 'active',
    totalSpent: 15000,
    totalDonated: 25000,
    ordersCount: 24,
    referralsCount: 12,
    createdAt: new Date('2024-06-15'),
    lastActive: new Date('2026-01-29'),
  },
  {
    id: 'u2',
    firstName: 'Marcus',
    lastName: 'Schmidt',
    email: 'marcus@example.com',
    avatar: '/images/avatars/marcus.jpg',
    tier: 'legend',
    role: 'user',
    status: 'active',
    totalSpent: 45000,
    totalDonated: 125000,
    ordersCount: 48,
    referralsCount: 28,
    createdAt: new Date('2023-12-01'),
    lastActive: new Date('2026-01-30'),
  },
  {
    id: 'u3',
    firstName: 'Emma',
    lastName: 'Laurent',
    email: 'emma@example.com',
    avatar: null,
    tier: 'supporter',
    role: 'user',
    status: 'active',
    totalSpent: 5000,
    totalDonated: 2500,
    ordersCount: 8,
    referralsCount: 3,
    createdAt: new Date('2025-03-20'),
    lastActive: new Date('2026-01-28'),
  },
  {
    id: 'u4',
    firstName: 'Jan',
    lastName: 'de Vries',
    email: 'jan@example.com',
    avatar: null,
    tier: 'free',
    role: 'user',
    status: 'suspended',
    totalSpent: 0,
    totalDonated: 0,
    ordersCount: 1,
    referralsCount: 0,
    createdAt: new Date('2025-11-10'),
    lastActive: new Date('2025-12-15'),
  },
];

const tierColors: Record<string, string> = {
  free: 'bg-gray-100 text-gray-700',
  supporter: 'bg-blue-100 text-blue-700',
  champion: 'bg-purple-100 text-purple-700',
  legend: 'bg-amber-100 text-amber-700',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  suspended: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
};

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);

  // Filter users
  const filteredUsers = mockUsers.filter((user) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !user.firstName.toLowerCase().includes(query) &&
        !user.lastName.toLowerCase().includes(query) &&
        !user.email.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    if (tierFilter !== 'all' && user.tier !== tierFilter) return false;
    if (statusFilter !== 'all' && user.status !== statusFilter) return false;
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, subscriptions, and permissions
          </p>
        </div>
        <Button>
          <Icons.userPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{formatNumber(mockUsers.length)}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{mockUsers.filter((u) => u.tier !== 'free').length}</p>
            <p className="text-xs text-muted-foreground">TRIBE Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{mockUsers.filter((u) => u.status === 'active').length}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{formatCurrency(mockUsers.reduce((sum, u) => sum + u.totalSpent, 0), 'EUR')}</p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="supporter">Supporter</SelectItem>
                <SelectItem value="champion">Champion</SelectItem>
                <SelectItem value="legend">Legend</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Icons.download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="mt-4 flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">
                {selectedUsers.length} user(s) selected
              </span>
              <Button size="sm" variant="outline">Send Email</Button>
              <Button size="sm" variant="outline">Change Tier</Button>
              <Button size="sm" variant="outline" className="text-red-600">Suspend</Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedUsers([])}
              >
                Clear
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Donated</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => toggleSelectUser(user.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar || undefined} />
                        <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={tierColors[user.tier]}>{user.tier}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[user.status]}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(user.totalSpent, 'EUR')}</TableCell>
                  <TableCell>{formatCurrency(user.totalDonated, 'EUR')}</TableCell>
                  <TableCell>{user.ordersCount}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {format(user.lastActive, 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Icons.moreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => { setSelectedUser(user); setShowUserDialog(true); }}>
                          <Icons.eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Icons.edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Icons.mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Icons.key className="mr-2 h-4 w-4" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Icons.ban className="mr-2 h-4 w-4" />
                          Suspend User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {mockUsers.length} users
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>

      {/* User Detail Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-2xl">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* User Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedUser.avatar || undefined} />
                    <AvatarFallback className="text-lg">
                      {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <p className="text-muted-foreground">{selectedUser.email}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge className={tierColors[selectedUser.tier]}>{selectedUser.tier}</Badge>
                      <Badge variant="outline" className={statusColors[selectedUser.status]}>
                        {selectedUser.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xl font-bold">{selectedUser.ordersCount}</p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xl font-bold">{formatCurrency(selectedUser.totalSpent, 'EUR')}</p>
                    <p className="text-xs text-muted-foreground">Spent</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xl font-bold">{formatCurrency(selectedUser.totalDonated, 'EUR')}</p>
                    <p className="text-xs text-muted-foreground">Donated</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xl font-bold">{selectedUser.referralsCount}</p>
                    <p className="text-xs text-muted-foreground">Referrals</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Member since:</span>
                    <span className="ml-2 font-medium">{format(selectedUser.createdAt, 'MMMM d, yyyy')}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last active:</span>
                    <span className="ml-2 font-medium">{format(selectedUser.lastActive, 'MMMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowUserDialog(false)}>Close</Button>
                <Button>Edit User</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 17: ADMIN CMS - CONTENT MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 17.1: Create Content Management System

```
Create the admin CMS for managing pages, blog posts, and site content.

### FILE: src/app/admin/content/page.tsx
import { Metadata } from 'next';
import { ContentManagement } from '@/components/admin/ContentManagement';

export const metadata: Metadata = {
  title: 'Content Management | Admin | GRATIS.NGO',
};

export default function ContentPage() {
  return <ContentManagement />;
}

### FILE: src/components/admin/ContentManagement.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Icons } from '@/components/shared/Icons';
import { cn } from '@/lib/utils';

// Content types
type ContentType = 'page' | 'blog' | 'faq' | 'email_template';
type ContentStatus = 'draft' | 'published' | 'scheduled' | 'archived';

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  type: ContentType;
  status: ContentStatus;
  author: string;
  category?: string;
  publishedAt?: Date;
  scheduledAt?: Date;
  updatedAt: Date;
  views?: number;
}

// Mock content data
const mockContent: ContentItem[] = [
  {
    id: 'c1',
    title: 'About Us',
    slug: 'about',
    type: 'page',
    status: 'published',
    author: 'Admin',
    updatedAt: new Date('2025-12-01'),
    views: 5420,
  },
  {
    id: 'c2',
    title: 'How GRATIS.NGO Works',
    slug: 'blog/how-gratis-works',
    type: 'blog',
    status: 'published',
    author: 'Emma Jansen',
    category: 'Guide',
    publishedAt: new Date('2025-11-15'),
    updatedAt: new Date('2025-11-15'),
    views: 12350,
  },
  {
    id: 'c3',
    title: '2025 Impact Report',
    slug: 'blog/2025-impact-report',
    type: 'blog',
    status: 'scheduled',
    author: 'Thomas Bakker',
    category: 'Report',
    scheduledAt: new Date('2026-02-01'),
    updatedAt: new Date('2026-01-20'),
  },
  {
    id: 'c4',
    title: 'Privacy Policy',
    slug: 'privacy',
    type: 'page',
    status: 'published',
    author: 'Legal Team',
    updatedAt: new Date('2025-05-01'),
    views: 890,
  },
  {
    id: 'c5',
    title: 'Welcome Email',
    slug: 'email/welcome',
    type: 'email_template',
    status: 'published',
    author: 'Marketing',
    updatedAt: new Date('2025-10-15'),
  },
];

const typeConfig: Record<ContentType, { label: string; icon: React.ElementType; color: string }> = {
  page: { label: 'Page', icon: Icons.fileText, color: 'bg-blue-100 text-blue-700' },
  blog: { label: 'Blog', icon: Icons.newspaper, color: 'bg-green-100 text-green-700' },
  faq: { label: 'FAQ', icon: Icons.helpCircle, color: 'bg-purple-100 text-purple-700' },
  email_template: { label: 'Email', icon: Icons.mail, color: 'bg-orange-100 text-orange-700' },
};

const statusConfig: Record<ContentStatus, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  published: { label: 'Published', color: 'bg-green-100 text-green-700' },
  scheduled: { label: 'Scheduled', color: 'bg-blue-100 text-blue-700' },
  archived: { label: 'Archived', color: 'bg-red-100 text-red-700' },
};

export function ContentManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter content
  const filteredContent = mockContent.filter((item) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!item.title.toLowerCase().includes(query) && !item.slug.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">
            Manage pages, blog posts, and site content
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Icons.plus className="mr-2 h-4 w-4" />
              Create Content
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/admin/content/new?type=page">
                <Icons.fileText className="mr-2 h-4 w-4" />
                New Page
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/content/new?type=blog">
                <Icons.newspaper className="mr-2 h-4 w-4" />
                New Blog Post
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/content/new?type=faq">
                <Icons.helpCircle className="mr-2 h-4 w-4" />
                New FAQ
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/content/new?type=email_template">
                <Icons.mail className="mr-2 h-4 w-4" />
                New Email Template
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(typeConfig).map(([key, config]) => {
          const count = mockContent.filter((c) => c.type === key).length;
          return (
            <Card key={key}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-lg', config.color.split(' ')[0])}>
                    <config.icon className={cn('h-5 w-5', config.color.split(' ')[1])} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">{config.label}s</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(typeConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContent.map((item) => {
                const type = typeConfig[item.type];
                const status = statusConfig[item.status];
                
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">/{item.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={type.color}>
                        <type.icon className="mr-1 h-3 w-3" />
                        {type.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={status.color}>
                        {status.label}
                      </Badge>
                      {item.scheduledAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(item.scheduledAt, 'MMM d, yyyy')}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.author}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(item.updatedAt, 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.views ? item.views.toLocaleString() : '—'}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Icons.moreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/content/${item.id}/edit`}>
                              <Icons.edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/${item.slug}`} target="_blank">
                              <Icons.externalLink className="mr-2 h-4 w-4" />
                              View Live
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Icons.copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Icons.trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 18: ANALYTICS DASHBOARD
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 18.1: Create Analytics Dashboard with Charts

```
Create the analytics dashboard with comprehensive metrics and visualizations.

### FILE: src/app/admin/analytics/page.tsx
import { Metadata } from 'next';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';

export const metadata: Metadata = {
  title: 'Analytics | Admin | GRATIS.NGO',
};

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}

### FILE: src/components/admin/AnalyticsDashboard.tsx
'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icons } from '@/components/shared/Icons';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';

// Mock data for charts
const revenueData = [
  { month: 'Jan', revenue: 32000, donations: 45000, subscriptions: 28000 },
  { month: 'Feb', revenue: 35000, donations: 52000, subscriptions: 31000 },
  { month: 'Mar', revenue: 42000, donations: 58000, subscriptions: 35000 },
  { month: 'Apr', revenue: 38000, donations: 48000, subscriptions: 33000 },
  { month: 'May', revenue: 45000, donations: 62000, subscriptions: 38000 },
  { month: 'Jun', revenue: 52000, donations: 75000, subscriptions: 42000 },
  { month: 'Jul', revenue: 48000, donations: 68000, subscriptions: 40000 },
  { month: 'Aug', revenue: 55000, donations: 82000, subscriptions: 45000 },
  { month: 'Sep', revenue: 62000, donations: 95000, subscriptions: 50000 },
  { month: 'Oct', revenue: 58000, donations: 88000, subscriptions: 48000 },
  { month: 'Nov', revenue: 68000, donations: 105000, subscriptions: 55000 },
  { month: 'Dec', revenue: 75000, donations: 125000, subscriptions: 62000 },
];

const userGrowthData = [
  { month: 'Jan', users: 8500, newUsers: 650, churn: 120 },
  { month: 'Feb', users: 9200, newUsers: 820, churn: 120 },
  { month: 'Mar', users: 10100, newUsers: 1050, churn: 150 },
  { month: 'Apr', users: 10800, newUsers: 850, churn: 150 },
  { month: 'May', users: 11600, newUsers: 920, churn: 120 },
  { month: 'Jun', users: 12500, newUsers: 1100, churn: 200 },
  { month: 'Jul', users: 13200, newUsers: 850, churn: 150 },
  { month: 'Aug', users: 14000, newUsers: 950, churn: 150 },
  { month: 'Sep', users: 14800, newUsers: 1000, churn: 200 },
  { month: 'Oct', users: 15420, newUsers: 800, churn: 180 },
];

const tierDistribution = [
  { name: 'Free', value: 8500, color: '#9CA3AF' },
  { name: 'Supporter', value: 4200, color: '#3B82F6' },
  { name: 'Champion', value: 2100, color: '#8B5CF6' },
  { name: 'Legend', value: 620, color: '#F59E0B' },
];

const impactData = [
  { category: 'Clean Water', value: 125000, unit: 'liters' },
  { category: 'Trees Planted', value: 8500, unit: 'trees' },
  { category: 'Meals Provided', value: 45000, unit: 'meals' },
  { category: 'Communities', value: 28, unit: 'communities' },
];

const topCountries = [
  { country: 'Netherlands', users: 5420, revenue: 125000 },
  { country: 'Germany', users: 3200, revenue: 85000 },
  { country: 'Belgium', users: 2100, revenue: 52000 },
  { country: 'France', users: 1800, revenue: 45000 },
  { country: 'United Kingdom', users: 1500, revenue: 42000 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('12m');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Platform performance and insights
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Icons.download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(61000000, 'EUR')}
          change={15.2}
          icon={Icons.euro}
          color="green"
        />
        <MetricCard
          title="Active Users"
          value={formatNumber(15420)}
          change={8.5}
          icon={Icons.users}
          color="blue"
        />
        <MetricCard
          title="Total Donations"
          value={formatCurrency(95200000, 'EUR')}
          change={22.1}
          icon={Icons.heart}
          color="red"
        />
        <MetricCard
          title="Impact Score"
          value="892K"
          change={18.3}
          icon={Icons.leaf}
          color="emerald"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value * 100, 'EUR')}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="subscriptions"
                    stackId="1"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.6}
                    name="Subscriptions"
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.6}
                    name="Shop Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="donations"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.6}
                    name="Donations"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Active users over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name="Total Users"
                  />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="New Users"
                  />
                  <Line
                    type="monotone"
                    dataKey="churn"
                    stroke="#EF4444"
                    strokeWidth={2}
                    name="Churn"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tier Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>TRIBE Distribution</CardTitle>
            <CardDescription>Users by membership tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tierDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {tierDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatNumber(value)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Impact Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Impact Metrics</CardTitle>
            <CardDescription>Total impact achieved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={100} />
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => [
                      `${formatNumber(value)} ${props.payload.unit}`,
                      'Value',
                    ]}
                  />
                  <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>Users by location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCountries.map((country, i) => (
                <div key={country.country} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-4">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{country.country}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(country.users)} users
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${(country.users / topCountries[0].users) * 100}%`,
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

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>User journey from visit to donation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between h-[200px] gap-4">
            {[
              { stage: 'Visitors', value: 125000, pct: 100 },
              { stage: 'Sign Ups', value: 28500, pct: 22.8 },
              { stage: 'First Order', value: 15200, pct: 12.2 },
              { stage: 'TRIBE Member', value: 6920, pct: 5.5 },
              { stage: 'Donor', value: 4500, pct: 3.6 },
            ].map((item, i) => (
              <div key={item.stage} className="flex-1 text-center">
                <div
                  className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg mx-auto transition-all"
                  style={{
                    height: `${item.pct * 2}px`,
                    maxWidth: '80px',
                  }}
                />
                <p className="font-semibold mt-2">{formatNumber(item.value)}</p>
                <p className="text-xs text-muted-foreground">{item.stage}</p>
                <Badge variant="outline" className="mt-1">
                  {item.pct}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: string;
}) {
  const colorClasses: Record<string, { bg: string; text: string }> = {
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  };

  const colors = colorClasses[color] || colorClasses.blue;
  const isPositive = change >= 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className={cn('p-2 rounded-lg', colors.bg)}>
            <Icon className={cn('h-5 w-5', colors.text)} />
          </div>
          <div className={cn(
            'flex items-center text-sm',
            isPositive ? 'text-green-600' : 'text-red-600'
          )}>
            {isPositive ? (
              <Icons.trendingUp className="h-4 w-4 mr-1" />
            ) : (
              <Icons.trendingDown className="h-4 w-4 mr-1" />
            )}
            {Math.abs(change)}%
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

This completes Part 4 with Sections 14-18. The document includes:
- **Section 14**: Impact Projects & Voting System (Listings, Details, Progress Tracking)
- **Section 15**: Referral System (Dashboard, Tracking, Rewards, Tiers)
- **Section 16**: Admin Panel (Dashboard, User Management, System Status)
- **Section 17**: Content Management System (Pages, Blog, FAQ, Email Templates)
- **Section 18**: Analytics Dashboard (Charts, Metrics, Funnel, Geographic Data)

Part 5 will cover Sections 19-26: API Architecture, Testing, Security, Notifications, Workflows, and Deployment.

Shall I continue with Part 5?
