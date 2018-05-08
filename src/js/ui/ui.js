module.exports = class UI {
	constructor(config) {
		this.skyIndex = 0;
		this.isMobile = config.isMobile;
		this.setupUI();
	}

	setupUI() {
		const fullscreenButton = document.getElementById('fullscreen');
		const thumbnailElements = [...document.querySelectorAll('.thumbnail')];
		const vrThumbnailElements = [...document.querySelectorAll('.vr-thumbnail')];
		const thumbnailIcons = [...document.querySelectorAll('.thumbnail-icon')];
		const closeThumbnailIcons = document.querySelector('#thumbnail-icons-close');
		const thumbnailsContainer = document.querySelector('#thumbnails-container');


        const el = {
            body: document.querySelector('body'),
            btn_fullscreen: document.getElementById('fullscreen'),
            cursor: document.getElementById('cursor'),
            camera: document.getElementById('camera'),
            pointer: document.getElementById('pointer')
        };

        const a = {
            scene: {},
            assets: {},
            sky: {},
            sky_fadeout: {}
        }

        a.scene = el.body.querySelector('a-scene');
        a.assets = a.scene.querySelector('a-assets');
        a.sky = a.scene.querySelector('#skybox');
        a.sky_fadeout = a.sky.querySelector('#fade-out');

		el.body.classList.add(this.isMobile ? 'mobile' : 'desktop');

		a.scene.addEventListener('enter-vr', () => {
			this._showVRUI();
			el.body.classList.add('vr');
		});

		a.scene.addEventListener('exit-vr', () => {
			this._hideVRUI();
			el.body.classList.remove('vr');
		});

		// show loading screen until assets are loaded
		a.assets.addEventListener('loaded', () => {
			const loadingScreen = document.getElementById('loading');
			const scenes = document.getElementById('scene-vr');

			loadingScreen.classList.add('fade-out');
			setTimeout(() => {
				scenes.classList.add('fade-in');
				loadingScreen.remove();
			}, 500);

			// update skybox in case the projection needs to be fixed
			this._updateSkybox();
		});

		a.sky_fadeout.addEventListener('animationend', () => {
			// update the selected thumbnail in the footer
			let selectedThumbnail = document.querySelector('.selected-thumbnail');
			selectedThumbnail.classList.remove('selected-thumbnail');
			document.querySelector(`#thumbnail-${this.skyIndex}`).classList.add('selected-thumbnail');

			// TODO: update selected VR thumbnail

			// update the VR text
			let currentText = document.querySelector('.current-text');
			currentText.classList.remove('current-text');
			currentText.setAttribute('visible', 'false');
			let newText = document.getElementById(`text-${this.skyIndex}`);
			newText.classList.add('current-text');

			// update the footer text
			let currentFooterText = document.querySelector('.current-footer-text');
			currentFooterText.classList.remove('current-footer-text');
			let newFooterText = document.getElementById(`footer-text-${this.skyIndex}`);
			newFooterText.classList.add('current-footer-text');

			// update skybox (and projection if necessary)
			this._updateSkybox();

			// fade in the new a-sky
			a.sky.emit('fadeIn');
		});

		// enter VR or fullscreen
		fullscreenButton.addEventListener('click', () => {
			if (this.isMobile) {
				document.querySelector('a-scene').enterVR();
			} else {
				// this checks if the window is fullscreen
				if (!window.screenTop && !window.screenY) {
					const efs = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen;
					efs.call(document);
				} else {
					const docEl = document.documentElement
					let rfs = docEl.requestFullScreen || docEl.webkitRequestFullScreen || docEl.mozRequestFullScreen;
					rfs.call(docEl);
				}
			}
		});

		// toggle thumbnails modal
		thumbnailIcons.forEach((t) => {
			t.addEventListener('click', () => {
				this._toggleModal();
			});
		});

		// close thumbnails modal
		closeThumbnailIcons.addEventListener('click', () => {
			this._toggleModal();
		});

		// desktop and mobile thumbnails
		thumbnailElements.forEach((t, i) => {
			t.addEventListener('click', () => {
				if (this.skyIndex !== i) {
					this._transition(i);
					this._toggleModal();
				}
			});
		});

		// click or drag anywhere to exit modal
		a.scene.addEventListener('mousedown', () => {
			if (document.querySelector('body').classList.contains('modal'))
				this._toggleModal();
		});

		// VR thumbnails

		vrThumbnailElements.forEach((t, i) => {
			t.addEventListener('click', () => {
				if (this.skyIndex !== i)
					this._transition(i);
			});
		});

		el.cursor.addEventListener('raycaster-intersection-cleared', () => {
			el.cursor.emit('rewind');
			el.cursor.emit('stop-loading');
		});


		// UI updates dependent on camera rotation
		el.camera.addEventListener('componentchanged', (event) => {
			let camera_x, camera_y = 0;

            if (event.detail.name === 'rotation') {

                camera_x = el.camera.getAttribute('rotation').x;
                camera_y = el.camera.getAttribute('rotation').y;

                // Show cursor when looking down
                if ( camera_x <= -30 ) {
                    el.cursor.setAttribute('visible', 'true');
                } else {
                    el.cursor.setAttribute('visible', 'false');
                }

                // UPDATE COMPASS
                el.pointer.style.transform = `rotateZ(${-camera_y}deg)`
            }
		});
	}

	_showVRUI() {
        const el = {
            cursor: document.getElementById('cursor')
        }
		// hide non-VR UI
		document.querySelector('#ui').style.display = 'none';

		el.cursor.setAttribute('raycaster', 'objects: .vr-thumbnail');

		let vrThumbnails = document.getElementById('vr-thumbnails');
		vrThumbnails.setAttribute('visible', 'true');

		let currentText = document.querySelector('.current-text');
		currentText.setAttribute('visible', 'true');
	}

	_hideVRUI() {
        const el = {
            cursor: document.getElementById('cursor')
        }
		// show non-VR UI
		document.querySelector('#ui').style.display = 'initial';

		el.cursor.setAttribute('raycaster', 'objects: none');

		let vrThumbnails = document.getElementById('vr-thumbnails');
		vrThumbnails.setAttribute('visible', 'false');

		let currentText = document.querySelector('.current-text');
		currentText.setAttribute('visible', 'false');
	}

	_toggleModal() {
        const el = {
            body: document.querySelector('body')
        }

		el.body.classList.toggle('modal');
	}

	_transition(index) {
        const a = {
            sky: document.getElementById(`sky-${this.skyIndex}`),
            sky_fadeout: {}
        }

        a.sky_fadeout = document.querySelector('a-sky #fade-out');
		const storyLength = document.querySelectorAll('a-assets .sky').length;

		if (index >= storyLength || index < 0)
			return;

		this.skyIndex = index;

		// trigger transition
		a.sky_fadeout.emit('fadeOut');
	}

	_updateSkybox() {
        const a = {
            sky: document.getElementById('skybox')
        }


		//a.sky = document.getElementById('skybox');
		const currentSky = document.getElementById(`sky-${this.skyIndex}`);
		const imageWidth = currentSky.naturalWidth;
		const imageHeight = currentSky.naturalHeight;

		// check if longer than equilinear
		if (imageHeight * 2 < imageWidth) {
			const multiplier = (imageWidth / imageHeight) * 60.8;
			a.sky.setAttribute('theta-start', 45);
			a.sky.setAttribute('theta-length', 60.8);
			a.sky.setAttribute('phi-length', multiplier);
			a.sky.setAttribute('rotation', '0 180 0');
		} else {
			a.sky.setAttribute('theta-start', 0);
			a.sky.setAttribute('theta-length', 180);
			a.sky.setAttribute('phi-length', 360);
			a.sky.setAttribute('rotation', '0 0 0');
		}

		// set skybox to the correct image
		a.sky.setAttribute('src', `#sky-${this.skyIndex}`);
	}
}
