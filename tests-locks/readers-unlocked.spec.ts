import { test, expect } from '@playwright/test';
import { readSettings, sleep } from '../helpers/server-settings';

// Ordinary parallel-safe tests that expect the default settings. They do not
// hold the lock, so nothing stops them from running while a mutator has the
// shared state changed.
test.describe('reports (no lock)', () => {
  for (const n of [1, 2, 3, 4]) {
    test(`report ${n} renders with default settings`, async () => {
      await sleep(300);
      expect((await readSettings()).featureFlag).toBe('off');
    });
  }
});
