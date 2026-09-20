import { test } from '@playwright/test';
import { expectEnvironment } from '../helpers/environments';
import { sleep } from '../helpers/server-settings';

// Runs against an environment with the new-checkout feature flag already on.
test.describe('checkout (new-checkout flag environment)', () => {
  for (const n of [1, 2]) {
    test(`checkout scenario ${n}`, async ({ baseURL }) => {
      await sleep(300);
      expectEnvironment(baseURL, 'NEW_CHECKOUT_BASE_URL');
    });
  }
});
