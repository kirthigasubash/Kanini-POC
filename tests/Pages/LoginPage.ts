import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly continueButton: Locator;
  readonly logInButton: Locator;
  readonly logo: Locator;

  constructor(readonly page: Page) {
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.logInButton = page.getByRole('button', { name: 'Log in' });
    this.logo = page.getByRole('img', { name: 'OpenMRS logo' }).first();
  }

  async goto(): Promise<void> {
    await this.page.goto('https://dev3.openmrs.org/openmrs/spa/login');
  }

  async continueWithUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.continueButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.continueWithUsername(username);
    await this.passwordInput.fill(password);
    await this.logInButton.click();
  }
}
