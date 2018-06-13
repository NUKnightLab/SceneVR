const Scenes = require('./ui/scenes.js');
const isMobile = require('./utils/isMobile.js');
const data_url = "/assets/test_panos/data.json";

// config data model
// config {
//     source: '1fWdaOBE62qfr3OWZGsPqbF4X-bh_VQJ5U3fbbZbd61U',
//     isMobile: isMobile.any(),
//
// }

// DATA MODEL
// project: {
//     title: "Title",
//     desc: "Description",
//     scenes: [
//         {
//             caption: "Caption info",
//             image_url: "url_to_image"
//         },
//         {
//             caption: "Caption info",
//             image_url: "url_to_image"
//         }
//     ]
// }

function initalize() {
    console.log('Scene VR Version: 0.0.5 (20180611)');
    const query_params = getQueryParams(window.location.search);
    let config = {}
    config.source = query_params.hasOwnProperty('source') ? query_params.source : data_url;
    config.isMobile = isMobile.any;
    let scenes = new Scenes(config);

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
