const template = require('template.js');
const ui = require('ui.js');
const gapiClient = require('gapiClient.js');

function buildTemplate() {
  gapiClient.init().then(() => {
    return gapiClient.getSpreadsheetData();
  }).then(response => {
    let templateData = { images: [] };
    response.result.values.forEach((p, i) => {
      templateData.images.push({ path: p[0] });
    });

    let compiledTemplate = Handlebars.compile(template.template); 
    let scene = document.createElement('section');
    scene.innerHTML = compiledTemplate(templateData);
    document.querySelector('body').appendChild(scene);
    ui.addEventListeners();
  }, response => {
    console.log(response.result.error.message);
  });
}

window.onload = () => {
  buildTemplate();
}
