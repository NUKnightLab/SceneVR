module.exports = {
  skyIndex: 0,
  inVR: 0,
  cameraEl: 0,
  addEventListeners: () => {
    module.exports.setupOrbs();
    module.exports.setupUI();
    const aScene = document.querySelector('a-scene');
    aScene.addEventListener('enter-vr', () => {
      module.exports.inVR = 1;
      module.exports._showOrbs();
      module.exports._hideText(); //Current way to just hide text permanently
    });
    aScene.addEventListener('exit-vr', () => {
      module.exports.inVR = 0;
      module.exports._hideOrbs();
      module.exports._hideText(); //Current way to just hide text permanently
    });
  },
  setupUI: () => {
    // Fade transitions
    const storyLength = document.querySelectorAll('a-assets .sky').length;
    const aSkyEl = document.getElementById('skybox');
    const aSkyFadeOut = document.querySelector('#skybox #fade-out');
    const aSkyFadeIn = document.querySelector('#skybox #fade-in');
    const nextButton = document.getElementById('next');
    const fullscreenButton = document.getElementById('fullscreen');
    const thumbnailElements = [...document.querySelectorAll('.thumbnail')];
    
    module.exports._hideText(); //Current way to just hide text permanently

    // Compass
    cameraEl = document.getElementById('camera');
    let angle, angleInRadians = 0;
    const pointerEl = document.getElementById('pointer');

    aSkyFadeOut.addEventListener('animationend', () => {
      // update the selected thumbnail in the footer
      let selectedThumbnail = document.querySelector('.selected-thumbnail');
      selectedThumbnail.className = selectedThumbnail.className.replace('selected-thumbnail','');
      document.querySelector(`#thumbnail-${module.exports.skyIndex}`).className += ' selected-thumbnail';

      // update the VR text
      let currentText = document.querySelector('.current-text');
      currentText.className = currentText.className.replace('current-text', '');
      currentText.setAttribute('visible', 'false');
      let newText = document.getElementById(`text-${module.exports.skyIndex}`);
      newText.className += ' current-text';

      // update the footer text
      let currentFooterText = document.querySelector('.current-footer-text');
      currentFooterText.className = currentFooterText.className.replace('current-footer-text', '');
      // currentFooterText.style.display = 'none';
      let newFooterText = document.getElementById(`footer-text-${module.exports.skyIndex}`);
      newFooterText.className += ' current-footer-text';

      if (module.exports.inVR==0)
        newText.setAttribute('visible', 'true');

      // update orbs (and skybox projection if necessary)
      module.exports._updateSkies();
      // fade in the new a-sky
      aSkyEl.emit('fadeIn');
    });

    // change a-sky to next image 
    nextButton.addEventListener('click', () => {
    module.exports._transitionTo(module.exports.skyIndex+1);
    });

    // full screen on click
    fullscreenButton.addEventListener('click', () => {
      document.querySelector('a-scene').enterVR();
    });

    // change a-sky on click
    thumbnailElements.forEach((t, i) => {
      t.addEventListener('click', () => {
      module.exports._transitionTo(i);
      });
    });

    // update compass when camera is rotated
    cameraEl.addEventListener('componentchanged', (event) => {
      if (event.detail.name === 'rotation' && event.detail.newData.y !== angle) {
        angle = event.detail.newData.y;
        angleInRadians = angle * (Math.PI / 180);
        pointerEl.style.transform = `rotateZ(${-angle}deg)`
      }
    });
  },
  setupOrbs: () => {
    const storyLength = document.querySelectorAll('a-assets .sky').length;
    const aSkyEl = document.getElementById('skybox');
    const aSkyFadeOut = document.querySelector('a-sky #fade-out');
    const aSkyFadeIn = document.querySelector('a-sky #fade-in');
    const backOrb = document.getElementById('back-orb');
    const nextOrb = document.getElementById('next-orb');
    const cursor =  document.getElementById('cursor');
    const backOrbEntity = document.getElementById('back-orb-entity');
    const nextOrbEntity = document.getElementById('next-orb-entity');

    backOrb.setAttribute('opacity', 0);
    nextOrb.setAttribute('opacity', Number(storyLength > 1));

    const currentSky = document.getElementById('sky-0');
    currentSky.onload = module.exports._updateSkybox;

    if (storyLength > 1) {
      nextOrbEntity.setAttribute('class','orb');
      nextOrb.setAttribute('src', `#sky-${module.exports.skyIndex + 1}`);
    }

    //Handler when 'back' orb is selected
    backOrb.addEventListener('click', () => {
      module.exports._transitionTo(module.exports.skyIndex-1);
      cursor.components.raycaster.refreshObjects(); //Update cursor to only select active orbs
    });

    //Handler when 'next' orb is selected
    nextOrb.addEventListener('click', () => {
      module.exports._transitionTo(module.exports.skyIndex+1);
      cursor.components.raycaster.refreshObjects(); //Update cursor to only select active orbs
    });

    cursor.addEventListener('raycaster-intersection-cleared', () => {
      cursor.emit('rewind');
      cursor.emit('stop-loading');
    });
  },
  _showText: () => {
    let currentText = document.querySelector('.current-text');
    currentText.setAttribute('visible', 'true');
  },
  _hideText: () => {
    let currentText = document.querySelector('.current-text');
    currentText.setAttribute('visible', 'false');
  },
  _showOrbs: () => {
    const backOrbEntity = document.getElementById('back-orb-entity');
    const nextOrbEntity = document.getElementById('next-orb-entity');
    backOrbEntity.setAttribute('visible', 'true');
    nextOrbEntity.setAttribute('visible', 'true');
  },
  _hideOrbs: () => {
    const backOrbEntity = document.getElementById('back-orb-entity');
    const nextOrbEntity = document.getElementById('next-orb-entity');
    backOrbEntity.setAttribute('visible', 'false');
    nextOrbEntity.setAttribute('visible', 'false');
  },
  _updateSkies: () => {
    const backOrb = document.getElementById('back-orb');
    const nextOrb = document.getElementById('next-orb');

    module.exports._updateSkybox();
    backOrb.setAttribute('src', `#sky-${module.exports.skyIndex - 1}`);
    nextOrb.setAttribute('src', `#sky-${module.exports.skyIndex + 1}`);
  },
  _transitionTo: (index) => {
    const storyLength = document.querySelectorAll('a-assets .sky').length;
    const aSkyFadeOut = document.querySelector('a-sky #fade-out');
    if ((index >= storyLength) || (index < 0)) //If index is out of range
      return;

    module.exports.skyIndex = index;
    aSkyFadeOut.emit('fadeOut');

    if (index === 0){ //First scene of story
      const aSkyEl = document.getElementById('skybox');
      const backOrbEntity = document.getElementById('back-orb-entity');
      const nextOrbEntity = document.getElementById('next-orb-entity');
      const backOrb = document.getElementById('back-orb');
      const nextOrb = document.getElementById('next-orb');

      //Make the back orb invisible
      backOrb.setAttribute('opacity', 0);
      backOrb.setAttribute('src', '');
      backOrbEntity.setAttribute('class', 'not-selectable');
 
      //Make the next orb visible
      nextOrb.setAttribute('opacity', 1);
      nextOrb.setAttribute('src', `#sky-${module.exports.skyIndex + 1}`);
      nextOrbEntity.setAttribute('class', 'orb');
    } else if (index === storyLength - 1){ //Last scene of story
      //Make the next orb invisible
      const aSkyEl = document.getElementById('skybox');
      const backOrbEntity = document.getElementById('back-orb-entity');
      const nextOrbEntity = document.getElementById('next-orb-entity');
      const backOrb = document.getElementById('back-orb');
      const nextOrb = document.getElementById('next-orb');
      nextOrb.setAttribute('opacity', 0);
      nextOrb.setAttribute('src', '');
      nextOrbEntity.setAttribute('class', 'not-selectable');

      //Make the back orb visible
      backOrb.setAttribute('opacity', 1);
      backOrb.setAttribute('src', `#sky-${module.exports.skyIndex - 1}`);
      backOrbEntity.setAttribute('class', 'orb');
    } else {
      const backOrb = document.getElementById('back-orb');
      const nextOrb = document.getElementById('next-orb');
      const backOrbEntity = document.getElementById('back-orb-entity');
      const nextOrbEntity = document.getElementById('next-orb-entity');
      //Make the back orb visible
      backOrb.setAttribute('opacity', 1);
      backOrbEntity.setAttribute('class', 'orb');

      //Make the next orb visible
      nextOrb.setAttribute('opacity', 1);
      nextOrbEntity.setAttribute('class', 'orb');
    }
  },
  _updateSkybox: () => {
    const aSkyEl = document.getElementById('skybox');
    const currentSky = document.getElementById(`sky-${module.exports.skyIndex}`);
    const w = currentSky.naturalWidth;
    const h = currentSky.naturalHeight;
    if (h*2 < w) { //Longer than an equilinear
      const multiplier=(w/h)*60.8;
      aSkyEl.setAttribute('theta-start', 45);
      aSkyEl.setAttribute('theta-length', 60.8);
      aSkyEl.setAttribute('phi-length', multiplier);
      aSkyEl.setAttribute('rotation', "0 180 0");
    } else {
      aSkyEl.setAttribute('theta-start', 0);
      aSkyEl.setAttribute('theta-length', 180);
      aSkyEl.setAttribute('phi-length', 360);
      aSkyEl.setAttribute('rotation', "0 0 0");
    }
    aSkyEl.setAttribute('src', `#sky-${module.exports.skyIndex}`);
  }
}