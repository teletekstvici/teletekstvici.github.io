const https = require('https');
const FormData = require('form-data');
const { IgApiClient } = require('instagram-private-api');
const Twitter = require('twitter-lite');
const dotenv = require('dotenv');
const { jpg } = require('./edit-image');

dotenv.config();

function postToFacebook(message, binary) {
  const form = new FormData();
  form.append('message', message);
  form.append('source', binary, { filename: 'source.png', contentType: 'image/png' });
  form.pipe(https.request(
    `https://graph.facebook.com/${process.env.FACEBOOK_ID}/photos?access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`, { method: 'post', headers: form.getHeaders() },
  ));
}

async function postToInstagram(caption, file) {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.INSTAGRAM_USERNAME);
  await ig.simulate.preLoginFlow();
  await ig.account.login(process.env.INSTAGRAM_USERNAME, process.env.INSTAGRAM_PASSWORD);
  process.nextTick(async () => ig.simulate.postLoginFlow());
  await ig.publish.photo({ caption, file });
}

async function postToTwitter(status, binary) {
  const secrets = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  };

  const media = await new Twitter({ subdomain: 'upload', ...secrets }).post('media/upload', { media_data: binary.toString('base64') });

  await new Twitter(secrets).post('statuses/update', { status, media_ids: media.media_id_string });
}

async function postToSocials(status, image) {
  try {
    await postToTwitter(status, image);
    await postToInstagram(status, await jpg(image));
    postToFacebook(status, image);

    return null;
  } catch (error) {
    return new Error(error);
  }
}

module.exports = postToSocials;
