import { test } from '@playwright/test';
import { expectEnvironment } from '../helpers/environments';
import { sleep } from '../helpers/server-settings';

// Runs against an environment whose language setting is already Spanish.
test.describe('account page (Spanish environment)', () => {
  for (const n of [1, 2]) {
    test(`account scenario ${n}`, async ({ baseURL }) => {
      await sleep(300);
      expectEnvironment(baseURL, 'SPANISH_BASE_URL');
    });
  }
});
