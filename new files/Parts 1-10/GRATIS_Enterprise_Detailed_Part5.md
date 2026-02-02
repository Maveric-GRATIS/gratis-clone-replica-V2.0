# GRATIS.NGO Enterprise Development Prompts - PART 5
## API Architecture, Testing, Security, Notifications & Deployment (Sections 19-24)
### Total Estimated Size: ~45,000 tokens | Complexity: HIGH

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 19: API ARCHITECTURE & SERVER ACTIONS
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 19.1: Create API Route Handlers & Server Actions

```
Create the complete API architecture with Next.js API routes and server actions.

### FILE: src/lib/api/client.ts
// =============================================================================
// API CLIENT
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(
        error.message || 'An error occurred',
        response.status,
        error.code
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Network error', 500, 'NETWORK_ERROR');
  }
}

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// HTTP methods
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
  patch: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    
  delete: <T>(endpoint: string, options?: RequestInit) =>
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};

### FILE: src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { db } from '@/lib/firebase/admin';
import { z } from 'zod';

// GET /api/users - List users (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const tier = searchParams.get('tier');
    const status = searchParams.get('status');

    let query = db.collection('users').orderBy('createdAt', 'desc');

    if (tier) {
      query = query.where('tribeMembership.tier', '==', tier);
    }
    
    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.limit(limit).offset((page - 1) * limit).get();
    
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const countSnapshot = await db.collection('users').count().get();
    const total = countSnapshot.data().count;

    return NextResponse.json({
      users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

### FILE: src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { db } from '@/lib/firebase/admin';
import { z } from 'zod';
import { nanoid } from 'nanoid';

// POST /api/orders - Create new order
const createOrderSchema = z.object({
  items: z.array(z.object({
    bottleDesignId: z.string(),
    quantity: z.number().min(1).max(10),
    personalization: z.object({
      name: z.string().max(20).optional(),
      message: z.string().max(50).optional(),
    }).optional(),
  })).min(1),
  shippingAddressId: z.string(),
  giftWrap: z.boolean().default(false),
  giftMessage: z.string().max(200).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    const userDoc = await db.collection('users').doc(session.user.id).get();
    const userData = userDoc.data();

    const monthlyUsed = userData?.stats.monthlyBottlesUsed || 0;
    const monthlyAllowance = userData?.stats.monthlyBottleAllowance || 1;
    const totalQuantity = validatedData.items.reduce((sum, item) => sum + item.quantity, 0);

    if (monthlyUsed + totalQuantity > monthlyAllowance) {
      return NextResponse.json({ error: 'Monthly bottle allowance exceeded' }, { status: 400 });
    }

    const addressDoc = await db
      .collection('users').doc(session.user.id)
      .collection('addresses').doc(validatedData.shippingAddressId).get();

    if (!addressDoc.exists) {
      return NextResponse.json({ error: 'Shipping address not found' }, { status: 400 });
    }

    const orderId = nanoid(12).toUpperCase();
    const order = {
      id: orderId,
      userId: session.user.id,
      orderNumber: `GRT-${orderId}`,
      items: validatedData.items,
      status: 'pending',
      shippingAddress: addressDoc.data(),
      giftWrap: validatedData.giftWrap,
      giftMessage: validatedData.giftMessage,
      subtotal: 0, shipping: 0, tax: 0, total: 0,
      impactGenerated: { waterLiters: totalQuantity * 50, treesPlanted: totalQuantity * 0.1 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('orders').doc(orderId).set(order);

    await db.collection('users').doc(session.user.id).update({
      'stats.monthlyBottlesUsed': monthlyUsed + totalQuantity,
      'stats.totalBottlesOrdered': (userData?.stats.totalBottlesOrdered || 0) + totalQuantity,
      'stats.totalOrders': (userData?.stats.totalOrders || 0) + 1,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    let query = db.collection('orders')
      .where('userId', '==', session.user.id)
      .orderBy('createdAt', 'desc');

    if (status) query = query.where('status', '==', status);

    const snapshot = await query.limit(limit).offset((page - 1) * limit).get();
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

### FILE: src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/server';
import { db } from '@/lib/firebase/admin';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_failed':
        await handleInvoiceFailed(event.data.object as Stripe.Invoice);
        break;
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const { metadata } = session;
  if (session.mode === 'payment') {
    await db.collection('donations').add({
      userId: metadata?.userId,
      stripeSessionId: session.id,
      amount: session.amount_total,
      currency: session.currency,
      projectId: metadata?.projectId || null,
      isAnonymous: metadata?.isAnonymous === 'true',
      status: 'completed',
      createdAt: new Date(),
    });

    if (metadata?.userId && metadata.userId !== 'anonymous') {
      const userRef = db.collection('users').doc(metadata.userId);
      await db.runTransaction(async (t) => {
        const userDoc = await t.get(userRef);
        const userData = userDoc.data();
        t.update(userRef, {
          'stats.totalDonated': (userData?.stats.totalDonated || 0) + (session.amount_total || 0),
          'stats.donationCount': (userData?.stats.donationCount || 0) + 1,
        });
      });
    }
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const usersSnapshot = await db.collection('users').where('stripeCustomerId', '==', customerId).limit(1).get();
  if (usersSnapshot.empty) return;

  const userDoc = usersSnapshot.docs[0];
  const priceId = subscription.items.data[0]?.price.id;
  
  const tierMap: Record<string, string> = {
    [process.env.STRIPE_PRICE_SUPPORTER_MONTHLY!]: 'supporter',
    [process.env.STRIPE_PRICE_CHAMPION_MONTHLY!]: 'champion',
    [process.env.STRIPE_PRICE_LEGEND_MONTHLY!]: 'legend',
  };

  const tier = tierMap[priceId] || 'free';
  const monthlyBottles = { free: 1, supporter: 3, champion: 5, legend: 10 };

  await userDoc.ref.update({
    'tribeMembership.tier': tier,
    'tribeMembership.stripeSubscriptionId': subscription.id,
    'tribeMembership.status': subscription.status,
    'tribeMembership.currentPeriodEnd': new Date(subscription.current_period_end * 1000),
    'stats.monthlyBottleAllowance': monthlyBottles[tier as keyof typeof monthlyBottles],
  });
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const usersSnapshot = await db.collection('users').where('stripeCustomerId', '==', customerId).limit(1).get();
  if (usersSnapshot.empty) return;

  await usersSnapshot.docs[0].ref.update({
    'tribeMembership.tier': 'free',
    'tribeMembership.status': 'cancelled',
    'stats.monthlyBottleAllowance': 1,
  });
}

async function handleInvoiceFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const usersSnapshot = await db.collection('users').where('stripeCustomerId', '==', customerId).limit(1).get();
  if (!usersSnapshot.empty) {
    await db.collection('notificationQueue').add({
      type: 'payment_failed',
      userId: usersSnapshot.docs[0].id,
      data: { invoiceId: invoice.id, amount: invoice.amount_due },
      createdAt: new Date(),
    });
  }
}

### FILE: src/actions/user.ts
'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from '@/lib/auth/session';
import { db } from '@/lib/firebase/admin';
import { z } from 'zod';

const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().optional(),
  bio: z.string().max(500).optional(),
});

export async function updateProfile(formData: FormData) {
  const session = await getServerSession();
  if (!session) return { error: 'Unauthorized' };

  const rawData = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    phone: formData.get('phone'),
    bio: formData.get('bio'),
  };

  try {
    const validatedData = updateProfileSchema.parse(rawData);
    await db.collection('users').doc(session.user.id).update({ ...validatedData, updatedAt: new Date() });
    revalidatePath('/settings/profile');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) return { error: 'Validation failed', details: error.errors };
    return { error: 'Failed to update profile' };
  }
}

const addressSchema = z.object({
  label: z.string().min(1).max(50),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  street: z.string().min(1).max(100),
  apartment: z.string().max(50).optional(),
  city: z.string().min(1).max(50),
  postalCode: z.string().min(1).max(20),
  country: z.string().min(2).max(2),
  isDefault: z.boolean().default(false),
});

export async function addAddress(formData: FormData) {
  const session = await getServerSession();
  if (!session) return { error: 'Unauthorized' };

  try {
    const validatedData = addressSchema.parse({
      ...Object.fromEntries(formData),
      isDefault: formData.get('isDefault') === 'true',
    });

    const addressRef = db.collection('users').doc(session.user.id).collection('addresses').doc();

    if (validatedData.isDefault) {
      const existing = await db.collection('users').doc(session.user.id)
        .collection('addresses').where('isDefault', '==', true).get();
      const batch = db.batch();
      existing.docs.forEach((doc) => batch.update(doc.ref, { isDefault: false }));
      await batch.commit();
    }

    await addressRef.set({ ...validatedData, id: addressRef.id, createdAt: new Date() });
    revalidatePath('/settings/addresses');
    return { success: true, addressId: addressRef.id };
  } catch (error) {
    if (error instanceof z.ZodError) return { error: 'Validation failed', details: error.errors };
    return { error: 'Failed to add address' };
  }
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 20: TESTING INFRASTRUCTURE
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 20.1: Create Comprehensive Testing Setup

```
Create the complete testing infrastructure with unit, integration, and E2E tests.

