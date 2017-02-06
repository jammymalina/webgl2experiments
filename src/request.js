export default function makeRequest(method, url) {
    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
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

export function makeImageRequest(src, progressCallback) {
    return new Promise(function(resolve, reject) {
        let image = new Image();
        image.src = src;
        image.onload = function() {
            if (typeof progressCallback !== 'undefined') {
                progressCallback();
            }
            resolve({
                type: 'image',
                data: image
            });
        };
        image.onerror = function(e) {
            reject(e);
        };
    });
}

export function makeShaderRequest(shaders, progressCallback) {
    if (shaders.length < 2) {
        return null;
    }
    let promises = [];

    for (let i = 0; i < shaders.length; i++) {
        const p = new Promise(function(resolve, reject) {
            let type;
            if (shaders[i].endsWith(".vert") || shaders[i].endsWith(".vs")) {
                type = "vertex";
            } else {
                type = "fragment";
            }
            makeRequest('GET', shaders[0]).then({
            }).catch(function(e) {
                reject(e);
            })
        });
        promises.push(p);
    }

    return Promise.all(promises);
}
