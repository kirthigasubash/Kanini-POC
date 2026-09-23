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
    const testsOrderedPanel = page.getByRole('tabpanel', { name: 'Tests ordered' });
    this.heading = page.getByRole('main').getByText('Laboratory', { exact: true });
    this.addTestOrderButton = page.getByText('Add test order', { exact: true });
    this.testsOrderedHeading = page.getByRole('tab', { name: 'Tests ordered', exact: true });
    this.worklistHeading = page.getByText('Worklist', { exact: true });
    this.resultsHeading = page.getByText('Results', { exact: true });
    this.dateRange = testsOrderedPanel.getByText('Date range:', { exact: true });
    this.testsTable = testsOrderedPanel.getByRole('table');
  }

  async openAddTestOrder(): Promise<void> {
    await this.addTestOrderButton.click();
  }
}
