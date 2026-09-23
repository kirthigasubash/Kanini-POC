import { test, expect } from './fixtures/openmrs.fixture';
import { HomePage } from './Pages/HomePage';
import { PatientChartPage } from './Pages/PatientChartPage';
import { PatientSearchPage } from './Pages/PatientSearchPage';
import testData from './fixtures/openmrs.test-data.json';

test.describe('@Core end-user workflows', () => {
  test('Find an existing patient and document current vital signs', async ({ authenticatedPage }) => {
    const homePage = new HomePage(authenticatedPage);
    const patientSearchPage = new PatientSearchPage(authenticatedPage);

    // 1. Open the global patient-search panel.
    await homePage.openPatientSearch();
    await expect(patientSearchPage.heading).toBeVisible();
    await expect(patientSearchPage.closeButton).toBeVisible();

    // 2. Search for a known seeded patient by identifier.
    await patientSearchPage.searchFor(testData.patients.seeded.identifier);
    await expect(patientSearchPage.result(testData.patients.seeded.name)).toBeVisible();
    await expect(authenticatedPage.getByText(`OpenMRS ID: ${testData.patients.seeded.identifier}`, { exact: true })).toBeVisible();

    // 3. Verify a nonexistent query does not return a patient record.
    await patientSearchPage.searchFor(`${testData.patients.missingSearchPrefix}${Date.now()}`);
    await expect(patientSearchPage.result(testData.patients.seeded.name)).toBeHidden();

    // 4. Search again and open the patient chart.
    await patientSearchPage.searchFor(testData.patients.seeded.name);
    await patientSearchPage.openPatient(testData.patients.seeded.name);
    const chartPage = new PatientChartPage(authenticatedPage);
    await expect(chartPage.patientSummaryLink).toBeVisible();
    await expect(chartPage.recordVitalsButton).toBeVisible({ timeout: 20_000 });

    // 5. Record a valid vital-sign set and confirm it remains on Kenneth Carter's chart.
    await chartPage.startVitalsCapture(testData.vitals.visitType);
    await chartPage.enterVitalSigns(testData.vitals);
    await chartPage.saveVitals();
    await expect(authenticatedPage.getByRole('banner', { name: 'patient banner' }).getByText(testData.patients.seeded.name, { exact: true })).toBeVisible();
    const latestVitalsRow = authenticatedPage
      .getByRole('table', { name: 'vitals' })
      .getByRole('row')
      .filter({ hasText: `${testData.vitals.systolicBloodPressure} / ${testData.vitals.diastolicBloodPressure}` })
      .first();
    await expect(latestVitalsRow).toBeVisible();
  });
});
