module.exports = {
  skyIndex: 0,
  addEventListeners: () => {
    module.exports.setupOrbs();
    module.exports.setupUI();
    const aScene = document.querySelector('a-scene');
    aScene.addEventListener('enter-vr', module.exports._showOrbs);
    aScene.addEventListener('exit-vr', module.exports._hideOrbs);
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

    // Compass
    const cameraEl = document.getElementById('camera');
    let angle, angleInRadians = 0;
    const pointerEl = document.getElementById('pointer');

    aSkyFadeOut.addEventListener('animationend', () => {
      // update the selected thumbnail in the footer
      let selectedThumbnail = document.querySelector('.selected-thumbnail');
      selectedThumbnail.className = selectedThumbnail.className.replace('selected-thumbnail','');
      document.querySelector(`#thumbnail-${module.exports.skyIndex}`).className += ' selected-thumbnail';

      // fade in the new a-sky
      aSkyEl.emit('fadeIn');
    });

    // change a-sky to next image 
    nextButton.addEventListener('click', () => {
      if (module.exports.skyIndex < storyLength - 1) {
        aSkyEl.emit('fadeOut');
        aSkyEl.setAttribute('src', `#sky-${++module.exports.skyIndex}`);
      }
    });

    // full screen on click
    fullscreenButton.addEventListener('click', () => {
      document.querySelector('a-scene').enterVR();
    });

    // change a-sky on click
    thumbnailElements.forEach((t, i) => {
      t.addEventListener('click', () => {
        if (module.exports.skyIndex !== i) {
          aSkyEl.emit('fadeOut');
          module.exports.skyIndex = i;
          aSkyEl.setAttribute('src', `#sky-${module.exports.skyIndex}`);
        }
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
    aSkyEl.setAttribute('src', `#sky-${module.exports.skyIndex}`);
    if (storyLength > 1) {
      nextOrbEntity.setAttribute('class','orb');
      nextOrb.setAttribute('src', `#sky-${module.exports.skyIndex + 1}`);
    }

    //Handler when 'back' orb is selected
    backOrb.addEventListener('click', () => {
      aSkyFadeOut.emit('fadeOut');
      module.exports.skyIndex--;
      if (module.exports.skyIndex >= 0){
        if (module.exports.skyIndex + 1 === storyLength - 1) { //If the next orb was invisible because we were on the last image
          nextOrb.setAttribute('opacity', 1);
          nextOrbEntity.setAttribute('class','orb');
        }
        if (module.exports.skyIndex - 1 === -1) { //If we will now be on the first image of the collection
          backOrb.setAttribute('opacity',0);
          backOrb.setAttribute('src', '');
          backOrbEntity.setAttribute('class','not-selectable');
          aSkyEl.setAttribute('src', `#sky-${module.exports.skyIndex}`);
          nextOrb.setAttribute('src', `#sky-${module.exports.skyIndex + 1}`);
        } else {
          module.exports._updateSkies();
        }
      }
      cursor.components.raycaster.refreshObjects(); //Update cursor to only select active orbs
    });

    //Handler when 'next' orb is selected
    nextOrb.addEventListener('click', () => {
      aSkyFadeOut.emit('fadeOut');
      module.exports.skyIndex++;
      if (module.exports.skyIndex < storyLength) {
        if (module.exports.skyIndex - 1 === 0){ //If the backOrb was invisible because we were on the first image
          backOrb.setAttribute('opacity', 1);
          backOrbEntity.setAttribute('class','orb');
        }
        if (module.exports.skyIndex + 1 === storyLength) { //If there cannot be another 'next' image after this
          nextOrb.setAttribute('opacity', 0);
          nextOrb.setAttribute('src', '');
          nextOrbEntity.setAttribute('class','');
          aSkyEl.setAttribute('src', `#sky-${module.exports.skyIndex}`);
          backOrb.setAttribute('src', `#sky-${module.exports.skyIndex - 1}`);
        } else {
          module.exports._updateSkies();
        }
      }
      cursor.components.raycaster.refreshObjects(); //Update cursor to only select active orbs
    });

    cursor.addEventListener('raycaster-intersection-cleared', () => {
      cursor.emit('rewind');
      cursor.emit('stop-loading');
    });
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
    const aSkyEl = document.getElementById('skybox');
    const backOrb = document.getElementById('back-orb');
    const nextOrb = document.getElementById('next-orb');

    aSkyEl.setAttribute('src', `#sky-${module.exports.skyIndex}`);
    backOrb.setAttribute('src', `#sky-${module.exports.skyIndex - 1}`);
    nextOrb.setAttribute('src', `#sky-${module.exports.skyIndex + 1}`);
  }
}