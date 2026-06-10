# Airline Booking Website - Playwright Automation Tests

## Overview
This project contains comprehensive Playwright automation tests for an airline booking website. The tests cover all main pages and user journeys including flight search, destinations exploration, deals browsing, and navigation flows.

## Project Structure
```
├── package.json                 # Project dependencies and scripts
├── playwright.config.js         # Playwright configuration
├── tests/
│   ├── homepage.spec.js         # Homepage functionality tests
│   ├── flights.spec.js          # Flight search and booking tests
│   ├── destinations.spec.js     # Destinations page tests
│   ├── deals.spec.js            # Deals and promotions tests
│   └── navigation.spec.js       # Cross-page navigation tests
└── README.md                    # This file
```

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation
1. Clone or download this project
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Install Playwright browsers:
   ```bash
   npm run install
   ```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Headed Mode (with browser UI)
```bash
npm run test:headed
```

### Run Tests in Debug Mode
```bash
npm run test:debug
```

### Run Tests with UI Mode
```bash
npm run test:ui
```

### Run Specific Test File
```bash
npx playwright test tests/homepage.spec.js
```

### Run Tests in Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Coverage

### Homepage Tests (`tests/homepage.spec.js`)
- Page loading and navigation verification
- Flight search form validation
- Round trip and one-way search functionality
- Footer elements and newsletter subscription
- Navigation to other sections

### Flights Page Tests (`tests/flights.spec.js`)
- Flight search form functionality
- Round trip vs one-way trip handling
- Form validation and required fields
- Passenger and cabin class selection
- Promo code functionality
- User account features access

### Destinations Page Tests (`tests/destinations.spec.js`)
- Destinations content display
- Explore destinations functionality
- Flight search from destinations page
- Navigation between pages
- Footer elements verification

### Deals Page Tests (`tests/deals.spec.js`)
- Deals and promotions display
- "Learn More" button interactions
- Promo code integration with search
- Mobile app promotion testing
- Customer service access

### Navigation Tests (`tests/navigation.spec.js`)
- Cross-page navigation flows
- Header and footer consistency
- Browser back/forward functionality
- Direct URL access testing
- Search form state maintenance

## Test Features

### Best Practices Implemented
- **Increased Timeouts**: All critical operations use extended timeouts (30-60 seconds)
- **Element Visibility Checks**: Comprehensive visibility assertions before interactions
- **Proper Waits**: Strategic waits for page loads and element states
- **Robust Selectors**: Multiple selector strategies (role, label, CSS)
- **Error Handling**: Graceful handling of dynamic content loading

### Selector Strategies
- Role-based selectors: `page.getByRole('button', { name: 'Search Flights' })`
- Label-based selectors: `page.getByLabel('Round Trip')`
- CSS selectors: `page.locator('input[name="from"]')`
- Text-based selectors for dynamic content

### Wait Strategies
- `waitForLoadState('networkidle')` for complete page loading
- `waitForSelector()` with timeouts for element appearance
- `waitForTimeout()` for UI transitions
- `expect().toBeVisible()` with timeouts for assertions

## Configuration

### Browser Support
- Chromium (Desktop)
- Firefox (Desktop)
- WebKit/Safari (Desktop)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)
- Microsoft Edge
- Google Chrome

### Test Settings
- Base URL: `http://xperion1.centralindia.cloudapp.azure.com:3002`
- Action Timeout: 30 seconds
- Navigation Timeout: 60 seconds
- Parallel execution enabled
- Retry on CI: 2 attempts
- Screenshots on failure
- Video recording on failure
- Trace collection on retry

## Reporting

### View Test Results
```bash
npm run report
```

This opens the HTML report with:
- Test execution summary
- Failed test details
- Screenshots and videos
- Trace files for debugging

## Troubleshooting

### Common Issues
1. **Timeout Errors**: Increase timeouts in `playwright.config.js` if the application is slow
2. **Element Not Found**: Check if selectors match the actual elements on the page
3. **Network Issues**: Ensure the application URL is accessible
4. **Browser Installation**: Run `npx playwright install` if browsers are missing

### Debug Mode
Use debug mode to step through tests:
```bash
npm run test:debug
```

### Trace Viewer
View detailed execution traces:
```bash
npx playwright show-trace trace.zip
```

## Continuous Integration

The tests are configured for CI environments with:
- Reduced parallelism on CI
- Automatic retries on failure
- Comprehensive reporting
- Artifact collection (screenshots, videos, traces)

## Contributing

1. Follow the existing test structure and naming conventions
2. Use appropriate waits and timeouts
3. Include comprehensive assertions
4. Add comments for complex test logic
5. Update this README when adding new test files

## Support

For issues or questions:
1. Check the Playwright documentation: https://playwright.dev
2. Review test execution reports for detailed error information
3. Use debug mode for step-by-step test execution
4. Check browser console logs for application errors