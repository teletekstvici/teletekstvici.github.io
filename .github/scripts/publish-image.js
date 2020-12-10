const { border, watermark, png } = require('./edit-image');
const postToSocials = require('./post-to-socials');

(async () => {
  try {
    const image = await border('./.github/assets/latest.png');
    const date = (new Date()).toLocaleString('sl-SI', { weekday: 'long', month: 'long', day: 'numeric' });
    await png(image); // Build website
    await postToSocials(`${date.charAt(0).toUpperCase()}${date.slice(1)}`, await watermark(image));
  } catch (error) {
    console.error(error);
  }
})();
