module.exports = {
    getJSON: (path) => {
        const url = path;
        return module.exports.request('GET', url);
    },
    request: (method, url) => {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.onload = function(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject({status: this.status, statusText: xhr.statusText});
                    }
                }
            };
            xhr.onerror = function(e) {
                reject({status: this.status, statusText: xhr.statusText});
            };
            xhr.send(null);
        });
    }
}
