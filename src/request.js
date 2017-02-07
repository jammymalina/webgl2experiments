export default function makeRequest(method, url, metadata, progressCallback) {
    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                if (typeof progressCallback !== 'undefined') {
                    progressCallback();
                }
                metadata = metadata || {};
                resolve({
                    ...metadata,
                    data: xhr.response
                });
            } else {
                reject({status: this.status, statusText: xhr.statusText});
            }
        };
        xhr.onerror = function() {
            reject({status: this.status, statusText: xhr.statusText});
        };
        xhr.send();
    });
}

export function makeImageRequest(src, metadata, progressCallback) {
    return new Promise(function(resolve, reject) {
        let image = new Image();
        image.src = src;
        image.onload = function() {
            if (typeof progressCallback !== 'undefined') {
                progressCallback();
            }
            metadata = metadata || {};
            resolve({
                ...metadata,
                data: image
            });
        };
        image.onerror = function(e) {
            reject(e);
        };
    });
}
