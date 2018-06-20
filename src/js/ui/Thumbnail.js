const dom = require('../utils/dom.js');
const EventEmitter = require("../utils/EventEmitter.js");

module.exports = class Thumbnail {
    constructor(data, n, add_to_container) {
        this.number = n;
        this.data = data;
        this.active = false;
        this.events = new EventEmitter();

        this.el = {
            container: dom.createElement('div', `svr-thumb-${this.number}`, ["svr-thumbnail"]),
            image: dom.createElement('img')
        }

        this.el.container.addEventListener('click', (e) => {this.onClick(e)});

        this.el.container.appendChild(this.el.image);
        this.el.image.setAttribute("src", `${this.data.image_url}image-thumbnail.jpg`)

        if (add_to_container) {
            add_to_container.appendChild(this.el.container);
        };
    }

    setActive(active) {
        this.active = active;

        if(this.active) {
            console.log(`THUMB ${this.number} ACTIVE`)
        } else {
            console.log(`THUMB ${this.number} NOT ACTIVE`)
        }
    }


    onClick(e) {
        this.events.emit("click", {number:this.number, data:this.data});
    }
}
