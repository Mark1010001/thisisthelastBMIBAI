import { test, expect } from '@playwright/test';

test('verify authentication flow', async ({ page }) => {
  // Clear local storage to ensure we start from login
  await page.goto('http://localhost:5173');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // 1. Verify we are on login page
  await expect(page.locator('h1')).toHaveText('HealthAnalytics');
  await expect(page.locator('p').filter({ hasText: 'Secure Access Gateway' })).toBeVisible();
  await page.screenshot({ path: 'verification/login_page.png' });

  // 2. Perform login
  await page.fill('input[placeholder="Enter your username"]', 'admin');
  await page.fill('input[placeholder="Enter your password"]', 'admin123');
  await page.click('button:has-text("Sign In")');

  // 3. Verify we are on the dashboard
  await expect(page.locator('aside')).toBeVisible();
  await expect(page.locator('h1').filter({ hasText: 'HealthAnalytics' }).first()).toBeVisible();
  await page.screenshot({ path: 'verification/dashboard_after_login.png' });

  // 4. Verify logout button exists and works
  const logoutBtn = page.locator('button[title="Sign Out"]');
  await expect(logoutBtn).toBeVisible();
  await logoutBtn.click();

  // 5. Verify we are back to login
  await expect(page.locator('p').filter({ hasText: 'Secure Access Gateway' })).toBeVisible();
  await page.screenshot({ path: 'verification/back_to_login.png' });
});