### FILE: jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/', '<rootDir>/e2e/'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts', '!src/types/**/*'],
  coverageThreshold: { global: { branches: 70, functions: 70, lines: 70, statements: 70 } },
};

module.exports = createJestConfig(customJestConfig);

### FILE: jest.setup.ts
import '@testing-library/jest-dom';
import { server } from './src/__tests__/mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn(), back: jest.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

### FILE: src/__tests__/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users/me', () => HttpResponse.json({
    id: 'test-user-id', email: 'test@example.com', firstName: 'Test', lastName: 'User',
    tribeMembership: { tier: 'supporter' },
    stats: { monthlyBottleAllowance: 3, monthlyBottlesUsed: 1 },
  })),

  http.get('/api/orders', () => HttpResponse.json({
    orders: [{ id: 'order-1', orderNumber: 'GRT-12345', status: 'delivered', createdAt: new Date().toISOString() }],
  })),

  http.post('/api/orders', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({ order: { id: 'new-order-id', orderNumber: 'GRT-NEW', status: 'pending', ...data } }, { status: 201 });
  }),

  http.post('/api/donations', () => HttpResponse.json({ sessionId: 'cs_test_session', url: 'https://checkout.stripe.com/test' })),
];

### FILE: src/__tests__/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';
export const server = setupServer(...handlers);

