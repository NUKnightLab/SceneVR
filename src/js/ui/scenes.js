const UI = require('ui/ui.js');
const gapiClient = require('data/gapiClient.js');
const template = require('data/template.js');
const flickrApi = require('data/flickrApi.js');
const jsonClient = require('data/jsonClient.js');

module.exports = class Scenes {
    constructor(config) {
        this.config = config;

        if (config.sourceType == 'spreadsheet'){
          this.buildScenesFromSpreadsheet().then(() => {
              document.querySelector('body').prepend(this.scene);
              this.ui = new UI(config);
          });
        }
        else if (config.sourceType == 'json'){
          this.buildScenesFromJSON().then(() => {
              document.querySelector('body').prepend(this.scene);
              this.ui = new UI(config);
          });
        }

    }

    buildScenesFromJSON() {
      return jsonClient.getJSONData(this.config.source).then(response => {
        let templateData = {
          images: response.scenes
        };

        this.scene = template.buildTemplate(templateData);

      }, response => {
          console.log(response.result.error.message);
      });
    }

    buildScenesFromSpreadsheet(){
      return gapiClient.getSpreadsheetData(this.config.source).then(response => {
            let promises = [];
            let templateData = {
                images: []
            };
            response.entry.forEach(e => promises.push(flickrApi.getImages(e.gsx$image.$t)));

            // wait until all Flickr URLs are ready before building the template
            return Promise.all(promises).then(objects => {
                objects.forEach((o, i) => {
                    templateData.images.push({
                        path: o.source,
                        thumbnailPath: o.thumbnail,
                        text: response.entry[i].gsx$text.$t
                    });
                });
                this.scene = template.buildTemplate(templateData);
            });
        }, response => {
            console.log(response.result.error.message);
        });

    }
}
