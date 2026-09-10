import { type Locator, type Page } from '@playwright/test';

export type PatientDemographics = {
  firstName: string;
  familyName: string;
  sex: 'Male' | 'Female' | 'Other' | 'Unknown';
  birthDate: string;
  address?: string;
  phoneNumber?: string;
};

export class CreatePatientPage {
  readonly heading: Locator;
  readonly registerButton: Locator;
  readonly firstNameInput: Locator;
  readonly familyNameInput: Locator;
  readonly birthDateInput: Locator;
  readonly basicInfoHeading: Locator;
  readonly contactDetailsHeading: Locator;
  readonly relationshipsHeading: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Create new patient' });
    this.registerButton = page.getByRole('button', { name: 'Register patient' });
    this.firstNameInput = page.locator('input[name="givenName"]');
    this.familyNameInput = page.locator('input[name="familyName"]');
    this.birthDateInput = page.locator('input[name="birthdate"]').first();
    this.basicInfoHeading = page.getByRole('heading', { name: /Basic Info/ });
    this.contactDetailsHeading = page.getByRole('heading', { name: /Contact Details/ });
    this.relationshipsHeading = page.getByRole('heading', { name: /Relationships/ });
  }

  sexOption(sex: PatientDemographics['sex']): Locator {
    return this.page.getByRole('radio', { name: sex });
  }

  async enterDemographics(patient: PatientDemographics): Promise<void> {
    await this.firstNameInput.fill(patient.firstName);
    await this.familyNameInput.fill(patient.familyName);
    await this.sexOption(patient.sex).check();
    await this.birthDateInput.fill(patient.birthDate);

    if (patient.address) {
      await this.page.locator('input[name="address.address1"]').fill(patient.address);
    }
    if (patient.phoneNumber) {
      await this.page.locator('input[name^="attributes."]').fill(patient.phoneNumber);
    }
  }

  async register(): Promise<void> {
    await this.registerButton.click();
  }
}
