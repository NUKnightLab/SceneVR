const dom = require('../utils/dom.js');
const THREE = require("three");
const isMobile = require('../utils/isMobile.js');
const isVR = require('../utils/isVR.js');
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

        this._stereo = false;

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

        if (isMobile.any) {
            this.controls = new THREE.DeviceOrientationControls( this.camera );
        } else {
            if (isMobile.vr) {
                console.log("Supports VR");
                this.renderer.vr.enabled = true;
                this.is_vr = new isVR();
            }
            this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
            this.controls.enableZoom = false;
			this.controls.enablePan = false;
			this.controls.enableDamping = true;
			this.controls.rotateSpeed = - 0.1;
            this.camera.position.z = 0.01;
        }

    }

    get stereo() {
        return this._stereo;
    }

    set stereo(s) {
        this._stereo = s;
        if (this._stereo) {
            this.stereo_camera = new THREE.StereoCamera();
            this.stereo_camera.aspect = 0.5;
            this.stereo_camera.eyeSep = 1;
        }
    }

    addPano(pano) {
        pano.addToScene(this.scene);
    }

    updateCameraTarget(lon, lat, animate) {
        this.pos.lon = lon;

        this.pos.lon +=  0.1;
		this.pos.lat = Math.max( - 85, Math.min( 85, lat ) );

		this.pos.phi = THREE.Math.degToRad( 90 - this.pos.lat );
		this.pos.theta = THREE.Math.degToRad( this.pos.lon );

        this.pos.alpha_offset = -(this.pos.theta * 2);
        this.pos.beta_offset = THREE.Math.degToRad( this.pos.lat );

        if (isMobile.any) {
            this.controls.updateAlphaOffsetAngle( this.pos.alpha_offset);
            //this.controls.updateBetaOffsetAngle(this.pos.beta_offset);
        } else {
            this.controls.target.x = Math.sin( this.pos.phi ) * Math.cos( this.pos.theta );
            this.controls.target.y = Math.cos( this.pos.phi );
            this.controls.target.z = Math.sin( this.pos.phi ) * Math.sin( this.pos.theta );
        }

    }

    render() {
        this.controls.update();
        let render_size = this.renderer.getSize();
        if (this._stereo) {
            this.scene.updateMatrixWorld();
            if ( this.camera.parent === null ) {
                this.camera.updateMatrixWorld()
            };
            this.stereo_camera.update( this.camera );

            if ( this.renderer.autoClear ) {
                this.renderer.clear()
            };
            this.renderer.setScissorTest( true );

            // LEFT CAMERA
            this.renderer.setScissor( 0, 0, render_size.width / 2, render_size.height );
            this.renderer.setViewport( 0, 0, render_size.width / 2, render_size.height );
            this.renderer.render( this.scene, this.stereo_camera.cameraL );

            // RIGHT CAMERA
            this.renderer.setScissor( render_size.width / 2, 0, render_size.width / 2, render_size.height );
            this.renderer.setViewport( render_size.width / 2, 0, render_size.width / 2, render_size.height );
            this.renderer.render( this.scene, this.stereo_camera.cameraR );

            this.renderer.setScissorTest( false );

        } else {
            this.renderer.setViewport( 0, 0, render_size.width, render_size.height );
            this.renderer.render( this.scene, this.camera );
        }

        this.camera.getWorldDirection(this.camera_direction);
        this.camera_angle = THREE.Math.radToDeg(Math.atan2(this.camera_direction.x,this.camera_direction.z) );
    }

    updateSize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }


}
