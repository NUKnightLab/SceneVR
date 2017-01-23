let skyIndex = 1; // swig's loop index starts at 1...
let storyLength = document.querySelectorAll('a-assets img').length;
let aSky = document.querySelector('a-sky');
let aSkyFadeOut = document.querySelector('a-sky #fade-out');
let aSkyFadeIn = document.querySelector('a-sky #fade-in');

aSkyFadeOut.addEventListener('animationend', () => {
  aSky.setAttribute('src', `#sky-${++skyIndex}`);
  aSky.emit('fadeIn');
});

aSkyFadeIn.addEventListener('animationend', () => {
});

document.getElementById('next').addEventListener('click', () => {
  if (skyIndex < storyLength)
    aSky.emit('fadeOut');
});