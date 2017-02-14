// Fade transitions
let skyIndex = 1; // swig's loop index starts at 1...
const storyLength = document.querySelectorAll('a-assets .sky').length;
const aSky = document.querySelector('a-sky');
const aSkyFadeOut = document.querySelector('a-sky #fade-out');
const aSkyFadeIn = document.querySelector('a-sky #fade-in');

aSkyFadeOut.addEventListener('animationend', () => {
  // change the a-sky and increment skyIndex
  aSky.setAttribute('src', `#sky-${++skyIndex}`);

  // update the selected thumbnail in the footer
  let selectedThumbnail = document.querySelector('.selected-thumbnail');
  selectedThumbnail.className = selectedThumbnail.className.replace('selected-thumbnail','');
  document.querySelector(`#thumbnail-${skyIndex}`).className += ' selected-thumbnail';

  // fade in the new a-sky
  aSky.emit('fadeIn');
});

aSkyFadeIn.addEventListener('animationend', () => {
});

document.getElementById('next').addEventListener('click', () => {
  if (skyIndex < storyLength)
    aSky.emit('fadeOut');
});

// Compass
let angle, angleInRadians = 0;
const pointerEl = document.getElementById('pointer');

document.getElementById('camera').addEventListener('componentchanged', (event) => {
  if (event.detail.name === 'rotation' && event.detail.newData.y !== angle) {
    angle = event.detail.newData.y;
    angleInRadians = angle * (Math.PI / 180);
    pointerEl.style.transform = `rotateZ(${-angle}deg)`
  }
});
