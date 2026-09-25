const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://dev3.openmrs.org/openmrs/spa/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log('URL', page.url());
  try {
    const text = await page.locator('body').innerText();
    console.log('BODY_TEXT_START');
    console.log(text.slice(0, 2000));
  } catch (e) {
    console.error('BODY_TEXT_ERROR', e.message);
  }
  try {
    const username = page.getByRole('textbox', { name: 'Username' });
    console.log('USERNAME_COUNT', await username.count());
    console.log('USERNAME_VISIBLE', await username.first().isVisible().catch(() => 'ERR'));
  } catch (e) {
    console.error('USERNAME_CHECK_ERROR', e.message);
  }
  await page.waitForTimeout(5000);
  await browser.close();
})().catch(err => {
  console.error('TOP_ERROR', err);
  process.exit(1);
});
