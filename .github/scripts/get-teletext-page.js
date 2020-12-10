const https = require('https');

const getTeletextPage = () => new Promise((resolve, reject) => {
  const request = https.get('https://teletext.rtvslo.si/ttxdata/629_0002.png', (response) => {
    if (response.statusCode < 200 || response.statusCode >= 300) {
      reject(new Error(`Request failed with code ${response.statusCode}`));
    }
    const data = [];
    response.on('data', (chunk) => data.push(chunk));
    response.on('end', () => resolve(Buffer.concat(data)));
  });

  request.on('error', (error) => reject(new Error(`Request failed: ${error.message}`)));
  request.end();
});

module.exports = getTeletextPage;
