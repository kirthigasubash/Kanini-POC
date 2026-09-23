import { test, expect } from './fixtures/openmrs.fixture';
import { HomePage } from './Pages/HomePage';
import { LaboratoryPage } from './Pages/LaboratoryPage';
import testData from './fixtures/openmrs.test-data.json';

test.describe('@Core end-user workflows', () => {
  test('Create and track a laboratory test order through its result status', async ({ authenticatedPage }) => {
    const homePage = new HomePage(authenticatedPage);

    // 1. Open the laboratory workspace and verify the order-management summary.
    await homePage.openLaboratory();
    const laboratoryPage = new LaboratoryPage(authenticatedPage);
    await expect(laboratoryPage.heading).toBeVisible();
    await expect(laboratoryPage.addTestOrderButton).toBeVisible();
    await expect(laboratoryPage.testsOrderedHeading).toBeVisible();
    await expect(laboratoryPage.worklistHeading).toBeVisible();
    await expect(laboratoryPage.resultsHeading).toBeVisible();
    await expect(laboratoryPage.dateRange).toBeVisible();
    await expect(laboratoryPage.testsTable).toBeVisible();

    // 2. Start a test order and select a known patient through the patient-search panel.
    await laboratoryPage.openAddTestOrder();
    const patientSearchInput = authenticatedPage.getByRole('searchbox', { name: 'Search for a patient by name or identifier number' });
    await expect(patientSearchInput).toBeVisible();
    await patientSearchInput.fill(testData.patients.seeded.identifier);
    await authenticatedPage.getByRole('button', { name: 'Search', exact: true }).click();
    await authenticatedPage.getByRole('button', { name: new RegExp(`Avatar for ${testData.patients.seeded.name}`) }).click();

    // 3. Verify an empty order basket cannot be signed before a test is added.
    const orderBasket = authenticatedPage.getByRole('banner', { name: 'Workspace header' }).getByText('Order basket', { exact: true });
    await expect(orderBasket).toBeVisible();
    await expect(authenticatedPage.getByRole('heading', { name: 'Lab orders (0)' })).toBeVisible();
    await expect(authenticatedPage.getByRole('button', { name: 'Add', exact: true })).toBeVisible();
    await expect(authenticatedPage.getByRole('button', { name: 'Sign and close', exact: true })).toBeDisabled();

    // 4. Verify the laboratory lifecycle views remain distinguishable.
    await expect(laboratoryPage.testsOrderedHeading).toBeVisible();
    await expect(laboratoryPage.worklistHeading).toBeVisible();
    await expect(laboratoryPage.resultsHeading).toBeVisible();
    await expect(authenticatedPage.getByRole('tab', { name: 'In progress', exact: true })).toBeVisible();
    await expect(authenticatedPage.getByRole('tab', { name: 'Completed', exact: true })).toBeVisible();
    await expect(authenticatedPage.getByRole('tab', { name: 'Declined tests', exact: true })).toBeVisible();
  });
});
