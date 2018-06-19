const dom = require('../utils/dom.js');
const icons = require('../ui/Icons.js');
const EventEmitter = require("../utils/EventEmitter.js");
const isMobile = require("../utils/isMobile.js");
import {TweenLite, CSSPlugin} from "gsap/all";

module.exports = class Chrome {
    constructor(data, add_to_container) {
        this.data = data;
        this.events = new EventEmitter();
        this.el = {
            container: dom.createElement('div', 'svr-chrome'),
            header: dom.createElement('div', 'svr-chrome-header'),
            footer: dom.createElement('div', 'svr-chrome-footer')
        }

        this.buttons = {
            fullscreen: dom.createElement('div', 'svr-btn-fullscreen', ["svr-btn"], this.el.footer),
            cardboard: dom.createElement('div', 'svr-btn-cardboard', ["svr-btn"], this.el.footer)
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

        if (isMobile.any) {
            this.buttons.fullscreen.style.display = "none";
        } else {
            this.buttons.cardboard.style.display = "none";
        }

        if (add_to_container) {
            add_to_container.appendChild(this.el.container);
        };
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
