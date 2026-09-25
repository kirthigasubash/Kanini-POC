const https = require('https');
const urls = [
  'https://dev3.openmrs.org/openmrs/login.htm',
  'https://dev3.openmrs.org/openmrs/spa/login',
  'https://dev3.openmrs.org/openmrs/login.htm?redirect=%2Fopenmrs%2Fspa%2Fhome'
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ url, status: res.statusCode, contentType: res.headers['content-type'], body: data.slice(0, 500).replace(/\s+/g, ' ') }));
    }).on('error', reject);
  });
}

(async () => {
  for (const url of urls) {
    try {
      const result = await fetchUrl(url);
      console.log('\nURL:', result.url);
      console.log('STATUS:', result.status, 'CTYPE:', result.contentType);
      console.log(result.body);
    } catch (err) {
      console.log('ERR', url, err.message);
    }
  }
})();
