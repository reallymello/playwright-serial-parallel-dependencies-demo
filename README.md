# Playwright: parallel-safe vs serial-only tests

Companion repo for the article [Run Parallel and Serial Tests Together in Playwright](https://www.davidmello.com/software-testing/frameworks/playwright/run-parallel-and-serial-tests-in-playwright), about running tests that mutate global state (config values, the server clock) alongside tests that are safe to parallelize.

Requires Playwright 1.52+ (per-project `workers`); the test locks example needs 1.63+. No browsers needed; the tests exercise a shared settings file that stands in for global server state.

```bash
npm install
```

## Scenarios

| Command | What it shows |
| --- | --- |
| `npm run test:collision` | Everything in one parallel pool with 5 workers. Serial-only tests mutate shared state while parallel tests read it, so parallel tests fail. On the author's machine the same 3 tests failed on every run; the exact count depends on your CPU and scheduling. |
| `npm run test:deps` | Projects linked with `dependencies`. Serial-only runs after parallel-safe passes. |
| `DEMO_FAIL=1 npm run test:deps` | The gotcha: one failing parallel test means serial-only reports "did not run". |
| `npm run test:parallel` then `npm run test:serial` | Separate invocations, no `dependencies`. Each runs regardless of the other. `npm run test:split` runs both in sequence. |

The `1 skipped` you see in normal runs is a deliberately failing parallel-safe test that only runs when `DEMO_FAIL=1` is set. It exists to force a red parallel run for the two scenarios above.

On PowerShell set the variable with `$env:DEMO_FAIL='1'`.

### Tag-based variant

Instead of a `*.serial.spec.ts` filename convention, tests in `tests-tagged/` mark the state-mutating group with `{ tag: '@serial' }`.

| Command | What it shows |
| --- | --- |
| `npm run test:tagged:parallel` then `npm run test:tagged:serial` | Two projects that match on `grepInvert: /@serial/` and `grep: /@serial/`. |
| `npm run test:tagged:cli` | No projects. Pure `--grep-invert @serial` then `--grep @serial --workers=1` on the command line. |

### Test-locks variant

Playwright 1.63 added test locks: tests that share a named `lock` never run at the same time, while every other test keeps running in parallel. The examples in `tests-locks/` show what that does and does not solve.

| Command | What it shows |
| --- | --- |
| `npm run test:locks` | Two tests that change the shared settings, both holding the lock `server-settings`. They never overlap, so both pass. |
| `NO_LOCK=1 npm run test:locks` | The same two tests with the lock removed. They overwrite each other's state and fail. |
| `npm run test:locks:partial` | The locked tests plus ordinary tests that only read the settings and hold no lock. The readers still fail, because a lock only keeps apart the tests that hold it. |
| `npm run test:locks:all` | The readers take the same lock too. Everything passes, but the tests can no longer run alongside each other, so the run is slower. |

### Preconfigured-environments variant

Instead of tests changing global settings, each precondition (month-end date, Spanish locale, feature flag on) gets its own already-configured environment. Projects match test files by naming convention (`*.month-end.spec.ts`, `*.spanish.spec.ts`, `*.new-checkout.spec.ts`) and point at the right environment with a per-project `baseURL` loaded from a `.env` file.

| Command | What it shows |
| --- | --- |
| `npm run test:envs` | All four projects run together in one invocation, no `dependencies`, no serial project. |

The example URLs are placeholders that point at no real servers, so nothing is contacted. Each test calls `expectEnvironment()` (`helpers/environments.ts`), which checks that the test received the base URL for its flavor, that the variable is set and a valid URL, and that it differs from every other flavor's URL. It does not prove an environment is actually configured.

Copy `.env.example` to `.env` and point the URLs at real environments to use it for real. The demo config loads `.env.example` directly so it runs out of the box. The `injected env` lines in the output are printed by `dotenv`, not Playwright: one from the main process loading the four URLs, and more from workers as they start.

## Files

- `playwright.config.ts`: two projects, no dependencies (used by the split CI steps)
- `playwright.dependencies.config.ts`: same projects with `dependencies: ['parallel-safe']`
- `playwright.collision.config.ts`: single parallel pool, reproduces the problem
- `tests/*.spec.ts`: parallel-safe (read shared settings)
- `tests/*.serial.spec.ts`: serial-only (mutate shared settings)
- `helpers/server-settings.ts`: the shared settings file that stands in for global server state
- `tests-tagged/`: one file mixing parallel-safe tests and an `@serial` describe block
- `playwright.tagged.config.ts`: projects matching on tags (`grep` / `grepInvert`)
- `playwright.tagged-cli.config.ts`: no projects, tag filtering done purely with CLI flags
- `tests-locks/`: mutators that share a lock, plus readers with and without the lock
- `playwright.locks.config.ts`: one parallel pool with 5 workers for the locks examples
- `tests-environments/`: tests named by environment flavor (default, `.month-end`, `.spanish`, `.new-checkout`)
- `playwright.environments.config.ts`: one project per flavor, each with its own `baseURL`
- `helpers/environments.ts`: `expectEnvironment()` assertions for the environments variant
- `.env.example`: one base URL per environment flavor
- `.github/workflows/split-steps.yml`: recommended CI setup with `continue-on-error` and a final gate step
- `.github/workflows/project-dependencies.yml`: manual workflow that demonstrates the dependency gotcha

## License

[Apache License 2.0](LICENSE)
