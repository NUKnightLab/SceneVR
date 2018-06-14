const dom = require('../utils/dom.js');
const template = require('../data/template.js');

module.exports = class Stage {
    constructor(config, add_to_container) {
        this.config = config;
        this.el = {
            scene: dom.createElement('a-scene'),
            assets: {},
            camera: {},
            skybox: {}
        };
        this.el.scene.setAttribute("reverse-look-controls", "reverse-look-controls");
        this.el.scene.innerHTML = template.template_scene;
        this.el.assets = this.el.scene.querySelector('a-assets');
        this.el.camera = this.el.scene.querySelector('#camera');
        this.el.skybox = this.el.scene.querySelector('#skybox');

        if (add_to_container) {
			add_to_container.appendChild(this.el.scene);
		};

    }


}
