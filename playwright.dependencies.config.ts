import { defineConfig } from '@playwright/test';

// The "built-in" approach: serial-only depends on parallel-safe.
// Gotcha: if ANY parallel-safe test fails, serial-only never runs.
export default defineConfig({
  testDir: './tests',
  reporter: [['list']],
  projects: [
    {
      name: 'parallel-safe',
      testMatch: /.*\.spec\.ts/,
      testIgnore: /.*\.serial\.spec\.ts/,
      fullyParallel: true,
    },
    {
      name: 'serial-only',
      testMatch: /.*\.serial\.spec\.ts/,
      dependencies: ['parallel-safe'],
      workers: 1,
    },
  ],
});
