// const UI = require('../ui/ui.js');
const data = require('../data/data.js');
const template = require('../data/template.js');
const dom = require('../utils/dom.js');
const SceneImage = require('../ui/SceneImage.js');
const Stage = require('../ui/Stage.js');

module.exports = class Scenes {
    constructor(config) {
        this.config = config;
        this.el = {
            container: {},
            stage: {},
            ui: {},
            loading: document.getElementById("loading")
        };
        this.scenes = [];
        this.stage = {};


        // LOAD DATA
        data.getJSON(this.config.source).then(
            response => {
                this.data = response;
                this.buildTemplate();
                this.buildScenes().then(
                    response => {
                        console.log(response);
                        this.appendScenes();
                    },
                    response => {
                        console.log(response);
                    }
                );

            },
            response => {
                console.error("FAILED TO LOAD DATA");
                console.log(response);
            }
        )
    }

    buildTemplate() {
        this.el.container = dom.createElement('section', '#scene-vr');
        this.stage = new Stage(this.config, this.el.container);
        this.el.ui = dom.createElement('div', '#svr-ui');

        //this.el.container.innerHTML = template.template_scene;
        //this.el.ui.innerHTML = template.template_ui;
    }

    buildScenes() {
        return new Promise((resolve, reject) => {
            this.data.scenes.forEach((s, i) => {
                let scene = new SceneImage(s,i);
                this.scenes.push(scene);
                console.log(scene);

            });
            resolve("WORKED");
            reject("DIDN'T WORK");
        });
    }

    appendScenes() {
        this.el.loading.style.visibility = "hidden";
        this.el.container.appendChild(this.el.ui);

        document.body.appendChild(this.el.container);

    }

    buildScenesOLD() {
        return data.getJSON(this.config.source).then(
            response => {
                let promises = [];
                let template_data = {
                    scenes: response.scenes
                };

                console.log(template_data);
                this.scene = template.buildTemplate(template_data);

            },

            response => {
                console.log(response.scenes);
            }

        );
    }
}
