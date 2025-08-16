import { test, expect } from '@playwright/test';

test('should navigate to the home page', async ({ page }) => {
  // Start from the index page (the baseURL is set in the playwright.config.ts)
  await page.goto('/');
  // The page should contain an h1 with "New Test Run"
  await expect(page.getByTestId('test-form-card').getByText('New Test Run')).toBeVisible();
});

test('should have the correct page title on home', async ({ page }) => {
  await page.goto('/');
  // The page should have the correct title
  await expect(page).toHaveTitle(/K6 Commander/);
});

test('should navigate to the about page', async ({ page }) => {
  await page.goto('/');
  // Click the about link
  await page.getByTestId('header-about-link').click();
  // The page should contain a CardTitle with "About K6 Commander"
  await expect(page.getByRole('heading', { name: 'About K6 Commander' })).toBeVisible();
  await expect(page).toHaveURL('/about');
});

test('should navigate to the history page', async ({ page }) => {
  await page.goto('/');
  // Click the history link
  await page.getByTestId('header-history-link').click();
  // The page should contain a CardTitle with "Test History"
  await expect(page.getByRole('heading', { name: 'Test History' })).toBeVisible();
  await expect(page).toHaveURL('/history');
});
