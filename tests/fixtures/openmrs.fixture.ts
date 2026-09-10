import { test as base, expect, type Page } from '@playwright/test';
import { HomePage } from '../Pages/HomePage';
import { LoginPage } from '../Pages/LoginPage';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Admin123';

type OpenMRSFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<OpenMRSFixtures>({
  authenticatedPage: async ({ browser }, use, testInfo) => {
    const statePath = testInfo.outputPath('admin-storage-state.json');
    let authenticatedStateSaved = false;

    for (let attempt = 1; attempt <= 3 && !authenticatedStateSaved; attempt += 1) {
      const loginContext = await browser.newContext();
      const loginBrowserPage = await loginContext.newPage();
      const loginPage = new LoginPage(loginBrowserPage);

      try {
        await loginPage.goto();
        await loginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);
        await expect(new HomePage(loginBrowserPage).serviceQueuesLink).toBeVisible({ timeout: 20_000 });
        await loginContext.storageState({ path: statePath });
        authenticatedStateSaved = true;
      } catch {
        // The shared demo intermittently rejects a valid session; retry in a clean context.
      } finally {
        await loginContext.close();
      }
    }

    if (!authenticatedStateSaved) {
      throw new Error('Unable to authenticate with the OpenMRS demo account after three attempts.');
    }

    const authenticatedContext = await browser.newContext({ storageState: statePath });
    const authenticatedPage = await authenticatedContext.newPage();
    await authenticatedPage.goto('/openmrs/spa/home/service-queues');
    await use(authenticatedPage);
    await authenticatedContext.close();
  },
});

export { expect };
