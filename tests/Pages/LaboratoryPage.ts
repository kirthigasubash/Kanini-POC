import { type Locator, type Page } from '@playwright/test';

export class LaboratoryPage {
  readonly heading: Locator;
  readonly addTestOrderButton: Locator;
  readonly testsOrderedHeading: Locator;
  readonly worklistHeading: Locator;
  readonly resultsHeading: Locator;
  readonly dateRange: Locator;
  readonly testsTable: Locator;

  constructor(page: Page) {
    this.heading = page.getByRole('heading', { name: 'Laboratory' }).first();
    this.addTestOrderButton = page.getByText('Add test order', { exact: true });
    this.testsOrderedHeading = page.getByText('Tests ordered', { exact: true });
    this.worklistHeading = page.getByText('Worklist', { exact: true });
    this.resultsHeading = page.getByText('Results', { exact: true });
    this.dateRange = page.getByText('Date range:', { exact: true });
    this.testsTable = page.getByRole('table');
  }

  async openAddTestOrder(): Promise<void> {
    await this.addTestOrderButton.click();
  }
}
