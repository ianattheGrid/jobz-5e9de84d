# Jobz E2E regression suite

Playwright tests covering the four critical journeys:

1. Candidate signup
2. Public job board renders jobs
3. Matching feed loads for a signed-in (demo) candidate
4. Job application flow reaches submit / auth gate

## Run

```bash
# one-time: install browsers
npx playwright install chromium

# against local dev (default: http://localhost:8080)
bun run dev   # in another terminal
npx playwright test -c e2e/playwright.config.ts

# against preview / staging / prod
E2E_BASE_URL=https://jobz.lovable.app npx playwright test -c e2e/playwright.config.ts

# open the HTML report
npx playwright show-report playwright-report
```

## Notes

- The signup test uses a unique `qa+<ts>@jobz-e2e.test` email per run so reruns
  don't collide. The user is left in whatever post-signup state the app puts
  them in (verification email / dashboard).
- The matching test hits `/preview/candidate-demo` so it does not depend on a
  verified inbox.
- The apply test asserts the flow reaches either the auth gate or an apply
  dialog — both are valid "apply is wired" outcomes.
- Tests skip (rather than fail) when prerequisite UI is missing in the target
  environment (e.g. no jobs seeded), so the suite is safe to run against
  production smoke checks.
