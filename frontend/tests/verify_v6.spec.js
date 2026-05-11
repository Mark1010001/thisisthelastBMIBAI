import { test, expect } from '@playwright/test';

test('verify v6 sidebar refinements', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Wait for sidebar to be visible
  await expect(page.locator('aside')).toBeVisible();

  // Enter values to trigger results
  await page.locator('input[type="number"]').nth(0).fill('20'); // Age
  await page.locator('input[type="number"]').nth(1).fill('84'); // Weight
  await page.locator('input[type="number"]').nth(2).fill('190'); // Height
  await page.locator('input[type="number"]').nth(3).fill('92'); // Hip

  // Wait for results to appear
  await expect(page.getByText('LIVE CALCULATION RESULTS')).toBeVisible();

  // Capture the sidebar area
  const sidebar = page.locator('aside');

  // Full sidebar screenshot (might need to scroll)
  await sidebar.screenshot({ path: 'verification/final_v6_sidebar_full.png' });

  // Scroll to bottom of sidebar and capture
  const scrollable = page.locator('aside .custom-scrollbar');
  await scrollable.evaluate(e => e.scrollTop = e.scrollHeight);
  await page.waitForTimeout(500);
  await sidebar.screenshot({ path: 'verification/final_v6_sidebar_bottom.png' });
});
