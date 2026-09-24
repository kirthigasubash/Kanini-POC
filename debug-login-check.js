const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://dev3.openmrs.org/openmrs/spa/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log('START=' + page.url());
  await page.locator('#username').fill('admin');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.locator('input[name="password"]').fill('Admin123');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForTimeout(20000);
  console.log('AFTER_LOGIN=' + page.url());
  console.log('TITLE=' + await page.title());
  const body = await page.locator('body').innerText();
  console.log('BODY=' + body.slice(0, 2000));
  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
