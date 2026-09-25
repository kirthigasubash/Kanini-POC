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

  async loginViaApi(username: string, password: string): Promise<void> {
    const response = await this.page.request.post(
      'https://dev3.openmrs.org/openmrs/ws/rest/v1/session',
      {
        data: {
          username,
          password,
        },
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        failOnStatusCode: false,
      }
    );

    if (!response.ok()) {
      const responseBody = await response.text();
      throw new Error(
        `OpenMRS session login failed with status ${response.status()}: ${responseBody}`
      );
    }

    const setCookieHeader = response.headers()['set-cookie'];
    const rawCookieValues = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : setCookieHeader
        ? [setCookieHeader]
        : [];

    const cookies = rawCookieValues.flatMap((rawCookie) => {
      const [nameValuePair, ...attributes] = rawCookie.split(';');
      const separatorIndex = nameValuePair.indexOf('=');

      if (separatorIndex === -1) {
        return [];
      }

      const name = nameValuePair.slice(0, separatorIndex).trim();
      const value = nameValuePair.slice(separatorIndex + 1).trim();

      return [
        {
          name,
          value,
          domain: 'dev3.openmrs.org',
          path: '/',
          httpOnly: attributes.some((attribute) =>
            attribute.toLowerCase().includes('httponly')
          ),
          secure: attributes.some((attribute) =>
            attribute.toLowerCase().includes('secure')
          ),
          url: 'https://dev3.openmrs.org',
        },
      ];
    });

    if (cookies.length > 0) {
      await this.page.context().addCookies(cookies);
    }
  }

  async selectLocation(location: string): Promise<void> {
    const locationSearch = this.page.getByRole('searchbox', { name: 'Search for a location' });
    if (!(await locationSearch.isVisible().catch(() => false))) {
      return;
    }

    await locationSearch.fill(location);
    await this.page.locator('label').filter({ hasText: location }).click();
    await this.page.getByRole('button', { name: 'Confirm' }).click();
  }
}
