const dom = require('utils/dom.js');

module.exports = {
	template: `<a-scene>
      <a-assets>
      </a-assets>
      <a-entity id="camera" camera look-controls>
      <a-entity   id="cursor"
    			cursor="fuse: true; fuseTimeout:4500" 
            	raycaster="objects: .orb"
                position="0.0 0.0 -0.45" geometry="primitive: ring; radius-inner: 0.005; radius-outer: 0.01; thetaLength: 360" 
                material="color: #D3D3D3">
                <a-animation  begin="fusing" end="stop-loading" easing="ease-in" attribute="geometry.thetaLength"
                dur=4500 from="360" to="0"></a-animation>
                <a-animation  begin="rewind" easing="ease-in" attribute="geometry.thetaLength"
                to="360"></a-animation>
                <a-animation  begin="click" easing="ease-in" attribute="geometry.thetaLength"
                dur=500 from="0" to="360"></a-animation>
  </a-entity>
  </a-entity>
  <a-entity id="back-orb-entity" position="-0.5 -0.75 -0.5" rotation="0 0 0" class="not-selectable" opacity=0>
      	<a-sky
      	id="back-orb"
      	radius=0.25
      	phi-start=0
      	phi-length=360
      	opacity=1
      	>	
      		<a-animation
      		begin="mouseenter"
      		dur=4000
      		attribute="rotation"
      		to="0 360 0"
      		fill="none"
      		</a-animation>
        </a-sky>
    </a-entity>
    <a-entity id="next-orb-entity" position="0.5 -0.75 -0.5" rotation="0 0 0" class="not-selectable">
      	<a-sky
      		id="next-orb"
      		radius=0.25
      		phi-start=0
      		phi-length=360
      		opacity=1
      		>	
      		<a-animation
      		begin="mouseenter"
      		dur=4000
      		attribute="rotation"
      		to="0 360 0"
      		fill="none"
      		</a-animation>
      		<a-animation id="fade-out-next" attribute="material.opacity" begin="fadeOutNext" to="0"></a-animation>
  			<a-animation id="fade-in-next" attribute="material.opacity" begin="fadeInNext" to="1"></a-animation>
        </a-sky>
    </a-entity>
      <a-sky id="skybox" src="#sky-0">
        <a-animation id="fade-out" attribute="material.opacity" begin="fadeOut" to="0"></a-animation>
        <a-animation id="fade-in" attribute="material.opacity" begin="fadeIn" to="1"></a-animation>
      </a-sky>
    </a-scene>
    <div id="ui">
      <div id="black-background"></div>
      <img id="next" src="/assets/chevron-right.svg">
      <img id="cardboard" src="/assets/google-cardboard.svg">
      <img id="fullscreen" src="/assets/fullscreen.svg">
      <div id="compass-container">
        <svg id="compass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 334.47 334.47">
          <title>Compass</title>
          <circle class="a" cx="167.24" cy="167.24" r="155.24"/>
          <circle class="b" cx="167.24" cy="167.24" r="30.1"/>
          <path id="pointer" d="M79,81.61l52.85,52.86c2.18-2.22,16.12-15.92,37.67-14.92,18.71,0.87,30.42,12.24,33,14.92l52.85-52.85c-6.94-6.89-36.09-34.28-82.18-36.49C119.69,42.55,84.73,76,79,81.61Z"/>
        </svg>
      </div>
      <div id="footer">
        <div id="footer-content">
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat.</p>
        </div>
        <div id="thumbnails">
        </div>
      </div>
    </div>`,
  buildTemplate: (templateData) => {
    let scene = document.createElement('section');
    scene.id = 'rendered-template';
    scene.innerHTML = module.exports.template
    let assets = scene.querySelector('a-assets');
    let thumbnails = scene.querySelector('#thumbnails');
    templateData.images.forEach((img, i) => {
      let skyEl = dom.createElement('img', `sky-${i}`, ['sky']);
      skyEl.setAttribute('src', img.path);
      assets.appendChild(skyEl);

      let thumbnailEl = dom.createElement('img', `thumbnail-${i}`, ['thumbnail', `${i === 0 ? "selected-thumbnail" : ""}`]);
      thumbnailEl.setAttribute('src', img.path);
      thumbnails.appendChild(thumbnailEl);
    });

    return scene;
  }
}