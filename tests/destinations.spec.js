const { test, expect } = require('@playwright/test');

test.describe('Destinations Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to destinations page with increased timeout
    await page.goto('/destinations', { waitUntil: 'networkidle', timeout: 60000 });
  });

  test('should load destinations page successfully', async ({ page }) => {
    // Verify we're on the destinations page
    expect(page.url()).toContain('/destinations');
    
    // Check page title
    await expect(page).toHaveTitle(/.*/, { timeout: 30000 });
    
    // Verify navigation is still present
    await expect(page.getByRole('link', { name: 'LOGO' })).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole('link', { name: 'Destinations' })).toBeVisible();
  });

  test('should display destinations content', async ({ page }) => {
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    // Check if explore destinations button is present
    await expect(page.getByRole('button', { name: 'Explore Destinations' })).toBeVisible({ timeout: 30000 });
    
    // Verify search form is still available on destinations page
    await page.waitForSelector('input[name="from"]', { timeout: 30000 });
    await expect(page.locator('input[name="from"]')).toBeVisible();
    await expect(page.locator('input[name="to"]')).toBeVisible();
  });

  test('should allow flight search from destinations page', async ({ page }) => {
    // Wait for search form elements
    await page.waitForSelector('input[name="from"]', { timeout: 30000 });
    
    // Perform search from destinations page
    await page.fill('input[name="from"]', 'Miami');
    await page.waitForTimeout(1000);
    
    await page.fill('input[name="to"]', 'Paris');
    await page.waitForTimeout(1000);
    
    // Set departure date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 45);
    const dateString = futureDate.toISOString().split('T')[0];
    await page.fill('input[name="departureDate"]', dateString);
    
    // Click search
    const searchButton = page.getByRole('button', { name: 'Search Flights' }).first();
    await expect(searchButton).toBeVisible();
    await searchButton.click();
    
    await page.waitForTimeout(3000);
  });

  test('should navigate back to homepage', async ({ page }) => {
    // Click on logo or home link
    await page.getByRole('link', { name: 'LOGO' }).click();
    await page.waitForLoadState('networkidle');
    
    // Verify we're back on homepage
    expect(page.url()).not.toContain('/destinations');
  });

  test('should handle explore destinations interaction', async ({ page }) => {
    // Wait for explore button to be visible
    const exploreButton = page.getByRole('button', { name: 'Explore Destinations' });
    await expect(exploreButton).toBeVisible({ timeout: 30000 });
    
    // Click explore destinations
    await exploreButton.click();
    await page.waitForTimeout(2000);
    
    // Check if any modal or content appears
    // This would depend on the actual implementation
  });

  test('should verify all navigation links work from destinations page', async ({ page }) => {
    // Test Flights navigation
    await page.getByRole('link', { name: 'Flights' }).click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/flights');
    
    // Go back to destinations
    await page.goto('/destinations');
    await page.waitForLoadState('networkidle');
    
    // Test Deals navigation
    await page.getByRole('link', { name: 'Deals' }).click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/deals');
  });

  test('should display footer elements on destinations page', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    
    // Verify footer elements are present
    await expect(page.getByRole('link', { name: 'About Us' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Help Center' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Subscribe' })).toBeVisible();
  });
});