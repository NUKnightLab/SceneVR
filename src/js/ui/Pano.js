const THREE = require("three");
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
        this.animation_time = 2;

        this.geometry.scale( - 1, 1, 1 );

        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.mesh.material.opacity = 0;
        this.tween = new TweenLite(this.mesh.material, 1, {opacity: 0});

        this.loadTexture(`${this.data.image_url}image-thumbnail.jpg`).then(
            response => {
                this.mesh.material = response;
                this.mesh.material.transparent = true;
                this.mesh.material.opacity = 0;
                if (this.active) {
                    this.tween = new TweenLite(this.mesh.material, this.animation_time, {opacity: 1});
                }
                console.log(response);
            }
        )

    }

    makeActive() {
        this.active = true;
        this.tween.kill();
        this.tween = new TweenLite(this.mesh.material, this.animation_time, {opacity: 1});
        console.log(this.mesh.material)
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

                    // this.mesh.material.opacity = 0.5;
                    console.log(response);
                }
            )
        }
    }

    makeInActive() {
        TweenLite.to(this.mesh.material, 1, {opacity: 0});
    }

    loadTexture(url) {
        return new Promise((resolve, reject) => {
            this.texture_loader.load(url, function(texture) {
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
