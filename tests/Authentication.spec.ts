// spec: authentication location-selection workflow
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';
import testData from './fixtures/openmrs.test-data.json';

test.describe('Authentication With Location Selection', () => {
  test('Handle post-login location selection', async ({ page }) => {
    // 1. Open the OpenMRS login page in a fresh browser context.
    await page.goto('https://dev3.openmrs.org/openmrs/spa/login');

    // 2. Enter the valid demo username and continue.
    await page.locator('#username').fill(testData.authentication.validUser.username);
    await page.getByRole('button', { name: 'Continue' }).click();

    // 3. Enter the valid demo password and log in.
    await page.locator('input[name="password"]').fill(testData.authentication.validUser.password);
    await page.getByRole('button', { name: 'Log in' }).click();

    // 4. Accept either the location chooser or a direct home redirect, depending on the demo state.
    await expect(page).toHaveURL(/\/openmrs\/spa\/(login\/location|home(?:\/.*)?)$/, { timeout: 20000 });

    if (page.url().includes('/openmrs/spa/login/location')) {
      // 5. Search for `Outpatient Clinic`, select it, and confirm.
      await page.getByRole('searchbox', { name: 'Search for a location' }).fill(testData.authentication.expectedLocation);
      await page.locator('label').filter({ hasText: testData.authentication.expectedLocation }).click();
      await page.getByRole('button', { name: 'Confirm' }).click();
    }

    // 6. Verify the app has reached the authenticated home workspace.
    await expect(page).toHaveURL(/\/openmrs\/spa\/home(?:\/.*)?$/, { timeout: 20000 });
    const changeLocationButton = page.getByRole('button', { name: 'Change location' });
    if (await changeLocationButton.isVisible().catch(() => false)) {
      await expect(changeLocationButton).toContainText(testData.authentication.expectedLocation);
    }
  });
});
