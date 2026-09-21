import { defineConfig } from '@playwright/test';

// Test locks (Playwright 1.63+): tests that share a lock name never run at the
// same time, across files, workers and projects, while every other test keeps
// running in parallel. One pool, several workers, no serial project.
export default defineConfig({
  testDir: './tests-locks',
  fullyParallel: true,
  workers: 5,
  reporter: [['list']],
});
