// src/lib/next-compat.ts
// Next.js compatibility shim for Vite project
// Note: These API routes won't work in Vite - they're Next.js-only

/**
 * Stub type for NextRequest (Next.js only)
 * This is a compatibility shim to allow compilation in Vite project
 */
export class NextRequest extends Request {
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    super(input, init);
  }
}

/**
 * Stub class for NextResponse (Next.js only)
 * This is a compatibility shim to allow compilation in Vite project
 */
export class NextResponse extends Response {
  static json(data: unknown, init?: ResponseInit): Response {
    return new Response(JSON.stringify(data), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  }
}
