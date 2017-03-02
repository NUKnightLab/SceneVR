const Story = require('story.js');
const Aframe = require('aframe-v0.5.0.js');

const exampleSpreadsheetId = '1tTyJECAoiLjHQh9_RWtVavhO_rLk133dt8-5c6lN-F0';

function initalize() {
  const qs = getQueryParams(window.location.search);
  qs.source = qs.hasOwnProperty('source') ? qs.source : exampleSpreadsheetId;

  let s = new Story(qs);
}

function getQueryParams(qs) {
  qs = qs.split("+").join(" ");

  var params = {}, tokens,
  re = /[?&]?([^=]+)=([^&]*)/g;

  while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])]
    = decodeURIComponent(tokens[2]);
  }

  return params;
}

window.onload = initalize;
