module.exports = {
  addEventListeners: () => {
    // Fade transitions
    let skyIndex = 0;
    let backIndex=-1;
	let nextIndex=1;
    const storyLength = document.querySelectorAll('a-assets .sky').length;
    const aSkyEl = document.getElementById('skybox');
    const aSkyFadeOut = document.querySelector('a-sky #fade-out');
    const aSkyFadeIn = document.querySelector('a-sky #fade-in');
    const nextButton = document.getElementById('next');
    const fullscreenButton = document.getElementById('fullscreen');
    const thumbnailElements = [...document.querySelectorAll('.thumbnail')];
    const backOrb = document.getElementById('back-orb');
	const nextOrb = document.getElementById('next-orb');
	const cursor =  document.getElementById('cursor');
	const backOrbEntity = document.getElementById('back-orb-entity');
	const nextOrbEntity = document.getElementById('next-orb-entity');

	//Set up orbs
switch (storyLength)
{
	case 0:
		console.log("This story contains no images...");
		break;
	case 1:
		backOrb.setAttribute('opacity', 0);
		nextOrb.setAttribute('opacity', 0);
		aSkyEl.setAttribute('src', `#sky-${skyIndex}`);
		break;
	default:
		backOrb.setAttribute('opacity', 0);
		nextOrb.setAttribute('opacity', 1);
		nextOrbEntity.setAttribute('class',"orb");
		nextOrb.setAttribute('src', `#sky-${nextIndex}`);
		aSkyEl.setAttribute('src', `#sky-${skyIndex}`);
		break;
	
}

//Helper function to update all skyboxes
function updateSkies(){
	aSkyEl.setAttribute('src', `#sky-${skyIndex}`);
	backOrb.setAttribute('src', `#sky-${backIndex}`);
	nextOrb.setAttribute('src', `#sky-${nextIndex}`);
}

//Handler when "back" orb is selected
 backOrb.addEventListener('click', () => {
 	aSkyFadeOut.emit('fadeOut');
  	skyIndex--;
	nextIndex--;
	backIndex--;
	if (skyIndex>=0){
		if (nextIndex==storyLength-1){ //If the next orb was invisible because we were on the last image
			nextOrb.setAttribute('opacity', 1);
			nextOrbEntity.setAttribute('class',"orb");
		}
		if (backIndex==-1){ //If we will now be on the first image of the collection
			backOrb.setAttribute('opacity',0);
			backOrb.setAttribute('src', '');
			backOrbEntity.setAttribute('class',"not-selectable");
			aSkyEl.setAttribute('src', `#sky-${skyIndex}`);
			nextOrb.setAttribute('src', `#sky-${nextIndex}`);
		}
		else{
			updateSkies();
		}
	}
	cursor.components.raycaster.refreshObjects(); //Update cursor to only select active orbs
		
  });
  
  //Handler when "next" orb is selected
  nextOrb.addEventListener('click', () => {
  	aSkyFadeOut.emit('fadeOut');
  	skyIndex++;
	nextIndex++;
	backIndex++;
	if (skyIndex<storyLength){
		if (backIndex==0){ //If the backOrb was invisible because we were on the first image
		backOrb.setAttribute('opacity', 1);
		backOrbEntity.setAttribute('class',"orb");}
		if (nextIndex==storyLength){ //If there cannot be another "next" image after this
		nextOrb.setAttribute('opacity', 0);
		nextOrb.setAttribute('src', '');
		nextOrbEntity.setAttribute('class',"");
		aSkyEl.setAttribute('src', `#sky-${skyIndex}`);
		backOrb.setAttribute('src', `#sky-${backIndex}`);}
		else{
		updateSkies();
		}
	}
	cursor.components.raycaster.refreshObjects(); //Update cursor to only select active orbs
  });
  
  document.getElementById('cursor').addEventListener('raycaster-intersection-cleared', () => {
	cursor.emit('rewind');
	cursor.emit('stop-loading');
});	

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