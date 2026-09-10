import { type Locator, type Page } from '@playwright/test';

export class AppointmentsPage {
  readonly heading: Locator;
  readonly createAppointmentButton: Locator;
  readonly serviceTypeFilter: Locator;
  readonly statusFilter: Locator;
  readonly tableFilterInput: Locator;
  readonly appointmentsTable: Locator;
  readonly createWorkspaceHeader: Locator;
  readonly patientSearchInput: Locator;
  readonly closeCreateWorkspaceButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Appointments' }).first();
    this.createAppointmentButton = page.getByText('Create new appointment', { exact: true });
    this.serviceTypeFilter = page.getByRole('combobox').first();
    this.statusFilter = page.getByRole('combobox').last();
    this.tableFilterInput = page.getByRole('searchbox', { name: 'Filter appointments' });
    this.appointmentsTable = page.getByRole('table');
    this.createWorkspaceHeader = page.getByRole('banner', { name: 'Workspace header' }).getByText('Create new appointment', { exact: true });
    this.patientSearchInput = page.getByRole('searchbox', { name: 'Search for a patient by name or identifier number' });
    this.closeCreateWorkspaceButton = page.getByRole('button', { name: 'Close' });
  }

  async openCreateAppointment(): Promise<void> {
    await this.createAppointmentButton.click();
  }

  async closeCreateAppointment(): Promise<void> {
    await this.closeCreateWorkspaceButton.click();
  }

  async filterByPatient(patientName: string): Promise<void> {
    await this.tableFilterInput.fill(patientName);
  }

  checkInButtonFor(patientName: string): Locator {
    return this.appointmentsTable.getByRole('row', { name: new RegExp(patientName) }).getByRole('button', { name: 'Check In' });
  }

  async checkIn(patientName: string): Promise<void> {
    await this.checkInButtonFor(patientName).click();
  }
}
