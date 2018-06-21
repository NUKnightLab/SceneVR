const dom = require('../utils/dom.js');
const THREE = require("three");
const isMobile = require('../utils/isMobile.js');
const DeviceOrientationControls = require('../threejs/DeviceOrientationControls.js');
const OrbitControls = require('../threejs/OrbitControls.js');
import {TweenLite} from "gsap/TweenLite";

module.exports = class Stage {
    constructor(config, add_to_container) {
        this.config = config;
        this.el = dom.createElement('div', 'svr-main');
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
        this.scene = new THREE.Scene();
        this.camera_direction = new THREE.Vector3();
        this.camera_angle = 0;

        this.controls = {};
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

        // USED FOR THREEJS CHROME INSPECTOR
        // REMOVE BEFORE DEPLOY
        // window.scene = this.scene;
        // window.THREE = THREE;



        if (add_to_container) {
            add_to_container.appendChild(this.el);
        };

        this.is_device = isMobile.any;
        if (this.is_device) {
            this.controls = new THREE.DeviceOrientationControls( this.camera );
        } else {
            this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
            this.controls.enableZoom = false;
			this.controls.enablePan = false;
			this.controls.enableDamping = true;
			this.controls.rotateSpeed = - 0.1;
            this.camera.position.z = 0.01;
        }

        // Testing
        // TweenLite.to(this.pos, 15, {lon: 180});

    }

    addPano(pano) {
        pano.addToScene(this.scene);
    }

    updateCameraTarget(lon, lat) {
        this.pos.lon = lon;

        this.pos.lon +=  0.1;
		this.pos.lat = Math.max( - 85, Math.min( 85, lat ) );

		this.pos.phi = THREE.Math.degToRad( 90 - this.pos.lat );
		this.pos.theta = THREE.Math.degToRad( this.pos.lon );

        if (isMobile.any) {
            this.controls.updateAlphaOffsetAngle( -(this.pos.theta * 2) );
            this.controls.updateBetaOffsetAngle(THREE.Math.degToRad( this.pos.lat ));
        } else {
            this.controls.target.x = Math.sin( this.pos.phi ) * Math.cos( this.pos.theta );
    		this.controls.target.y = Math.cos( this.pos.phi );
    		this.controls.target.z = Math.sin( this.pos.phi ) * Math.sin( this.pos.theta );
        }

    }

    render() {
        this.controls.update();
        this.renderer.render( this.scene, this.camera );
        this.camera.getWorldDirection(this.camera_direction);
        this.camera_angle = THREE.Math.radToDeg(Math.atan2(this.camera_direction.x,this.camera_direction.z) );
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
