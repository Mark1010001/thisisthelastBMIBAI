import { test, expect } from '@playwright/test';

test('verify specific user case 23.3 BMI', async ({ page }) => {
  // Login
  await page.goto('http://localhost:5173');
  await page.fill('input[placeholder="Enter your username"]', 'admin');
  await page.fill('input[placeholder="Enter your password"]', 'admin123');
  await page.click('button:has-text("Sign In")');

  // Wait for sidebar
  await expect(page.locator('aside')).toBeVisible();

  // Fill in user data: 20y, 84kg, 190cm, 92cm hip
  await page.locator('input[type="number"]').nth(0).fill('20');
  await page.locator('input[type="number"]').nth(1).fill('84');
  await page.locator('input[type="number"]').nth(2).fill('190');
  await page.locator('input[type="number"]').nth(3).fill('92');

  // Wait for results
  await expect(page.getByText('LIVE CALCULATION RESULTS')).toBeVisible();

  // Verify BMI 23.3 and BAI 17.1%
  const bmiVal = page.locator('p:has-text("YOUR BMI") + p');
  await expect(bmiVal).toHaveText('23.3');

  const baiVal = page.locator('p:has-text("YOUR BAI") + p');
  await expect(baiVal).toHaveText('17.1%');

  // Verify status is Healthy/Normal in the sidebar results area
  const resultsArea = page.locator('section:has-text("LIVE CALCULATION RESULTS")');
  await expect(resultsArea.locator('p:has-text("Normal")')).toBeVisible();
  await expect(resultsArea.locator('p:has-text("HEALTHY")')).toBeVisible();

  // Scroll to results and capture
  await resultsArea.scrollIntoViewIfNeeded();
  await page.locator('aside').screenshot({ path: 'verification/user_benchmark_sidebar_results.png' });
});
