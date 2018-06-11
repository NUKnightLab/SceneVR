const dom = require('utils/dom.js');

module.exports = {
    template: `
    <a-scene reverse-look-controls="reverse-look-controls">
        <a-assets></a-assets>
        <a-entity id="camera" camera="camera" look-controls="reverse-mouse-drag:true">
            <a-entity id="cursor" cursor="fuse: true; fuseTimeout:1000;" raycaster="objects: none" position="0.0 0.0 -0.45" geometry="primitive: ring; radius-inner: 0.005; radius-outer: 0.01; thetaLength: 360" material="color: #D3D3D3" visible="false">
                <a-animation begin="fusing" end="stop-loading" easing="ease-in" attribute="geometry.thetaLength" dur="1000" from="360" to="0"></a-animation>
                <a-animation begin="rewind" easing="ease-in" attribute="geometry.thetaLength" to="360"></a-animation>
                <a-animation begin="click" easing="ease-in" attribute="geometry.thetaLength" dur="500" from="0" to="360"></a-animation>
            </a-entity>
        </a-entity>
        <a-entity id="vr-thumbnails" visible="false"></a-entity>
        <a-sky id="skybox" src="#sky-0">
            <a-animation id="fade-out" attribute="material.opacity" begin="fadeOut" from="1" to="0"></a-animation>
            <a-animation id="fade-in" attribute="material.opacity" begin="fadeIn" from="0" to="1"></a-animation>
        </a-sky>
    </a-scene>
    <div id="ui">
        <div id="black-background"></div>
        <img id="cardboard" src="/assets/google-cardboard.svg">
        <img id="fullscreen" src="/assets/fullscreen.svg">
        <img id="thumbnail-icons-close" src="/assets/close.svg"/>
        <div id="thumbnail-icons">
            <div id="thumbnail-icons-stack"></div>
        </div>
        <div id="thumbnails-container">
            <div id="thumbnails"></div>
        </div>
        <div id="compass-container">
            <svg id="compass" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 334.47 334.47">
                <title>Compass</title>
                <circle class="a" cx="167.24" cy="167.24" r="155.24"/>
                <circle class="b" cx="167.24" cy="167.24" r="30.1"/>
                <path id="pointer" d="M79,81.61l52.85,52.86c2.18-2.22,16.12-15.92,37.67-14.92,18.71,0.87,30.42,12.24,33,14.92l52.85-52.85c-6.94-6.89-36.09-34.28-82.18-36.49C119.69,42.55,84.73,76,79,81.61Z"/>
            </svg>
        </div>
        <div id="footer">
            <div id="footer-content"></div>
        </div>
    </div>
    `,
    buildTemplate: (templateData) => {
        let scene = document.createElement('section');
        scene.id = 'scene-vr';
        scene.innerHTML = module.exports.template
        let assets = scene.querySelector('a-assets');
        let thumbnailsIconStack = scene.querySelector('#thumbnail-icons #thumbnail-icons-stack');
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

            // only need three thumbnails for stack
            if (i < 3) {
              let thumbnailIcon = dom.createElement('img', '', ['thumbnail-icon']);
              thumbnailIcon.setAttribute('src', img.thumbnailPath);
              thumbnailsIconStack.prepend(thumbnailIcon);
            }

            let vrThumbnailEl = dom.createElement('a-image', `vr-thumbnail-${i}`, ['vr-thumbnail', `${i === 0 ? 'current-vr-thumbnail' : ''}`]);
            vrThumbnailEl.setAttribute('src', img.thumbnailPath);
            vrThumbnailEl.setAttribute('width', 0.25);
            vrThumbnailEl.setAttribute('height', 0.25);
            vrThumbnailEl.setAttribute('look-at', '[camera]');
            // vrThumbnailEl.setAttribute('shader', 'standard');

            // x from 0 to 1, -0.7 + x, x ranges from -1.4 to 1.4
            let xPosition = -0.7 + (i / (scenesLength - 1)) * 1.4;
            let z = (i / (scenesLength - 1));

            // these adjustments make the thumbnails appear more circular around the user
            let zCorrection = 0.5 * Math.abs(0.5 - z);
            let xCorrection = 0.25 * (0.5 - z);
            xPosition += xCorrection;

            // since the half circle is asymptotic at 0 and 1, we need to adjust the position
            if (z === 0)
              z = ((i + 1) / (scenesLength - 1)) / 2;
            else if (z === 1)
              z = (((i - 1) / (scenesLength - 1)) + 1) / 2;

            // scale z position to fit the circle
            z *= 1.4;

            // half circle with radius 0.7, centered in the middle of the half circle
            let zPosition = -Math.sqrt(Math.pow(0.7, 2) - Math.pow(z - 0.7, 2)) + 0.35;
            zPosition += zCorrection;
            vrThumbnailEl.setAttribute('position', `${xPosition} -0.6 ${zPosition}`);

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
