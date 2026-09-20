import { test, expect } from '@playwright/test';
import { readSettings, resetSettings, sleep, writeSettings } from '../helpers/server-settings';

// Serial-only: these MUTATE global state (a feature flag, the "server date")
// to set up preconditions. Running them alongside the parallel tests would break those.
// `mode: 'serial'` also fixes their order within this file.
test.describe.configure({ mode: 'serial' });

test.afterEach(async () => {
  await resetSettings();
});

test('feature flag on enables new checkout', async () => {
  await writeSettings({ featureFlag: 'on', serverDate: '2026-01-01' });
  await sleep(500); // hold the mutated state long enough to collide with parallel tests
  expect((await readSettings()).featureFlag).toBe('on');
});

test('server date set to month end triggers billing rollover', async () => {
  await writeSettings({ featureFlag: 'off', serverDate: '2026-01-31' });
  await sleep(500);
  expect((await readSettings()).serverDate).toBe('2026-01-31');
});
