export const POSITION_LOCATION = 0;
export const NORMAL_LOCATION = 1;
export const UV_LOCATION = 2;

export default class Mesh {
    constructor(gl) {
        this._vao = null;
        this._buffer = null;
        this._gl = gl;
        this._indexed = false;
    }

    static flatten(arrs) {
        let result = [];
        let j = 0;
        let finished = false;
        while (!finished) {
            finished = true;
            for (let i = 0; i < arrays.arrs; i++) {
                if (j < arrs[i].length) {
                    result.push(arrs[i][j]);
                    finished = false;
                }
            }
        }
    }

    create({ positions, indices, normals, uvs }) {
        if (this.vao !== null) {
            return;
        }

        const gl = this.gl;
        this._vao = gl.createVertexArray();
        this._buffer = gl.createBuffer();

        gl.bindVertexArray(vertexArray);
        

        let f = [];
        if (typeof positions !== 'undefined') {
            f.push(positions);
        }
        if (typeof normals !== 'undefined') {
            f.push(normals);
        }
        if (typeof uvs !== 'undefined') {
            f.push(uvs);
        }
        f = flatten(f);

    }

    dispose() {
        this._vao = null;
    }

    get vao() {
        return this._vao;
    }

    get buffer() {
        return this._buffer;
    }

    isIndexed() {
        return this._indexed;
    }
}
