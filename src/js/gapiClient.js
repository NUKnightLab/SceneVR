const xhr = require('utils/xhr.js');

module.exports = {
  getSpreadsheetData: (spreadsheetId) => {
    const url = `https://spreadsheets.google.com/feeds/list/${spreadsheetId}/1/public/values?alt=json`;
    return xhr.request('GET', url).then(response => response.feed);
  }
}