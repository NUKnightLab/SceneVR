// Fade transitions
let skyIndex = 1; // swig's loop index starts at 1...
const storyLength = document.querySelectorAll('a-assets img').length;
const aSky = document.querySelector('a-sky');
const aSkyFadeOut = document.querySelector('a-sky #fade-out');
const aSkyFadeIn = document.querySelector('a-sky #fade-in');

// aSkyFadeOut.addEventListener('animationend', () => {
//   aSky.setAttribute('src', `#sky-${++skyIndex}`);
//   aSky.emit('fadeIn');
// });

// aSkyFadeIn.addEventListener('animationend', () => {
// });

// document.getElementById('next').addEventListener('click', () => {
//   if (skyIndex < storyLength)
//     aSky.emit('fadeOut');
// });

// Compass
let angle = 0;
const pointerEl = document.getElementById('pointer');

document.getElementById('camera').addEventListener('componentchanged', (event) => {
  if (event.detail.name === 'rotation' && event.detail.newData.y !== angle) {
    angle = event.detail.newData.y;
    pointerEl.setAttribute('position', `${-0.75 * Math.sin(angle * (Math.PI / 180))} ${0.75 * Math.cos(angle * (Math.PI / 180))} 0`);
    pointerEl.setAttribute('rotation', `0 0 ${angle}`);
  }
});


AFRAME.registerComponent('position-compass', {
  x: 0,
  finished: false,
  frustum: new THREE.Frustum(),
  init: function () {
    // on init, construct a frustum
    // more details here: http://stackoverflow.com/questions/17624021/determine-if-a-mesh-is-visible-on-the-viewport-according-to-current-camera
    let cameraEl = document.getElementById('camera');
    let cameraObject3D = cameraEl.getObject3D('camera');
    let cameraViewProjectionMatrix = new THREE.Matrix4();

    cameraEl.object3D.updateMatrixWorld();
    cameraObject3D.matrixWorldInverse.getInverse(cameraObject3D.matrixWorld);
    cameraViewProjectionMatrix.multiplyMatrices(cameraObject3D.projectionMatrix, cameraObject3D.matrixWorldInverse);
    this.frustum.setFromMatrix(cameraViewProjectionMatrix);
  },
  tick: function () {
    if (!this.finished)
      this.updatePosition();
  },
  updatePosition: function () {
    let compassEl = document.getElementById('compass');
    let pointerEl = document.getElementById('pointer');
    compassEl.setAttribute('position', `${this.x++} 0 -12`);

    // move the compass until it is outside of viewport
    if (!this.frustum.intersectsObject(pointerEl.getObject3D('mesh'))) {
      this.finished = true;
      // TODO: find the source of this error. The position error seems to be consistent for various screen sizes.
      const error = this.el.isMobile ? 2.5 : -5;
      compassEl.setAttribute('position', `${this.x + error} 0 -12`);
      compassEl.emit('fadeIn');
      pointerEl.emit('fadeIn');
    }
  }
});


