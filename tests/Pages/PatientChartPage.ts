import { type Locator, type Page } from '@playwright/test';

export type VitalSigns = {
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
    this.patientSummaryLink = page.getByText('Patient summary', { exact: true });
    this.vitalsAndBiometricsLink = page.getByText('Vitals & Biometrics', { exact: true });
    this.medicationsLink = page.getByText('Medications', { exact: true });
    this.ordersLink = page.getByText('Orders', { exact: true });
    this.resultsLink = page.getByText('Results', { exact: true });
    this.visitsLink = page.getByText('Visits', { exact: true });
    this.allergiesLink = page.getByText('Allergies', { exact: true });
    this.conditionsLink = page.getByText('Conditions', { exact: true });
    this.appointmentsLink = page.getByText('Appointments', { exact: true });
    this.billingHistoryLink = page.getByText('Billing history', { exact: true });
    this.recordVitalsButton = page.getByRole('button', { name: 'Record vitals' });
  }

  async startVitalsCapture(): Promise<void> {
    await this.recordVitalsButton.click();
  }

  async enterVitalSigns(vitals: VitalSigns): Promise<void> {
    await this.page.getByLabel(/Temp/).fill(vitals.temperature);
    await this.page.getByLabel(/Systolic|BP/).first().fill(vitals.systolicBloodPressure);
    await this.page.getByLabel(/Diastolic/).fill(vitals.diastolicBloodPressure);
    await this.page.getByLabel(/Pulse|Heart rate/).fill(vitals.pulse);
    await this.page.getByLabel(/R\. Rate|Respiratory/).fill(vitals.respiratoryRate);
    await this.page.getByLabel(/SpO2|Oxygen/).fill(vitals.oxygenSaturation);
    await this.page.getByLabel(/Weight/).fill(vitals.weight);
    await this.page.getByLabel(/Height/).fill(vitals.height);
  }

  async saveVitals(): Promise<void> {
    await this.page.getByRole('button', { name: /Save|Submit/ }).click();
  }
}
