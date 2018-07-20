const dom = require('../utils/dom.js');
const icons = require('../ui/Icons.js');
const ThumbnailNav = require('../ui/ThumbnailNav.js');
const Caption = require('../ui/Caption.js');
const EventEmitter = require("../utils/EventEmitter.js");
const isMobile = require("../utils/isMobile.js");
import TweenLite from 'gsap/TweenLite';
import 'gsap/CSSPlugin';


// TO DO SCROLLABLE THUMBNAIL PANEL
module.exports = class Chrome {
    constructor(data, add_to_container) {
        this.data = data;
        this.events = new EventEmitter();
        this.thumbnails = {};
        this._current_thumbnail = 0;
        this._active = true;
        this._fullscreen = false;
        this._turn_phone = false;
        this._message = "";
        this._vr = false;
        this.compass_offset = 75;
        this.el = {
            container: dom.createElement('div', 'svr-chrome'),
            header: dom.createElement('div', 'svr-chrome-header'),
            middle: dom.createElement('div', 'svr-chrome-middle'),
            footer_button_container: dom.createElement('div', '', ["svr-button-container"]),
            header_button_container: dom.createElement('div', '', ["svr-button-container"]),
            middle_button_container: dom.createElement('div', '', ["svr-button-container"]),
            footer: dom.createElement('div', 'svr-chrome-footer'),
            compass: {},
            compass_pointer: {},
            message: dom.createElement('div', 'svr-message')
        }

        this.buttons = {
            fullscreen: dom.createElement('div', 'svr-btn-fullscreen', ["svr-btn"], this.el.footer_button_container, icons.fullscreen),
            cardboard: dom.createElement('div', 'svr-btn-cardboard', ["svr-btn"], this.el.footer_button_container, icons.cardboard),
            next: dom.createElement('div', 'svr-btn-next', ["svr-btn"], this.el.middle_button_container, icons.chevron),
            prev: dom.createElement('div', 'svr-btn-prev', ["svr-btn"], this.el.middle_button_container, icons.chevron)
        }

        this.title = new Caption(this.el.header);
        this.title.text = this.data.desc;
        this.title.header_text = this.data.title;

        this.el.compass = dom.createElement('div', 'svr-compass', [" "], this.el.header_button_container);
        this.el.compass_pointer = {};
        this.el.compass.innerHTML = icons.compass;
        this.el.compass_pointer = this.el.compass.querySelector('#svr-compass-pointer');

        // BUTTON LISTENERS
        this.buttons.fullscreen.addEventListener('click', (e) => {
            this.events.emit("fullscreen", {data:"fullscreen button"});
        });

        this.buttons.cardboard.addEventListener('click', (e) => {
            this.events.emit("cardboard", {data:"cardboard button"});
        });

        this.buttons.next.addEventListener('click', (e) => {
            this.events.emit("next", {data:"next button"});
        });

        this.buttons.prev.addEventListener('click', (e) => {
            this.events.emit("prev", {data:"prev button"});
        });

        // HEADER
        this.el.container.appendChild(this.el.header);
        this.el.header.appendChild(this.el.header_button_container);

        // MIDDLE
        this.el.container.appendChild(this.el.middle);
        this.el.middle.appendChild(this.el.middle_button_container);
        this.buttons.prev.style.display = "none";

        // FOOTER
        this.el.container.appendChild(this.el.footer);
        this.el.footer.appendChild(this.el.footer_button_container);
        this.caption = new Caption(this.el.footer);
        this.caption.text = this.data.scenes[0].caption;

        // THUMBNAILS
        this.thumbnails = new ThumbnailNav(this.data, this.el.footer);
        this.thumbnails.events.addListener("goto", (e) => {
            this.events.emit("goto", {number:e.number});
        })



        // MESSAGE
        this.el.container.appendChild(this.el.message);
        this.el.message.style.display = "none";

        if (isMobile.any) {
            this.buttons.fullscreen.style.display = "none";
        } else {
            this.buttons.cardboard.style.display = "none";
        }

        if (add_to_container) {
            add_to_container.appendChild(this.el.container);
        };
    }

    updateNav(n) {
        if (n == 0) {
            this.buttons.prev.style.display = "none";
        } else {
            this.buttons.prev.style.display = "block";
        }

        if ((this.thumbnails.number_of_thumbnails -1) == n ) {
            this.buttons.next.style.display = "none";
        } else {
            this.buttons.next.style.display = "block";
        }
    }

    get vr() {
        return this._vr;
    }

    set vr(v) {
        this._vr = v;
        if (this._vr) {
            this.el.container.style.display = "none";
        } else {
            this.el.container.style.display = "block";
        }
    }

    get current_thumbnail() {
        return this.thumbnails.current_thumbnail;
    }

    set current_thumbnail(n) {
        this.updateNav(n);
        this.thumbnails.current_thumbnail = n;
        this.caption.text = this.thumbnails.caption;
    }

    get turn_phone() {
        return this._turn_phone;
    }

    set turn_phone(t) {
        this._turn_phone = t;
        if (this._turn_phone) {
            // SHOW MESSAGE
            this.message = "Place your phone into your Cardboard viewer";
            this.el.message.style.display = "flex";
        } else {
            this.el.message.style.display = "none";
        }
    }

    get compass() {
        let c = this.el.compass_pointer.getAttribute("transform");
        return c;
    }

    set compass(deg) {
        this.el.compass_pointer.setAttribute("transform", `rotate(${deg})`);
        this.el.compass_pointer.style.webkitTransform = `rotate(${deg}deg)`;
    }

    get active() {
        return this._active;
    }

    set active(a) {
        this._active = a;
    }

    get fullscreen() {
        return this._fullscreen;
    }

    get message() {
        return this._message;
    }

    set message(m) {
        this._message = m;
        this.el.message.innerHTML = `<div class="svr-message-container">${icons.cardboard_instruction} <p>${this._message}</p></div>`;
    }

    set fullscreen(f) {
        this._fullscreen = f;
        if (f) {
            this.buttons.fullscreen.innerHTML = icons.fullscreen_exit;
        } else {
            this.buttons.fullscreen.innerHTML = icons.fullscreen;
        }
    }

    toggleUI(a) {
        let active = this._active;

        if (a) {
            active = a;
        }

        if (active) {
            let footer_height = this.el.footer.offsetHeight;
            let header_height = this.el.header.offsetHeight;

            this._active = false;

            this.el.header.classList.remove("svr-active");
            this.el.header.classList.add("svr-inactive");
            this.el.header.style.top = `-${header_height - this.compass_offset}px`;

            this.el.middle.classList.remove("svr-active");
            this.el.middle.classList.add("svr-inactive");

            this.el.footer.classList.remove("svr-active");
            this.el.footer.classList.add("svr-inactive");
            this.el.footer.style.bottom = `-${footer_height - 42}px`;


        } else {
            this._active = true;

            this.el.header.classList.remove("svr-inactive");
            this.el.header.classList.add("svr-active");
            this.el.header.style.top = "0px";

            this.el.middle.classList.remove("svr-inactive");
            this.el.middle.classList.add("svr-active");

            this.el.footer.classList.remove("svr-inactive");
            this.el.footer.classList.add("svr-active");
            this.el.footer.style.bottom = "0px";
        }
    }

    updateChromePosition() {
        if (this.thumbnails.number_of_thumbnails < 2) {
            this.thumbnails.visible = false;
        }
        if (window.innerHeight < 400) {
            this.el.compass.style.display = "none";
            this.compass_offset = 0;
        } else {
            this.compass_offset = 75;
            this.el.compass.style.display = "block";
        }

        if (this._active) {
            this.el.header.style.top = "0px";
            this.el.footer.style.bottom = "0px";
        } else {
            let footer_height = this.el.footer.offsetHeight,
                header_height = this.el.header.offsetHeight;
            this.el.header.style.top = `-${header_height - this.compass_offset}px`;
            this.el.footer.style.bottom = `-${footer_height - 42}px`;
        }

    }

    updateSize() {
        this.thumbnails.updateSize();
        this.updateChromePosition();
    }

}
