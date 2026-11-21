import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { getReadyUrl, workspaceRoot } from '@nx/devkit';

const isCI = !!process.env['CI'];

// A Snap-packaged VS Code exports GIO_MODULE_DIR (a path under ~/snap/ or
// /snap/) into its terminals. WebKit's network process then loads Snap
// libraries and crashes, so every page load fails with "WebKit encountered an
// internal error". Dropping the variable only when it points into a Snap
// fixes that, and leaves CI and other machines untouched.
const webkitEnv = Object.fromEntries(
  Object.entries(process.env).filter(
    (entry): entry is [string, string] =>
      entry[1] !== undefined &&
      !(entry[0] === 'GIO_MODULE_DIR' && /\/snap\//.test(entry[1])),
  ),
);
// getReadyUrl moves the address to the port the server task reported.
const webServerAddress = getReadyUrl(
  isCI ? 'http://localhost:3000' : 'http://127.0.0.1:3000',
);

// For CI, you may want to set BASE_URL to the deployed application.
const baseURL = process.env['BASE_URL'] || webServerAddress;

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import 'dotenv/config';

/**
 * See https://playwright.dev/docs/test-configuration.
 *
 * Generated as a .mts file so Node forces ESM regardless of workspace
 * `type`. Playwright routes `.mts` through its ESM loader (dynamic import,
 * bypassing the pirates CJS-compile path), and Nx's native TS strip loads
 * `.mts` directly. Playwright's configLoader auto-discovers
 * `playwright.config.mts` via its extension list
 * (.ts/.js/.mts/.mjs/.cts/.cjs).
 */
export default defineConfig({
  ...nxE2EPreset(import.meta.dirname, { testDir: './src' }),
  // CI: fail on a committed test.only, retry once so traces get recorded,
  // and run serially for stable timing on small runners.
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 1 : undefined,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  webServer: {
    command: isCI ? 'npx nx run storefront:start' : 'npx nx run storefront:dev',
    url: webServerAddress,
    // Keep true, also on CI: the Nx e2e target already starts the server
    // (dependsOn storefront:dev, or storefront:start when CI is set) and waits
    // until it is ready. With false, Playwright would start a second server
    // on the same port and fail.
    reuseExistingServer: true,
    // CI runs `next build` before `next start`, which can exceed the 60 s default.
    timeout: 180_000,
    cwd: workspaceRoot,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        launchOptions: { env: webkitEnv },
      },
    },

    // Uncomment for mobile browsers support
    /* {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    }, */

    // Uncomment for branded browsers
    /* {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    } */
  ],
});
