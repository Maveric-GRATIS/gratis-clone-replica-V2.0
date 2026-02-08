// src/lib/graphql/resolvers.ts
// GRATIS.NGO — GraphQL Resolvers

import type { IResolvers } from '@graphql-tools/utils';

// Mock data stores (in production, this would use Firestore)
const mockProjects = new Map();
const mockEvents = new Map();
const mockDonations = new Map();
const mockPartners = new Map();
const mockUsers = new Map();
const mockVideos = new Map();

export const resolvers: IResolvers = {
  Query: {
    // Projects
    projects: async (_parent, args) => {
      console.log('[GraphQL] Query: projects', args);
      const { limit = 10, offset = 0, status, partnerId } = args;

      let projects = Array.from(mockProjects.values());

      if (status) {
        projects = projects.filter((p) => p.status === status);
      }
      if (partnerId) {
        projects = projects.filter((p) => p.partnerId === partnerId);
      }

      return projects.slice(offset, offset + limit);
    },

    project: async (_parent, { id }) => {
      console.log('[GraphQL] Query: project', id);
      return mockProjects.get(id) || null;
    },

    // Events
    events: async (_parent, args) => {
      console.log('[GraphQL] Query: events', args);
      const { limit = 10, offset = 0, upcoming } = args;

      let events = Array.from(mockEvents.values());

      if (upcoming) {
        const now = new Date();
        events = events.filter((e) => new Date(e.startDate) > now);
      }

      return events.slice(offset, offset + limit);
    },

    event: async (_parent, { id }) => {
      console.log('[GraphQL] Query: event', id);
      return mockEvents.get(id) || null;
    },

    // Partners
    partners: async (_parent, args) => {
      console.log('[GraphQL] Query: partners', args);
      const { limit = 10, offset = 0, verified } = args;

      let partners = Array.from(mockPartners.values());

      if (verified !== undefined) {
        partners = partners.filter((p) => p.verified === verified);
      }

      return partners.slice(offset, offset + limit);
    },

    partner: async (_parent, { id }) => {
      console.log('[GraphQL] Query: partner', id);
      return mockPartners.get(id) || null;
    },

    // Donations
    donations: async (_parent, args) => {
      console.log('[GraphQL] Query: donations', args);
      const { userId, projectId, limit = 20 } = args;

      let donations = Array.from(mockDonations.values());

      if (userId) {
        donations = donations.filter((d) => d.userId === userId);
      }
      if (projectId) {
        donations = donations.filter((d) => d.projectId === projectId);
      }

      return donations.slice(0, limit);
    },

    donation: async (_parent, { id }) => {
      console.log('[GraphQL] Query: donation', id);
      return mockDonations.get(id) || null;
    },

    donationStats: async (_parent, { projectId, partnerId }) => {
      console.log('[GraphQL] Query: donationStats', { projectId, partnerId });

      let donations = Array.from(mockDonations.values());

      if (projectId) {
        donations = donations.filter((d) => d.projectId === projectId);
      }

      const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
      const donationCount = donations.length;
      const recurringCount = donations.filter((d) => d.isRecurring).length;

      return {
        totalAmount,
        donationCount,
        averageDonation: donationCount > 0 ? totalAmount / donationCount : 0,
        recurringCount,
        topDonors: [], // TODO: Implement top donors
      };
    },

    // Users
    user: async (_parent, { id }) => {
      console.log('[GraphQL] Query: user', id);
      return mockUsers.get(id) || null;
    },

    me: async (_parent, _args, context) => {
      console.log('[GraphQL] Query: me');
      if (!context.userId) {
        throw new Error('Not authenticated');
      }
      return mockUsers.get(context.userId) || null;
    },

    // Videos
    videos: async (_parent, args) => {
      console.log('[GraphQL] Query: videos', args);
      const { limit = 10, category } = args;

      let videos = Array.from(mockVideos.values());

      if (category) {
        videos = videos.filter((v) => v.category === category);
      }

      return videos.slice(0, limit);
    },

    video: async (_parent, { id }) => {
      console.log('[GraphQL] Query: video', id);
      return mockVideos.get(id) || null;
    },

    // Analytics
    platformStats: async () => {
      console.log('[GraphQL] Query: platformStats');

      const projects = Array.from(mockProjects.values());
      const donations = Array.from(mockDonations.values());

      return {
        totalProjects: projects.length,
        activeProjects: projects.filter((p) => p.status === 'ACTIVE').length,
        totalDonations: donations.reduce((sum, d) => sum + d.amount, 0),
        donationCount: donations.length,
        partnerCount: mockPartners.size,
        userCount: mockUsers.size,
      };
    },
  },

  Mutation: {
    // Donations
    createDonation: async (_parent, { input }, context) => {
      console.log('[GraphQL] Mutation: createDonation', input);

      if (!context.userId) {
        throw new Error('Authentication required');
      }

      const donation = {
        id: `donation_${Date.now()}`,
        ...input,
        userId: input.isAnonymous ? null : context.userId,
        status: 'COMPLETED',
        createdAt: new Date().toISOString(),
      };

      mockDonations.set(donation.id, donation);

      // Update project raised amount
      const project = mockProjects.get(input.projectId);
      if (project) {
        project.raised += input.amount;
        project.donationCount += 1;
      }

      return donation;
    },

    // Projects
    createProject: async (_parent, { input }, context) => {
      console.log('[GraphQL] Mutation: createProject', input);

      if (!context.userId) {
        throw new Error('Authentication required');
      }

      const project = {
        id: `project_${Date.now()}`,
        ...input,
        raised: 0,
        donationCount: 0,
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockProjects.set(project.id, project);
      return project;
    },

    updateProject: async (_parent, { id, input }, context) => {
      console.log('[GraphQL] Mutation: updateProject', id, input);

      if (!context.userId) {
        throw new Error('Authentication required');
      }

      const project = mockProjects.get(id);
      if (!project) {
        throw new Error('Project not found');
      }

      const updated = {
        ...project,
        ...input,
        updatedAt: new Date().toISOString(),
      };

      mockProjects.set(id, updated);
      return updated;
    },

    // Events
    createEvent: async (_parent, { input }, context) => {
      console.log('[GraphQL] Mutation: createEvent', input);

      if (!context.userId) {
        throw new Error('Authentication required');
      }

      const event = {
        id: `event_${Date.now()}`,
        ...input,
        registrationCount: 0,
        status: 'UPCOMING',
        createdAt: new Date().toISOString(),
      };

      mockEvents.set(event.id, event);
      return event;
    },

    registerForEvent: async (_parent, { eventId }, context) => {
      console.log('[GraphQL] Mutation: registerForEvent', eventId);

      if (!context.userId) {
        throw new Error('Authentication required');
      }

      const event = mockEvents.get(eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      event.registrationCount += 1;

      return {
        id: `reg_${Date.now()}`,
        eventId,
        userId: context.userId,
        status: 'CONFIRMED',
        registeredAt: new Date().toISOString(),
      };
    },

    // User
    updateProfile: async (_parent, { input }, context) => {
      console.log('[GraphQL] Mutation: updateProfile', input);

      if (!context.userId) {
        throw new Error('Authentication required');
      }

      const user = mockUsers.get(context.userId);
      if (!user) {
        throw new Error('User not found');
      }

      const updated = {
        ...user,
        ...input,
      };

      mockUsers.set(context.userId, updated);
      return updated;
    },
  },

  // Field resolvers
  Project: {
    partner: async (parent) => {
      return mockPartners.get(parent.partnerId) || null;
    },
  },

  Donation: {
    project: async (parent) => {
      return mockProjects.get(parent.projectId) || null;
    },
    user: async (parent) => {
      if (!parent.userId) return null;
      return mockUsers.get(parent.userId) || null;
    },
  },
};

// Seed some mock data
export function seedGraphQLMockData() {
  // Partner
  const partner1 = {
    id: 'partner_1',
    name: 'Red Cross',
    description: 'International humanitarian organization',
    logoUrl: '/partners/redcross.svg',
    verified: true,
    projectCount: 5,
    totalRaised: 125000,
    createdAt: new Date('2024-01-01').toISOString(),
  };
  mockPartners.set(partner1.id, partner1);

  // Project
  const project1 = {
    id: 'project_1',
    title: 'Clean Water Initiative',
    description: 'Providing clean water to rural communities',
    goal: 50000,
    raised: 35000,
    currency: 'EUR',
    status: 'ACTIVE',
    category: 'Water',
    imageUrl: '/projects/water.jpg',
    partnerId: partner1.id,
    donationCount: 142,
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockProjects.set(project1.id, project1);

  // Event
  const event1 = {
    id: 'event_1',
    title: 'Charity Gala 2024',
    description: 'Annual fundraising gala',
    location: 'Amsterdam',
    startDate: new Date('2024-12-15').toISOString(),
    endDate: new Date('2024-12-15').toISOString(),
    imageUrl: '/events/gala.jpg',
    capacity: 200,
    registrationCount: 87,
    status: 'UPCOMING',
    createdAt: new Date('2024-03-01').toISOString(),
  };
  mockEvents.set(event1.id, event1);

  console.log('[GraphQL] Mock data seeded');
}

// Auto-seed in development
if (process.env.NODE_ENV === 'development') {
  seedGraphQLMockData();
}

export default resolvers;
