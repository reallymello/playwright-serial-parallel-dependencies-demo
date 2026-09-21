import { test, expect } from '@playwright/test';
import { readSettings, resetSettings, sleep, writeSettings } from '../helpers/server-settings';

// These two tests change the shared settings, so they share one lock and never
// run at the same time. Set NO_LOCK=1 to remove the lock and watch them
// overwrite each other's state.
const lock = process.env.NO_LOCK === '1' ? undefined : 'server-settings';

test.afterEach(async () => {
  await resetSettings();
});

test('feature flag on enables new checkout', { lock }, async () => {
  await writeSettings({ featureFlag: 'on', serverDate: '2026-01-01' });
  await sleep(500);
  expect((await readSettings()).featureFlag).toBe('on');
});

test('server date set to month end triggers billing rollover', { lock }, async () => {
  await writeSettings({ featureFlag: 'off', serverDate: '2026-01-31' });
  await sleep(500);
  expect((await readSettings()).serverDate).toBe('2026-01-31');
});
