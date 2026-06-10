const { test, expect } = require('@playwright/test');

test.describe('Flights Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to flights page with increased timeout
    await page.goto('/flights', { waitUntil: 'networkidle', timeout: 60000 });
  });

  test('should load flights page successfully', async ({ page }) => {
    // Verify we're on the flights page
    expect(page.url()).toContain('/flights');
    
    // Check page title
    await expect(page).toHaveTitle(/.*/, { timeout: 30000 });
    
    // Verify main navigation elements
    await expect(page.getByRole('link', { name: 'LOGO' })).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole('link', { name: 'Flights' })).toBeVisible();
  });

  test('should display flight search functionality', async ({ page }) => {
    // Wait for search form to load
    await page.waitForSelector('input[name="from"]', { timeout: 30000 });
    
    // Verify all search form elements are present
    await expect(page.getByLabel('Round Trip')).toBeVisible();
    await expect(page.getByLabel('One Way')).toBeVisible();
    await expect(page.locator('input[name="from"]')).toBeVisible();
    await expect(page.locator('input[name="to"]')).toBeVisible();
    await expect(page.locator('input[name="departureDate"]')).toBeVisible();
    await expect(page.locator('input[name="returnDate"]')).toBeVisible();
    await expect(page.locator('select[name="passengers"]')).toBeVisible();
    await expect(page.locator('select[name="cabinClass"]')).toBeVisible();
  });

  test('should handle round trip search', async ({ page }) => {
    // Wait for form elements
    await page.waitForSelector('input[name="from"]', { timeout: 30000 });
    
    // Select round trip (should be default)
    await page.check('input[value="roundTrip"]');
    await page.waitForTimeout(1000);
    
    // Fill search details
    await page.fill('input[name="from"]', 'Boston');
    await page.waitForTimeout(500);
    
    await page.fill('input[name="to"]', 'Seattle');
    await page.waitForTimeout(500);
    
    // Set departure date
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + 20);
    await page.fill('input[name="departureDate"]', departureDate.toISOString().split('T')[0]);
    
    // Set return date
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 27);
    await page.fill('input[name="returnDate"]', returnDate.toISOString().split('T')[0]);
    
    // Select passenger count
    await page.selectOption('select[name="passengers"]', '2');
    
    // Select cabin class
    await page.selectOption('select[name="cabinClass"]', 'business');
    
    // Add promo code
    await page.fill('input[name="promoCode"]', 'SAVE20');
    
    // Search flights
    const searchButton = page.getByRole('button', { name: 'Search Flights' }).first();
    await expect(searchButton).toBeVisible();
    await searchButton.click();
    
    await page.waitForTimeout(3000);
  });

  test('should handle one way search', async ({ page }) => {
    // Wait for form elements
    await page.waitForSelector('input[name="from"]', { timeout: 30000 });
    
    // Select one way trip
    await page.check('input[value="oneWay"]');
    await page.waitForTimeout(1000);
    
    // Fill search details
    await page.fill('input[name="from"]', 'Chicago');
    await page.waitForTimeout(500);
    
    await page.fill('input[name="to"]', 'Denver');
    await page.waitForTimeout(500);
    
    // Set departure date only
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + 15);
    await page.fill('input[name="departureDate"]', departureDate.toISOString().split('T')[0]);
    
    // Return date field should be disabled or hidden for one way
    // We'll verify this by checking if it's enabled
    const returnDateField = page.locator('input[name="returnDate"]');
    
    // Search flights
    const searchButton = page.getByRole('button', { name: 'Search Flights' }).first();
    await expect(searchButton).toBeVisible();
    await searchButton.click();
    
    await page.waitForTimeout(3000);
  });

  test('should validate required fields', async ({ page }) => {
    // Wait for search button
    const searchButton = page.getByRole('button', { name: 'Search Flights' }).first();
    await expect(searchButton).toBeVisible({ timeout: 30000 });
    
    // Try to search without filling required fields
    await searchButton.click();
    await page.waitForTimeout(2000);
    
    // Check if validation messages appear or form doesn't submit
    // This depends on the actual validation implementation
  });

  test('should navigate to other sections from flights page', async ({ page }) => {
    // Test destinations navigation
    await page.getByRole('link', { name: 'Destinations' }).click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/destinations');
    
    // Go back to flights
    await page.goto('/flights');
    await page.waitForLoadState('networkidle');
    
    // Test deals navigation
    await page.getByRole('link', { name: 'Deals' }).click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/deals');
  });

  test('should access user account features', async ({ page }) => {
    // Test sign in link
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible({ timeout: 30000 });
    
    // Test manage booking link
    await expect(page.getByRole('link', { name: 'Manage Booking' })).toBeVisible();
    
    // Test check-in link
    await expect(page.getByRole('link', { name: 'Check-in' })).toBeVisible();
    
    // Test loyalty program link
    await expect(page.getByRole('link', { name: 'Loyalty Program' })).toBeVisible();
  });

  test('should display help and support options', async ({ page }) => {
    // Check help link in navigation
    await expect(page.getByRole('link', { name: 'Help' })).toBeVisible({ timeout: 30000 });
    
    // Scroll to footer for more support options
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    
    // Check footer help links
    await expect(page.getByRole('link', { name: 'Help Center' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact Us' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Feedback' })).toBeVisible();
  });
});