import { test, expect } from './fixtures/openmrs.fixture';
import { HomePage } from './Pages/HomePage';
import { PatientChartPage } from './Pages/PatientChartPage';
import { PatientSearchPage } from './Pages/PatientSearchPage';

test.describe('Core end-user workflows', () => {
  // The shared demo intermittently rejects valid admin sessions before the scenario can start.
  test.fixme(true, 'OpenMRS demo authentication is currently unavailable for authenticated workflows.');

  test('Find an existing patient and document current vital signs', async ({ authenticatedPage }) => {
    const homePage = new HomePage(authenticatedPage);
    const patientSearchPage = new PatientSearchPage(authenticatedPage);

    // 1. Open the global patient-search panel.
    await homePage.openPatientSearch();
    await expect(patientSearchPage.heading).toBeVisible();
    await expect(patientSearchPage.closeButton).toBeVisible();

    // 2. Search for a known seeded patient by identifier.
    await patientSearchPage.searchFor('10001C6');
    await expect(patientSearchPage.result('Kenneth Carter')).toBeVisible();
    await expect(authenticatedPage.getByText('CR Number: 10001C6', { exact: true })).toBeVisible();

    // 3. Verify a nonexistent query does not return a patient record.
    await patientSearchPage.searchFor(`NoSuchPatient${Date.now()}`);
    await expect(patientSearchPage.result('Kenneth Carter')).toBeHidden();

    // 4. Search again and open the patient chart.
    await patientSearchPage.searchFor('Kenneth Carter');
    await patientSearchPage.openPatient('Kenneth Carter');
    const chartPage = new PatientChartPage(authenticatedPage);
    await expect(chartPage.patientSummaryLink).toBeVisible();
    await expect(chartPage.vitalsAndBiometricsLink).toBeVisible();
    await expect(chartPage.medicationsLink).toBeVisible();
    await expect(chartPage.ordersLink).toBeVisible();
    await expect(chartPage.resultsLink).toBeVisible();
    await expect(chartPage.visitsLink).toBeVisible();
    await expect(chartPage.allergiesLink).toBeVisible();
    await expect(chartPage.conditionsLink).toBeVisible();
    await expect(chartPage.appointmentsLink).toBeVisible();
    await expect(chartPage.billingHistoryLink).toBeVisible();

    // 5. Record a valid vital-sign set and confirm it remains on Kenneth Carter's chart.
    await chartPage.startVitalsCapture();
    await chartPage.enterVitalSigns({
      temperature: '36.8',
      systolicBloodPressure: '120',
      diastolicBloodPressure: '80',
      pulse: '72',
      respiratoryRate: '16',
      oxygenSaturation: '98',
      weight: '70',
      height: '170',
    });
    await chartPage.saveVitals();
    await expect(authenticatedPage.getByText('Kenneth Carter', { exact: true })).toBeVisible();
    await expect(authenticatedPage.getByText('120 / 80', { exact: true })).toBeVisible();
  });
});
