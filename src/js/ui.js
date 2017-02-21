module.exports = {
  addEventListeners: () => {
    // Fade transitions
    let skyIndex = 0;
    const storyLength = document.querySelectorAll('a-assets .sky').length;
    const aSkyEl = document.querySelector('a-sky');
    const aSkyFadeOut = document.querySelector('a-sky #fade-out');
    const aSkyFadeIn = document.querySelector('a-sky #fade-in');
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
      document.querySelector(`#thumbnail-${skyIndex}`).className += ' selected-thumbnail';

      // fade in the new a-sky
      aSkyEl.emit('fadeIn');
    });

    // change a-sky to next image 
    nextButton.addEventListener('click', () => {
      if (skyIndex < storyLength - 1) {
        aSkyEl.emit('fadeOut');
        aSkyEl.setAttribute('src', `#sky-${++skyIndex}`);
      }
    });

    // full screen on click
    fullscreenButton.addEventListener('click', () => {
      document.querySelector('a-scene').enterVR();
    });

    // change a-sky on click
    thumbnailElements.forEach((t, i) => {
      t.addEventListener('click', () => {
        if (skyIndex !== i) {
          aSkyEl.emit('fadeOut');
          skyIndex = i;
          aSkyEl.setAttribute('src', `#sky-${skyIndex}`);
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
  }
}