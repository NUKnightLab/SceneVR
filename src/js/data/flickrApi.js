const xhr = require('utils/xhr.js');
const base58 = require('utils/base58.js');

module.exports = {
  getImages: (url) => {
    let mediaId = module.exports.establishMediaUrl(url);
    const apiUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=6531cce726b38855846e85ddab1e2d1e&photo_id=${mediaId}&format=json&nojsoncallback=1`;
    return xhr.request('GET', apiUrl).then(response => {
      // get the 'Small' version for the thumbnails, 4K for VR sky unless original is less than 4K
      let arr = response.sizes.size.filter(r => r.label === 'Small' || r.height === 2048 || r.label === 'Original');
      return {
        thumbnail: arr[0].source,
        source: arr[1].source
      }
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