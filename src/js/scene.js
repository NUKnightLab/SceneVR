const Scenes = require('ui/scenes.js');
const Aframe = require('lib/aframe-v0.5.0.js');
const AframeLookAtComponent = require('lib/aframe-look-at-component.min.js');



const exampleSpreadsheetId = '1fWdaOBE62qfr3OWZGsPqbF4X-bh_VQJ5U3fbbZbd61U';

function initalize() {
    const qs = getQueryParams(window.location.search);
    qs.source = qs.hasOwnProperty('source') ? qs.source : exampleSpreadsheetId;

    let scenes = new Scenes(qs);
}

function getQueryParams(qs) {
    qs = qs.split("+").join(" ");

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

window.onload = initalize;
