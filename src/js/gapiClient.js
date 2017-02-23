module.exports = {
  getSpreadsheetData: (spreadsheetId) => {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      const url = `https://spreadsheets.google.com/feeds/list/${spreadsheetId}/1/public/values?alt=json`
      xhr.open("GET", url, true);
      xhr.onload = function (e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response).feed);
          } else {
            reject({
              status: this.status,
              statusText: xhr.statusText
            });
          }
        }
      };
      xhr.onerror = function (e) {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      };
      xhr.send(null);
    });
  }
}