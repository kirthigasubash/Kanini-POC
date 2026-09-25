import { test as base, expect, type Page } from '@playwright/test';

import { HomePage } from '../Pages/HomePage';
import { LoginPage } from '../Pages/LoginPage';

import testData from './openmrs.test-data.json';

type OpenMRSFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<OpenMRSFixtures>({
  authenticatedPage: async ({ browser }, use) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    const loginPage = new LoginPage(page);

    try {
      // 1. Open login page
      await loginPage.goto();

      // 2. Login
      await loginPage.login(
        testData.authentication.validUser.username,
        testData.authentication.validUser.password
      );

      // The OpenMRS SPA occasionally stalls on the username step, so fall back
      // to the session API to ensure the browser has a valid authenticated state.
      if (page.url().includes('/openmrs/spa/login')) {
        await loginPage.loginViaApi(
          testData.authentication.validUser.username,
          testData.authentication.validUser.password
        );
        await page.goto('/openmrs/spa/home/service-queues', {
          waitUntil: 'domcontentloaded',
        });
      }

      // 3. Wait for either location page or home page
      await expect(page).toHaveURL(
        /\/openmrs\/spa\/(login\/location|home(?:\/.*)?)$/,
        {
          timeout: 20_000,
        }
      );

      // 4. Select location if required
      if (page.url().includes('/openmrs/spa/login/location')) {
        await loginPage.selectLocation(
          testData.authentication.expectedLocation
        );
      }

      // 5. Verify we are authenticated
      await expect(page).toHaveURL(
        /\/openmrs\/spa\/home(?:\/.*)?$/,
        {
          timeout: 20_000,
        }
      );

      // 6. Go to service queues/home
      await page.goto('/openmrs/spa/home/service-queues');

      // 7. Wait for the page to be ready
      await page.waitForLoadState('domcontentloaded');

      // 8. Give the authenticated page to the test
      await use(page);

    } finally {
      // Close only after the test has finished
      await context.close().catch(() => undefined);
    }
  },
});

export { expect };