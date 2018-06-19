// const UI = require('../ui/ui.js');
const data = require('../data/data.js');
const dom = require('../utils/dom.js');
const Stage = require('../ui/Stage.js');
const Pano = require('../ui/Pano.js');
const Chrome = require('../ui/Chrome.js');
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
            lon: 0,
            lat: 0
        };
        this.pos = {
            lat: 0,
            lon: 0
        }
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

        document.body.appendChild(this.el.container);

        // TweenLite.to(that.el.loading, 1, {opacity:"0", onComplete:function() {
        //     that.el.loading.style.display = "none";
        // }});


        this.stage = new Stage(this.config, this.el.container);
        this.chrome = new Chrome(this.data, this.el.container);

    }

    startListening() {
        // this.el.container.addEventListener('mousedown', (e) => {this.onMouseDown(e)});
        // this.el.container.addEventListener('mousemove', (e) => {this.onMouseMove(e)});
        // this.el.container.addEventListener('mouseup', (e) => {this.onMouseUp(e)});
        // this.el.container.addEventListener('touchstart', (e) => {this.onTouchStart(e)});
        // this.el.container.addEventListener('touchmove', (e) => {this.onTouchMove(e)});
        this.el.container.addEventListener('dblclick', (e) => {this.onMouseDoubleClick(e)});
        this.chrome.events.addListener("fullscreen", (e) => {
            this.fullScreenToggle(e);

        })

    }

    fullScreenToggle(e) {
        console.log("FULLSCREEN")
        // if (this.el.container.requestFullscreen) {
        //     this.el.container.requestFullscreen();
        // }
        // this.el.container.requestFullscreen();
        if (this.el.container.requestFullscreen) {
            this.el.container.requestFullscreen();
        } else if (this.el.container.webkitRequestFullscreen) {
            this.el.container.webkitRequestFullscreen();
        } else if (this.el.container.mozRequestFullScreen) {
            this.el.container.mozRequestFullScreen();
        } else if (this.el.container.msRequestFullscreen) {
            this.el.container.msRequestFullscreen();
        }
        this.updateSize();
    }
    onMouseDoubleClick(e) {
        console.log("DOUBLE CLICK")
        let new_pano = this.current_pano + 1;
        this.goTo(new_pano);
    }
    //
    // onMouseDown(e) {
    //     e.preventDefault();
    //     this.user_interacting = true;
    //     console.log(e);
    //     console.log(this.pointer)
    //     this.pointer.down_x = e.clientX;
    //     this.pointer.down_y = e.clientY;
    //
    //     this.pointer.lon = this.stage.pos.lon;
    //     this.pointer.lat = this.stage.pos.lat;
    //
    //     console.log("onMouseDown")
    // }
    //
    // onMouseUp(e) {
    //     this.user_interacting = false;
    //     console.log("onMouseUp")
    // }
    //
    // onMouseMove(e) {
    //     if (this.user_interacting) {
    //
    //         this.stage.pos.lon = ( this.pointer.down_x - e.clientX ) * 0.1 + this.pointer.lon;
	// 		this.stage.pos.lat = ( e.clientY - this.pointer.down_y ) * 0.1 + this.pointer.lat;
    //     }
    // }
    //
    // onTouchStart(e) {
    //
    // }
    //
    // onTouchMove(e) {
    //
    // }

    buildPanos() {
        for (let i = 0; i < this.data.scenes.length; i++) {
            let pano = new Pano(this.data.scenes[i]);
            pano.events.addListener("thumbnail_loaded", (e) => {
                this.onThumbnailLoaded(e, i)
            })
            this.panos.push(pano);
            this.stage.addPano(pano);
        }
        this.panos[this.current_pano].makeActive();
    }

    onThumbnailLoaded(e, i) {
        console.log(`${i} loaded`)
        if (i === 0) {
            this.el.loading.style.display = "none";
        }
    }

    goTo(n) {
        this.panos[this.current_pano].makeInActive();
        this.current_pano = n;
        this.panos[this.current_pano].makeActive();
    }

    render() {
        if(this.stage){
            this.stage.render();
            this.chrome.updateCompass(Math.round(-this.stage.camera_angle-180));
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
        console.log("ATTACH STAGE");

    }


}
