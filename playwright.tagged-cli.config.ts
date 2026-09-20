import { defineConfig } from '@playwright/test';

// No projects at all: tag filtering happens purely on the command line
// (--grep / --grep-invert). fullyParallel applies to whatever the filter selects.
export default defineConfig({
  testDir: './tests-tagged',
  fullyParallel: true,
  reporter: [['list']],
});
