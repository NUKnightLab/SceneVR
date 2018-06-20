const THREE = require("three");
const EventEmitter = require("../utils/EventEmitter.js");
import {TweenLite} from "gsap/TweenLite";

module.exports = class Pano {
    constructor(data) {
        this.data = data;
        this.geometry = new THREE.SphereBufferGeometry( 1000, 60, 40 );

        this.material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
        this.mesh = {};
        this.texture_loader = new THREE.TextureLoader();
        this.high_resolution = false;
        this.tween = {};
        this.active = false;
        this.animation_time = 1;
        this.events = new EventEmitter();
        this.geometry_fixed = false;


        this.geometry.scale( - 1, 1, 1 );

        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.mesh.material.opacity = 0;
        this.tween = new TweenLite(this.mesh.material, 1, {opacity: 0});
        this.mesh.visible = false;
        this.loadTexture(`${this.data.image_url}image-thumbnail.jpg`).then(
            response => {
                this.mesh.material = response;
                this.mesh.material.transparent = true;
                this.mesh.material.opacity = 0;
                if (this.active) {
                    this.tween = new TweenLite(this.mesh.material, this.animation_time, {opacity: 1});
                }
                this.events.emit("thumbnail_loaded", {test:"testing"});
            }
        )

    }

    makeActive() {
        this.mesh.visible = true;
        this.active = true;
        this.tween.kill();
        this.tween = new TweenLite(this.mesh.material, this.animation_time, {opacity: 1, onComplete: () => {
            console.log("LOADED HIGH REZ")
            if (!this.high_resolution) {
                this.loadTexture(`${this.data.image_url}image-l.jpg`).then(
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

    }

    makeInActive() {
        TweenLite.to(this.mesh.material, 1, {opacity: 0, onComplete: () => {
            this.mesh.visible = false;
        }});
    }

    fixGeometry(w, h) {
        if (!this.geometry_fixed) {
            let image_multiplier = (w / h) * 60.8;
            image_multiplier = THREE.Math.degToRad(image_multiplier)
            // let image_multiplier = ( ( (texture.image.width / texture.image.height) * 60.8) * Math.PI)/180;
            let thetaLength = (60.8 * Math.PI)/180
            console.log(`image_multiplier ${image_multiplier}`)
            console.log(THREE.Math.degToRad(image_multiplier) )
            let g = {
                radius: 1000,
                widthSegments: 60,
                heightSegments: 40,
                phiStart: Math.PI*2,
                phiLength: Math.PI*(image_multiplier/2),
                thetaStart: 45,
                thetaLength: Math.PI/2
            }
            this.geometry = new THREE.SphereBufferGeometry( g.radius, g.widthSegments, g.heightSegments, g.phiStart, g.phiLength, g.thetaStart, g.thetaLength);
            this.geometry.scale( - 1, 1, 1 );
            this.mesh.geometry = this.geometry;
            this.mesh.geometry.rotateY((180 * Math.PI)/180);
            this.geometry_fixed = true;
        }

    }

    loadTexture(url) {
        return new Promise((resolve, reject) => {
            this.texture_loader.load(url, (texture) => {
                // check if equilinear
                if ((texture.image.height/texture.image.width) < 0.45) {
                    console.log("is not equilinear")
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
