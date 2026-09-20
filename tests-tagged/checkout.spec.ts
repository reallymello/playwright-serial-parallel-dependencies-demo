import { test, expect } from '@playwright/test';
import { readSettings, resetSettings, sleep, writeSettings } from '../helpers/server-settings';

// One file mixing both kinds of tests. The serial ones are marked with an
// `@serial` tag instead of living in a *.serial.spec.ts file.

test.describe('checkout totals (parallel-safe)', () => {
  for (const n of [1, 2, 3, 4]) {
    test(`total ${n} uses default settings`, async () => {
      await sleep(300);
      expect((await readSettings()).featureFlag).toBe('off');
    });
  }
});

test.describe('checkout with mutated server state', { tag: '@serial' }, () => {
  test.describe.configure({ mode: 'serial' });

  test.afterEach(async () => {
    await resetSettings();
  });

  test('feature flag on enables new checkout', async () => {
    await writeSettings({ featureFlag: 'on', serverDate: '2026-01-01' });
    await sleep(500);
    expect((await readSettings()).featureFlag).toBe('on');
  });

  test('server date set to month end triggers billing rollover', async () => {
    await writeSettings({ featureFlag: 'off', serverDate: '2026-01-31' });
    await sleep(500);
    expect((await readSettings()).serverDate).toBe('2026-01-31');
  });
});
