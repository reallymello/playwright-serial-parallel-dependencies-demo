import { test } from '@playwright/test';
import { expectEnvironment } from '../helpers/environments';
import { sleep } from '../helpers/server-settings';

// Runs against an environment whose server date is already set to a month end.
test.describe('billing rollover (month-end environment)', () => {
  for (const n of [1, 2]) {
    test(`rollover scenario ${n}`, async ({ baseURL }) => {
      await sleep(300);
      expectEnvironment(baseURL, 'MONTH_END_BASE_URL');
    });
  }
});
