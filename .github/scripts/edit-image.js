const fs = require('fs');
const sharp = require('sharp');
const imagemin = require('imagemin');
const imageminOptipng = require('imagemin-optipng');

const crop = async (image) => sharp(image).metadata().then(
  ({ width, height }) => sharp(image).extract({
    left: 60, top: 0, width: width - 60, height,
  }).resize(Math.round((width - 60) * 2)).toBuffer(),
);

const pad = async (image) => sharp(image).trim().extend(40).toBuffer();

const border = async (image) => pad(await crop(image));

const watermark = async (image) => sharp(image).extend({
  bottom: 60, top: 0, left: 0, right: 0,
}).composite([{ input: './.github/assets/logo.svg', gravity: 'southeast' }]).toBuffer();

const jpg = async (image) => sharp(image).toFormat('jpg').toBuffer();

const png = async (image) => {
  if (!fs.existsSync('./img')) fs.mkdirSync('./img');
  fs.writeFileSync(`./img/${(new Date()).toISOString().substring(0, 10)}.png`, await imagemin.buffer(image, { plugins: [imageminOptipng()] }));
};

module.exports = {
  border, watermark, jpg, png,
};
