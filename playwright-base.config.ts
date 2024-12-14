import { PlaywrightTestConfig } from '@playwright/test'

const TARGET_URL = process.env.ENV_URL ?? 'http://localhost:8080'
const PLAYWRIGHT_OUTPUT_DIR = process.env.PLAYWRIGHT_OUTPUT_DIR ?? `${__dirname}/output`

// Backend-specific configuration for Playwright tests.
export const baseConfig: PlaywrightTestConfig = {
  // Directory for artifacts like screenshots, traces, etc.
  outputDir: `${PLAYWRIGHT_OUTPUT_DIR}/test-results`,

  // Test timeout: Maximum duration for each test.
  timeout: 30 * 1000,

  // Assertion library configuration.
  expect: {
    timeout: 10 * 1000, // Wait time for expect() conditions.
  },

  // Directory containing test files.
  testDir: './tests',

  // Enable full parallelism for backend API tests.
  fullyParallel: true,

  // Fail if `test.only` is accidentally committed.
  forbidOnly: !!process.env.CI,

  // Retry failed tests once in CI.
  retries: process.env.CI ? 1 : 0,

  // Run all tests with a single worker for debugging purposes.
  workers: process.env.CI ? 2 : 1,

  // Reporters for test results.
  reporter: [
    ['list'],
    ['json', { outputFile: `${PLAYWRIGHT_OUTPUT_DIR}/test-results.json` }],
    ['html', { open: 'never', outputFolder: `${PLAYWRIGHT_OUTPUT_DIR}/html-report` }],
    [
      '@xray-app/playwright-junit-reporter',
      {
        outputFile: `${PLAYWRIGHT_OUTPUT_DIR}/TEST-results.xml`,
        embedAnnotationsAsProperties: true,
        textContentAnnotations: ['test_description'],
      },
    ],
  ],

  // General test options.
  use: {
    // Base URL for API requests.
    baseURL: TARGET_URL,

    // Disable UI-specific settings.
    headless: true,

    // No browser viewport, as it's not required for API tests.
    viewport: null,

    // No geolocation or timezone emulation for backend tests.
    geolocation: undefined,
    timezoneId: undefined,

    // Disable screenshots and videos for API testing.
    screenshot: 'off',
    video: 'off',

    // Enable tracing for debugging failed tests.
    trace: 'on-first-retry',

    // Reduce action timeout for backend actions.
    actionTimeout: 5 * 1000,
  },

  // Projects for different environments or configurations.
  projects: [
    {
      name: 'API Tests',
      use: {
        // No specific device emulation required for backend testing.
      },
    },
  ],
}
