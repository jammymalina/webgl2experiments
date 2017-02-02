export default function tex2d() {
    let data = null;
    let components = 0;
    let width = 0;
    let height = 0;

    const getIndex = function(x, y) {
        return components * (y * width + x);
    };

    this.create = function(w, h, n) {
        width = typeof w === 'undefined' ? 1 : w;
        height = typeof h === 'undefined' ? 1 : h;
        components = typeof n === 'undefined' ? 4 : n;
        data = new Uint8Array(width * height * components);
        return this;
    };

    this.setPixel = function(x, y, color) {
        if (x < 0 || x >= width || y < 0 || y >= height) {
            return;
        }
        const index = getIndex(x, y);
        for (let i = 0; i < Math.min(color.length, components); i++) {
            data[index + i] = color[i];
        }
    };

    this.fill = function(color) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = getIndex(x, y);
                for (let i = 0; i < Math.min(color.length, components); i++) {
                    data[index + i] = color[i];
                }
            }
        }
        return this;
    };

    this.fillRect = function(rx, ry, rwidth, rheight, color) {
        for (let y = ry; y < Math.min(height, ry + rheight); y++) {
            for (let x = rx; x < Math.min(width, rx + rwidth); x++) {
                const index = getIndex(x, y);
                for (let i = 0; i < Math.min(color.length, components); i++) {
                    data[index + i] = color[i];
                }
            }
        }
        return this;
    };

    this.furTexture(density, furColor, defaultColor) {
        furColor = typeof furColor === 'undefined' || furColor.length < components ?
            new Uint8Array(components).fill(255) : furColor;
        defaultColor = typeof defaultColor === 'undefined' ?
            new Uint8Array(components).fill(0) : defaultColor;

        this.fill(defaultColor);

        const pixelCount = width * height;
        const numStrands = Math.floor(density * pixelCount);

        const randomInt = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        for (let i = 0; i < numStrands; i++) {
            let x = randomInt(0, width  - 1);
            let y = randomInt(0, height - 1);
            const index = getIndex(x, y);
            for (let i = 0; i < Math.min(furColor.length, components); i++) {
                data[index + i] = furColor[i];
            }
        }

        return this;
    };

    toGLTexture() {

    }

    this.getData = function() {
        return data;
    };

    this.getWidth = function() {
        return width;
    };

    this.getHeight = function() {
        return height;
    }

    this.numComponents = function() {
        return components;
    };
}

export class GLSampler {
    constructor(gl) {
        this._gl = gl;
        this._sampler = gl.createSampler();

        gl.samplerParameteri(this.sampler, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.samplerParameteri(this.sampler, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.samplerParameteri(this.sampler, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.samplerParameteri(this.sampler, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.samplerParameteri(this.sampler, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
        gl.samplerParameterf(this.sampler, gl.TEXTURE_MIN_LOD, -1000.0);
        gl.samplerParameterf(this.sampler, gl.TEXTURE_MAX_LOD,  1000.0);
        gl.samplerParameteri(this.sampler, gl.TEXTURE_COMPARE_MODE, gl.NONE);
        gl.samplerParameteri(this.sampler, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
    }

    dispose() {
        if (this._sampler === null) {
            return;
        }
        gl.deleteSampler(this.sampler);
        this._sampler = null;
    }

    get gl() {
        return this._gl;
    }

    get sampler() {
        return this._sampler;
    }
}

export class GLTexture2d {
    constructor(gl) {
        this._gl = gl;
    }

    bindTexture(loc) {
        const gl = this.gl;
        loc = loc || gl.TEXTURE0;
        gl.activeTexture(gl.TEXTURE0);

    }

    get gl() {
        return this._gl;
    }
}
