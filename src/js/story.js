const ui = require('ui.js');
const gapiClient = require('gapiClient.js');
const template = require('template.js');
const flickrApi = require('flickrApi.js');

module.exports = class Story {
  constructor(config) {
    this.config = config;

    this.buildScene().then(() => {
      document.querySelector('body').appendChild(this.scene);
      ui.addEventListeners();
    });
  }

  buildScene() {
    return gapiClient.getSpreadsheetData(this.config.source).then(response => {
      let promises = [];
      let templateData = { images: [] };
      response.entry.forEach(e => promises.push(flickrApi.getImages(e.gsx$image.$t)));

      // wait until all Flickr URLs are ready before building the template
      return Promise.all(promises).then(objects => {
        objects.forEach((o, i) => {
          templateData.images.push({
            path: o.source,
            thumbnailPath: o.thumbnail,
            text: response.entry[i].gsx$text.$t
          });
        })
        this.scene = template.buildTemplate(templateData);
      });
    }, response => {
      console.log(response.result.error.message);
    });
  }
}