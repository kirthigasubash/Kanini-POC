import { type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly serviceQueuesLink: Locator;
  readonly appointmentsLink: Locator;
  readonly laboratoryLink: Locator;
  readonly searchPatientButton: Locator;
  readonly addPatientButton: Locator;
  readonly changeLocationButton: Locator;
  readonly myAccountButton: Locator;
  readonly appMenuButton: Locator;

  constructor(private readonly page: Page) {
    this.serviceQueuesLink = page.getByRole('link', { name: 'Service queues' });
    this.appointmentsLink = page.getByRole('link', { name: 'Appointments' });
    this.laboratoryLink = page.getByRole('link', { name: 'Laboratory' });
    this.searchPatientButton = page.getByRole('button', { name: 'Search patient' });
    this.addPatientButton = page.getByRole('button', { name: 'Add patient' });
    this.changeLocationButton = page.getByRole('button', { name: 'Change location' });
    this.myAccountButton = page.getByRole('button', { name: 'My Account' });
    this.appMenuButton = page.getByRole('button', { name: 'App Menu' });
  }

  async openAppointments(): Promise<void> {
    await this.appointmentsLink.click();
  }

  async openLaboratory(): Promise<void> {
    await this.laboratoryLink.click();
  }

  async openPatientRegistration(): Promise<void> {
    await this.addPatientButton.click();
  }

  async openPatientSearch(): Promise<void> {
    await this.searchPatientButton.click();
  }
}
