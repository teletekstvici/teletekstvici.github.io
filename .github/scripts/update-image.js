const fs = require('fs');
const getTeletextPage = require('./get-teletext-page');
const isDifferentImage = require('./is-different-image');

(async () => {
  try {
    const latest = './.github/assets/latest.png';
    const teletext = await getTeletextPage();
    if (!fs.existsSync('./img')) fs.mkdirSync('./img');
    if (!fs.existsSync(latest) || await isDifferentImage(latest, teletext)) {
      fs.writeFileSync(latest, teletext);
    }
  } catch (error) {
    console.error(error);
  }
})();
