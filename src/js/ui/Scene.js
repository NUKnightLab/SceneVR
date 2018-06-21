// const UI = require('../ui/ui.js');
const data = require('../data/data.js');
const dom = require('../utils/dom.js');
const Stage = require('../ui/Stage.js');
const Pano = require('../ui/Pano.js');
const Chrome = require('../ui/Chrome.js');
const isMobile = require('../utils/isMobile.js');
import {TweenLite, CSSPlugin} from "gsap/all";

module.exports = class Scene {
    constructor(config) {
        this.config = config;
        this.el = {
            container: {},
            ui: {},
            loading: document.getElementById("svr-loading")
        };
        this.current_pano = 0;
        this.panos = [];
        this.user_interacting = false;
        this.pointer = {
            down_x: 0,
            down_y: 0,
            move_x: 0,
            move_y: 0
        };
        this.loaded = [];


        // LOAD DATA
        data.getJSON(this.config.source).then(
            response => {
                this.data = response;
                this.buildTemplate();
                this.startListening();
                this.buildPanos();
            },
            response => {
                console.error("FAILED TO LOAD DATA");
                console.log(response);
            }
        )


    }

    buildTemplate() {
        this.el.container = dom.createElement('section', 'scene-vr');

        if (isMobile.any) {
            this.el.container.classList.add("svr-mobile");
        }
        document.body.appendChild(this.el.container);

        // TweenLite.to(that.el.loading, 1, {opacity:"0", onComplete:function() {
        //     that.el.loading.style.display = "none";
        // }});


        this.stage = new Stage(this.config, this.el.container);
        this.chrome = new Chrome(this.data, this.el.container);

    }

    startListening() {
        this.stage.el.addEventListener('mousedown', (e) => {this.onMouseDown(e)});
        this.stage.el.addEventListener('mouseup', (e) => {this.onMouseUp(e)});
        // this.el.container.addEventListener('mousemove', (e) => {this.onMouseMove(e)});
        // this.el.container.addEventListener('touchstart', (e) => {this.onTouchStart(e)});
        // this.el.container.addEventListener('touchmove', (e) => {this.onTouchMove(e)});

        this.chrome.events.addListener("fullscreen", (e) => {
            this.fullScreenToggle(e);

        })
        this.chrome.events.addListener("goto", (e) => {
            this.goTo(e.number);

        })

    }

    fullScreenToggle(e) {
        let fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;

        if (!fullscreenElement) {
            this.chrome.fullscreen = true;
            if (this.el.container.requestFullscreen) {
                this.el.container.requestFullscreen();
            } else if (this.el.container.webkitRequestFullscreen) {
                this.el.container.webkitRequestFullscreen();
            } else if (this.el.container.mozRequestFullScreen) {
                this.el.container.mozRequestFullScreen();
            } else if (this.el.container.msRequestFullscreen) {
                this.el.container.msRequestFullscreen();
            }
        } else {
            this.chrome.fullscreen = false;
            if(document.exitFullscreen) {
                document.exitFullscreen();
            } else if(document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if(document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }

        }

        this.updateSize();
    }


    onMouseDown(e) {
        this.pointer.down_x = e.clientX;
        this.pointer.down_y = e.clientY;
    }

    onMouseUp(e) {
        this.pointer.move_x = Math.abs(this.pointer.down_x - e.clientX);
        this.pointer.move_y = Math.abs(this.pointer.down_y - e.clientY);

        if (this.pointer.move_x < 10 && this.pointer.move_y < 10 ) {
            this.chrome.toggleUI();
        }
    }

    buildPanos() {
        for (let i = 0; i < this.data.scenes.length; i++) {
            let pano = new Pano(this.data.scenes[i]);
            pano.events.addListener("thumbnail_loaded", (e) => {
                this.onThumbnailLoaded(e, i)
            })
            this.panos.push(pano);
            this.stage.addPano(pano);
        }
        this.panos[this.current_pano].active = true;
    }

    onThumbnailLoaded(e, i) {
        if (i === 0) {
            this.el.loading.style.display = "none";
        }
    }

    goTo(n) {
        this.panos[this.current_pano].active = false;
        this.current_pano = n;
        this.panos[this.current_pano].active = true;
    }

    render() {
        if(this.stage) {
            this.stage.render();
        }
        if (this.chrome) {
            this.chrome.compass = Math.round(-this.stage.camera_angle-180);
        }

    }

    updateSize() {
        if(this.stage){
            this.stage.updateSize();
        }
    }

    appendStage() {
        this.el.loading.style.visibility = "hidden";
        this.el.container.appendChild(this.el.ui);
    }


}
