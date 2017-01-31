export default class Shader {
    constructor(gl) {
        this._gl = gl;
        this._program = null;
        this._linked = false;
        this._uniforms = {};
    }

    createProgram() {
        this._program = this.gl.createProgram();
    }

    getTypeName(type) {
        const gl = this.gl;
        switch (type) {
            case gl.VERTEX_SHADER:
                return 'vertex';
            case gl.FRAGMENT_SHADER:
                return 'fragment';
        }
        return "unknown";
    }

    _compileShader(type, shader_source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, shader_source);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Error compiling shader: ");
            console.log(shader_source);
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        gl.attachShader(this.program, shader);
        return shader;
    }

    compileShaders(shaders, uniforms) {
        if (this.isLinked()) {
            return;
        }
        if (this.program === null) {
            this.createProgram();
        }
        const gl = this.gl;
        const program = this.program;
        let shaders = [];

        for (let i = 0; i < shaders.length; i++) {
            const shader = this._compileShader(shaders[i].type, shaders[i].src);
            if (shader !== null) {
                gl.attachShader(program, shader);
                shaders.push(shader);
            }
        }

        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error("Error creating shader program.",gl.getProgramInfoLog(prog));
			gl.deleteProgram(program);
            return false;
		}

        shaders.forEach(shader => gl.deleteShader(shader));
        this._linked = true;

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

    get uniformLocation(name) {
        if (name in this._uniforms) {
            return this._uniforms[name];
        }
        return -1;
    }

    isLinked() {
        return this._linked;
    }
}
