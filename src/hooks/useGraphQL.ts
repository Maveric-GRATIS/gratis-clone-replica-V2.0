// src/hooks/useGraphQL.ts
// GRATIS.NGO — GraphQL Client Hook

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{ message: string; path?: string[] }>;
}

interface UseGraphQLOptions {
  userId?: string;
  tenantId?: string;
}

export function useGraphQL<T = any>(options: UseGraphQLOptions = {}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (query: string, variables?: Record<string, any>): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        // Add user ID from auth or options
        const userId = options.userId || user?.uid;
        if (userId) {
          headers['x-user-id'] = userId;
        }

        // Add tenant ID if provided
        if (options.tenantId) {
          headers['x-tenant-id'] = options.tenantId;
        }

        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            query,
            variables,
          }),
        });

        if (!response.ok) {
          throw new Error(`GraphQL request failed: ${response.statusText}`);
        }

        const result: GraphQLResponse<T> = await response.json();

        if (result.errors && result.errors.length > 0) {
          const errorMessages = result.errors.map((e) => e.message).join(', ');
          throw new Error(`GraphQL errors: ${errorMessages}`);
        }

        return result.data || null;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('GraphQL request failed');
        setError(error);
        console.error('[useGraphQL] Error:', error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user?.uid, options.userId, options.tenantId]
  );

  return {
    execute,
    loading,
    error,
  };
}

/**
 * Query helper functions
 */

export function useGraphQLQuery<T = any>(options: UseGraphQLOptions = {}) {
  const { execute, loading, error } = useGraphQL<T>(options);

  const query = useCallback(
    async (queryString: string, variables?: Record<string, any>) => {
      return execute(queryString, variables);
    },
    [execute]
  );

  return { query, loading, error };
}

export function useGraphQLMutation<T = any>(options: UseGraphQLOptions = {}) {
  const { execute, loading, error } = useGraphQL<T>(options);

  const mutate = useCallback(
    async (mutation: string, variables?: Record<string, any>) => {
      return execute(mutation, variables);
    },
    [execute]
  );

  return { mutate, loading, error };
}

/**
 * Pre-built queries for common operations
 */

export const QUERIES = {
  GET_PROJECTS: `
    query GetProjects($limit: Int, $offset: Int, $status: ProjectStatus) {
      projects(limit: $limit, offset: $offset, status: $status) {
        id
        title
        description
        goal
        raised
        currency
        status
        category
        imageUrl
        donationCount
        partner {
          id
          name
          logoUrl
        }
      }
    }
  `,

  GET_PROJECT: `
    query GetProject($id: ID!) {
      project(id: $id) {
        id
        title
        description
        goal
        raised
        currency
        status
        category
        imageUrl
        donationCount
        partnerId
        partner {
          id
          name
          description
          logoUrl
          verified
        }
        createdAt
        updatedAt
      }
    }
  `,

  GET_EVENTS: `
    query GetEvents($limit: Int, $upcoming: Boolean) {
      events(limit: $limit, upcoming: $upcoming) {
        id
        title
        description
        location
        startDate
        endDate
        imageUrl
        capacity
        registrationCount
        status
      }
    }
  `,

  GET_DONATION_STATS: `
    query GetDonationStats($projectId: ID, $partnerId: ID) {
      donationStats(projectId: $projectId, partnerId: $partnerId) {
        totalAmount
        donationCount
        averageDonation
        recurringCount
      }
    }
  `,

  GET_PLATFORM_STATS: `
    query GetPlatformStats {
      platformStats {
        totalProjects
        activeProjects
        totalDonations
        donationCount
        partnerCount
        userCount
      }
    }
  `,
};

export const MUTATIONS = {
  CREATE_DONATION: `
    mutation CreateDonation($input: CreateDonationInput!) {
      createDonation(input: $input) {
        id
        amount
        currency
        projectId
        status
        createdAt
      }
    }
  `,

  CREATE_PROJECT: `
    mutation CreateProject($input: CreateProjectInput!) {
      createProject(input: $input) {
        id
        title
        description
        goal
        currency
        status
        createdAt
      }
    }
  `,

  UPDATE_PROJECT: `
    mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
      updateProject(id: $id, input: $input) {
        id
        title
        description
        goal
        status
        updatedAt
      }
    }
  `,

  REGISTER_FOR_EVENT: `
    mutation RegisterForEvent($eventId: ID!) {
      registerForEvent(eventId: $eventId) {
        id
        eventId
        userId
        status
        registeredAt
      }
    }
  `,
};
