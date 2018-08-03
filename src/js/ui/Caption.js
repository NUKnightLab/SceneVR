const dom = require('../utils/dom.js');

module.exports = class Caption {
    constructor(add_to_container) {
        this._text = "";
        this._header_text = "";
        this._visible = true;

        this.el = {
            container: dom.createElement("div", "", ["svr-caption"]),
            text_container: dom.createElement('div', '', ["svr-text"])
        }


        this.el.container.appendChild(this.el.text_container);

        if (add_to_container) {
            add_to_container.appendChild(this.el.container);
        };
    }

    get visible() {
        return this._visible;
    }

    set visible(v) {
        this._visible = v;
        if (this._visible) {
            this.el.container.style.display = "block";
        } else {
            this.el.container.style.display = "none";
        }
    }

    get text() {
        return this._text;
    }

    set text(new_text) {
        if (new_text && new_text != null) {
            this._text = new_text;
        } else {
            this._text = "";
        }
        this.renderText();
    }

    get header_text() {
        return this._header_text;
    }

    set header_text(new_text) {
        if (new_text && new_text != null) {
            this._header_text = new_text;
        } else {
            this._header_text = "";
        }
        this.renderText();
    }

    renderText() {
        let t = "";
        if (this._header_text) {
            t += `<h2>${this._header_text}</h2>`;
        }

        if (this._text) {
            t += `<p>${this._text}</p>`
        }

        if (this._header_text == "" && this._text == "") {
            this.visible = false;
        } else {
            this.visible = true;
        }

        this.el.text_container.innerHTML = t;
    }

}
