const ui = require('ui.js');
const gapiClient = require('gapiClient.js');
const template = require('template.js');

function initalize() {
  gapiClient.init().then(() => {
    return gapiClient.getSpreadsheetData();
  }).then(response => {
    let templateData = { images: [] };
    response.result.values.forEach(p => {
      templateData.images.push({ path: p[0] });
    });

    let scene = template.buildTemplate(templateData);
    document.querySelector('body').appendChild(scene);
    ui.addEventListeners();
  }, response => {
    console.log(response.result.error.message);
  });
}

window.onload = initalize;
