import { test, expect } from '@playwright/test';
import { readSettings, sleep } from '../helpers/server-settings';

// The same readers, but each takes the same lock as the mutators, so they
// never overlap with them. They also can no longer run alongside each other.
test.describe('reports (with lock)', () => {
  for (const n of [1, 2, 3, 4]) {
    test(`report ${n} renders with default settings`, { lock: 'server-settings' }, async () => {
      await sleep(300);
      expect((await readSettings()).featureFlag).toBe('off');
    });
  }
});
