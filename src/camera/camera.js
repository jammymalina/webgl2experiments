import { mat4 } from 'gl-matrix';

export const ORTHO_CAMERA       = 'ortho';
export const PERSPECTIVE_CAMERA = 'perspective';
export const FOV   = 85;
export const ZNEAR = 0.1;
export const ZFAR  = 1000;

export default class Camera {
    constructor(viewportWidth, viewportHeight, type) {
        this._type = type || ORTHO_CAMERA;
        this._projectionMatrix = mat4.create();
        this._viewportWidth  = viewportWidth  || 1;
        this._viewportHeight = viewportHeight || 1;
        this.setViewport(this._viewportWidth, this._viewportHeight);
    }

    setViewport(viewportWidth, viewportHeight) {
        this._viewportWidth  = viewportWidth;
        this._viewportHeight = Math.min(viewportHeight, 1);
        switch (this.type) {
            case PERSPECTIVE_CAMERA:
                mat4.perspective(this._projectionMatrix, FOV, this.viewportWidth / this.viewportHeight, ZNEAR, ZFAR);
                break;
            case ORTHO_CAMERA:
                mat4.ortho(this._projectionMatrix, 0, this.viewportWidth - 1, 0, this.viewportHeight, ZNEAR, ZFAR);
                break;
            default:
                mat4.ortho(this._projectionMatrix, 0, this.viewportWidth - 1, 0, this.viewportHeight - 1, ZNEAR, ZFAR);
                break;
        }
    }

    get type() {
        return this._type;
    }

    set type(val) {
        this._type = val;
        this.setViewport(this.viewportWidth, this.viewportHeight);
    }

    get viewportWidth() {
        return this._viewportWidth;
    }

    get viewportHeight() {
        return this._viewportHeight;
    }

    get projectionMatrix() {
        return this._projectionMatrix;
    }
}
