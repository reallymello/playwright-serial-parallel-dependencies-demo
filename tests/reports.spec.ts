import { test, expect } from '@playwright/test';
import { readSettings, sleep } from '../helpers/server-settings';

test.describe('reports (parallel-safe)', () => {
  for (const n of [1, 2, 3, 4]) {
    test(`report ${n} renders with default settings`, async () => {
      await sleep(300);
      const settings = await readSettings();
      expect(settings.featureFlag).toBe('off');
    });
  }

  // Flip DEMO_FAIL=1 to force a red parallel run and demonstrate the
  // `dependencies` gotcha (serial-only never runs) vs. the split-steps fix.
  test('deliberately failing test (only when DEMO_FAIL=1)', async () => {
    test.skip(process.env.DEMO_FAIL !== '1', 'set DEMO_FAIL=1 to enable');
    expect(true, 'forced failure to demonstrate dependency blocking').toBe(false);
  });
});
