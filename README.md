# Tester playwright login task

```bash
docker run -i -t \
  -v "/var/run/docker.sock:/var/run/docker.sock:ro" \
  -v "$PWD/users.yml:/data/users.yml:ro" \
  -p "8080:8080" \
  -e "DOZZLE_AUTH_PROVIDER=simple" \
  --name dozzle \
  --rm amir20/dozzle:v8.8.2
```

Create a Playwright test for service above that verifies login functionality. Settings test Create a
Playwright test to validate the functionality of the settings page. Ensure the test changes a single
setting, such as switching the color scheme to "Dark".

Sending results:

- Provide a list of all covered test cases.
- Grant access to your private or public GitHub repository that you’ve created.
- Share access with via email
- Track the time spent on your work and include it in your report.
- Prepare and submit a report for the product management team.

# Playwright

```bash
pnpm playwright test --config=playwright.config.ts
```

## A quick way of opening the last test run report is:

```bash
pnpm playwright show-report output/html-report
```

## Way to record your tests

Put command

```bash
await page.pause()
```

in test where you have precondition to record tests.

In Playwright pause window click record and choose 'Playwright Test' as code. Make some steps in
browser that was opened by playwright. Copy code from Playwright pause window.

## Annotation

Put annotation in test name (you can find @fast and @regression in example). And update your run
script to:

```bash
pnpm playwright test --config=playwright.config.ts --grep=<annotation name>
```
