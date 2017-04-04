const dom = require('utils/dom.js');

module.exports = {
    template: `<a-scene>
      <a-assets>
      </a-assets>
      <a-entity id="camera" camera look-controls="reverse-mouse-drag:true">
        <a-entity id="cursor"
          cursor="fuse: true; fuseTimeout:1000;"
          raycaster="objects: .vr-thumbnail-sky"
          position="0.0 0.0 -0.45" geometry="primitive: ring; radius-inner: 0.005; radius-outer: 0.01; thetaLength: 360"
          material="color: #D3D3D3" visible="false">
            <a-animation  begin="fusing" end="stop-loading" easing="ease-in" attribute="geometry.thetaLength"
            dur=1000 from="360" to="0"></a-animation>
            <a-animation  begin="rewind" easing="ease-in" attribute="geometry.thetaLength"
            to="360"></a-animation>
            <a-animation  begin="click" easing="ease-in" attribute="geometry.thetaLength"
            dur=500 from="0" to="360"></a-animation>
        </a-entity>
      </a-entity>
      <a-entity id="vr-thumbnails">
      </a-entity>
      <a-entity id="back-orb-entity" position="-0.5 -0.6 -0.5" rotation="0 0 0" class="not-selectable" opacity="0" visible="false">
        <a-sky id="back-orb" radius=0.25 phi-start=0 phi-length=360 opacity=1>
          <a-animation begin="mouseenter" dur=4000 attribute="rotation" to="0 360 0"fill="none"></a-animation>
        </a-sky>
      </a-entity>
      <a-entity id="next-orb-entity" position="0.5 -0.6 -0.5" rotation="0 0 0" class="not-selectable" visible="false">
        <a-sky id="next-orb" radius=0.25 phi-start=0 phi-length=360 opacity=1>
          <a-animation begin="mouseenter" dur=4000 attribute="rotation" to="0 360 0" fill="none"></a-animation>
          <a-animation id="fade-out-next" attribute="material.opacity" begin="fadeOutNext" to="0"></a-animation>
          <a-animation id="fade-in-next" attribute="material.opacity" begin="fadeInNext" to="1"></a-animation>
        </a-sky>
      </a-entity>
      <a-sky id="skybox" src="#sky-0">
        <a-animation id="fade-out" attribute="material.opacity" begin="fadeOut" from="1" to="0"></a-animation>
        <a-animation id="fade-in" attribute="material.opacity" begin="fadeIn" from="0" to="1"></a-animation>
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
        let vrThumbnails = scene.querySelector('#vr-thumbnails');
        let aScene = scene.querySelector('a-scene');
        const scenesLength = templateData.images.length;

        let backgroundText = dom.createElement('a-entity', 'background-text', []);
        backgroundText.setAttribute('geometry', 'primitive: plane; height: 0.6; width: 2.2');
        backgroundText.setAttribute('material', 'color: black; opacity: 0.0'); //Currently not showing
        backgroundText.setAttribute('position', '0 0 -2');
        aScene.appendChild(backgroundText);

        let footerContentEl = scene.querySelector('#footer-content');

        templateData.images.forEach((img, i) => {
            let skyEl = dom.createElement('img', `sky-${i}`, ['sky']);
            skyEl.setAttribute('src', img.path);
            skyEl.setAttribute('crossorigin', 'anonymous');
            assets.appendChild(skyEl);

            let thumbnailEl = dom.createElement('img', `thumbnail-${i}`, ['thumbnail', `${i === 0 ? 'selected-thumbnail' : ''}`]);
            thumbnailEl.setAttribute('src', img.thumbnailPath);
            thumbnails.appendChild(thumbnailEl);

            let vrThumbnailEl = dom.createElement('a-entity', `vr-thumbnail-${i}`, ['vr-thumbnail', `${i === 0 ? 'current-vr-thumbnail' : ''}`]);
            vrThumbnailEl.setAttribute('src', img.thumbnailPath);
            // a from 0 to 1, -1 + 2a, x ranges from -1 to 1
            const xPosition = -1 + (i / (scenesLength - 1)) * 2;
            // a from 0 to 2, (a - 1)^2 - 1
            // divide by 4 and subtract 0.25 to smooth values, z ranges from -0.25 to -0.25
            const zPosition = (Math.pow(((i / (scenesLength - 1) * 2.0) - 1), 2) - 1) / 4 - 0.25;
            vrThumbnailEl.setAttribute('position', `${xPosition} -0.6 ${zPosition}`);
            let vrThumbnailSky = dom.createElement('a-sky', `vr-thumbnail-sky-${i}`, ['vr-thumbnail-sky']);
            vrThumbnailSky.setAttribute('src', img.thumbnailPath);
            vrThumbnailSky.setAttribute('radius', 0.1);
            vrThumbnailSky.setAttribute('phi-start', 0);
            vrThumbnailSky.setAttribute('phi-length', 360);
            vrThumbnailEl.appendChild(vrThumbnailSky);
            vrThumbnails.appendChild(vrThumbnailEl);

            let textEl = dom.createElement('a-entity', `text-${i}`, ['text', `${i === 0 ? 'current-text' : ''}`]);
            textEl.setAttribute('geometry', 'primitive: plane; height: 0.3; width: 1');
            //textEl.setAttribute('text', `value: ${img.text}; align: left`); //Currently not showing
            textEl.setAttribute('material', 'color: black; opacity: 0.0'); //Currently not showing
            textEl.setAttribute('position', '0 0 1');
            textEl.setAttribute('visible', `${i === 0}`);
            backgroundText.appendChild(textEl);

            let footerText = dom.createElement('p', `footer-text-${i}`, ['footer-text', `${i === 0 ? 'current-footer-text' : ''}`]);
            footerText.innerHTML = img.text;
            footerContentEl.appendChild(footerText);
        });

        return scene;
    }
}
