const Scenes = require('ui/scenes.js');
const Aframe = require('aframe');
const AframeLookAtComponent = require('aframe-look-at-component');

const exampleSpreadsheetId = '1fWdaOBE62qfr3OWZGsPqbF4X-bh_VQJ5U3fbbZbd61U';

function initalize() {
    console.log('Scene VR Version: 0.0.1 (Date 29-09-2017)');
    const qs = getQueryParams(window.location.search);
    let config = {}
    config.source = qs.hasOwnProperty('source') ? qs.source : exampleSpreadsheetId;
    config.isMobile = isMobile.any();
    let scenes = new Scenes(config);
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

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

window.onload = initalize;
