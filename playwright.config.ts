import { defineConfig } from '@playwright/test';

// Two projects with NO `dependencies` between them.
// CI runs each with its own `--project=` invocation so a failure in one
// never prevents the other from running.
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
      workers: 1, // per-project workers requires Playwright 1.52+
    },
  ],
});
