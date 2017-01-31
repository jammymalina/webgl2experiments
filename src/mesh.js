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
        return result;
    }

    create({ positions, indices, normals, uvs, sizes }) {
        if (this.vao !== null) {
            return;
        }

        const gl = this.gl;
        this._vao = gl.createVertexArray();
        this._buffer = gl.createBuffer();

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
        f = new Float32Array(flatten(f));

        gl.bindVertexArray(this.vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, f, gl.STATIC_DRAW);

        if (typeof positions !== 'undefined') {
            gl.enableVertexAttribArray(POSITION_LOCATION);
            gl.vertexAttribPointer(vertexPosLocation, 2, gl.FLOAT, false, 0, 0);
        }
        if (typeof normals !== 'undefined') {
        }
        if (typeof uvs !== 'undefined') {
        }

        gl.bindBuffer(null);

        gl.bindVertexArray(null);

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
