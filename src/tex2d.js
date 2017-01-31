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
