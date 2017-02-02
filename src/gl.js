import { mat4 } from 'gl-matrix';

export default function GLInstance(canvasID) {
    const canvas = document.getElementById(canvasID);
    const gl = canvas.getContext("webgl2");

    if (!gl) {
        console.error("WebGL 2 context is not available.");
        return null;
    }
    gl.projectionMatrix = mat4.create();
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.frameClear = function() {
        this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT);
        return this;
    };

    gl.frameSetSize = function(w, h) {
        this.canvas.style.width = `${w}px`;
        this.canvas.style.height = `${h}px`;
        this.canvas.width = w;
        this.canvas.height = h;

        this.viewport(0, 0, w, h);
        mat4.perspective(this.projectionMatrix, 85, w / h, 0.1, 1000);
        return this;
    };

    gl.getTypeByteSize = function(type) {
        switch (type) {
            case gl.BYTE:
                return 1;
            case gl.SHORT:
                return 2;
            case gl.INT:
                return 4;
            case gl.UNSIGNED_BYTE:
                return 1;
            case gl.UNSIGNED_SHORT:
                return 2;
            case gl.UNSIGNED_INT:
                return 4;
            case gl.FLOAT:
                return 4;
        }
        return 0;
    };

    return gl;
}
