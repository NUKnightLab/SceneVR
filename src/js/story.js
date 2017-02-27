const ui = require('ui.js');
const gapiClient = require('gapiClient.js');
const template = require('template.js');

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
      let templateData = { images: [] };
      response.entry.forEach(e => {
        templateData.images.push({
          path: e.gsx$sceneimageurl.$t,
          text: e.gsx$bodytext.$t
        });
      });

      this.scene = template.buildTemplate(templateData);
    }, response => {
      console.log(response.result.error.message);
    });
  }
}