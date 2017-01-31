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
