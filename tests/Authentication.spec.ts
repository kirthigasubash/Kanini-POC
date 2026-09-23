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

    // 4. Verify the `/openmrs/spa/login/location` page is displayed.
    await expect(page).toHaveURL(/\/openmrs\/spa\/login\/location/);

    // 5. Search for `Outpatient Clinic`, select it, and confirm.
    await page.getByRole('searchbox', { name: 'Search for a location' }).fill(testData.authentication.expectedLocation);
    await page.locator('label').filter({ hasText: testData.authentication.expectedLocation }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();

    // 6. Verify the Service queues workspace and selected Outpatient Clinic location are available.
    await expect(page.getByRole('link', { name: 'Service queues' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Change location' })).toContainText(testData.authentication.expectedLocation);
  });
});
