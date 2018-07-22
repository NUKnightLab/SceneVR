const dom = require('../utils/dom.js');
const Thumbnail = require('../ui/Thumbnail.js');
const icons = require('../ui/Icons.js');
const EventEmitter = require("../utils/EventEmitter.js");
const isMobile = require("../utils/isMobile.js");
import TweenLite from 'gsap/TweenLite';
import 'gsap/CSSPlugin';
import 'gsap/ScrollToPlugin';

module.exports = class ThumbnailNav {
    constructor(data, add_to_container) {
        this.data = data;
        this.thumbnails = [];
        this.events = new EventEmitter();
        this._current_thumbnail = 0;
        this._visible = true;
        this.el = {
            container: dom.createElement('div', 'svr-thumbnail-container'),
            scroll_container: dom.createElement('div', '', ["svr-thumbnail-scroll-conatiner"]),
            button_left: "",
            button_right: ""
        }

        this.buttons = {
            arrow_left: {},
            arrow_right: {}
        }

        if (!isMobile.any) {
            this.buttons.arrow_left = dom.createElement('div', 'svr-btn-arrow-left', ["svr-btn"], this.el.container);
            this.buttons.arrow_right = dom.createElement('div', 'svr-btn-arrow-right', ["svr-btn"], this.el.container);

            this.buttons.arrow_left.addEventListener("click", (e) => {this.onArrowClick("left")});
            this.buttons.arrow_right.addEventListener("click", (e) => {this.onArrowClick("right")});
            this.buttons.arrow_left.innerHTML = icons.chevron;
            this.buttons.arrow_right.innerHTML = icons.chevron;
            this.buttons.arrow_left.style.opacity = "0.2";
            this.buttons.arrow_left.style.display = "none";
        } else {
            this.el.container.style.justifyContent = "left";
        }

        this.el.container.appendChild(this.el.scroll_container);
        this.makeThumbnails();


        if (add_to_container) {
            add_to_container.appendChild(this.el.container);
        };

    }

    onArrowClick(direction) {
        let scroll_num = 0,
            scroll_max = this.el.scroll_container.offsetWidth - this.el.container.offsetWidth;
        if(direction == "left") {
            scroll_num = this.el.container.scrollLeft -300;
        } else {
            scroll_num = this.el.container.scrollLeft +300
        }
        TweenLite.to(this.el.container, .5, {scrollTo:{x:scroll_num}});

        if (scroll_num <= 0) {
            this.buttons.arrow_left.style.opacity = "0.2";
            this.buttons.arrow_left.style.display = "none";
        } else {
            this.buttons.arrow_left.style.display = "flex";
            this.buttons.arrow_left.style.opacity = "1";
        }

        if (scroll_num >= scroll_max) {
            this.buttons.arrow_right.style.opacity = "0.2";
            this.buttons.arrow_right.style.display = "none";
        } else {
            this.buttons.arrow_right.style.display = "flex";
            this.buttons.arrow_right.style.opacity = "1";
        }

    }

    updateSize() {
        if (!isMobile.any) {
            this.updateArrowButtons();
        }
    }

    updateArrowButtons() {
        if (this.el.scroll_container.offsetWidth > this.el.container.offsetWidth) {
            console.log("NEEDS TO SCROLL");
            this.el.container.style.justifyContent = "flex-start";
            this.buttons.arrow_left.style.display = "flex";
            this.buttons.arrow_right.style.display = "flex";
            if (this.el.container.scrollLeft === 0) {
                this.buttons.arrow_left.style.display = "none";
            }
        } else {
            this.el.container.style.justifyContent = "center";
            this.buttons.arrow_left.style.display = "none";
            this.buttons.arrow_right.style.display = "none";
        }
    }

    makeThumbnails() {
        for (let i = 0; i < this.data.scenes.length; i++) {
            let thumb = new Thumbnail(this.data.scenes[i], i, this.el.scroll_container);
            thumb.events.addListener("click", (e) => {
                this.onThumbnailClick(e)
            })
            this.thumbnails.push(thumb);
        }
        this.thumbnails[0].active = true;
        if (this.number_of_thumbnails < 2) {
            this.visible = false;
        }
    }

    get caption() {
        return this.thumbnails[this.current_thumbnail].data.caption
    }

    set caption(c) {
        console.log("Cannot set caption seperate from active thumbnail.")
    }

    get current_thumbnail() {
        return this._current_thumbnail;
    }

    set current_thumbnail(n) {
        this._current_thumbnail = n;
        for (let i = 0; i < this.thumbnails.length; i++) {
            if(this._current_thumbnail === i) {
                this.thumbnails[i].active = true;
            } else {
                this.thumbnails[i].active = false;
            }
        }
    }

    get visible() {
        return this._visible;
    }

    set visible(v) {
        this._visible = v;
        if (this._visible) {
            this.el.container.style.display = "flex";
        } else {
            this.el.container.style.display = "none";
        }
    }

    get number_of_thumbnails() {
        return this.thumbnails.length;
    }

    set number_of_thumbnails(n) {

    }

    onThumbnailClick(e) {
        this.current_thumbnail = e.number;
        this.events.emit("goto", {number:e.number, text:`${this.thumbnails[e.number].data.caption}`});
    }

}
