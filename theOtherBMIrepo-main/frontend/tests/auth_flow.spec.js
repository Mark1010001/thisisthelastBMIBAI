import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test('should sign up and redirect to dashboard', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // Switch to Sign Up mode
    await page.click('text=Don\'t have an account? Sign Up');

    // Fill signup form with unique username
    const username = 'user_' + Math.random().toString(36).substring(7);
    await page.fill('input[placeholder="Enter your full name"]', 'John Doe');
    await page.fill('input[placeholder="Enter your username"]', username);
    await page.fill('input[placeholder="Enter your password"]', 'password123');

    // Submit
    await page.click('button:has-text("Create Account")');

    // Verify redirection to dashboard
    await expect(page.locator('text=Population Patterns Dashboard')).toBeVisible({ timeout: 15000 });

    await page.screenshot({ path: 'signup_success.png' });
  });

  test('should login with existing account', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // Fill login form (default admin)
    await page.fill('input[placeholder="Enter your username"]', 'admin');
    await page.fill('input[placeholder="Enter your password"]', 'admin123');

    // Submit
    await page.click('button:has-text("Sign In")');

    // Verify dashboard
    await expect(page.locator('text=Population Patterns Dashboard')).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: 'login_success.png' });
  });

  test('should continue as guest', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // Click Guest Access
    await page.click('button:has-text("Guest Access")');

    // Verify dashboard
    await expect(page.locator('text=Population Patterns Dashboard')).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: 'guest_success.png' });
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.fill('input[placeholder="Enter your username"]', 'invalid_user_99');
    await page.fill('input[placeholder="Enter your password"]', 'wrong');
    await page.click('button:has-text("Sign In")');

    await expect(page.locator('text=Invalid username or password')).toBeVisible();
    await page.screenshot({ path: 'auth_error.png' });
  });
});
