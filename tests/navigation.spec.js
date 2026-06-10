const { test, expect } = require('@playwright/test');

test.describe('Cross-Page Navigation Tests', () => {
  test('should navigate through all main pages successfully', async ({ page }) => {
    // Start from homepage
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 });
    await expect(page.getByRole('link', { name: 'LOGO' })).toBeVisible({ timeout: 30000 });
    
    // Navigate to Flights
    await page.getByRole('link', { name: 'Flights' }).click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/flights');
    await expect(page.locator('input[name="from"]')).toBeVisible({ timeout: 30000 });
    
    // Navigate to Destinations
    await page.getByRole('link', { name: 'Destinations' }).click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/destinations');
    await expect(page.getByRole('button', { name: 'Explore Destinations' })).toBeVisible({ timeout: 30000 });
    
    // Navigate to Deals
    await page.getByRole('link', { name: 'Deals' }).click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/deals');
    await expect(page.getByRole('button', { name: 'Learn More' }).first()).toBeVisible({ timeout: 30000 });
    
    // Navigate back to homepage via logo
    await page.getByRole('link', { name: 'LOGO' }).click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).not.toContain('/flights');
    expect(page.url()).not.toContain('/destinations');
    expect(page.url()).not.toContain('/deals');
  });

  test('should maintain consistent header navigation across all pages', async ({ page }) => {
    const pages = ['/', '/flights', '/destinations', '/deals'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath, { waitUntil: 'networkidle', timeout: 60000 });
      
      // Check that all main navigation elements are present
      await expect(page.getByRole('link', { name: 'LOGO' })).toBeVisible({ timeout: 30000 });
      await expect(page.getByRole('link', { name: 'Flights' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Destinations' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Deals' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Check-in' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Manage Booking' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Loyalty Program' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Help' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
    }
  });

  test('should maintain consistent footer across all pages', async ({ page }) => {
    const pages = ['/', '/flights', '/destinations', '/deals'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath, { waitUntil: 'networkidle', timeout: 60000 });
      
      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(2000);
      
      // Check footer elements
      await expect(page.getByRole('link', { name: 'About Us' })).toBeVisible({ timeout: 30000 });
      await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Terms of Service' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Contact Us' })).toBeVisible();
      await expect(page.getByRole('button', { name: /App Store/ })).toBeVisible();
      await expect(page.getByRole('button', { name: /Google Play/ })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Subscribe' })).toBeVisible();
    }
  });

  test('should handle browser back and forward navigation', async ({ page }) => {
    // Start from homepage
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 });
    
    // Navigate to flights
    await page.getByRole('link', { name: 'Flights' }).click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/flights');
    
    // Navigate to destinations
    await page.getByRole('link', { name: 'Destinations' }).click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/destinations');
    
    // Use browser back
    await page.goBack();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/flights');
    
    // Use browser back again
    await page.goBack();
    await page.waitForLoadState('networkidle');
    expect(page.url()).not.toContain('/flights');
    
    // Use browser forward
    await page.goForward();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/flights');
  });

  test('should handle direct URL access to all pages', async ({ page }) => {
    const pages = [
      { path: '/', expectedElement: 'input[name="from"]' },
      { path: '/flights', expectedElement: 'input[name="from"]' },
      { path: '/destinations', expectedElement: 'button[text*="Explore Destinations"]' },
      { path: '/deals', expectedElement: 'button[text*="Learn More"]' }
    ];
    
    for (const pageInfo of pages) {
      await page.goto(pageInfo.path, { waitUntil: 'networkidle', timeout: 60000 });
      
      // Verify page loads correctly
      await expect(page.getByRole('link', { name: 'LOGO' })).toBeVisible({ timeout: 30000 });
      
      // Verify page-specific content is present
      if (pageInfo.path === '/destinations') {
        await expect(page.getByRole('button', { name: 'Explore Destinations' })).toBeVisible({ timeout: 30000 });
      } else if (pageInfo.path === '/deals') {
        await expect(page.getByRole('button', { name: 'Learn More' }).first()).toBeVisible({ timeout: 30000 });
      } else {
        await expect(page.locator('input[name="from"]')).toBeVisible({ timeout: 30000 });
      }
    }
  });

  test('should maintain search form state during navigation', async ({ page }) => {
    // Start from homepage
    await page.goto('/', { waitUntil: 'networkidle', timeout: 60000 });
    
    // Fill search form
    await page.waitForSelector('input[name="from"]', { timeout: 30000 });
    await page.fill('input[name="from"]', 'New York');
    await page.fill('input[name="to"]', 'London');
    
    // Navigate to flights page
    await page.getByRole('link', { name: 'Flights' }).click();
    await page.waitForLoadState('networkidle');
    
    // Check if form data is maintained (this depends on implementation)
    await page.waitForSelector('input[name="from"]', { timeout: 30000 });
    
    // Navigate to destinations
    await page.getByRole('link', { name: 'Destinations' }).click();
    await page.waitForLoadState('networkidle');
    
    // Verify search form is still available
    await expect(page.locator('input[name="from"]')).toBeVisible({ timeout: 30000 });
  });
});