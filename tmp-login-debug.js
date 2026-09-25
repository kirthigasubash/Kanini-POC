const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER_CONSOLE', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE_ERROR', err.message));
  page.on('requestfailed', req => console.log('REQUEST_FAILED', req.url(), req.failure() && req.failure().errorText));
  page.on('response', async response => {
    if (response.request().url().includes('/openmrs')) {
      console.log('RESPONSE', response.status(), response.request().method(), response.url());
    }
  });
  await page.goto('https://dev3.openmrs.org/openmrs/spa/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(15000);
  console.log('URL_AFTER_WAIT', page.url());
  console.log('DOC_TITLE', await page.title().catch(() => 'ERR'));
  console.log('HTML_LEN', (await page.content()).length);
  const html = await page.content();
  console.log(html.slice(0, 2000));
  await browser.close();
})().catch(err => { console.error('TOP_ERROR', err); process.exit(1); });