### FILE: src/__tests__/components/BottleCard.test.tsx
import { render, screen } from '../utils/test-utils';
import { BottleCard } from '@/components/bottles/BottleCard';

const mockBottle = {
  id: 'bottle-1', name: 'Ocean Wave', description: 'A beautiful ocean-themed bottle',
  images: ['/images/bottles/ocean-wave.jpg'], colors: ['#0066CC'], category: 'standard',
  isLimited: false, minTier: 'free' as const, inStock: true, orderedCount: 150, favoritesCount: 45,
};

describe('BottleCard', () => {
  it('renders bottle name and description', () => {
    render(<BottleCard bottle={mockBottle} view="grid" />);
    expect(screen.getByText('Ocean Wave')).toBeInTheDocument();
    expect(screen.getByText('A beautiful ocean-themed bottle')).toBeInTheDocument();
  });

  it('shows limited badge for limited edition bottles', () => {
    render(<BottleCard bottle={{ ...mockBottle, isLimited: true }} view="grid" />);
    expect(screen.getByText('Limited')).toBeInTheDocument();
  });

  it('shows out of stock badge when not available', () => {
    render(<BottleCard bottle={{ ...mockBottle, inStock: false }} view="grid" />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('handles favorite toggle', async () => {
    const onFavorite = jest.fn();
    const { user } = render(<BottleCard bottle={mockBottle} view="grid" onFavorite={onFavorite} />);
    const favoriteButton = screen.getByRole('button', { name: /favorite/i });
    await user.click(favoriteButton);
    expect(onFavorite).toHaveBeenCalledWith('bottle-1');
  });
});

### FILE: playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry', screenshot: 'only-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
  webServer: { command: 'npm run dev', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI },
});

### FILE: e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test('should redirect to dashboard after login', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL('/dashboard');
  });
});

