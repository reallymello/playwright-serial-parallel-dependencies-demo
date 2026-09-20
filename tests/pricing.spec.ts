import { test, expect } from '@playwright/test';
import { readSettings, sleep } from '../helpers/server-settings';

// Parallel-safe by design: these only READ the shared settings and assume defaults.
// They are exactly the tests that break if a serial-only test mutates state concurrently.
test.describe('pricing (parallel-safe)', () => {
  for (const n of [1, 2, 3, 4]) {
    test(`quote ${n} uses default settings`, async () => {
      await sleep(300);
      const settings = await readSettings();
      expect(settings.featureFlag).toBe('off');
      expect(settings.serverDate).toBe('2026-01-01');
    });
  }
});
