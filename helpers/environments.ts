import { expect } from '@playwright/test';

const FLAVORS = [
  'DEFAULT_BASE_URL',
  'MONTH_END_BASE_URL',
  'SPANISH_BASE_URL',
  'NEW_CHECKOUT_BASE_URL',
] as const;

export type EnvironmentFlavor = (typeof FLAVORS)[number];

// Asserts the test really received the base URL for its environment flavor.
// Comparing baseURL to its own env var alone would pass even when that var is
// empty or missing, so this also checks that the value is set, is a valid URL,
// and differs from every other flavor's URL.
export function expectEnvironment(baseURL: string | undefined, flavor: EnvironmentFlavor) {
  const expected = process.env[flavor];

  expect(expected, `${flavor} must be set and non-empty`).toBeTruthy();
  expect(() => new URL(expected!), `${flavor} must be a valid URL`).not.toThrow();
  expect(baseURL, `baseURL should come from ${flavor}`).toBe(expected);

  const otherUrls = FLAVORS.filter((f) => f !== flavor).map((f) => process.env[f]);
  expect(otherUrls, `${flavor} must differ from every other environment's URL`).not.toContain(baseURL);
}
