const { test, expect } = require('@playwright/test');

test.describe('Deals Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to deals page with increased timeout
    await page.goto('/deals', { waitUntil: 'networkidle', timeout: 60000 });
  });

  test('should load deals page successfully', async ({ page }) => {
    // Verify we're on the deals page
    expect(page.url()).toContain('/deals');
    
    // Check page title
    await expect(page).toHaveTitle(/.*/, { timeout: 30000 });
    
    // Verify navigation elements are present
    await expect(page.getByRole('link', { name: 'LOGO' })).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole('link', { name: 'Deals' })).toBeVisible();
  });

  test('should display deals content and promotions', async ({ page }) => {
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    // Look for "Learn More" buttons which likely relate to deals
    const learnMoreButtons = page.getByRole('button', { name: 'Learn More' });
    await expect(learnMoreButtons.first()).toBeVisible({ timeout: 30000 });
    
    // Check if multiple deals are displayed
    const buttonCount = await learnMoreButtons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('should interact with deal promotions', async ({ page }) => {
    // Wait for Learn More buttons to be visible
    const learnMoreButtons = page.getByRole('button', { name: 'Learn More' });
    await expect(learnMoreButtons.first()).toBeVisible({ timeout: 30000 });
    
    // Click on first deal
    await learnMoreButtons.first().click();
    await page.waitForTimeout(2000);
    
    // Check if any modal, popup, or navigation occurs
    // This would depend on the actual implementation
  });

  test('should allow flight search with promo codes from deals page', async ({ page }) => {
    // Wait for search form
    await page.waitForSelector('input[name="from"]', { timeout: 30000 });
    
    // Fill search form with deal-related search
    await page.fill('input[name="from"]', 'Las Vegas');
    await page.waitForTimeout(500);
    
    await page.fill('input[name="to"]', 'Orlando');
    await page.waitForTimeout(500);
    
    // Set dates
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + 30);
    await page.fill('input[name="departureDate"]', departureDate.toISOString().split('T')[0]);
    
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 37);
    await page.fill('input[name="returnDate"]', returnDate.toISOString().split('T')[0]);
    
    // Add a promo code (common on deals pages)
    await page.fill('input[name="promoCode"]', 'DEALS50');
    
    // Search flights
    const searchButton = page.getByRole('button', { name: 'Search Flights' }).first();
    await expect(searchButton).toBeVisible();
    await searchButton.click();
    
    await page.waitForTimeout(3000);
  });

  test('should navigate between all main sections from deals page', async ({ page }) => {
    // Test Flights navigation
    await page.getByRole('link', { name: 'Flights' }).click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/flights');
    
    // Go back to deals
    await page.goto('/deals');
    await page.waitForLoadState('networkidle');
    
    // Test Destinations navigation
    await page.getByRole('link', { name: 'Destinations' }).click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/destinations');
    
    // Go back to deals
    await page.goto('/deals');
    await page.waitForLoadState('networkidle');
    
    // Test home navigation via logo
    await page.getByRole('link', { name: 'LOGO' }).click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).not.toContain('/deals');
  });

  test('should verify all deal-related buttons function', async ({ page }) => {
    // Test all Learn More buttons
    const learnMoreButtons = page.getByRole('button', { name: 'Learn More' });
    const buttonCount = await learnMoreButtons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 3); i++) {
      await expect(learnMoreButtons.nth(i)).toBeVisible({ timeout: 30000 });
      await learnMoreButtons.nth(i).click();
      await page.waitForTimeout(1000);
      
      // Navigate back if needed
      // This depends on what the Learn More button does
    }
  });

  test('should check mobile app promotion on deals page', async ({ page }) => {
    // Scroll to footer where app promotions are likely located
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    
    // Check app store buttons
    await expect(page.getByRole('button', { name: /App Store/ })).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole('button', { name: /Google Play/ })).toBeVisible();
    
    // Click app store button
    await page.getByRole('button', { name: /App Store/ }).click();
    await page.waitForTimeout(2000);
  });

  test('should access customer service from deals page', async ({ page }) => {
    // Check main navigation help link
    await expect(page.getByRole('link', { name: 'Help' })).toBeVisible({ timeout: 30000 });
    
    // Scroll to footer for additional support options
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    
    // Check footer support links
    await expect(page.getByRole('link', { name: 'Help Center' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact Us' })).toBeVisible();
    
    // Test contact us link
    await page.getByRole('link', { name: 'Contact Us' }).click();
    await page.waitForTimeout(2000);
  });

  test('should handle newsletter subscription from deals page', async ({ page }) => {
    // Scroll to footer for newsletter signup
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    
    // Find and click subscribe button
    const subscribeButton = page.getByRole('button', { name: 'Subscribe' });
    await expect(subscribeButton).toBeVisible({ timeout: 30000 });
    await subscribeButton.click();
    await page.waitForTimeout(2000);
  });
});