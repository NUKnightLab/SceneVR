const dom = require('../utils/dom.js');

module.exports = class Caption {
    constructor(add_to_container) {
        this._text = "";

        this.el = {
            container: dom.createElement("div", "svr-caption"),
            text_container: dom.createElement('div', '', ["svr-text"])
        }


        this.el.container.appendChild(this.el.text_container);

        if (add_to_container) {
            add_to_container.appendChild(this.el.container);
        };
    }

    get text() {
        return this._text;
    }

    set text(new_text) {
        this._text = new_text;
        this.el.text_container.innerHTML = this._text;
    }

}