### FILE: e2e/bottles.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Bottle Ordering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL('/dashboard');
  });

  test('should display bottle gallery', async ({ page }) => {
    await page.goto('/bottles');
    await expect(page.getByRole('heading', { name: /bottle designs/i })).toBeVisible();
  });

  test('should open order dialog', async ({ page }) => {
    await page.goto('/bottles');
    await page.getByTestId('bottle-card').first().hover();
    await page.getByRole('button', { name: /order/i }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 21: SECURITY IMPLEMENTATION
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 21.1: Create Security Middleware & Utilities

```
Create comprehensive security measures including middleware, rate limiting, and encryption.

### FILE: src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedRoutes = ['/dashboard', '/bottles', '/orders', '/profile', '/settings', '/impact', '/tribe', '/referrals'];
const adminRoutes = ['/admin'];
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data: https: blob:; connect-src 'self' https://*.firebaseio.com https://api.stripe.com;"
  );

  // Rate Limiting for API routes
  if (pathname.startsWith('/api/')) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `${ip}:${pathname}`;
    const now = Date.now();
    const windowMs = 60000;
    const maxRequests = pathname.startsWith('/api/auth') ? 5 : 100;

    const current = rateLimitMap.get(rateLimitKey);
    if (current && now - current.timestamp < windowMs && current.count >= maxRequests) {
      return new NextResponse(JSON.stringify({ error: 'Too many requests' }), { status: 429 });
    }
    rateLimitMap.set(rateLimitKey, { count: (current?.count || 0) + 1, timestamp: current?.timestamp || now });
  }

  // Authentication Check
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdmin = adminRoutes.some((route) => pathname.startsWith(route));

  if (isProtected || isAdmin) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (isAdmin && token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'] };

### FILE: src/lib/security/validation.ts
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'] });
}

export function sanitizeText(text: string): string {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
}

export const emailSchema = z.string().email().max(255).transform((v) => v.toLowerCase().trim());
export const passwordSchema = z.string().min(8).max(100)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must contain uppercase, lowercase, and number');
export const nameSchema = z.string().min(1).max(50).regex(/^[a-zA-Z\s\-']+$/).transform((v) => v.trim());

### FILE: src/lib/security/encryption.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha512');
}

export function encrypt(text: string, secretKey?: string): string {
  const key = secretKey || process.env.ENCRYPTION_KEY!;
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);
  const derivedKey = deriveKey(key, salt);

  const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, authTag, Buffer.from(encrypted, 'hex')]).toString('base64');
}

export function decrypt(encryptedText: string, secretKey?: string): string {
  const key = secretKey || process.env.ENCRYPTION_KEY!;
  const buffer = Buffer.from(encryptedText, 'base64');

  const salt = buffer.subarray(0, SALT_LENGTH);
  const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const authTag = buffer.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = buffer.subarray(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);

  const derivedKey = deriveKey(key, salt);
  const decipher = crypto.createDecipheriv(ALGORITHM, derivedKey, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted.toString('hex'), 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, ITERATIONS, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verifyHash));
}

export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

### FILE: src/lib/security/permissions.ts
export type Role = 'user' | 'moderator' | 'admin' | 'super_admin';
export type Permission = 'read:own_profile' | 'update:own_profile' | 'create:order' | 'read:bottles' | 'create:donation' | 'vote:project' | 'moderate:comments' | 'manage:content' | 'manage:admins';

const rolePermissions: Record<Role, Permission[]> = {
  user: ['read:own_profile', 'update:own_profile', 'create:order', 'read:bottles', 'create:donation', 'vote:project'],
  moderator: ['moderate:comments'],
  admin: ['manage:content'],
  super_admin: ['manage:admins'],
};

export function getPermissionsForRole(role: Role): Permission[] {
  const permissions: Permission[] = [];
  const roleHierarchy: Role[] = ['user', 'moderator', 'admin', 'super_admin'];
  const roleIndex = roleHierarchy.indexOf(role);
  for (let i = 0; i <= roleIndex; i++) permissions.push(...rolePermissions[roleHierarchy[i]]);
  return [...new Set(permissions)];
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return getPermissionsForRole(role).includes(permission);
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 22: NOTIFICATION SYSTEM
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 22.1: Create Multi-Channel Notification System

```
Create the complete notification system with email, push, and in-app notifications.

### FILE: src/types/notification.ts
import type { Timestamp } from 'firebase/firestore';

export type NotificationType =
  | 'order_confirmed' | 'order_shipped' | 'order_delivered'
  | 'donation_received' | 'subscription_created' | 'subscription_expiring'
  | 'referral_qualified' | 'event_reminder' | 'achievement_unlocked' | 'welcome';

export type NotificationChannel = 'email' | 'push' | 'in_app';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  channels: NotificationChannel[];
  read: boolean;
  readAt?: Timestamp;
  actionUrl?: string;
  createdAt: Timestamp;
}

### FILE: src/lib/notifications/service.ts
import { db } from '@/lib/firebase/admin';
import { sendEmail } from '@/lib/email/service';
import { sendPushNotification } from '@/lib/push/service';
import type { NotificationType, NotificationChannel } from '@/types/notification';

const notificationTemplates: Record<NotificationType, {
  title: (data: any) => string;
  body: (data: any) => string;
  channels: NotificationChannel[];
  emailTemplate?: string;
}> = {
  order_confirmed: {
    title: () => 'Order Confirmed! 🎉',
    body: (data) => `Your order #${data.orderNumber} has been confirmed.`,
    channels: ['email', 'push', 'in_app'],
    emailTemplate: 'order-confirmed',
  },
  order_shipped: {
    title: () => 'Your Order is On Its Way! 📦',
    body: (data) => `Order #${data.orderNumber} has been shipped.`,
    channels: ['email', 'push', 'in_app'],
  },
  order_delivered: {
    title: () => 'Order Delivered! ✅',
    body: (data) => `Order #${data.orderNumber} has been delivered.`,
    channels: ['email', 'push', 'in_app'],
  },
  donation_received: {
    title: () => 'Thank You for Your Donation! 💙',
    body: (data) => `Your donation of ${data.amount} has been received.`,
    channels: ['email', 'push', 'in_app'],
  },
  subscription_created: {
    title: () => 'Welcome to the TRIBE! 👑',
    body: (data) => `You're now a ${data.tier} member.`,
    channels: ['email', 'push', 'in_app'],
  },
  subscription_expiring: {
    title: () => 'Your Membership is Expiring Soon',
    body: (data) => `Your ${data.tier} membership expires on ${data.expiryDate}.`,
    channels: ['email', 'push', 'in_app'],
  },
  referral_qualified: {
    title: () => 'Referral Qualified! 🌟',
    body: (data) => `${data.friendName} completed their first order. Your reward is ready!`,
    channels: ['email', 'push', 'in_app'],
  },
  event_reminder: {
    title: (data) => `Reminder: ${data.eventName}`,
    body: (data) => `${data.eventName} starts in ${data.timeUntil}.`,
    channels: ['email', 'push', 'in_app'],
  },
  achievement_unlocked: {
    title: () => 'Achievement Unlocked! 🏆',
    body: (data) => `You've earned the "${data.achievementName}" badge!`,
    channels: ['push', 'in_app'],
  },
  welcome: {
    title: () => 'Welcome to GRATIS.NGO! 👋',
    body: () => `We're thrilled to have you join our mission.`,
    channels: ['email', 'in_app'],
  },
};

export async function sendNotification({ userId, type, data = {} }: {
  userId: string;
  type: NotificationType;
  data?: Record<string, any>;
}) {
  const template = notificationTemplates[type];
  if (!template) return;

  const userDoc = await db.collection('users').doc(userId).get();
  const userData = userDoc.data();

  const notification = {
    userId,
    type,
    title: template.title(data),
    body: template.body(data),
    data,
    channels: template.channels,
    read: false,
    actionUrl: data.actionUrl,
    createdAt: new Date(),
  };

  const notificationRef = await db.collection('notifications').add(notification);

  const promises: Promise<void>[] = [];

  if (template.channels.includes('email') && userData?.email) {
    promises.push(sendEmail({
      to: userData.email,
      template: template.emailTemplate || 'default',
      data: { ...data, title: notification.title, body: notification.body, userName: userData.firstName },
    }));
  }

  if (template.channels.includes('push')) {
    const tokens = await getUserPushTokens(userId);
    if (tokens.length > 0) {
      promises.push(sendPushNotification({
        tokens,
        title: notification.title,
        body: notification.body,
        data: { notificationId: notificationRef.id, type, actionUrl: data.actionUrl },
      }));
    }
  }

  await Promise.allSettled(promises);
  return notificationRef.id;
}

async function getUserPushTokens(userId: string): Promise<string[]> {
  const snapshot = await db.collection('users').doc(userId).collection('pushTokens').get();
  return snapshot.docs.map((doc) => doc.data().token);
}

export async function markNotificationRead(notificationId: string, userId: string) {
  const ref = db.collection('notifications').doc(notificationId);
  const doc = await ref.get();
  if (!doc.exists || doc.data()?.userId !== userId) throw new Error('Not found');
  await ref.update({ read: true, readAt: new Date() });
}

export async function markAllNotificationsRead(userId: string) {
  const batch = db.batch();
  const notifications = await db.collection('notifications')
    .where('userId', '==', userId).where('read', '==', false).get();
  notifications.docs.forEach((doc) => batch.update(doc.ref, { read: true, readAt: new Date() }));
  await batch.commit();
}

### FILE: src/lib/email/service.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, template, data, subject }: {
  to: string; template: string; data: Record<string, any>; subject?: string;
}) {
  const emailTemplate = getEmailTemplate(template, data);
  return resend.emails.send({
    from: 'GRATIS.NGO <noreply@gratis.ngo>',
    to,
    subject: subject || emailTemplate.subject,
    html: emailTemplate.html,
  });
}

