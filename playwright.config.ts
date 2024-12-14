import { defineConfig } from '@playwright/test'
import { baseConfig } from './playwright-base.config'

// See https://playwright.dev/docs/test-configuration.
const config = defineConfig({
  ...baseConfig,

  // timeout: 70 * 1000,

  // expect: {
  //   timeout: 45 * 1000,
  // },
})

// eslint-disable-next-line import/no-default-export
export default config
