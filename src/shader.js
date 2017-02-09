import makeRequest from './request';

export function mapExtensionType(url) {
    let type = 'vertex';
    if (url.endsWith('.vert') || url.endsWith('.vs')) {
        type = 'vertex';
    } else if (url.endsWith('.frag') || url.endsWith('.fs')) {
        type = 'fragment';
    } else {
        type = 'vertex';
    }
    return type;
}

export function mapTypeName(type, gl) {
    switch (type) {
        case gl.VERTEX_SHADER:
            return 'vertex';
        case gl.FRAGMENT_SHADER:
            return 'fragment';
    }
    return 'unknown';
}

export async function makeShaderRequest(shaders, metadata, progressCallback) {
    let shaderTypes = new Set();

    shaders = shaders.filter(item => {
        const type = mapExtensionType(item);
        if (!shaderTypes.has()) {
            shaderTypes.add(type);
            return true;
        }
        return false;
    }).map(item => {
        const type = mapExtensionType(item);
        return {
            type,
            src: item
        };
    });

    if (shaders.length < 2) {
        return null;
    }
    let promises = [];

    for (let i = 0; i < shaders.length; i++) {
        const p = new Promise(function(resolve, reject) {
            makeRequest('GET', shaders[i].src).then(function(src) {
                if (typeof progressCallback !== 'undefined') {
                    progressCallback(1 / shaders.length);
                }
                resolve({
                    type: shaders[i].type,
                    src: src.data
                });
            }).catch(function(e) {
                reject(e);
            });
        });
        promises.push(p);
    }

    try {
        const data = await Promise.all(promises);
        return {
            ...metadata,
            data
        };
    } catch (err) {
        console.error('Augh, there was an error while loading shader!', err);
        return null;
    }

    return null;
}

export default class Shader {
    constructor(gl) {
        this._gl = gl;
        this._program = null;
        this._linked = false;
        this._uniforms = new Map();
    }

    _compileShader(type, shaderSRC) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, shaderSRC);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Error compiling shader: ');
            console.log(shader_source);
            const error = gl.getShaderInfoLog(shader);
            console.error(error);
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    createProgram(shaders, uniforms) {
        if (this.isLinked()) {
            return;
        }
        const gl = this.gl;
        const program = gl.createProgram();
        this._program = program;
        let compiledShaders = [];

        for (let i = 0; i < shaders.length; i++) {
            let type;
            switch (shaders[i].type) {
                case 'vertex':
                    type = gl.VERTEX_SHADER;
                    break;
                case 'fragment':
                    type = gl.FRAGMENT_SHADER;
                    break;
                default:
                    type = gl.VERTEX_SHADER;
                    break;
            }
            const shader = this._compileShader(type, shaders[i].src);
            if (shader !== null) {
                gl.attachShader(program, shader);
                compiledShaders.push(shader);
            }
        }

        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error('Error creating shader program.', gl.getProgramInfoLog(program));
			gl.deleteProgram(program);
            return false;
		}

        compiledShaders.forEach(shader => gl.deleteShader(shader));

        gl.useProgram(program);
        uniforms.forEach(uniform => {
            if (!this.hasUniform(uniform)) {
                this._uniforms.set(uniform, gl.getUniformLocation(program, uniform));
            }
        });
        this._linked = true;

        gl.useProgram(null);
        return true;
    }

    use() {
        if (!this.isLinked()) {
            return;
        }
        this.gl.useProgram(this.program);
    }

    stop() {
        if (!this.isLinked()) {
            return;
        }
        this.gl.useProgram(null);
    }

    dispose() {
        if (this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program) {
            this.stop();
        }
		this.gl.deleteProgram(this.program);
    }

    get gl() {
        return this._gl;
    }

    get program() {
        return this._program;
    }

    hasUniform(name) {
        return this._uniforms.has(name);
    }

    getUniformLocation(name) {
        if (this.hasUniform(name)) {
            return this._uniforms.get(name);
        }
        return -1;
    }

    setUniform(name, val, f) {
        if (!this.isLinked() || !this.hasUniform(name)) {
            console.warn('Shader - no uniform: ', name);
            return;
        }
        this.gl[f](this.getUniformLocation(name), val);
    }

    setMatrixUniform(name, val, transpose, f) {
        if (!this.isLinked() || !this.hasUniform(name)) {
            console.warn('Shader - no uniform: ', name);
            return;
        }
        this.gl[f](this.getUniformLocation(name), transpose, val);
    }

    setUniform_float(name, val) {
        this.setUniform(name, val, 'uniform1f');
    }
    setUniform_int(name, val) {
        this.setUniform(name, val, 'uniform1i');
    }
    setUniform_vec2(name, val) {
        this.setUniform(name, val, 'uniform2fv');
    }
    setUniform_vec3(name, val) {
        this.setUniform(name, val, 'uniform3fv');
    }
    setUniform_vec4(name, val) {
        this.setUniform(name, val, 'uniform4fv');
    }
    setUniform_ivec2(name, val) {
        this.setUniform(name, val, 'uniform2iv');
    }
    setUniform_ivec3(name, val) {
        this.setUniform(name, val, 'uniform3iv');
    }
    setUniform_ivec4(name, val) {
        this.setUniform(name, val, 'uniform4iv');
    }
    setUniform_mat2(name, val) {
        this.setMatrixUniform(name, val, false, 'uniformMatrix2fv');
    }
    setUniform_mat3(name, val) {
        this.setMatrixUniform(name, val, false, 'uniformMatrix3fv');
    }
    setUniform_mat4(name, val) {
        this.setMatrixUniform(name, val, false, 'uniformMatrix4fv');
    }

    isLinked() {
        return this._linked;
    }
}
