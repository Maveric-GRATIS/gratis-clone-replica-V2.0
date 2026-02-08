# E2E Testing with Playwright

This directory contains end-to-end tests for the GRATIS.NGO platform using Playwright.

## 📁 Structure

```
e2e/
├── fixtures/
│   └── auth.ts          # Authentication fixtures for test setup
├── pages/
│   └── DashboardPage.ts # Page Object Model for Dashboard
└── tests/
    ├── auth.spec.ts           # Authentication flow tests
    └── video-upload.spec.ts   # Video upload flow tests
```

## 🚀 Getting Started

### Installation

1. Install Playwright:
```bash
npm install
```

2. Install browser binaries (first time only):
```bash
npx playwright install
```

## 🧪 Running Tests

**IMPORTANT**: Start the development server first in a separate terminal:
```bash
npm run dev
```

Then run tests in another terminal:

### Run all tests:
```bash
npm run test:e2e
```

### Run with UI mode (interactive):
```bash
npm run test:e2e:ui
```

### Run in headed mode (see browser):
```bash
npm run test:e2e:headed
```

### Debug tests:
```bash
npm run test:e2e:debug
```

### Run only Chromium tests (faster):
```bash
npm run test:e2e:chromium
```

### Run specific test file:
```bash
npx playwright test e2e/tests/auth.spec.ts
```

### Run in specific browser:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 📊 View Test Results

### Open HTML report:
```bash
npx playwright show-report
```

### View traces (for failed tests):
```bash
npx playwright show-trace trace.zip
```

## 📝 Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test('should do something', async ({ page }) => {
  await page.goto('/some-page');
  await expect(page.locator('h1')).toContainText('Expected Text');
});
```

### Using Authentication Fixtures

```typescript
import { test, expect } from '../fixtures/auth';

test('should access protected page', async ({ page, authenticatedUser }) => {
  // User is already logged in
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/.*dashboard/);
});
```

### Using Page Objects

```typescript
import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';

test('should navigate dashboard', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.goto();
  await dashboard.clickUpload();

  await expect(page).toHaveURL(/.*upload/);
});
```

## 🎯 Test Users

Pre-configured test users in `fixtures/auth.ts`:

- **Regular User**:
  - Email: `test@gratis.ngo`
  - Password: `TestPassword123!`

- **Admin User**:
  - Email: `admin@gratis.ngo`
  - Password: `AdminPassword123!`

- **Creator**:
  - Email: `creator@gratis.ngo`
  - Password: `CreatorPassword123!`

## 🌐 Browsers Tested

- ✅ Desktop Chrome (Chromium)
- ✅ Desktop Firefox
- ✅ Desktop Safari (WebKit)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

## 📋 Current Test Coverage

### Authentication (`auth.spec.ts`):
- ✅ Display login page
- ✅ Show validation errors
- ✅ Login with valid credentials
- ✅ Show error for invalid credentials
- ✅ Navigate to register page
- ✅ Logout successfully

### Video Upload (`video-upload.spec.ts`):
- ✅ Display upload page
- ✅ Validate file type
- ✅ Show upload progress
- ✅ Complete upload and fill details
- ✅ Save as draft
- ✅ Show upload limits
- ✅ Navigate from dashboard

## 🔧 Configuration

See `playwright.config.ts` for:
- Base URL configuration
- Timeout settings
- Retry policies
- Screenshot/video settings
- Browser configurations
- Test reporter settings

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [API Reference](https://playwright.dev/docs/api/class-test)

## 🐛 Troubleshooting

### Tests fail on first run
Make sure the development server is running:
```bash
npm run dev
```

### Browser binaries not found
Install them:
```bash
npx playwright install
```

### Tests timeout
Increase timeout in `playwright.config.ts`:
```typescript
use: {
  timeout: 60000, // 60 seconds
}
```

### Need to update snapshots
```bash
npx playwright test --update-snapshots
```

## 📦 CI/CD Integration

For GitHub Actions:
```yaml
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e:ci

- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## ✨ Tips

1. **Use Page Objects**: Encapsulate page interactions for reusability
2. **Fixtures**: Share common setup logic across tests
3. **Selectors**: Prefer text-based and role-based selectors over CSS
4. **Assertions**: Use Playwright's auto-waiting assertions
5. **Isolation**: Each test should be independent
6. **Data**: Use test data that doesn't conflict with real data

---

*Part of GRATIS.NGO Part 15 - Enterprise Testing Infrastructure*
