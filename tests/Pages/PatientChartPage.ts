import { type Locator, type Page } from '@playwright/test';

export type VitalSigns = {
  visitType: string;
  temperature: string;
  systolicBloodPressure: string;
  diastolicBloodPressure: string;
  pulse: string;
  respiratoryRate: string;
  oxygenSaturation: string;
  weight: string;
  height: string;
};

export class PatientChartPage {
  readonly patientSummaryLink: Locator;
  readonly vitalsAndBiometricsLink: Locator;
  readonly medicationsLink: Locator;
  readonly ordersLink: Locator;
  readonly resultsLink: Locator;
  readonly visitsLink: Locator;
  readonly allergiesLink: Locator;
  readonly conditionsLink: Locator;
  readonly appointmentsLink: Locator;
  readonly billingHistoryLink: Locator;
  readonly recordVitalsButton: Locator;

  constructor(private readonly page: Page) {
    this.patientSummaryLink = page.getByRole('link', { name: 'Patient summary' });
    this.vitalsAndBiometricsLink = page.getByRole('link', { name: 'Vitals & Biometrics' });
    this.medicationsLink = page.getByRole('link', { name: 'Medications' });
    this.ordersLink = page.getByRole('link', { name: 'Orders' });
    this.resultsLink = page.getByRole('link', { name: 'Results' });
    this.visitsLink = page.getByRole('link', { name: 'Visits' });
    this.allergiesLink = page.getByRole('link', { name: 'Allergies' });
    this.conditionsLink = page.getByRole('link', { name: 'Conditions' });
    this.appointmentsLink = page.getByRole('link', { name: 'Appointments' });
    this.billingHistoryLink = page.getByRole('link', { name: 'Billing history' });
    this.recordVitalsButton = page.getByRole('button', { name: 'Record vitals', exact: true });
  }

  async startVitalsCapture(visitType: string): Promise<void> {
    await this.recordVitalsButton.click();
    const startNewVisitButton = this.page.getByRole('button', { name: 'Start new visit' });
    const vitalsInput = this.page.locator('input[type="number"]').first();
    const visitRequired = await Promise.race([
      startNewVisitButton.waitFor({ state: 'visible', timeout: 20_000 }).then(() => true),
      vitalsInput.waitFor({ state: 'visible', timeout: 20_000 }).then(() => false),
    ]);

    if (visitRequired) {
      await startNewVisitButton.click();
      await this.page.getByText(visitType, { exact: true }).click();
      const startVisitButton = this.page.getByRole('button', { name: 'Start visit', exact: true });
      const startVisitWorkspace = this.page.getByRole('banner', { name: 'Workspace header' }).getByText('Start a visit', { exact: true });
      await startVisitButton.click();
      await startVisitWorkspace.waitFor({ state: 'hidden', timeout: 30_000 });
      await this.recordVitalsButton.click();
    }

    await this.page.locator('input[type="number"]').first().waitFor({ state: 'visible', timeout: 20_000 });
  }

  async enterVitalSigns(vitals: VitalSigns): Promise<void> {
    await this.page.locator('input[name="Temperature"]').fill(vitals.temperature);
    await this.page.locator('input[name="systolic"]').fill(vitals.systolicBloodPressure);
    await this.page.locator('input[name="diastolic"]').fill(vitals.diastolicBloodPressure);
    await this.page.locator('input[name="Pulse"]').fill(vitals.pulse);
    await this.page.locator('input[name="Respiration rate"]').fill(vitals.respiratoryRate);
    await this.page.locator('input[name="Oxygen saturation"]').fill(vitals.oxygenSaturation);
    await this.page.locator('input[name="Weight"]').fill(vitals.weight);
    await this.page.locator('input[name="Height"]').fill(vitals.height);
  }

  async saveVitals(): Promise<void> {
    await this.page.getByRole('button', { name: /Save|Submit/ }).click();
  }
}
