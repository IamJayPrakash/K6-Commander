import { test, expect } from '@playwright/test';

test('should navigate to the home page', async ({ page }) => {
  // Start from the index page (the baseURL is set in the playwright.config.ts)
  await page.goto('/');
  // The page should contain an h1 with "New Test Run"
  await expect(page.locator('h1')).toContainText('New Test Run');
});

test('should have the correct page title', async ({ page }) => {
  await page.goto('/');
  // The page should have the correct title
  await expect(page).toHaveTitle(/K6 Commander/);
});

test('should navigate to the about page', async ({ page }) => {
  await page.goto('/');
  // Click the about link
  await page.getByTestId('header-about-link').click();
  // The page should contain an h1 with "About K6 Commander"
  await expect(page.locator('h1')).toContainText('About K6 Commander');
  await expect(page).toHaveURL('/about');
});

test('should navigate to the history page', async ({ page }) => {
  await page.goto('/');
  // Click the history link
  await page.getByTestId('header-history-link').click();
  // The page should contain an h1 with "Test History"
  await expect(page.locator('h1')).toContainText('Test History');
  await expect(page).toHaveURL('/history');
});
