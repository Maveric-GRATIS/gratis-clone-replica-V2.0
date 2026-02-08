// e2e/pages/DashboardPage.ts
// Page Object Model for Dashboard

import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly statsCards: Locator;
  readonly recentVideos: Locator;
  readonly uploadButton: Locator;
  readonly notificationBell: Locator;
  readonly profileMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /dashboard/i });
    this.statsCards = page.locator('[data-testid="stats-card"]');
    this.recentVideos = page.locator('[data-testid="recent-videos"]');
    this.uploadButton = page.getByRole('button', { name: /upload/i });
    this.notificationBell = page.locator('button[aria-label*="notification"]');
    this.profileMenu = page.locator('[data-testid="profile-menu"]');
  }

  async goto() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async clickUpload() {
    await this.uploadButton.click();
  }

  async openNotifications() {
    await this.notificationBell.click();
  }

  async getStatsCount() {
    return await this.statsCards.count();
  }
}
