import { type Locator, type Page } from '@playwright/test';

export class PatientSearchPage {
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly closeButton: Locator;
  private readonly searchPanel: Locator;

  constructor(private readonly page: Page) {
    this.searchPanel = page.getByTestId('floatingSearchResultsContainer');
    this.heading = page.getByText('Search for a patient by name or identifier number');
    this.searchInput = page.getByPlaceholder('Search').or(page.getByRole('textbox')).first();
    this.closeButton = page.getByRole('button', { name: 'Close Search Panel' });
  }

  result(patientName: string): Locator {
    return this.searchPanel.getByText(patientName, { exact: true });
  }

  async searchFor(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  async openPatient(patientName: string): Promise<void> {
    await this.result(patientName).click();
  }
}
