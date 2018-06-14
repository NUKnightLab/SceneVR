const dom = require('../utils/dom.js');

module.exports = class SceneImage { 
    constructor(data, num) {
        this.data = data;
        this.number = num;
        this.el = {
            asset: {}
        };

        this.el.asset = this.createAsset();

    }

    createAsset() {
        let asset = dom.createElement('img', `sky-${this.number}`, ['sky']);
        asset.setAttribute('src', `${this.data.image_url}image-m.jpg`);
        asset.setAttribute('crossorigin', 'anonymous');
        return asset;
    }

}
