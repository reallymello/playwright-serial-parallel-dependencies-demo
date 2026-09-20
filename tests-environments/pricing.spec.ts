import { test } from '@playwright/test';
import { expectEnvironment } from '../helpers/environments';
import { sleep } from '../helpers/server-settings';

// These tests prove routing and configuration only: the project handed each test
// the base URL for its flavor, and that URL is set, valid and unique. A real test
// would call page.goto('/') and hit that environment.
test.describe('pricing (default environment)', () => {
  for (const n of [1, 2, 3, 4]) {
    test(`quote ${n} runs against the default environment`, async ({ baseURL }) => {
      await sleep(300);
      expectEnvironment(baseURL, 'DEFAULT_BASE_URL');
    });
  }
});
