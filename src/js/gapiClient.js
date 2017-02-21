const CLIENT_ID = '176595787089-tarbcutpcnflpfuk6vklf4mrc1rg3odj.apps.googleusercontent.com';
const DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

module.exports = {
	init: () => {
	  return new Promise((resolve, reject) => {
	    gapi.load('client:auth2', () => {
	      gapi.client.init({
	        discoveryDocs: DISCOVERY_DOCS,
	        clientId: CLIENT_ID,
	        scope: SCOPES,
	        apiKey: 'AIzaSyCi2wPWhosxgjVZiPEa1Tttzo5d2htr2GU'
	      }).then(() => {
	        resolve();
	      });
	    });
	  });
	},
	getSpreadsheetData: () => {
	  return gapi.client.sheets.spreadsheets.values.get({
	    spreadsheetId: '1aLMe-s3SGIPZw51prsyNvM8LENNtI55WP0b7LAyLajE',
	    range: 'A2:A4',
	  });
	}
}