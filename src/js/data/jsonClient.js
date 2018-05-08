const xhr = require('utils/xhr.js');

module.exports = {
  getJSONData: (jsonURL) => {
    const url = jsonURL;
    return xhr.request('GET', url).then(response => response);
  }
}
