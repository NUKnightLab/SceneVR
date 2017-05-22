const UI = require('ui/ui.js');
const gapiClient = require('data/gapiClient.js');
const template = require('data/template.js');
const flickrApi = require('data/flickrApi.js');

module.exports = class Scenes {
    constructor(config) {
        this.config = config;

        this.buildScenes().then(() => {
            document.querySelector('body').prepend(this.scene);
            this.ui = new UI({});
        });
    }

    buildScenes() {
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
