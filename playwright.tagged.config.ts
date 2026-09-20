import { defineConfig } from '@playwright/test';

// Third option: match on a tag instead of a filename convention.
// Tests marked `@serial` go to the serial-only project; everything else is parallel-safe.
// Still no `dependencies`, so CI can run each project as its own step.
export default defineConfig({
  testDir: './tests-tagged',
  reporter: [['list']],
  projects: [
    {
      name: 'parallel-safe',
      grepInvert: /@serial/,
      fullyParallel: true,
    },
    {
      name: 'serial-only',
      grep: /@serial/,
      workers: 1,
    },
  ],
});
