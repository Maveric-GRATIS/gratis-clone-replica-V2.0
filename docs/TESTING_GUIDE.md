# Testing Infrastructure Guide

## Overview

This guide covers testing setup and best practices for the GRATIS NGO platform using Vitest, React Testing Library, and Playwright.

---

## 🧪 Testing Stack

### Unit & Integration Testing
- **Vitest**: Fast unit testing framework (Vite-native)
- **React Testing Library**: Component testing with user-centric approach
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom matchers for DOM assertions

### E2E Testing
- **Playwright**: Cross-browser end-to-end testing
- **@playwright/test**: Playwright test runner

### API Mocking
- **MSW (Mock Service Worker)**: API request mocking for both browser and Node.js

---

## 📦 Installation

```bash
# Install testing dependencies
npm install -D vitest @vitest/ui
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D jsdom
npm install -D @playwright/test
npm install -D msw

# Initialize Playwright
npx playwright install
```

---

## ⚙️ Configuration

### 1. Vitest Configuration (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/',
        'dist/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 2. Test Setup File (`src/test/setup.ts`)

```typescript
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock Firebase Auth
vi.mock('@/firebase', () => ({
  auth: {},
  db: {},
  storage: {},
  analytics: {},
}));
```

### 3. Playwright Configuration (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8081',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8081',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 4. MSW Setup (`src/test/mocks/handlers.ts`)

```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock Stripe API
  http.post('/api/create-payment-intent', () => {
    return HttpResponse.json({
      clientSecret: 'pi_test_secret_123',
    });
  }),

  // Mock user data
  http.get('/api/user/:userId', ({ params }) => {
    return HttpResponse.json({
      id: params.userId,
      name: 'Test User',
      email: 'test@example.com',
    });
  }),

  // Add more handlers as needed
];
```

### 5. MSW Browser Setup (`src/test/mocks/browser.ts`)

```typescript
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

---

## 📝 Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

---

## 🧪 Writing Tests

### Unit Test Example (Component)

```typescript
// src/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Integration Test Example (Form)

```typescript
// src/components/LoginForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from './LoginForm';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('LoginForm', () => {
  it('submits form with valid credentials', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    renderWithRouter(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('shows validation errors for invalid email', async () => {
    const user = userEvent.setup();

    renderWithRouter(<LoginForm onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });
});
```

### E2E Test Example (Playwright)

```typescript
// src/test/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can sign up', async ({ page }) => {
    await page.goto('/signup');

    await page.fill('input[name="email"]', 'newuser@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.fill('input[name="confirmPassword"]', 'SecurePass123!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('user can login', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });
});
```

---

## 🎯 Testing Best Practices

### 1. Test User Behavior, Not Implementation
```typescript
// ❌ Bad - testing implementation details
expect(component.state.isOpen).toBe(true);

// ✅ Good - testing user-visible behavior
expect(screen.getByRole('dialog')).toBeVisible();
```

### 2. Use Accessible Queries
```typescript
// Priority order:
screen.getByRole('button', { name: /submit/i })  // Best
screen.getByLabelText(/email/i)                   // Good for forms
screen.getByText(/welcome/i)                       // Good for text
screen.getByTestId('custom-element')               // Last resort
```

### 3. Wait for Async Changes
```typescript
// ❌ Bad
await user.click(button);
expect(screen.getByText('Success')).toBeInTheDocument();

// ✅ Good
await user.click(button);
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

### 4. Clean Up Side Effects
```typescript
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
```

### 5. Mock External Dependencies
```typescript
vi.mock('@/lib/services/notificationService', () => ({
  notificationService: {
    create: vi.fn(),
    getUserNotifications: vi.fn().mockResolvedValue([]),
  },
}));
```

---

## 📊 Coverage Goals

Aim for these coverage targets:
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

Focus on:
1. Critical user flows (auth, checkout, donations)
2. Business logic (calculations, validations)
3. Error handling
4. Edge cases

---

## 🚀 CI/CD Integration

### GitHub Actions Example (`.github/workflows/test.yml`)

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:run

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## 🐛 Debugging Tests

### Vitest UI
```bash
npm run test:ui
```
Opens interactive UI at `http://localhost:51204/__vitest__/`

### Playwright Debug Mode
```bash
npm run test:e2e:debug
```
Opens Playwright Inspector for step-by-step debugging

### Screen Debug
```typescript
import { screen } from '@testing-library/react';

// Log entire DOM
screen.debug();

// Log specific element
screen.debug(screen.getByRole('button'));
```

---

## 📚 Key Testing Scenarios

### 1. Authentication Flow
- Sign up with valid/invalid data
- Login with correct/incorrect credentials
- Password reset
- Email verification
- Social login (Google, Facebook)

### 2. Shopping Cart
- Add/remove products
- Update quantities
- Apply discount codes
- Calculate totals
- Checkout flow

### 3. Donations
- One-time donation
- Recurring donation
- Custom amount validation
- Payment processing
- Confirmation email

### 4. Forms
- Input validation
- Error messages
- Success feedback
- File uploads
- Multi-step forms

### 5. Routing
- Navigation between pages
- Protected routes
- 404 pages
- Redirects after login

### 6. Accessibility
- Keyboard navigation
- Screen reader support
- Color contrast
- Focus management
- ARIA attributes

---

## 🎓 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Next Steps**: Set up testing infrastructure and start writing tests for critical features.

