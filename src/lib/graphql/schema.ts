// src/lib/graphql/schema.ts
// GRATIS.NGO — GraphQL Schema Definition

export const typeDefs = `
  # ============================================
  # GRATIS.NGO GraphQL Schema v1.0
  # ============================================

  type Query {
    # Projects
    projects(limit: Int, offset: Int, status: ProjectStatus, partnerId: ID): [Project!]!
    project(id: ID!): Project

    # Events
    events(limit: Int, offset: Int, upcoming: Boolean): [Event!]!
    event(id: ID!): Event

    # Partners
    partners(limit: Int, offset: Int, verified: Boolean): [Partner!]!
    partner(id: ID!): Partner

    # Donations
    donations(userId: ID, projectId: ID, limit: Int): [Donation!]!
    donation(id: ID!): Donation
    donationStats(projectId: ID, partnerId: ID): DonationStats!

    # Users
    user(id: ID!): User
    me: User

    # Videos
    videos(limit: Int, category: String): [Video!]!
    video(id: ID!): Video

    # Analytics
    platformStats: PlatformStats!
  }

  type Mutation {
    # Donations
    createDonation(input: CreateDonationInput!): Donation!

    # Projects
    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project!

    # Events
    createEvent(input: CreateEventInput!): Event!
    registerForEvent(eventId: ID!): EventRegistration!

    # User
    updateProfile(input: UpdateProfileInput!): User!
  }

  type Subscription {
    donationCreated(projectId: ID): Donation!
    projectUpdated(projectId: ID!): Project!
  }

  # ============================================
  # Core Types
  # ============================================

  type Project {
    id: ID!
    title: String!
    description: String!
    goal: Float!
    raised: Float!
    currency: String!
    status: ProjectStatus!
    category: String!
    imageUrl: String
    partnerId: ID!
    partner: Partner
    donationCount: Int!
    createdAt: String!
    updatedAt: String!
  }

  enum ProjectStatus {
    DRAFT
    ACTIVE
    COMPLETED
    ARCHIVED
  }

  type Event {
    id: ID!
    title: String!
    description: String!
    location: String
    startDate: String!
    endDate: String
    imageUrl: String
    capacity: Int
    registrationCount: Int!
    status: EventStatus!
    createdAt: String!
  }

  enum EventStatus {
    UPCOMING
    ONGOING
    COMPLETED
    CANCELLED
  }

  type Partner {
    id: ID!
    name: String!
    description: String
    logoUrl: String
    verified: Boolean!
    projectCount: Int!
    totalRaised: Float!
    createdAt: String!
  }

  type Donation {
    id: ID!
    amount: Float!
    currency: String!
    projectId: ID!
    project: Project
    userId: ID
    user: User
    status: DonationStatus!
    isRecurring: Boolean!
    isAnonymous: Boolean!
    message: String
    createdAt: String!
  }

  enum DonationStatus {
    PENDING
    COMPLETED
    FAILED
    REFUNDED
  }

  type User {
    id: ID!
    displayName: String
    email: String
    photoURL: String
    role: String!
    donationCount: Int!
    totalDonated: Float!
    createdAt: String!
  }

  type Video {
    id: ID!
    title: String!
    description: String
    url: String!
    thumbnailUrl: String
    duration: Int
    views: Int!
    category: String
    uploadedAt: String!
  }

  type EventRegistration {
    id: ID!
    eventId: ID!
    userId: ID!
    status: String!
    registeredAt: String!
  }

  # ============================================
  # Statistics & Analytics
  # ============================================

  type DonationStats {
    totalAmount: Float!
    donationCount: Int!
    averageDonation: Float!
    recurringCount: Int!
    topDonors: [DonorSummary!]!
  }

  type DonorSummary {
    userId: ID!
    displayName: String
    totalDonated: Float!
    donationCount: Int!
  }

  type PlatformStats {
    totalProjects: Int!
    activeProjects: Int!
    totalDonations: Float!
    donationCount: Int!
    partnerCount: Int!
    userCount: Int!
  }

  # ============================================
  # Input Types
  # ============================================

  input CreateDonationInput {
    amount: Float!
    currency: String!
    projectId: ID!
    isRecurring: Boolean
    isAnonymous: Boolean
    message: String
    paymentMethodId: String!
  }

  input CreateProjectInput {
    title: String!
    description: String!
    goal: Float!
    currency: String!
    category: String!
    imageUrl: String
    partnerId: ID!
  }

  input UpdateProjectInput {
    title: String
    description: String
    goal: Float
    status: ProjectStatus
    imageUrl: String
  }

  input CreateEventInput {
    title: String!
    description: String!
    location: String
    startDate: String!
    endDate: String
    imageUrl: String
    capacity: Int
  }

  input UpdateProfileInput {
    displayName: String
    photoURL: String
  }
`;

export default typeDefs;
