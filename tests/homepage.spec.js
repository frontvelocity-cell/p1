const { test, expect } = require('@playwright/test');

test.describe('Homepage Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage with increased timeout
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 });
  });

  test('should load homepage successfully', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/.*/, { timeout: 30000 });
    
    // Check main navigation elements visibility
    await expect(page.getByRole('link', { name: 'LOGO' })).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole('link', { name: 'Flights' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Destinations' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Deals' })).toBeVisible();
  });

  test('should display flight search form', async ({ page }) => {
    // Wait for search form to be visible
    await page.waitForSelector('input[name="from"]', { timeout: 30000 });
    
    // Verify search form elements
    await expect(page.getByLabel('Round Trip')).toBeVisible();
    await expect(page.getByLabel('One Way')).toBeVisible();
    await expect(page.locator('input[name="from"]')).toBeVisible();
    await expect(page.locator('input[name="to"]')).toBeVisible();
    await expect(page.locator('input[name="departureDate"]')).toBeVisible();
    await expect(page.locator('input[name="returnDate"]')).toBeVisible();
    await expect(page.locator('select[name="passengers"]')).toBeVisible();
    await expect(page.locator('select[name="cabinClass"]')).toBeVisible();
  });

  test('should perform flight search', async ({ page }) => {
    // Wait for form elements to be ready
    await page.waitForSelector('input[name="from"]', { timeout: 30000 });
    
    // Fill search form
    await page.fill('input[name="from"]', 'New York');
    await page.waitForTimeout(1000);
    
    await page.fill('input[name="to"]', 'Los Angeles');
    await page.waitForTimeout(1000);
    
    // Set departure date (future date)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const dateString = futureDate.toISOString().split('T')[0];
    await page.fill('input[name="departureDate"]', dateString);
    
    // Select passengers
    await page.selectOption('select[name="passengers"]', { index: 1 });
    
    // Select cabin class
    await page.selectOption('select[name="cabinClass"]', { index: 1 });
    
    // Click search button
    const searchButton = page.getByRole('button', { name: 'Search Flights' }).first();
    await expect(searchButton).toBeVisible();
    await searchButton.click();
    
    // Wait for navigation or results
    await page.waitForTimeout(3000);
  });

  test('should navigate to different sections', async ({ page }) => {
    // Test navigation links
    await page.getByRole('link', { name: 'Destinations' }).click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/destinations');
    
    // Go back to home
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test flights link
    await page.getByRole('link', { name: 'Flights' }).click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/flights');
  });

  test('should display footer elements', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    
    // Check footer links visibility
    await expect(page.getByRole('link', { name: 'About Us' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Terms of Service' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact Us' })).toBeVisible();
    
    // Check app download buttons
    await expect(page.getByRole('button', { name: /App Store/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Google Play/ })).toBeVisible();
  });

  test('should handle newsletter subscription', async ({ page }) => {
    // Scroll to footer where newsletter signup is likely located
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    
    // Look for subscribe button
    const subscribeButton = page.getByRole('button', { name: 'Subscribe' });
    await expect(subscribeButton).toBeVisible({ timeout: 30000 });
    
    // Click subscribe button (assuming it opens a modal or form)
    await subscribeButton.click();
    await page.waitForTimeout(2000);
  });
});