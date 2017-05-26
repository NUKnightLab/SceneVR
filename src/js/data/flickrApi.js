const xhr = require('utils/xhr.js');
const base58 = require('utils/base58.js');

const MAX_IMAGE_SIZE = 4096 * 2160;

function calculateImageArea(flickrImage) {
  return Number(flickrImage.width) * Number(flickrImage.height);
}

module.exports = {
  getImages: (url) => {
    let mediaId = module.exports.establishMediaUrl(url);
    const apiUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=6531cce726b38855846e85ddab1e2d1e&photo_id=${mediaId}&format=json&nojsoncallback=1`;
    return xhr.request('GET', apiUrl).then(response => {
      // sort images by area
      let sortedImages = response.sizes.size.sort((a, b) => {
        return calculateImageArea(a) > calculateImageArea(b);
      });

      // get the 'Small' version for the thumbnails
      const thumbnail = sortedImages.find(i => i.label === 'Small').source;

      // VR sky resolution is capped at 4K
      let source = sortedImages.pop();
      if (calculateImageArea(source) > MAX_IMAGE_SIZE){
        while (calculateImageArea(source) > MAX_IMAGE_SIZE)
          source = sortedImages.pop();
      }
      source = source.source;

      return { thumbnail, source }
    });
  },
  establishMediaUrl: (url) => {
    let mediaId = '';
    if (url.match(/flic.kr\/.+/i)) {
      let encoded = url.split('/').slice(-1)[0];
      mediaId = base58.decode(encoded);
    } else {
      let marker = 'flickr.com/photos/';
      let idx = url.indexOf(marker);
      // if (idx == -1) { throw new TL.Error("flickr_invalidurl_err"); }
      let pos = idx + marker.length;
      mediaId = url.substr(pos).split("/")[1];
    }

    return mediaId;
  }
}
