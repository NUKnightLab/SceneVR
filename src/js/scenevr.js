// const AFRAME = require("aframe");
const THREE = require("three");
const OrbitControls = require('three-orbitcontrols');
const Scene = require('./ui/Scene.js');
const isMobile = require('./utils/isMobile.js');
const data_url = "/assets/old_panos/data.json";


function initalize() {
    console.info('Scene VR Version: 0.0.7 (2018-06-21)');
    const query_params = getQueryParams(window.location.search);
    let config = {}
    config.source = query_params.hasOwnProperty('source') ? query_params.source : data_url;
    config.isMobile = isMobile.any;
    let scene = new Scene(config);

    function animate() {
        window.requestAnimationFrame(animate);
        scene.render();
    }

    function onResize() {
        console.debug("Window Resize");
        scene.updateSize();
    };

    animate();
    window.addEventListener( 'resize', onResize, false );

}



// Get information from URL
function getQueryParams(query_params) {
    query_params = query_params.split("+").join(" ");

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(query_params)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}


window.onload = initalize;
