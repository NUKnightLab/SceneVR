const dom = require('../utils/dom.js');
const icons = require('../ui/Icons.js');
const Thumbnail = require('../ui/Thumbnail.js');
const EventEmitter = require("../utils/EventEmitter.js");
const isMobile = require("../utils/isMobile.js");
import {TweenLite, CSSPlugin} from "gsap/all";

module.exports = class Chrome {
    constructor(data, add_to_container) {
        this.data = data;
        this.events = new EventEmitter();
        this.thumbnails = [];
        this.el = {
            container: dom.createElement('div', 'svr-chrome'),
            header: dom.createElement('div', 'svr-chrome-header'),
            thumbnail_container: dom.createElement('div', 'svr-thumbnail-container'),
            button_container: dom.createElement('div', 'svr-button-container'),
            footer: dom.createElement('div', 'svr-chrome-footer')
        }

        this.buttons = {
            fullscreen: dom.createElement('div', 'svr-btn-fullscreen', ["svr-btn"], this.el.button_container),
            cardboard: dom.createElement('div', 'svr-btn-cardboard', ["svr-btn"], this.el.button_container)
        }

        this.compass = dom.createElement('div', 'svr-compass', [" "], this.el.header);
        this.compass_pointer = {};
        this.compass.innerHTML = icons.compass;
        this.compass_pointer = this.compass.querySelector('#svr-compass-pointer');

        this.buttons.fullscreen.innerHTML = icons.fullscreen;
        this.buttons.cardboard.innerHTML = icons.cardboard;
        this.buttons.fullscreen.addEventListener('click', (e) => {this.onFullScreenButton(e)});

        this.el.container.appendChild(this.el.header);
        this.el.container.appendChild(this.el.footer);
        this.el.footer.appendChild(this.el.button_container);
        this.el.footer.appendChild(this.el.thumbnail_container);

        this.makeThumbnails();

        if (isMobile.any) {
            this.buttons.fullscreen.style.display = "none";
        } else {
            this.buttons.cardboard.style.display = "none";
        }

        if (add_to_container) {
            add_to_container.appendChild(this.el.container);
        };
    }

    makeThumbnails() {
        for (let i = 0; i < this.data.scenes.length; i++) {
            let thumb = new Thumbnail(this.data.scenes[i], i, this.el.thumbnail_container);
            thumb.events.addListener("click", (e) => {
                this.onThumbnailClick(e)
            })
            this.thumbnails.push(thumb);
        }
    }

    toggleUI() {
        console.log("Toggle UI");
    }

    onThumbnailClick(e) {
        // set state of thumbnails
        for (let i = 0; i < this.thumbnails.length; i++) {
            if(e.number === i) {
                this.thumbnails[i].setActive(true);
            } else {
                this.thumbnails[i].setActive(false);
            }
        }
        this.events.emit("goto", {number:e.number});
    }

    onFullScreenButton() {
        this.events.emit("fullscreen", {test:"testing"});
    }

    updateCompass(deg) {
        this.compass_pointer.setAttribute("transform", `rotate(${deg})`);
        // this.compass_pointer.setAttribute("-webkit-transform", `rotate(${deg})`);
        // this.compass_pointer.style.transform = `rotate(${deg})`;
        this.compass_pointer.style.webkitTransform = `rotate(${deg}deg)`;
    }
}
