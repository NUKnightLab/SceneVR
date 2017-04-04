module.exports = class UI {
  constructor(config) {
    this.skyIndex = 0;
    this.setupUI();
  }

  setupUI() {
    const aScene = document.querySelector('a-scene');
    const aAssetsEl = aScene.querySelector('a-assets');
    const storyLength = aAssetsEl.querySelectorAll('.sky').length;
    const aSkyEl = aScene.querySelector('#skybox');
    const aSkyFadeOut = aSkyEl.querySelector('#fade-out');
    const aSkyFadeIn = aSkyEl.querySelector('#fade-in');
    const nextButton = document.getElementById('next');
    const fullscreenButton = document.getElementById('fullscreen');
    const thumbnailElements = [...document.querySelectorAll('.thumbnail')];
    const vrThumbnailElements = [...document.querySelectorAll('.vr-thumbnail')];

    aScene.addEventListener('enter-vr', () => {
      this._showVRUI();
    });
    aScene.addEventListener('exit-vr', () => {
      this._hideVRUI();
    });

    // show loading screen until assets are loaded
    aAssetsEl.addEventListener('loaded', () => {
      const loadingScreen = document.getElementById('loading');
      let fadeOut = () => {
        return loadingScreen.animate({ opacity: [1, 0] }, {
          duration: 500,
          easing: 'ease-in',
          fill: 'forwards'
        });
      }

      const scenes = document.getElementById('rendered-template');
      let fadeIn = () => {
        return scenes.animate({ opacity: [0, 1] }, {
          duration: 500,
          easing: 'ease-out',
          fill: 'forwards'
        });
      }

      // fade out the loading screen and then fade into the scenes
      fadeOut().onfinish = () => {
        loadingScreen.remove();
        fadeIn();
      }

      // update skybox in case the projection needs to be fixed
      this._updateSkybox();
    });

    aSkyFadeOut.addEventListener('animationend', () => {
      // update the selected thumbnail in the footer
      let selectedThumbnail = document.querySelector('.selected-thumbnail');
      selectedThumbnail.className = selectedThumbnail.className.replace('selected-thumbnail','');
      document.querySelector(`#thumbnail-${this.skyIndex}`).className += ' selected-thumbnail';

      // update the VR text
      let currentText = document.querySelector('.current-text');
      currentText.className = currentText.className.replace('current-text', '');
      currentText.setAttribute('visible', 'false');
      let newText = document.getElementById(`text-${this.skyIndex}`);
      newText.className += ' current-text';

      // update the footer text
      let currentFooterText = document.querySelector('.current-footer-text');
      currentFooterText.className = currentFooterText.className.replace('current-footer-text', '');
      // currentFooterText.style.display = 'none';
      let newFooterText = document.getElementById(`footer-text-${this.skyIndex}`);
      newFooterText.className += ' current-footer-text';

      // update skybox (and projection if necessary)
      this._updateSkybox();
      // fade in the new a-sky
      aSkyEl.emit('fadeIn');
    });

    // change a-sky to next image 
    nextButton.addEventListener('click', () => {
      this._transition(this.skyIndex + 1);
    });

    // full screen on click
    fullscreenButton.addEventListener('click', () => {
      document.querySelector('a-scene').enterVR();
    });

    // desktop and mobile thumbnails
    thumbnailElements.forEach((t, i) => {
      t.addEventListener('click', () => {
        if (this.skyIndex !== i)
          this._transition(i);
      });
    });

    // change a-sky on click
    let cursor = document.getElementById('cursor');
    vrThumbnailElements.forEach((t, i) => {
      t.querySelector('.vr-thumbnail-sky').addEventListener('click', () => {
        if (this.skyIndex !== i) {
          this._transition(i);
          cursor.components.raycaster.refreshObjects();
        }
      });
    });

    cursor.addEventListener('raycaster-intersection-cleared', () => {
      cursor.emit('rewind');
      cursor.emit('stop-loading');
    });

    let cameraEl = document.getElementById('camera');

    // update compass when camera is rotated
    cameraEl.addEventListener('componentchanged', (event) => {
      let angle, angleInRadians = 0;
      const pointerEl = document.getElementById('pointer');

      if (event.detail.name === 'rotation' && event.detail.newData.y !== angle) {
        angle = event.detail.newData.y;
        angleInRadians = angle * (Math.PI / 180);
        pointerEl.style.transform = `rotateZ(${-angle}deg)`
      }
    });
  }

  _showVRUI() {
    let cursor = document.getElementById('cursor');
    cursor.setAttribute('visible', 'true');

    let vrThumbnails = document.getElementById('vr-thumbnails');
    vrThumbnails.setAttribute('visible', 'true');

    let currentText = document.querySelector('.current-text');
    currentText.setAttribute('visible', 'true');
  }

  _hideVRUI() {
    let cursor = document.getElementById('cursor');
    cursor.setAttribute('visible', 'false');

    let vrThumbnails = document.getElementById('vr-thumbnails');
    vrThumbnails.setAttribute('visible', 'false');

    let currentText = document.querySelector('.current-text');
    currentText.setAttribute('visible', 'false');
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