import { defineConfig } from '@playwright/test';

// The problem this repo exists to show: everything in one parallel pool.
// The serial-only tests mutate shared state while parallel tests read it,
// so parallel tests fail intermittently. Run with: npm run test:collision
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 5,
  reporter: [['list']],
});
