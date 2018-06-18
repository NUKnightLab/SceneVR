const dom = require('../utils/dom.js');
const THREE = require("three");
const OrbitControls = require('three-orbitcontrols');
import {TweenLite} from "gsap/TweenLite";

module.exports = class Stage {
    constructor(config, add_to_container) {
        this.config = config;
        this.el = dom.createElement('div', 'svr-main');
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
        this.scene = new THREE.Scene();
        this.pos = {
            lat: 0,
            lon: 0,
            phi: 0,
            theta: 0
        }
        this.camera_target = new THREE.Vector3( 0, 0, 0 );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.vr.enabled = true;
        this.renderer.vr.userHeight = 0; // TOFIX

        this.camera.target = this.camera_target;

        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.el.appendChild( this.renderer.domElement );

        if (add_to_container) {
            add_to_container.appendChild(this.el);
        };

        // Testing
        // TweenLite.to(this.pos, 15, {lon: 180});

    }

    addPano(pano) {
        pano.addToScene(this.scene);
    }





    render() {
        this.pos.lat = Math.max( - 85, Math.min( 85, this.pos.lat ) );
        this.pos.phi = THREE.Math.degToRad( 90 - this.pos.lat );
        this.pos.theta = THREE.Math.degToRad( this.pos.lon );
		this.camera_target.x = 500 * Math.sin( this.pos.phi ) * Math.cos( this.pos.theta );
		this.camera_target.y = 500 * Math.cos( this.pos.phi );
		this.camera_target.z = 500 * Math.sin( this.pos.phi ) * Math.sin( this.pos.theta );
        // this.size_test--;
        // console.log(this.size_test)
        // console.log(this.size_test/100);
        // if(this.size_test<2) {
        //     this.size_test = 2;
        // } else {
        //     this.size_test--;
        //     let fraction = this.size_test/100;
        //     this.spheres.b.mesh.scale.set( fraction, fraction, fraction );
        // }
        this.camera.lookAt( this.camera_target );
        this.renderer.render( this.scene, this.camera );
    }

    updateSize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    setScene(src) {

    }

    addImage(img) {

    }


}
