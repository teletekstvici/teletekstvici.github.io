const looksSame = require('looks-same');

const isDifferentImage = (firstImage, secondImage) => new Promise((resolve, reject) => {
  looksSame(firstImage, secondImage, (error, success) => {
    if (error) {
      reject(new Error(`Image comparison failed: ${error.message}`));
    } else {
      resolve(!success.equal);
    }
  });
});

module.exports = isDifferentImage;
