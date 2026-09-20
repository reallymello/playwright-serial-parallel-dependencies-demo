import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env.example') });

// Preferred option when you can afford it: instead of tests changing global
// settings on the fly, each flavor of precondition gets its own preconfigured
// environment. Projects match test files by naming convention and point at
// the right environment with a per-project baseURL. No serial project, no
// dependencies, no CI ordering.
export default defineConfig({
  testDir: './tests-environments',
  fullyParallel: true,
  reporter: [['list']],
  projects: [
    {
      name: 'parallel-safe',
      testMatch: /.*\.spec\.ts/,
      testIgnore: /.*\.(month-end|spanish|new-checkout)\.spec\.ts/,
      use: { baseURL: process.env.DEFAULT_BASE_URL },
    },
    {
      name: 'month-end-date',
      testMatch: /.*\.month-end\.spec\.ts/,
      use: { baseURL: process.env.MONTH_END_BASE_URL },
    },
    {
      name: 'spanish-locale',
      testMatch: /.*\.spanish\.spec\.ts/,
      use: { baseURL: process.env.SPANISH_BASE_URL },
    },
    {
      name: 'new-checkout-flag',
      testMatch: /.*\.new-checkout\.spec\.ts/,
      use: { baseURL: process.env.NEW_CHECKOUT_BASE_URL },
    },
  ],
});