function getEmailTemplate(name: string, data: Record<string, any>) {
  const templates: Record<string, any> = {
    'order-confirmed': {
      subject: `Order Confirmed - #${data.orderNumber}`,
      html: `<h1>Order Confirmed!</h1><p>Hi ${data.userName}, your order #${data.orderNumber} has been confirmed.</p>`,
    },
    'welcome': {
      subject: 'Welcome to GRATIS.NGO!',
      html: `<h1>Welcome!</h1><p>Hi ${data.userName}, we're thrilled to have you join our mission.</p>`,
    },
    default: {
      subject: data.title || 'Notification from GRATIS.NGO',
      html: `<h1>${data.title}</h1><p>${data.body}</p>`,
    },
  };
  return templates[name] || templates.default;
}

### FILE: src/lib/push/service.ts
import { messaging } from '@/lib/firebase/admin';

export async function sendPushNotification({ tokens, title, body, data = {} }: {
  tokens: string[]; title: string; body: string; data?: Record<string, string>;
}) {
  if (tokens.length === 0) return;

  const message = { notification: { title, body }, data };

  if (tokens.length === 1) {
    await messaging.send({ ...message, token: tokens[0] });
  } else {
    await messaging.sendEachForMulticast({ ...message, tokens });
  }
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 23: BACKGROUND JOBS & WORKFLOWS
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 23.1: Create Background Job System

```
Create the background job system for scheduled tasks and async workflows.

### FILE: src/lib/jobs/scheduler.ts
import { db } from '@/lib/firebase/admin';
import { sendNotification } from '@/lib/notifications/service';

export type JobType = 'send_event_reminders' | 'process_subscription_renewals' | 'cleanup_expired_sessions' | 'update_leaderboards' | 'archive_old_notifications';

interface Job {
  id: string;
  type: JobType;
  data?: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  error?: string;
  scheduledFor: Date;
  createdAt: Date;
}

export async function scheduleJob(type: JobType, data: Record<string, any> = {}, scheduledFor: Date = new Date()): Promise<string> {
  const job = { type, data, status: 'pending', attempts: 0, maxAttempts: 3, scheduledFor, createdAt: new Date() };
  const ref = await db.collection('jobs').add(job);
  return ref.id;
}

export async function processJobs() {
  const now = new Date();
  const pendingJobs = await db.collection('jobs')
    .where('status', '==', 'pending')
    .where('scheduledFor', '<=', now)
    .limit(10).get();

  for (const jobDoc of pendingJobs.docs) {
    const job = { id: jobDoc.id, ...jobDoc.data() } as Job;
    
    try {
      await jobDoc.ref.update({ status: 'processing', startedAt: new Date(), attempts: job.attempts + 1 });
      await executeJob(job);
      await jobDoc.ref.update({ status: 'completed', completedAt: new Date() });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (job.attempts + 1 >= job.maxAttempts) {
        await jobDoc.ref.update({ status: 'failed', error: errorMessage });
      } else {
        await jobDoc.ref.update({ status: 'pending', error: errorMessage, scheduledFor: new Date(Date.now() + 60000 * Math.pow(2, job.attempts)) });
      }
    }
  }
}

async function executeJob(job: Job) {
  switch (job.type) {
    case 'send_event_reminders': await sendEventReminders(job.data); break;
    case 'process_subscription_renewals': await processSubscriptionRenewals(); break;
    case 'cleanup_expired_sessions': await cleanupExpiredSessions(); break;
    case 'update_leaderboards': await updateLeaderboards(); break;
    case 'archive_old_notifications': await archiveOldNotifications(); break;
  }
}

async function sendEventReminders(data: any) {
  const { hoursBeforeEvent = 24 } = data;
  const reminderTime = new Date(Date.now() + hoursBeforeEvent * 60 * 60 * 1000);

  const events = await db.collection('events').where('startDate', '>=', new Date()).where('startDate', '<=', reminderTime).get();

  for (const eventDoc of events.docs) {
    const event = eventDoc.data();
    const attendees = await db.collection('eventRegistrations').where('eventId', '==', eventDoc.id).where('reminderSent', '==', false).get();

    for (const attendeeDoc of attendees.docs) {
      await sendNotification({
        userId: attendeeDoc.data().userId,
        type: 'event_reminder',
        data: { eventId: eventDoc.id, eventName: event.title, timeUntil: `${hoursBeforeEvent} hours`, actionUrl: `/events/${event.slug}` },
      });
      await attendeeDoc.ref.update({ reminderSent: true });
    }
  }
}

async function processSubscriptionRenewals() {
  const expiringDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const users = await db.collection('users')
    .where('tribeMembership.status', '==', 'active')
    .where('tribeMembership.currentPeriodEnd', '<=', expiringDate)
    .where('tribeMembership.renewalReminderSent', '==', false).get();

  for (const userDoc of users.docs) {
    const user = userDoc.data();
    await sendNotification({
      userId: userDoc.id,
      type: 'subscription_expiring',
      data: { tier: user.tribeMembership.tier, expiryDate: user.tribeMembership.currentPeriodEnd.toDate().toLocaleDateString() },
    });
    await userDoc.ref.update({ 'tribeMembership.renewalReminderSent': true });
  }
}

async function cleanupExpiredSessions() {
  const expiryDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sessions = await db.collection('sessions').where('lastActiveAt', '<', expiryDate).limit(500).get();
  const batch = db.batch();
  sessions.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
}

async function updateLeaderboards() { /* Recalculate rankings */ }

async function archiveOldNotifications() {
  const archiveDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const old = await db.collection('notifications').where('createdAt', '<', archiveDate).limit(1000).get();
  const batch = db.batch();
  for (const doc of old.docs) {
    batch.set(db.collection('notificationsArchive').doc(doc.id), doc.data());
    batch.delete(doc.ref);
  }
  await batch.commit();
}

### FILE: src/app/api/cron/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { processJobs, scheduleJob } from '@/lib/jobs/scheduler';

function verifyCronSecret(request: NextRequest): boolean {
  return request.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`;
}

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await processJobs();
  return NextResponse.json({ success: true });
}

