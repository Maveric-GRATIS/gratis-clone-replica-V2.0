// src/app/api/graphql/route.ts
// GRATIS.NGO — GraphQL API Endpoint

import { NextRequest, NextResponse } from 'next/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { graphql, GraphQLError } from 'graphql';
import typeDefs from '@/lib/graphql/schema';
import resolvers from '@/lib/graphql/resolvers';

// Create executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

/**
 * POST /api/graphql
 * GraphQL endpoint (query + mutation)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, variables = {}, operationName } = body;

    if (!query) {
      return NextResponse.json(
        { errors: [{ message: 'Query is required' }] },
        { status: 400 }
      );
    }

    // Mock authentication - in production, extract from session/token
    const userId = request.headers.get('x-user-id') || undefined;
    const tenantId = request.headers.get('x-tenant-id') || 'platform';

    // Build context
    const context = {
      userId,
      tenantId,
      headers: request.headers,
    };

    // Execute GraphQL query
    const result = await graphql({
      schema,
      source: query,
      variableValues: variables,
      operationName,
      contextValue: context,
    });

    // Log for debugging
    if (result.errors) {
      console.error('[GraphQL API] Errors:', result.errors);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[GraphQL API] Error:', error);
    return NextResponse.json(
      {
        errors: [
          {
            message: error instanceof Error ? error.message : 'Internal server error',
          },
        ],
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/graphql
 * GraphQL introspection (for GraphiQL/Playground)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      {
        message: 'GRATIS.NGO GraphQL API',
        version: '1.0',
        docs: 'POST your GraphQL queries to this endpoint',
      },
      { status: 200 }
    );
  }

  // Allow GET queries (useful for simple queries)
  const userId = request.headers.get('x-user-id') || undefined;
  const context = { userId, tenantId: 'platform' };

  const result = await graphql({
    schema,
    source: query,
    contextValue: context,
  });

  return NextResponse.json(result);
}
