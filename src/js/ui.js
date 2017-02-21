module.exports = {
  addEventListeners: () => {
    // Fade transitions
    let skyIndex = 0;
    const storyLength = document.querySelectorAll('a-assets .sky').length;
    const aSkyEl = document.querySelector('a-sky');
    const aSkyFadeOut = document.querySelector('a-sky #fade-out');
    const aSkyFadeIn = document.querySelector('a-sky #fade-in');
    const nextButton = document.getElementById('next');

    // Compass
    const cameraEl = document.getElementById('camera');
    let angle, angleInRadians = 0;
    const pointerEl = document.getElementById('pointer');

    aSkyFadeOut.addEventListener('animationend', () => {
      // change the a-sky and increment skyIndex
      aSkyEl.setAttribute('src', `#sky-${++skyIndex}`);

      // update the selected thumbnail in the footer
      let selectedThumbnail = document.querySelector('.selected-thumbnail');
      selectedThumbnail.className = selectedThumbnail.className.replace('selected-thumbnail','');
      document.querySelector(`#thumbnail-${skyIndex}`).className += ' selected-thumbnail';

      // fade in the new a-sky
      aSkyEl.emit('fadeIn');
    });

    aSkyFadeIn.addEventListener('animationend', () => {
    });

    nextButton.addEventListener('click', () => {
      if (skyIndex < storyLength)
        aSkyEl.emit('fadeOut');
    });

    cameraEl.addEventListener('componentchanged', (event) => {
      if (event.detail.name === 'rotation' && event.detail.newData.y !== angle) {
        angle = event.detail.newData.y;
        angleInRadians = angle * (Math.PI / 180);
        pointerEl.style.transform = `rotateZ(${-angle}deg)`
      }
    });
  }
}