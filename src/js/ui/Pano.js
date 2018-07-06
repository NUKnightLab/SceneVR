const THREE = require("three");
const EventEmitter = require("../utils/EventEmitter.js");
import {TweenLite} from "gsap/TweenLite";

module.exports = class Pano {
    constructor(data, config) {
        this.data = data;
        this.config = {
            speed: "m"
        };

        if (config) {
            this.config = config;
        }

        this.geometry = new THREE.SphereBufferGeometry( 1000, 60, 40 );

        this.material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
        this.mesh = {};
        this.texture_loader = new THREE.TextureLoader();
        this.high_resolution = false;
        this.tween = {};
        this._active = false;
        this.animation_time = 1;
        this.events = new EventEmitter();
        this.geometry_fixed = false;
        this._background = false;

        this.geometry.scale( - 1, 1, 1 );

        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.mesh.material.opacity = 0;
        this.tween = new TweenLite(this.mesh.material, 1, {opacity: 0});
        this.mesh.visible = false;
        this.mesh.geometry.rotateY(Math.PI); // ROTATE TO CENTER
        this.loadTexture(`${this.data.image_url}image-thumbnail.jpg`).then(
            response => {
                this.mesh.material = response;
                this.mesh.material.transparent = true;
                this.mesh.material.opacity = 0;
                if (this._active) {
                    this.tween = new TweenLite(this.mesh.material, this.animation_time, {opacity: 1});
                }
                this.events.emit("thumbnail_loaded", {test:"testing"});
            }
        )

    }

    get background() {
        return this._background;
    }

    set background(b) {
        this._background = b;
    }

    get active() {
        return this._active;
    }

    set active(a) {
        if(a) {
            console.log("not active")
            this.mesh.material.opacity = 0;
            this.mesh.visible = true;
            this._active = true;
            this.tween.kill();
            this.tween = new TweenLite(this.mesh.material, this.animation_time, {opacity: 1, onComplete: () => {
                console.debug("LOADED HIGH REZ");
                if (!this.high_resolution) {
                    this.loadTexture(`${this.data.image_url}image-${this.config.speed}.jpg`).then(
                        response => {
                            let opac = this.mesh.material.opacity;
                            this.tween.kill();
                            this.high_resolution = true;
                            this.mesh.material = response;
                            this.mesh.material.transparent = true;
                            this.mesh.material.opacity = opac;
                            this.tween = new TweenLite(this.mesh.material, this.animation_time, {opacity: 1});
                        }
                    )
                }
            }});
        } else {
            this.tween.kill();
            if (this.geometry_fixed) {
                this.mesh.visible = false;
            } else {
                this.tween = new TweenLite(this.mesh.material, 1, {opacity: 0, onComplete: () => {
                    this.mesh.visible = false;
                }});
            }
            this._active = false;
        }
    }

    fixGeometry(w, h) {
        if (!this.geometry_fixed) {
            let fov = 60.8;//60.8;
            let image_multiplier = (w / h) * fov;
            image_multiplier = THREE.Math.degToRad(image_multiplier)
            let g = {
                radius: 1100,
                widthSegments: 60,
                heightSegments: 1000,
                phiStart: 0,
                phiLength: Math.PI*(image_multiplier/3),
                thetaStart: 45, //0
                thetaLength: (fov * Math.PI)/180
            }
            this.geometry = new THREE.SphereBufferGeometry( g.radius, g.widthSegments, g.heightSegments, g.phiStart, g.phiLength, g.thetaStart, g.thetaLength);
            this.geometry.scale( - 1, 1, 1 );
            this.mesh.geometry = this.geometry;
            this.mesh.geometry.rotateY(image_multiplier/2);

            this.geometry_fixed = true;
        }

    }

    loadTexture(url) {
        return new Promise((resolve, reject) => {
            this.texture_loader.load(url, (texture) => {
                // check if equilinear
                if ((texture.image.height/texture.image.width) < 0.45) {
                    this.background = texture;
                    console.debug("is not equilinear");
                    this.fixGeometry(texture.image.width, texture.image.height);
                }
                resolve(new THREE.MeshBasicMaterial( {
                    map: texture
                }));
            }, undefined, function(err) {
                console.error(err);
                reject(err);
            })
        });
    }

    addToScene(scene) {
        scene.add(this.mesh);
    }
}
