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
        this.fov = {
            current: 70,
            min: 40,
            max: 110,
            range: 70
        };
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1200 );
        this.scene = new THREE.Scene();
        this.camera_direction = new THREE.Vector3();
        this.camera_angle = 0;
        this._scale = 1;
        this._background = false;
        this._stereo = false;
        this.tween = {
            position:null,
            target:null,
            camera:null
        };
        this.controls = {};
        this.pos = {
            lat: 0,
            lon: 0,
            phi: 0,
            theta: 0
        }
        this.camera_target = new THREE.Vector3( 1, 0, 0 );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.vr.enabled = true;
        this.renderer.vr.userHeight = 0; // TOFIX

        this.camera.target = this.camera_target;

        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.el.appendChild( this.renderer.domElement );
        this.scene.background = new THREE.Color( 0x000000 );

        if (add_to_container) {
            add_to_container.appendChild(this.el);
        };

        if (isMobile.any) {
            this.controls = new THREE.DeviceOrientationControls( this.camera );
            console.log("mobile DEVICE")
            console.log(navigator.userAgent)
            console.log(isMobile.apple.device)
            if (isMobile.apple.device) {
                console.log("APPLE DEVICE")
                // FIX ORIENTATION
                this.controls.updateAlphaOffsetAngle(-90);
            }
            if (isMobile.android.device) {
                console.log("ANDROID DEVICE")
            }
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
            this.controls.target.x = 1;
            this.controls.target.y = 0;
            this.controls.target.z = 0;
            this.camera.position.z = 0.01;
            this.controls.saveState();
        }

    }

    get scale() {
        return this._scale;
    }

    set scale(s) {
        let multiplier = 1;
        this._scale = s;
        this.fov.current = this.fov.current - (this._scale * multiplier);
        if (this.fov.current > this.fov.max) {
            this.fov.current = this.fov.max;
        }
        if (this.fov.current < this.fov.min) {
            this.fov.current = this.fov.min;
        }

        this.camera.fov = this.fov.current;
        this.camera.updateProjectionMatrix();
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

    get background() {
        return this._background;
    }

    set background(b) {
        this._background = b;
        if (!this._background) {
            this.scene.background = new THREE.Color( 0x000000 );
        } else {
            this.scene.background = b;
        }

    }

    resetCamera() {
        if (isMobile.any) {
            this.tween.position = new TweenLite(this.controls, 0.5, {alphaOffsetAngle: -90, onUpdate:(e) => {
                this.controls.update();
            }, onComplete: () => {
                this.updateCameraTarget(0,0);
            }});
        } else {

            this.tween.position = new TweenLite(this.camera.position, 0.5, {x: this.controls.position0.x, y:this.controls.position0.y, z:this.controls.position0.z, onComplete: () => {

            }});
            this.tween.target = new TweenLite(this.controls.target, 0.5, {x: this.controls.target0.x, y: this.controls.target0.y, z: this.controls.target0.z, onComplete: () => {

            }});

        }
    }

    addPano(pano) {
        pano.addToScene(this.scene);
    }

    updateCameraTarget(lon, lat, animate) {
        this.pos.lon = lon;

        this.pos.lon +=  0.1;
		this.pos.lat = Math.max( - 90, Math.min( 90, lat ) );

		this.pos.phi = THREE.Math.degToRad( 90 - this.pos.lat );
		this.pos.theta = THREE.Math.degToRad( this.pos.lon );

        if (isMobile.apple.device) {
            this.pos.alpha_offset = -(this.pos.theta * 2) -90;
        } else {
            this.pos.alpha_offset = -(this.pos.theta * 2);
        }

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