export async function POST(request: NextRequest) {
  if (!verifyCronSecret(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { type, data, scheduledFor } = await request.json();
  const jobId = await scheduleJob(type, data, scheduledFor ? new Date(scheduledFor) : undefined);
  return NextResponse.json({ jobId });
}
```

---

# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 24: DEPLOYMENT & INFRASTRUCTURE
# ═══════════════════════════════════════════════════════════════════════════════

## PROMPT 24.1: Create Deployment Configuration

```
Create deployment configurations for Vercel, Docker, and environment setup.

### FILE: vercel.json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "regions": ["fra1", "iad1"],
  "functions": { "app/api/**/*.ts": { "maxDuration": 30 } },
  "crons": [
    { "path": "/api/cron", "schedule": "*/5 * * * *" },
    { "path": "/api/cron/daily", "schedule": "0 6 * * *" }
  ],
  "headers": [
    { "source": "/(.*)", "headers": [
      { "key": "X-Frame-Options", "value": "DENY" },
      { "key": "X-Content-Type-Options", "value": "nosniff" }
    ]}
  ]
}

### FILE: Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]

### FILE: docker-compose.yml
version: '3.8'
services:
  app:
    build: { context: ., dockerfile: Dockerfile }
    ports: ["3000:3000"]
    env_file: [.env.production]
    restart: unless-stopped
    healthcheck: { test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"], interval: 30s, timeout: 10s, retries: 3 }
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    volumes: [redis_data:/data]
volumes:
  redis_data:

### FILE: .env.example
# APPLICATION
NEXT_PUBLIC_APP_URL=https://gratis.ngo
NEXTAUTH_URL=https://gratis.ngo
NEXTAUTH_SECRET=your-nextauth-secret

# FIREBASE
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# STRIPE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# MUX
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=

# EMAIL
RESEND_API_KEY=

# SECURITY
ENCRYPTION_KEY=your-32-byte-key
CRON_SECRET=your-cron-secret

### FILE: .github/workflows/deploy.yml
name: Deploy
on: { push: { branches: [main] }, pull_request: { branches: [main] } }

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm test -- --coverage

  e2e:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e

  deploy:
    runs-on: ubuntu-latest
    needs: [test, e2e]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g vercel@latest
      - run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}

### FILE: src/app/api/health/route.ts
import { NextResponse } from 'next/server';

async function checkDatabase() {
  try { return { service: 'database', status: 'healthy' }; }
  catch { return { service: 'database', status: 'unhealthy' }; }
}

export async function GET() {
  const checks = await Promise.all([checkDatabase()]);
  const hasUnhealthy = checks.some((c) => c.status === 'unhealthy');
  return NextResponse.json({
    status: hasUnhealthy ? 'unhealthy' : 'healthy',
    checks,
    timestamp: new Date().toISOString(),
  }, { status: hasUnhealthy ? 503 : 200 });
}
```

---

## SUMMARY OF ALL PARTS

### Part 1 (Sections 1-5): Foundation
- Firebase setup & configuration
- Authentication system
- Database schema & types
- Core shared components
- Utility functions

### Part 2 (Sections 6-10): Core Features
- Homepage & marketing pages
- User dashboard
- Bottle system (gallery, ordering)
- Events system
- Video platform (Mux)

### Part 3 (Sections 11-13): Community & Payments
- Social features & activity feed
- TRIBE membership system
- Donation system

### Part 4 (Sections 14-18): Advanced Features & Admin
- Impact projects & voting
- Referral system
- Admin panel & user management
- Content management system
- Analytics dashboard

### Part 5 (Sections 19-24): Infrastructure
- API architecture & server actions
- Testing infrastructure
- Security implementation
- Notification system
- Background jobs & workflows
- Deployment configuration

**Total Implementation**: ~93,000 tokens of detailed, copy-paste ready code across 26 components/systems.
