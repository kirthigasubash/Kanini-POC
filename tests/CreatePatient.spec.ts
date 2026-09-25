import { test, expect } from './fixtures/openmrs.fixture';
import { CreatePatientPage } from './Pages/CreatePatient';
import { HomePage } from './Pages/HomePage';
import { PatientSearchPage } from './Pages/PatientSearchPage';
import testData from './fixtures/openmrs.test-data.json';

test.describe('@Core end-user workflows', () => {
  test('Register a new patient with mandatory demographics and optional contact information', async ({ authenticatedPage }) => {
    const homePage = new HomePage(authenticatedPage);
    const uniqueSuffix = Date.now().toString();
    const firstName = `${testData.patients.registration.firstNamePrefix}${uniqueSuffix}`;
    const familyName = testData.patients.registration.familyName;

    // 1. Start at the clinical home page and open patient registration.
    await homePage.openPatientRegistration();
    const createPatientPage = new CreatePatientPage(authenticatedPage);
    await expect(createPatientPage.heading).toBeVisible();
    await expect(createPatientPage.basicInfoHeading).toBeVisible();
    await expect(createPatientPage.contactDetailsHeading).toBeVisible();
    await expect(createPatientPage.relationshipsHeading).toBeVisible();

    // 2. Submit an empty form to verify required demographics prevent registration.
    await createPatientPage.register();
    await expect(authenticatedPage).toHaveURL(/patient-registration/);
    await expect(createPatientPage.firstNameInput).toBeVisible();
    const validationSnackbar = authenticatedPage.getByRole('alertdialog', { name: 'The following fields have errors:' });
    await expect(validationSnackbar).toBeVisible();
    await validationSnackbar.getByRole('button', { name: 'Close snackbar' }).click();
    await expect(validationSnackbar).toBeHidden();

    // 3. Enter valid mandatory demographics and optional contact details.
    await createPatientPage.enterDemographics({
      firstName,
      familyName,
      sex: testData.patients.registration.sex,
      birthDate: testData.patients.registration.birthDate,
      address: testData.patients.registration.address,
      phoneNumber: testData.patients.registration.phoneNumber,
    });
    await expect(
      authenticatedPage.getByTestId('identifier-placeholder').first()
    ).toBeVisible();

    // 4. Register the patient once and verify the resulting patient record.
    await createPatientPage.register();
    await expect(authenticatedPage).toHaveURL(/\/patient\/.*\/chart/, { timeout: 20_000 });
    const registrationSnackbar = authenticatedPage.getByRole('alertdialog', { name: 'New Patient Created' });
    await expect(registrationSnackbar).toBeVisible();
    await registrationSnackbar.getByRole('button', { name: 'Close snackbar' }).click();

    // 5. Find the newly registered patient through global search and reopen their chart.
    await homePage.openPatientSearch();
    const patientSearchPage = new PatientSearchPage(authenticatedPage);
    await patientSearchPage.searchFor(firstName);
    await expect(patientSearchPage.result(`${firstName} ${familyName}`)).toBeVisible();
    await patientSearchPage.openPatient(`${firstName} ${familyName}`);
    await expect(authenticatedPage).toHaveURL(/\/patient\/.*\/chart/);
  });
});
