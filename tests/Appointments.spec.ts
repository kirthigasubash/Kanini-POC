// spec: appointment creation workflow
// seed: tests/seed.spec.ts

import { expect, test } from './fixtures/openmrs.fixture';
import { HomePage } from './Pages/HomePage';
import testData from './fixtures/openmrs.test-data.json';

test.describe('@Core end-user workflows', () => {
  test('Create an appointment for a patient and verify it in the appointments table', async ({ authenticatedPage }) => {
    const homePage = new HomePage(authenticatedPage);
    const patient = testData.patients.seeded;
    const appointment = {
      location: testData.authentication.expectedLocation,
      service: 'General Medicine service',
      durationMinutes: '30',
    };
    const appointmentDateTime = new Date(Date.now() + (240 + Math.floor(Math.random() * 120)) * 60 * 1000);
    const appointmentHour = appointmentDateTime.getHours();
    const appointmentTime = `${String(appointmentHour % 12 || 12).padStart(2, '0')}:${String(appointmentDateTime.getMinutes()).padStart(2, '0')}`;
    const appointmentMeridiem = appointmentHour >= 12 ? 'PM' : 'AM';

    // 1. Authenticate to OpenMRS and open Appointments.
    await homePage.openAppointments();
    await expect(authenticatedPage.getByRole('heading', { name: 'Appointments' }).first()).toBeVisible();

    // 2. Click Create new appointment.
    await authenticatedPage.getByRole('button', { name: 'Create new appointment', exact: true }).click();
    await expect(authenticatedPage.getByRole('searchbox', { name: 'Search for a patient by name or identifier number' })).toBeVisible();

    // 3. Search for the seeded patient by identifier and select them.
    await authenticatedPage.getByTestId('patientSearchBar').fill(patient.identifier);
    await authenticatedPage.getByRole('button', { name: 'Search', exact: true }).click();
    await authenticatedPage.getByRole('button', { name: new RegExp(`Avatar for ${patient.name}`) }).click();

    // 4. Select the available service and appointment time, then save the appointment.
    await authenticatedPage.locator('#location').selectOption({ label: appointment.location });
    await authenticatedPage.locator('#service').selectOption({ label: appointment.service });
    await authenticatedPage.locator('#time-picker').fill(appointmentTime);
    await authenticatedPage.locator('#time-picker-select-1').selectOption(appointmentMeridiem);
    await authenticatedPage.locator('#duration').fill(appointment.durationMinutes);
    await authenticatedPage.getByRole('button', { name: 'Save and close', exact: true }).click();

    // 5. Filter the appointment table by the patient name and verify the created appointment is displayed.
    await authenticatedPage.getByRole('searchbox', { name: 'Filter appointments' }).fill(patient.name);
    const appointmentRow = authenticatedPage
      .getByRole('table')
      .getByRole('row', { name: new RegExp(`${patient.name}.*${appointment.location}.*${appointment.service}.*${appointmentTime} ${appointmentMeridiem}.*Scheduled`) });
    await expect(appointmentRow).toBeVisible();
  });
});
