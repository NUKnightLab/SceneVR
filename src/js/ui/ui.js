module.exports = class UI {
  constructor(config) {
    this.skyIndex = 0;
    this.setupUI();
  }

  setupUI() {
    const bodyEl = document.querySelector('body');
    const aScene = bodyEl.querySelector('a-scene');
    const aAssetsEl = aScene.querySelector('a-assets');
    const aSkyEl = aScene.querySelector('#skybox');
    const aSkyFadeOut = aSkyEl.querySelector('#fade-out');
    const fullscreenButton = document.getElementById('fullscreen');
    const thumbnailElements = [...document.querySelectorAll('.thumbnail')];
    const vrThumbnailElements = [...document.querySelectorAll('.vr-thumbnail')];
    const thumbnailIcons = [...document.querySelectorAll('.thumbnail-icon')];
    const closeThumbnailIcons = document.querySelector('#thumbnail-icons-close');
    const thumbnailsContainer = document.querySelector('#thumbnails-container');

    bodyEl.classList.add(aScene.isMobile ? 'mobile' : 'desktop');

    aScene.addEventListener('enter-vr', () => {
      this._showVRUI();
      bodyEl.classList.add('vr');
    });

    aScene.addEventListener('exit-vr', () => {
      this._hideVRUI();
      bodyEl.classList.remove('vr');
    });

    // show loading screen until assets are loaded
    aAssetsEl.addEventListener('loaded', () => {
      const loadingScreen = document.getElementById('loading');
      const scenes = document.getElementById('rendered-template');

      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        scenes.classList.add('fade-in');
        loadingScreen.remove();
      }, 500);

      // update skybox in case the projection needs to be fixed
      this._updateSkybox();
    });

    aSkyFadeOut.addEventListener('animationend', () => {
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
      aSkyEl.emit('fadeIn');
    });

    // enter VR or fullscreen
    fullscreenButton.addEventListener('click', () => {
      if (aScene.isMobile) {
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
    aScene.addEventListener('mousedown', () => {
      if (document.querySelector('body').classList.contains('modal'))
        this._toggleModal();
    });

    // VR thumbnails
    let cursor = document.getElementById('cursor');
    vrThumbnailElements.forEach((t, i) => {
      t.addEventListener('click', () => {
        if (this.skyIndex !== i)
          this._transition(i);
      });
    });

    cursor.addEventListener('raycaster-intersection-cleared', () => {
      cursor.emit('rewind');
      cursor.emit('stop-loading');
    });

    let cameraEl = document.getElementById('camera');

    // update compass when camera is rotated
    cameraEl.addEventListener('componentchanged', (event) => {
      let angle = 0;
      const pointerEl = document.getElementById('pointer');

      if (event.detail.name === 'rotation' && event.detail.newData.y !== angle) {
        angle = event.detail.newData.y;
        pointerEl.style.transform = `rotateZ(${-angle}deg)`
      }
    });
  }

  _showVRUI() {
    let cursor = document.getElementById('cursor');
    cursor.setAttribute('visible', 'true');
    cursor.setAttribute('raycaster', 'objects: .vr-thumbnail');

    let vrThumbnails = document.getElementById('vr-thumbnails');
    vrThumbnails.setAttribute('visible', 'true');

    let currentText = document.querySelector('.current-text');
    currentText.setAttribute('visible', 'true');
  }

  _hideVRUI() {
    let cursor = document.getElementById('cursor');
    cursor.setAttribute('visible', 'false');
    cursor.setAttribute('raycaster', 'objects: none');

    let vrThumbnails = document.getElementById('vr-thumbnails');
    vrThumbnails.setAttribute('visible', 'false');

    let currentText = document.querySelector('.current-text');
    currentText.setAttribute('visible', 'false');
  }

  _toggleModal() {
    const bodyEl = document.querySelector('body');
    bodyEl.classList.toggle('modal');
  }

  _transition(index) {
    const storyLength = document.querySelectorAll('a-assets .sky').length;
    const aSkyFadeOut = document.querySelector('a-sky #fade-out');

    if (index >= storyLength || index < 0)
      return;

    this.skyIndex = index;

    // trigger transition
    aSkyFadeOut.emit('fadeOut');
  }

  _updateSkybox() {
    const aSkyEl = document.getElementById('skybox');
    const currentSky = document.getElementById(`sky-${this.skyIndex}`);
    const imageWidth = currentSky.naturalWidth;
    const imageHeight = currentSky.naturalHeight;

    // check if longer than equilinear
    if (imageHeight * 2 < imageWidth) {
      const multiplier = (imageWidth / imageHeight) * 60.8;
      aSkyEl.setAttribute('theta-start', 45);
      aSkyEl.setAttribute('theta-length', 60.8);
      aSkyEl.setAttribute('phi-length', multiplier);
      aSkyEl.setAttribute('rotation', '0 180 0');
    } else {
      aSkyEl.setAttribute('theta-start', 0);
      aSkyEl.setAttribute('theta-length', 180);
      aSkyEl.setAttribute('phi-length', 360);
      aSkyEl.setAttribute('rotation', '0 0 0');
    }

    // set skybox to the correct image
    aSkyEl.setAttribute('src', `#sky-${this.skyIndex}`);
  }
}