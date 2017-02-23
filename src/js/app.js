const ui = require('ui.js');
const gapiClient = require('gapiClient.js');
const template = require('template.js');

const spreadsheetId = '1tTyJECAoiLjHQh9_RWtVavhO_rLk133dt8-5c6lN-F0';

function initalize() {
  gapiClient.getSpreadsheetData(spreadsheetId).then(response => {
    let templateData = { images: [] };
    response.entry.forEach(e => {
      templateData.images.push({
        path: e.gsx$sceneimageurl.$t,
        text: e.gsx$bodytext.$t
      });
    });

    let scene = template.buildTemplate(templateData);
    document.querySelector('body').appendChild(scene);
    ui.addEventListeners();
  }, response => {
    console.log(response.result.error.message);
  });
}

window.onload = initalize;
