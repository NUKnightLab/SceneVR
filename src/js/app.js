const ui = require('ui.js');
const gapiClient = require('gapiClient.js');
const template = require('template.js');

const spreadsheetId = '1aLMe-s3SGIPZw51prsyNvM8LENNtI55WP0b7LAyLajE';

function initalize() {
  gapiClient.getSpreadsheetData(spreadsheetId).then(response => {
    let templateData = { images: [] };
    response.entry.forEach(e => {
      templateData.images.push({ path: e.gsx$paths.$t });
    });

    let scene = template.buildTemplate(templateData);
    document.querySelector('body').appendChild(scene);
    ui.addEventListeners();
  }, response => {
    console.log(response.result.error.message);
  });
}

window.onload = initalize;
