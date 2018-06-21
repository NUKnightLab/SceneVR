const dom = require('../utils/dom.js');
const EventEmitter = require("../utils/EventEmitter.js");

module.exports = class Thumbnail {
    constructor(data, n, add_to_container) {
        this.number = n;
        this.data = data;
        this._active = false;
        this.events = new EventEmitter();

        this.el = {
            container: dom.createElement('div', `svr-thumb-${this.number}`, ["svr-thumbnail"]),
            image: dom.createElement('div', '', ["svr-thumbnail-bg"])
        }

        this.el.container.addEventListener('click', (e) => {this.onClick(e)});

        this.el.container.appendChild(this.el.image);

        this.el.image.style.backgroundImage = `url(${this.data.image_url}image-thumbnail.jpg)`

        if (add_to_container) {
            add_to_container.appendChild(this.el.container);
        };
    }

    get active() {
        return this._active;
    }

    set active(a) {
        this._active = a;
        if(this._active) {
            this.el.container.classList.add("svr-active");
        } else {
            this.el.container.classList.remove("svr-active");
        }
    }


    onClick(e) {
        this.events.emit("click", {number:this.number, data:this.data});
    }
}