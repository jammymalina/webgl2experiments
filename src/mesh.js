export const POSITION_LOCATION = 0;
export const NORMAL_LOCATION = 1;
export const UV_LOCATION = 2;

export default class BasicMesh
{
    constructor(gl, material) {
        this._vao = null;
        this._buffer = null;
        this._indicesBuffer = null;
        this._gl = gl;
        this._indexed = false;
        this._material = material;
        this._numIndices = 0;
        this._mode = gl.TRIANGLES;
    }

    static flatten(arrs, arrBatchSizes, limit) {
        let result = [];
        let indices = new Array(arrs.length);
        indices.fill(0);
        let j = 0;
        while (j < limit) {
            for (let i = 0; i < arrs.length && j < limit; i++) {
                for (let k = 0; k < arrBatchSizes[i]; k++) {
                    result.push(arrs[i][indices[i]]);
                    indices[i]++;
                }
            }
            j++;
        }
        return result;
    }

    draw(shader) {
        if (this.vao === null) {
            return;
        }
        if (typeof shader === 'undefined') {
            this.material.shader.use();
        }
        const s = shader || this.material.shader;
        const uniforms = this.material.uniforms || [];

        uniforms.forEach(u => {
            s[`setUniform_${u.type}`](u.name, u.value);
        });

        const gl = this.gl;
        gl.bindVertexArray(this.vao);
        if (this.isIndexed()) {
            gl.drawElements(this.mode, this.numIndices, gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawArrays(this.mode, 0, this.numIndices);
        }
        gl.bindVertexArray(null);

        if (typeof shader === 'undefined') {
            this.material.shader.stop();
        }
    }

    create({ vertices, indices, normals, uvs, mode }) {
        if (this.vao !== null) {
            return;
        }

        const gl = this.gl;
        this._vao = gl.createVertexArray();
        this._buffer = gl.createBuffer();

        if (typeof mode !== 'undefined') {
            this._mode = mode;
        }

        let bufferSizes = [];
        let vertexSizes = [];

        let f = [];
        if (typeof vertices !== 'undefined') {
            f.push(vertices.data);
            const vsize = vertices.dimension || 3;
            bufferSizes.push(Math.floor(vertices.data.length / vsize));
            vertexSizes.push(vsize);
        }
        if (typeof normals !== 'undefined') {
            f.push(normals.data);
            const vsize = normals.dimension || 3;
            bufferSizes.push(Math.floor(normals.data.length));
            vertexSizes.push(vsize);
        }
        if (typeof uvs !== 'undefined') {
            f.push(uvs.data);
            const vsize = uvs.dimension || 2;
            bufferSizes.push(Math.floor(uvs.data.length / vsize));
            vertexSizes.push(vsize);
        }
        const maxBufferSize = Math.min(...bufferSizes);
        f = new Float32Array(BasicMesh.flatten(f, vertexSizes, maxBufferSize));

        gl.bindVertexArray(this.vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, f, gl.STATIC_DRAW);

        let normal_offset = 0;
        let uv_offset = 0;
        if (typeof vertices !== 'undefined') {
            const dimension = vertices.dimension || 3;
            const totalByteSize = vertices.totalByteSize || dimension * gl.getTypeByteSize(gl.FLOAT);
            gl.enableVertexAttribArray(POSITION_LOCATION);
            gl.vertexAttribPointer(
                POSITION_LOCATION,
                dimension,
                gl.FLOAT,
                false,
                0,
                0
            );
            normal_offset += totalByteSize;
            uv_offset += totalByteSize;
        }
        if (typeof normals !== 'undefined') {
            const dimension = normals.dimension || 3;
            const totalByteSize = normals.totalByteSize || dimension * gl.getTypeByteSize(gl.FLOAT);
            gl.enableVertexAttribArray(NORMAL_LOCATION);
            gl.vertexAttribPointer(
                NORMAL_LOCATION,
                dimension,
                gl.FLOAT,
                false,
                0,
                normal_offset
            );
            uv_offset += totalByteSize;
        }
        if (typeof uvs !== 'undefined') {
            const dimension = uvs.dimension || 2;
            const totalByteSize =  uvs.totalByteSize || dimension * gl.getTypeByteSize(gl.FLOAT);
            gl.enableVertexAttribArray(UV_LOCATION);
            gl.vertexAttribPointer(
                UV_LOCATION,
                dimension,
                gl.FLOAT,
                false,
                0,
                uv_offset
            );
        }

        if (typeof indices !== 'undefined') {
            this._indexed = true;
            this._indicesBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
            this._numIndices = indices.length;
        } else {
            this._numIndices = maxBufferSize;
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindVertexArray(null);

    }

    dispose() {
        const gl = this.gl;
        if (this.buffer !== null) {
            gl.deleteBuffer(this.buffer);
            this._buffer = null;
        }
        if (this.indicesBuffer !== null) {
            gl.deleteBuffer(this.indicesBuffer);
            this._indicesBuffer = null;
        }
        if (this.vao !== null) {
            gl.deleteVertexArray(this.vao);
            this._vao = null;
        }
    }

    get gl() {
        return this._gl;
    }

    get vao() {
        return this._vao;
    }

    get buffer() {
        return this._buffer;
    }

    get indicesBuffer() {
        return this._indicesBuffer;
    }

    get numIndices() {
        return this._numIndices;
    }

    get mode() {
        return this._mode;
    }

    get material() {
        return this._material;
    }

    set material(new_material) {
        const material = this._material;
        this._material = {
            ...material,
            ...new_material
        };
    }

    isIndexed() {
        return this._indexed;
    }
}
